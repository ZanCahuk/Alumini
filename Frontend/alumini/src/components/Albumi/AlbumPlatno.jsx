import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import api from "../../services/api";

// Isti logični dimenziji kot v urejevalniku (UrediAlbum.js).
const PLATNO_W = 1200;
const PLATNO_H = 800;

export default function AlbumPlatno({ albumId }) {
    const okvirRef = useRef(null);
    const [merilo, setMerilo] = useState(1);
    const [elementi, setElementi] = useState([]);
    const [nalaganje, setNalaganje] = useState(true);
    const [napaka, setNapaka] = useState(false);

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

    useEffect(() => {
        let preklicano = false;
        setNalaganje(true);
        setNapaka(false);
        Promise.all([api.get("/slike"), api.get(`/albumi/${albumId}/slike`)])
            .then(([odgovorSlike, odgovorPostavitev]) => {
                if (preklicano) return;
                const poId = new Map((odgovorSlike.data || []).map((slika) => [slika.id, slika]));
                setElementi(
                    (odgovorPostavitev.data || [])
                        .map((p, i) => ({
                            key: i,
                            slika: poId.get(p.slikaId),
                            x: p.x,
                            y: p.y,
                            w: p.width,
                            h: p.height,
                            rotation: p.rotation || 0,
                            z: p.zIndex,
                        }))
                        .filter((el) => el.slika)
                );
            })
            .catch((error) => {
                console.error("Napaka pri nalaganju postavitve albuma:", error);
                if (!preklicano) setNapaka(true);
            })
            .finally(() => {
                if (!preklicano) setNalaganje(false);
            });
        return () => {
            preklicano = true;
        };
    }, [albumId]);

    const sporocilo = nalaganje
        ? "Nalaganje ..."
        : napaka
            ? "Postavitve albuma ni bilo mogoče naložiti."
            : elementi.length === 0
                ? "V tem albumu še ni slik. Dodaj jih z gumbom »Uredi album«."
                : null;

    return (
        <Paper
            ref={okvirRef}
            elevation={0}
            sx={{
                position: "relative",
                width: "100%",
                height: PLATNO_H * merilo,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
            }}
        >
            <Box
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
                {elementi.map((el) => (
                    <Box
                        key={el.key}
                        sx={{
                            position: "absolute",
                            left: el.x,
                            top: el.y,
                            width: el.w,
                            height: el.h,
                            zIndex: el.z,
                            transform: `rotate(${el.rotation}deg)`,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            boxShadow: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            userSelect: "none",
                        }}
                    >
                        <PhotoOutlinedIcon color="action" />
                        <Typography variant="caption" noWrap sx={{ maxWidth: "90%" }}>
                            {el.slika.name}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {sporocilo && (
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                    }}
                >
                    <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                        {sporocilo}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}