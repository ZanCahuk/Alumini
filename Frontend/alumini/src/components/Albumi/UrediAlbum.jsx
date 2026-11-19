import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Alert, Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import api from "../../services/api";
import { slikaUrl } from "../Slike/SlikeTable";

// Logične dimenzije platna: shranjene koordinate so vedno v teh enotah,
// na zaslonu se platno samo skalira, zato je postavitev povsod enaka.
const PLATNO_W = 1200;
const PLATNO_H = 800;
// Najdaljša stranica slike, ko jo dodamo na platno (razmerje stranic ostane enako).
const PRIVZETA_VELIKOST = 240;
const MIN_VELIKOST = 60;

const omeji = (vrednost, min, max) => Math.min(Math.max(min, vrednost), max);

export default function UrediAlbum() {
    const { id } = useParams();
    const navigate = useNavigate();
    const okvirRef = useRef(null);
    const platnoRef = useRef(null);
    const akcija = useRef(null);
    const naslednjiKljuc = useRef(1);
    const naslednjiZ = useRef(1);

    const [album, setAlbum] = useState(null);
    const [slike, setSlike] = useState([]);
    const [naPlatnu, setNaPlatnu] = useState([]); // { key, slika, x, y, w, h, rotation, z }
    const [merilo, setMerilo] = useState(1);
    const [shranjevanje, setShranjevanje] = useState(false);
    const [sporocilo, setSporocilo] = useState(null);

    // Merilo = širina okvirja / logična širina platna.
    useEffect(() => {
        const okvir = okvirRef.current;
        if (!okvir) return undefined;
        const opazovalec = new ResizeObserver(([vnos]) => {
            setMerilo(vnos.contentRect.width / PLATNO_W);
        });
        opazovalec.observe(okvir);
        return () => opazovalec.disconnect();
    }, []);

    // Naložimo album, vse slike in shranjeno postavitev.
    useEffect(() => {
        let preklicano = false;
        Promise.all([
            api.get(`/albumi/${id}`),
            api.get("/slike"),
            api.get(`/albumi/${id}/slike`),
        ])
            .then(([odgovorAlbum, odgovorSlike, odgovorPostavitev]) => {
                if (preklicano) return;
                const vseSlike = odgovorSlike.data || [];
                const poId = new Map(vseSlike.map((slika) => [slika.id, slika]));
                const elementi = (odgovorPostavitev.data || [])
                    .map((p, i) => ({
                        key: i + 1,
                        slika: poId.get(p.slikaId),
                        x: p.x,
                        y: p.y,
                        w: p.width,
                        h: p.height,
                        rotation: p.rotation,
                        z: p.zIndex,
                    }))
                    .filter((el) => el.slika);

                naslednjiKljuc.current = elementi.reduce((m, el) => Math.max(m, el.key), 0) + 1;
                naslednjiZ.current = elementi.reduce((m, el) => Math.max(m, el.z), 0) + 1;
                setAlbum(odgovorAlbum.data);
                setSlike(vseSlike);
                setNaPlatnu(elementi);
            })
            .catch((error) => {
                console.error("Napaka pri nalaganju urejevalnika:", error);
                setSporocilo({ severity: "error", text: "Podatkov ni bilo mogoče naložiti." });
            });
        return () => {
            preklicano = true;
        };
    }, [id]);

    const posodobiElement = (kljuc, spremembe) => {
        setNaPlatnu((trenutni) =>
            trenutni.map((el) => (el.key === kljuc ? { ...el, ...spremembe } : el))
        );
    };

    // Razmerje stranic (širina / višina) prebere brskalnik iz same slike, ker ga backend ne hrani.
    const izmeriRazmerje = (slika) =>
        new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img.naturalWidth / img.naturalHeight || 1);
            img.onerror = () => resolve(1);
            img.src = slikaUrl(slika.id);
        });

    const dodajNaPlatno = async (slika) => {
        const razmerje = await izmeriRazmerje(slika);
        const w = razmerje >= 1 ? PRIVZETA_VELIKOST : PRIVZETA_VELIKOST * razmerje;
        const h = razmerje >= 1 ? PRIVZETA_VELIKOST / razmerje : PRIVZETA_VELIKOST;
        const kljuc = naslednjiKljuc.current++;
        const zamik = ((kljuc - 1) % 8) * 20;
        setNaPlatnu((trenutni) => [
            ...trenutni,
            {
                key: kljuc,
                slika,
                x: 20 + zamik,
                y: 20 + zamik,
                w,
                h,
                rotation: 0,
                z: naslednjiZ.current++,
            },
        ]);
    };

    const odstraniSNaPlatna = (kljuc) => {
        setNaPlatnu((trenutni) => trenutni.filter((el) => el.key !== kljuc));
    };

    const zacniPremik = (event, element) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        const okvir = event.currentTarget.getBoundingClientRect();
        akcija.current = {
            tip: "premik",
            key: element.key,
            odmikX: (event.clientX - okvir.left) / merilo,
            odmikY: (event.clientY - okvir.top) / merilo,
        };
        posodobiElement(element.key, { z: naslednjiZ.current++ });
    };

    const zacniSpremembo = (event, element) => {
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        akcija.current = {
            tip: "velikost",
            key: element.key,
            zacetekX: event.clientX,
            zacetekY: event.clientY,
            zacetnaW: element.w,
            zacetnaH: element.h,
            x: element.x,
            y: element.y,
        };
        posodobiElement(element.key, { z: naslednjiZ.current++ });
    };

    const gibanje = (event) => {
        const a = akcija.current;
        if (!a || !platnoRef.current) return;
        const platno = platnoRef.current.getBoundingClientRect();

        if (a.tip === "premik") {
            setNaPlatnu((trenutni) =>
                trenutni.map((el) => {
                    if (el.key !== a.key) return el;
                    const x = omeji((event.clientX - platno.left) / merilo - a.odmikX, 0, PLATNO_W - el.w);
                    const y = omeji((event.clientY - platno.top) / merilo - a.odmikY, 0, PLATNO_H - el.h);
                    return { ...el, x, y };
                })
            );
        } else {
            const w = omeji(a.zacetnaW + (event.clientX - a.zacetekX) / merilo, MIN_VELIKOST, PLATNO_W - a.x);
            const h = omeji(a.zacetnaH + (event.clientY - a.zacetekY) / merilo, MIN_VELIKOST, PLATNO_H - a.y);
            posodobiElement(a.key, { w, h });
        }
    };

    const konecAkcije = () => {
        akcija.current = null;
    };

    const shrani = async () => {
        setShranjevanje(true);
        setSporocilo(null);
        // Vrstni red kopiranja po z-indeksu, da se shrani čist zIndex 0..n-1.
        const postavitev = [...naPlatnu]
            .sort((a, b) => a.z - b.z)
            .map((el, i) => ({
                slikaId: el.slika.id,
                x: el.x,
                y: el.y,
                width: el.w,
                height: el.h,
                rotation: el.rotation ?? 0,
                zIndex: i,
            }));
        try {
            await api.put(`/albumi/${id}/slike`, postavitev);
            setSporocilo({ severity: "success", text: "Postavitev je shranjena." });
        } catch (error) {
            console.error("Napaka pri shranjevanju postavitve:", error);
            setSporocilo({ severity: "error", text: "Postavitve ni bilo mogoče shraniti." });
        } finally {
            setShranjevanje(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/albumi")}>
                Nazaj na albume
            </Button>
            <Stack direction="row" sx={{ mt: 1, mb: 2, justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4">
                    Urejanje albuma{album ? `: ${album.name}` : ""}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={shrani}
                    disabled={shranjevanje}
                >
                    {shranjevanje ? "Shranjujem ..." : "Shrani postavitev"}
                </Button>
            </Stack>

            {sporocilo && (
                <Alert severity={sporocilo.severity} sx={{ mb: 2 }} onClose={() => setSporocilo(null)}>
                    {sporocilo.text}
                </Alert>
            )}

            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                {/* Levo: vse moje slike */}
                <Paper
                    elevation={0}
                    sx={{ width: 300, flexShrink: 0, p: 2, border: "1px solid", borderColor: "divider", maxHeight: 640, overflowY: "auto" }}
                >
                    <Typography variant="h6" sx={{ mb: 0.5 }}>Moje slike</Typography>
                    <Typography variant="caption" color="text.secondary">
                        Dvojni klik doda sliko v album.
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5, mt: 2 }}>
                        {slike.map((slika) => (
                            <Box
                                key={slika.id}
                                onDoubleClick={() => dodajNaPlatno(slika)}
                                title={slika.name}
                                sx={{
                                    position: "relative",
                                    aspectRatio: "1 / 1",
                                    bgcolor: "action.hover",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    "&:hover": { borderColor: "primary.main" },
                                }}
                            >
                                <img
                                    src={slikaUrl(slika.id)}
                                    alt={slika.name || "Slika"}
                                    loading="lazy"
                                    draggable={false}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                                <Typography
                                    variant="caption"
                                    noWrap
                                    sx={{
                                        position: "absolute",
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        px: 0.5,
                                        color: "common.white",
                                        bgcolor: "rgba(0,0,0,0.5)",
                                    }}
                                >
                                    {slika.name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    {slike.length === 0 && (
                        <Typography color="text.secondary" sx={{ mt: 2 }}>Ni slik.</Typography>
                    )}
                </Paper>

                {/* Desno: okvir, ki se prilagodi širini; v njem skaliran platno */}
                <Paper
                    ref={okvirRef}
                    elevation={0}
                    sx={{
                        position: "relative",
                        flexGrow: 1,
                        minWidth: 0,
                        height: PLATNO_H * merilo,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        ref={platnoRef}
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: PLATNO_W,
                            height: PLATNO_H,
                            transformOrigin: "0 0",
                            transform: `scale(${merilo})`,
                        }}
                    >
                        <Typography variant="overline" color="text.secondary" sx={{ position: "absolute", top: 8, right: 16 }}>
                            Album
                        </Typography>
                        {naPlatnu.map((el) => (
                            <Box
                                key={el.key}
                                onPointerDown={(event) => zacniPremik(event, el)}
                                onPointerMove={gibanje}
                                onPointerUp={konecAkcije}
                                onPointerCancel={konecAkcije}
                                sx={{
                                    position: "absolute",
                                    left: el.x,
                                    top: el.y,
                                    width: el.w,
                                    height: el.h,
                                    zIndex: el.z,
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "primary.main",
                                    borderRadius: 1,
                                    boxShadow: 2,
                                    cursor: "grab",
                                    touchAction: "none",
                                    userSelect: "none",
                                    overflow: "hidden",
                                    "&:active": { cursor: "grabbing" },
                                }}
                            >
                                <IconButton
                                    size="small"
                                    aria-label="Odstrani iz albuma"
                                    onPointerDown={(event) => event.stopPropagation()}
                                    onClick={() => odstraniSNaPlatna(el.key)}
                                    sx={{
                                        position: "absolute",
                                        top: 2,
                                        right: 2,
                                        zIndex: 1,
                                        bgcolor: "rgba(255,255,255,0.85)",
                                        "&:hover": { bgcolor: "common.white" },
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                                <img
                                    src={slikaUrl(el.slika.id)}
                                    alt={el.slika.name || "Slika"}
                                    draggable={false}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                        pointerEvents: "none",
                                    }}
                                />

                                <Box
                                    onPointerDown={(event) => zacniSpremembo(event, el)}
                                    aria-label="Spremeni velikost"
                                    sx={{
                                        position: "absolute",
                                        right: 0,
                                        bottom: 0,
                                        width: 20,
                                        height: 20,
                                        zIndex: 1,
                                        cursor: "nwse-resize",
                                        background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.9) 50%)",
                                        filter: "drop-shadow(0 0 1px rgba(0,0,0,0.8))",
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}