import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Pagination,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import api from "../../services/api";
import "../Albumi/Albumi.css"; // enak dizajn kot pri albumih
import { slikaUrl } from "./SlikeTable";

const VELIKOST_STRANI = 6;
const BARVE_NASLOVNIC = ["lavender", "peach", "blue", "green"];

const jeTip = (slika, tip) => {
    const t = String(slika.type || "").toLowerCase();
    return tip === "jpg" ? t === "jpg" || t === "jpeg" : t === tip;
};

export default function Slike() {
    const navigate = useNavigate();
    const [slike, setSlike] = useState([]);
    const [iskanje, setIskanje] = useState("");
    const [filter, setFilter] = useState("vse");
    const [stran, setStran] = useState(0);
    const [steviloStrani, setSteviloStrani] = useState(0);
    const [skupaj, setSkupaj] = useState(0);
    const [nalaganje, setNalaganje] = useState(false);
    const [napaka, setNapaka] = useState("");
    const [meniSidro, setMeniSidro] = useState(null);
    const [meniSlika, setMeniSlika] = useState(null);
    const [odprta, setOdprta] = useState(null);

    const pridobiSlike = useCallback(async () => {
        setNalaganje(true);
        setNapaka("");
        try {
            const odgovor = await api.get("/slike/iskanje", {
                params: { q: iskanje, page: stran, size: VELIKOST_STRANI },
            });
            const vsebina = odgovor.data?.content ?? [];
            const stranPodatki = odgovor.data?.page ?? {};

            if (vsebina.length === 0 && stran > 0) {
                setStran((trenutna) => Math.max(0, trenutna - 1));
                return;
            }

            setSlike(vsebina);
            setSteviloStrani(stranPodatki.totalPages ?? 0);
            setSkupaj(stranPodatki.totalElements ?? vsebina.length);
        } catch (error) {
            console.error("Napaka pri pridobivanju slik:", error);
            setNapaka("Slik ni bilo mogoče naložiti. Preveri, ali backend deluje.");
        } finally {
            setNalaganje(false);
        }
    }, [iskanje, stran]);

    useEffect(() => {
        pridobiSlike();
    }, [pridobiSlike]);

    const izbrisiSliko = async (id) => {
        if (id == null || !window.confirm("Ali res želite izbrisati to sliko?")) return;
        setMeniSidro(null);
        try {
            await api.delete(`/slike/${id}`);
            if (odprta?.id === id) setOdprta(null);
            await pridobiSlike();
        } catch (error) {
            console.error("Napaka pri brisanju slike:", error);
            setNapaka(
                error.response?.status === 409
                    ? "Slike ni mogoče izbrisati, ker je uporabljena v albumu."
                    : "Slike ni bilo mogoče izbrisati (morda je uporabljena v albumu)."
            );
        }
    };

    const odpriMeni = (event, slika) => {
        event.stopPropagation();
        setMeniSidro(event.currentTarget);
        setMeniSlika(slika);
    };

    const spremeniIskanje = (event) => {
        setIskanje(event.target.value);
        setStran(0);
    };

    const prikazaneSlike = slike.filter((slika) => filter === "vse" || jeTip(slika, filter));

    return (
        <Box className="album-page">
            <Box className="album-topbar">
                <Box className="album-brand">
                    <Avatar className="album-brand-icon"><CollectionsOutlinedIcon /></Avatar>
                    <Typography variant="h6">Alumini</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button color="inherit" variant="contained" disableElevation>Slike</Button>
                    <Button component={Link} to="/albumi" color="inherit">Albumi</Button>
                </Stack>
            </Box>

            <Box className="album-content">
                <Box className="album-heading-row">
                    <Box>
                        <Typography variant="h4" className="album-title">Moje slike</Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Vse naložene slike na enem mestu.
                        </Typography>
                    </Box>
                    <Button
                        component={Link}
                        to="/slike/dodaj"
                        variant="contained"
                        startIcon={<AddIcon />}
                        className="create-album-button"
                    >
                        Nova slika
                    </Button>
                </Box>

                {napaka && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setNapaka("")}>{napaka}</Alert>}

                <Paper className="album-toolbar" elevation={0}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Išči slike po imenu ali tipu ..."
                        value={iskanje}
                        onChange={spremeniIskanje}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Stack direction="row" spacing={1} className="album-filters">
                        {[
                            ["vse", `Vse (${skupaj})`],
                            ["jpg", "JPG"],
                            ["png", "PNG"],
                        ].map(([vrednost, oznaka]) => (
                            <Chip
                                key={vrednost}
                                label={oznaka}
                                clickable
                                color={filter === vrednost ? "primary" : "default"}
                                variant={filter === vrednost ? "filled" : "outlined"}
                                onClick={() => setFilter(vrednost)}
                            />
                        ))}
                    </Stack>
                </Paper>

                {nalaganje ? (
                    <Typography color="text.secondary">Nalaganje slik ...</Typography>
                ) : prikazaneSlike.length === 0 ? (
                    <Paper className="no-albums" elevation={0}>
                        <Avatar className="empty-album-icon"><PhotoOutlinedIcon /></Avatar>
                        <Typography variant="h6">Ni najdenih slik</Typography>
                        <Typography color="text.secondary">
                            Poskusi spremeniti iskalni niz ali naloži novo sliko.
                        </Typography>
                    </Paper>
                ) : (
                    <Box className="album-grid">
                        {prikazaneSlike.map((slika) => {
                            const barva = BARVE_NASLOVNIC[Math.abs(Number(slika.id) || 0) % BARVE_NASLOVNIC.length];
                            return (
                                <Paper
                                    key={slika.id}
                                    className="album-card"
                                    elevation={0}
                                    onClick={() => setOdprta(slika)}
                                >
                                    <Box
                                        className={`album-cover ${barva}`}
                                        sx={{ position: "relative", overflow: "hidden" }}
                                    >
                                        <PhotoOutlinedIcon />
                                        <img
                                            src={slikaUrl(slika.id)}
                                            alt={slika.name || "Slika"}
                                            loading="lazy"
                                            draggable={false}
                                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <IconButton
                                            className="album-more"
                                            aria-label="Možnosti slike"
                                            onClick={(event) => odpriMeni(event, slika)}
                                            sx={{ zIndex: 1 }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Chip
                                            className="album-status"
                                            size="small"
                                            label={String(slika.type || "").toUpperCase() || "SLIKA"}
                                            sx={{ zIndex: 1 }}
                                        />
                                    </Box>
                                    <Box className="album-card-info">
                                        <Typography variant="h6" noWrap>{slika.name || "Brez imena"}</Typography>
                                        <Typography className="album-description" color="text.secondary" noWrap>
                                            {slika.size || ""}
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            sx={{ justifyContent: "space-between", alignItems: "center", mt: 1.5 }}
                                        >
                                            <Stack direction="row" spacing={0.7} sx={{ alignItems: "center" }}>
                                                <PhotoOutlinedIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">Slika</Typography>
                                            </Stack>
                                            <Typography variant="caption" color="text.secondary">#{slika.id}</Typography>
                                        </Stack>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Box>
                )}

                {steviloStrani > 1 && (
                    <Stack sx={{ alignItems: "center", mt: 4 }}>
                        <Pagination
                            count={steviloStrani}
                            page={stran + 1}
                            onChange={(event, vrednost) => setStran(vrednost - 1)}
                            color="primary"
                        />
                    </Stack>
                )}
            </Box>

            <Menu anchorEl={meniSidro} open={Boolean(meniSidro)} onClose={() => setMeniSidro(null)}>
                <MenuItem onClick={() => { setOdprta(meniSlika); setMeniSidro(null); }}>
                    <OpenInFullIcon fontSize="small" sx={{ mr: 1 }} />Odpri sliko
                </MenuItem>
                <MenuItem onClick={() => meniSlika && navigate(`/slike/uredi/${meniSlika.id}`)}>
                    <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />Uredi
                </MenuItem>
                <MenuItem onClick={() => izbrisiSliko(meniSlika?.id)} sx={{ color: "error.main" }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />Izbriši
                </MenuItem>
            </Menu>

            <Dialog open={Boolean(odprta)} onClose={() => setOdprta(null)} maxWidth="lg">
                <DialogContent sx={{ p: 1 }}>
                    {odprta && (
                        <img
                            src={slikaUrl(odprta.id)}
                            alt={odprta.name || "Slika"}
                            style={{ maxWidth: "100%", maxHeight: "80vh", display: "block" }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}