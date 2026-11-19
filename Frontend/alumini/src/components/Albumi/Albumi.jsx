import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import api from "../../services/api";
import "./Albumi.css";
import AlbumPlatno from "./AlbumPlatno";

const VELIKOST_STRANI = 6;
const PRAZEN_OBRAZEC = { name: "", description: "" };
const BARVE_NASLOVNIC = ["lavender", "peach", "blue", "green"];

// Backend status PUBLIC/PRIVATE pretvorimo v vrednost za prikaz v UI.
const jeObjavljen = (status) =>
    ["PUBLIC", "PUBLISHED", "OBJAVLJEN"].includes(String(status || "").toUpperCase());

export default function Albumi() {
    const navigate = useNavigate();
    const [albumi, setAlbumi] = useState([]);
    const [iskanje, setIskanje] = useState("");
    const [filter, setFilter] = useState("vsi");
    const [stran, setStran] = useState(0);
    const [steviloStrani, setSteviloStrani] = useState(0);
    const [skupaj, setSkupaj] = useState(0);
    const [nalaganje, setNalaganje] = useState(false);
    const [izbranAlbum, setIzbranAlbum] = useState(null);
    const [odprtDialog, setOdprtDialog] = useState(false);
    const [urejanjeId, setUrejanjeId] = useState(null);
    const [obrazec, setObrazec] = useState(PRAZEN_OBRAZEC);
    const [napaka, setNapaka] = useState("");
    const [meniSidro, setMeniSidro] = useState(null);
    const [meniAlbum, setMeniAlbum] = useState(null);

    const pridobiAlbume = useCallback(async () => {
        setNalaganje(true);
        setNapaka("");
        try {
            const odgovor = await api.get("/albumi/iskanje", {
                params: { q: iskanje, page: stran, size: VELIKOST_STRANI },
            });
            const vsebina = odgovor.data.content || [];
            const stranPodatki = odgovor.data.page || {};

            // Če po brisanju trenutna stran nima več zapisov, pojdi stran nazaj.
            if (vsebina.length === 0 && stran > 0) {
                setStran((trenutna) => Math.max(0, trenutna - 1));
                return;
            }

            setAlbumi(vsebina);
            setSteviloStrani(stranPodatki.totalPages || 0);
            setSkupaj(stranPodatki.totalElements ?? vsebina.length);
        } catch (error) {
            console.error("Napaka pri pridobivanju albumov:", error);
            setNapaka("Albumov ni bilo mogoče naložiti. Preveri, ali backend deluje.");
        } finally {
            setNalaganje(false);
        }
    }, [iskanje, stran]);

    useEffect(() => {
        pridobiAlbume();
    }, [pridobiAlbume]);

    const odpriUstvarjanje = () => {
        setUrejanjeId(null);
        setObrazec(PRAZEN_OBRAZEC);
        setNapaka("");
        setOdprtDialog(true);
    };

    const odpriUrejanje = (album) => {
        setUrejanjeId(album.id);
        setObrazec({ name: album.name || "", description: album.description || "" });
        setNapaka("");
        setOdprtDialog(true);
        setMeniSidro(null);
    };

    const shraniAlbum = async () => {
        const name = obrazec.name.trim();
        if (!name) {
            setNapaka("Vnesite ime albuma.");
            return;
        }

        const podatki = {
            name,
            description: obrazec.description.trim(),
            status: urejanjeId !== null
                ? (albumi.find((album) => album.id === urejanjeId)?.status || "PRIVATE")
                : "PRIVATE",
        };

        try {
            if (urejanjeId !== null) {
                await api.put(`/albumi/${urejanjeId}`, podatki);
            } else {
                await api.post("/albumi", podatki);
                setStran(0);
            }
            setOdprtDialog(false);
            setObrazec(PRAZEN_OBRAZEC);
            if (stran === 0 || urejanjeId !== null) {
                await pridobiAlbume();
            }
        } catch (error) {
            console.error("Napaka pri shranjevanju albuma:", error);
            setNapaka("Albuma ni bilo mogoče shraniti. Poskusi znova.");
        }
    };

    const izbrisiAlbum = async (id) => {
        if (id == null || !window.confirm("Ali res želite izbrisati ta album?")) return;
        setMeniSidro(null);
        try {
            await api.delete(`/albumi/${id}`);
            if (izbranAlbum?.id === id) setIzbranAlbum(null);
            await pridobiAlbume();
        } catch (error) {
            console.error("Napaka pri brisanju albuma:", error);
            setNapaka("Albuma ni bilo mogoče izbrisati.");
        }
    };

    const preklopiObjavo = async (album) => {
        if (!album) return;
        const novStatus = jeObjavljen(album.status) ? "PRIVATE" : "PUBLIC";
        setMeniSidro(null);
        try {
            await api.put(`/albumi/${album.id}`, {
                id: album.id,
                name: album.name,
                description: album.description,
                status: novStatus,
            });
            await pridobiAlbume();
            if (izbranAlbum?.id === album.id) {
                setIzbranAlbum((trenutni) => ({ ...trenutni, status: novStatus }));
            }
        } catch (error) {
            console.error("Napaka pri spremembi objave albuma:", error);
            setNapaka("Stanja objave ni bilo mogoče spremeniti.");
        }
    };

    const odpriMeni = (event, album) => {
        event.stopPropagation();
        setMeniSidro(event.currentTarget);
        setMeniAlbum(album);
    };

    const spremeniIskanje = (event) => {
        setIskanje(event.target.value);
        setStran(0);
    };

    const prikazaniAlbumi = albumi.filter((album) => {
        const objavljen = jeObjavljen(album.status);
        return filter === "vsi" || (filter === "objavljeni" ? objavljen : !objavljen);
    });

    const aktualniAlbum = izbranAlbum
        ? albumi.find((album) => album.id === izbranAlbum.id) || izbranAlbum
        : null;

    if (aktualniAlbum) {
        const objavljen = jeObjavljen(aktualniAlbum.status);
        return (
            <Box className="album-page">
                <Box className="album-topbar">
                    <Box className="album-brand">
                        <Avatar className="album-brand-icon"><CollectionsOutlinedIcon /></Avatar>
                        <Typography variant="h6">Alumini</Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button component={Link} to="/slike" color="inherit">Slike</Button>
                        <Button color="inherit" variant="contained" disableElevation>Albumi</Button>
                    </Stack>
                </Box>
                <Box className="album-content">
                    <Button startIcon={<ArrowBackIcon />} onClick={() => setIzbranAlbum(null)} className="back-button">
                        Nazaj na albume
                    </Button>
                    <Box className="detail-heading">
                <Box>
                    <Typography variant="h4" className="album-title">{aktualniAlbum.name}</Typography>
                    <Typography color="text.secondary">{aktualniAlbum.description || "Brez opisa"}</Typography>
                    </Box>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <Chip
                                icon={objavljen ? <PublicIcon /> : <LockOutlinedIcon />}
                                label={objavljen ? "Objavljen" : "Zaseben"}
                                color={objavljen ? "success" : "default"}
                            />
                            <Button
                                variant="contained"
                                startIcon={<EditOutlinedIcon />}
                                onClick={() => navigate(`/albumi/uredi/${aktualniAlbum.id}`)}
                            >
                                Uredi album
                            </Button>
                        </Stack>
                    </Box>
                    <AlbumPlatno albumId={aktualniAlbum.id} />
                </Box>
            </Box>
        );
    }

    return (
        <Box className="album-page">
            <Box className="album-topbar">
                <Box className="album-brand">
                    <Avatar className="album-brand-icon"><CollectionsOutlinedIcon /></Avatar>
                    <Typography variant="h6">Alumini</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button component={Link} to="/slike" color="inherit">Slike</Button>
                    <Button color="inherit" variant="contained" disableElevation>Albumi</Button>
                </Stack>
            </Box>

            <Box className="album-content">
                <Box className="album-heading-row">
                    <Box>
                        <Typography variant="h4" className="album-title">Moji albumi</Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Vsi tvoji spomini na enem mestu.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={odpriUstvarjanje}
                        className="create-album-button"
                    >
                        Nov album
                    </Button>
                </Box>

                {napaka && <Alert severity="error" sx={{ mb: 2 }}>{napaka}</Alert>}

                <Paper className="album-toolbar" elevation={0}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Išči albume po imenu ali opisu ..."
                        value={iskanje}
                        onChange={spremeniIskanje}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Stack direction="row" spacing={1} className="album-filters">
                        <Chip
                            label={`Vsi (${skupaj})`}
                            clickable
                            color={filter === "vsi" ? "primary" : "default"}
                            variant={filter === "vsi" ? "filled" : "outlined"}
                            onClick={() => setFilter("vsi")}
                        />
                        <Chip
                            label="Objavljeni"
                            clickable
                            color={filter === "objavljeni" ? "primary" : "default"}
                            variant={filter === "objavljeni" ? "filled" : "outlined"}
                            onClick={() => setFilter("objavljeni")}
                        />
                        <Chip
                            label="Zasebni"
                            clickable
                            color={filter === "osnutki" ? "primary" : "default"}
                            variant={filter === "osnutki" ? "filled" : "outlined"}
                            onClick={() => setFilter("osnutki")}
                        />
                    </Stack>
                </Paper>

                {nalaganje ? (
                    <Typography color="text.secondary">Nalaganje albumov ...</Typography>
                ) : prikazaniAlbumi.length === 0 ? (
                    <Paper className="no-albums" elevation={0}>
                        <Avatar className="empty-album-icon"><CollectionsOutlinedIcon /></Avatar>
                        <Typography variant="h6">Ni najdenih albumov</Typography>
                        <Typography color="text.secondary">
                            Poskusi spremeniti iskalni niz ali ustvari nov album.
                        </Typography>
                    </Paper>
                ) : (
                    <Box className="album-grid">
                        {prikazaniAlbumi.map((album) => {
                            const objavljen = jeObjavljen(album.status);
                            const barva = BARVE_NASLOVNIC[Math.abs(Number(album.id) || 0) % BARVE_NASLOVNIC.length];
                            return (
                                <Paper
                                    key={album.id}
                                    className="album-card"
                                    elevation={0}
                                    onClick={() => setIzbranAlbum(album)}
                                >
                                    <Box className={`album-cover ${barva}`}>
                                        <CollectionsOutlinedIcon />
                                        <IconButton
                                            className="album-more"
                                            aria-label="Možnosti albuma"
                                            onClick={(event) => odpriMeni(event, album)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Chip
                                            className="album-status"
                                            size="small"
                                            icon={objavljen ? <PublicIcon /> : <LockOutlinedIcon />}
                                            label={objavljen ? "Objavljen" : "Zaseben"}
                                        />
                                    </Box>
                                    <Box className="album-card-info">
                                        <Typography variant="h6" noWrap>{album.name}</Typography>
                                        <Typography className="album-description" color="text.secondary" noWrap>
                                            {album.description || "Brez opisa"}
                                        </Typography>
                                        <Stack direction="row" sx={{ mt: 1.5, justifyContent: "space-between", alignItems: "center" }}>
                                            <Stack direction="row" spacing={0.7} sx={{ alignItems: "center" }}>
                                                <PhotoOutlinedIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">Album</Typography>
                                            </Stack>
                                            <Typography variant="caption" color="text.secondary">#{album.id}</Typography>
                                        </Stack>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Box>
                )}

                {steviloStrani > 1 && (
                    <Stack sx={{ mt: 4, alignItems: "center" }}>
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
                <MenuItem onClick={() => { setIzbranAlbum(meniAlbum); setMeniSidro(null); }}>
                    <CollectionsOutlinedIcon fontSize="small" sx={{ mr: 1 }} />Odpri album
                </MenuItem>
                <MenuItem onClick={() => meniAlbum && odpriUrejanje(meniAlbum)}>
                    <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />Uredi
                </MenuItem>
                <MenuItem onClick={() => preklopiObjavo(meniAlbum)}>
                    {jeObjavljen(meniAlbum?.status)
                        ? <LockOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                        : <PublicIcon fontSize="small" sx={{ mr: 1 }} />}
                    {jeObjavljen(meniAlbum?.status) ? "Naredi zasebnega" : "Objavi album"}
                </MenuItem>
                <MenuItem onClick={() => izbrisiAlbum(meniAlbum?.id)} sx={{ color: "error.main" }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />Izbriši
                </MenuItem>
            </Menu>

            <Dialog open={odprtDialog} onClose={() => setOdprtDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>{urejanjeId !== null ? "Uredi album" : "Ustvari nov album"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {napaka && <Alert severity="error">{napaka}</Alert>}
                        <TextField
                            autoFocus
                            required
                            label="Ime albuma"
                            value={obrazec.name}
                            onChange={(event) => setObrazec({ ...obrazec, name: event.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Opis"
                            value={obrazec.description}
                            onChange={(event) => setObrazec({ ...obrazec, description: event.target.value })}
                            fullWidth
                            multiline
                            minRows={3}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOdprtDialog(false)}>Prekliči</Button>
                    <Button variant="contained" onClick={shraniAlbum}>Shrani</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}