import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Alert, Box, Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import SaveIcon from "@mui/icons-material/Save";
import api from "../../services/api";

// Logične dimenzije platna: shranjene koordinate so vedno v teh enotah,
// na zaslonu se platno samo skalira, zato je postavitev povsod enaka.
const PLATNO_W = 1200;
const PLATNO_H = 800;
const PRIVZETA_VELIKOST = 160;
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

    const dodajNaPlatno = (slika) => {
        const kljuc = naslednjiKljuc.current++;
        const zamik = ((kljuc - 1) % 8) * 20;
        setNaPlatnu((trenutni) => [
            ...trenutni,
            {
                key: kljuc,
                slika,
                x: 20 + zamik,
                y: 20 + zamik,
                w: PRIVZETA_VELIKOST,
                h: PRIVZETA_VELIKOST,
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
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1, mb: 2 }}>
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
                                sx={{
                                    aspectRatio: "1 / 1",
                                    bgcolor: "action.hover",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    p: 0.5,
                                    cursor: "pointer",
                                    userSelect: "none",
                                    "&:hover": { borderColor: "primary.main" },
                                }}
                            >
                                <PhotoOutlinedIcon color="action" />
                                <Typography variant="caption" noWrap sx={{ maxWidth: "100%" }}>
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
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
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
                                    sx={{ position: "absolute", top: 0, right: 0 }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                                <PhotoOutlinedIcon color="action" />
                                <Typography variant="caption" noWrap sx={{ maxWidth: "90%" }}>
                                    {el.slika.name}
                                </Typography>

                                <Box
                                    onPointerDown={(event) => zacniSpremembo(event, el)}
                                    aria-label="Spremeni velikost"
                                    sx={{
                                        position: "absolute",
                                        right: 0,
                                        bottom: 0,
                                        width: 20,
                                        height: 20,
                                        cursor: "nwse-resize",
                                        background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.45) 50%)",
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