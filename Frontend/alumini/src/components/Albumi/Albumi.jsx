import React, { useMemo, useState } from "react";
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
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import "./Albumi.css";

const ZACETNI_ALBUMI = [
    {
        id: 1,
        naziv: "Diploma 2026",
        opis: "Utrinki in spomini z zaključka študija.",
        steviloSlik: 12,
        objavljen: true,
        datum: "16. 6. 2026",
        barva: "lavender",
        naslovnica: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 2,
        naziv: "Študentski izlet",
        opis: "Skupni izlet in dogodivščine s sošolci.",
        steviloSlik: 24,
        objavljen: false,
        datum: "3. 5. 2026",
        barva: "peach",
        naslovnica: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 3,
        naziv: "FERI spomini",
        opis: "Dogodki, predavanja in vsakdan na fakulteti.",
        steviloSlik: 8,
        objavljen: true,
        datum: "21. 3. 2026",
        barva: "blue",
        naslovnica: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 4,
        naziv: "Poletje 2025",
        opis: "Poletni večeri, potovanja in druženje.",
        steviloSlik: 16,
        objavljen: false,
        datum: "12. 8. 2025",
        barva: "green",
        naslovnica: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
    },
];

const PRAZEN_OBRAZEC = { naziv: "", opis: "" };

export default function Albumi() {
    const navigate = useNavigate();
    const [albumi, setAlbumi] = useState(ZACETNI_ALBUMI);
    const [iskanje, setIskanje] = useState("");
    const [filter, setFilter] = useState("vsi");
    const [izbranAlbum, setIzbranAlbum] = useState(null);
    const [odprtDialog, setOdprtDialog] = useState(false);
    const [urejanjeId, setUrejanjeId] = useState(null);
    const [obrazec, setObrazec] = useState(PRAZEN_OBRAZEC);
    const [napaka, setNapaka] = useState("");
    const [meniSidro, setMeniSidro] = useState(null);
    const [meniAlbum, setMeniAlbum] = useState(null);

    const prikazaniAlbumi = useMemo(() => albumi.filter((album) => {
        const ustrezaIskanju = album.naziv.toLowerCase().includes(iskanje.toLowerCase());
        const ustrezaFiltru = filter === "vsi" || (filter === "objavljeni" ? album.objavljen : !album.objavljen);
        return ustrezaIskanju && ustrezaFiltru;
    }), [albumi, iskanje, filter]);

    const odpriUstvarjanje = () => {
        setUrejanjeId(null);
        setObrazec(PRAZEN_OBRAZEC);
        setNapaka("");
        setOdprtDialog(true);
    };

    const odpriUrejanje = (album) => {
        setUrejanjeId(album.id);
        setObrazec({ naziv: album.naziv, opis: album.opis });
        setNapaka("");
        setOdprtDialog(true);
        setMeniSidro(null);
    };

    const shraniAlbum = () => {
        const naziv = obrazec.naziv.trim();
        if (!naziv) {
            setNapaka("Vnesite ime albuma.");
            return;
        }

        if (urejanjeId !== null) {
            setAlbumi((trenutni) => trenutni.map((album) => album.id === urejanjeId
                ? { ...album, naziv, opis: obrazec.opis.trim() }
                : album));
        } else {
            setAlbumi((trenutni) => [{
                id: Date.now(),
                naziv,
                opis: obrazec.opis.trim(),
                steviloSlik: 0,
                objavljen: false,
                datum: new Date().toLocaleDateString("sl-SI"),
                barva: "lavender",
                naslovnica: "",
            }, ...trenutni]);
        }
        setOdprtDialog(false);
    };

    const izbrisiAlbum = (id) => {
        if (!window.confirm("Ali res želite izbrisati ta album?")) return;
        setAlbumi((trenutni) => trenutni.filter((album) => album.id !== id));
        if (izbranAlbum?.id === id) setIzbranAlbum(null);
        setMeniSidro(null);
    };

    const preklopiObjavo = (id) => {
        setAlbumi((trenutni) => trenutni.map((album) => album.id === id
            ? { ...album, objavljen: !album.objavljen }
            : album));
        setMeniSidro(null);
    };

    const odpriMeni = (event, album) => {
        event.stopPropagation();
        setMeniSidro(event.currentTarget);
        setMeniAlbum(album);
    };

    if (izbranAlbum) {
        const aktualniAlbum = albumi.find((album) => album.id === izbranAlbum.id);
        if (!aktualniAlbum) {
            setIzbranAlbum(null);
            return null;
        }
        return (
            <Box className="album-page">
                <Box className="album-topbar">
                    <Box className="album-brand"><Avatar className="album-brand-icon"><CollectionsOutlinedIcon /></Avatar><Typography variant="h6">Alumini</Typography></Box>
                    <Stack direction="row" spacing={1}>
                        <Button component={Link} to="/slike" color="inherit">Slike</Button>
                        <Button color="inherit" variant="contained" disableElevation>Albumi</Button>
                    </Stack>
                </Box>
                <Box className="album-content">
                    <Button startIcon={<ArrowBackIcon />} onClick={() => setIzbranAlbum(null)} className="back-button">Nazaj na albume</Button>
                    <Box className="detail-heading">
                        <Box>
                            <Typography variant="h4" className="album-title">{aktualniAlbum.naziv}</Typography>
                            <Typography color="text.secondary">{aktualniAlbum.opis || "Brez opisa"}</Typography>
                        </Box>
                        <Chip icon={aktualniAlbum.objavljen ? <PublicIcon /> : <LockOutlinedIcon />} label={aktualniAlbum.objavljen ? "Objavljen" : "Osnutek"} color={aktualniAlbum.objavljen ? "success" : "default"} />
                    </Box>
                    <Paper className="empty-album" elevation={0}>
                        <Avatar className="empty-album-icon"><PhotoOutlinedIcon /></Avatar>
                        <Typography variant="h6">V tem albumu še ni slik</Typography>
                        <Typography color="text.secondary">Ko bo dodajanje slikovnih datotek omogočeno, jih boš lahko dodal v ta album.</Typography>
                        <Button variant="outlined" onClick={() => navigate("/slike")} sx={{ mt: 2 }}>Pojdi na slike</Button>
                    </Paper>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="album-page">
            <Box className="album-topbar">
                <Box className="album-brand"><Avatar className="album-brand-icon"><CollectionsOutlinedIcon /></Avatar><Typography variant="h6">Alumini</Typography></Box>
                <Stack direction="row" spacing={1}>
                    <Button component={Link} to="/slike" color="inherit">Slike</Button>
                    <Button color="inherit" variant="contained" disableElevation>Albumi</Button>
                </Stack>
            </Box>

            <Box className="album-content">
                <Box className="album-heading-row">
                    <Box>
                        <Typography variant="h4" className="album-title">Moji albumi</Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>Vsi tvoji spomini na enem mestu.</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={odpriUstvarjanje} className="create-album-button">Nov album</Button>
                </Box>

                <Paper className="album-toolbar" elevation={0}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Išči albume po imenu ..."
                        value={iskanje}
                        onChange={(event) => setIskanje(event.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
                    />
                    <Stack direction="row" spacing={1} className="album-filters">
                        <Chip label={`Vsi (${albumi.length})`} clickable color={filter === "vsi" ? "primary" : "default"} variant={filter === "vsi" ? "filled" : "outlined"} onClick={() => setFilter("vsi")} />
                        <Chip label="Objavljeni" clickable color={filter === "objavljeni" ? "primary" : "default"} variant={filter === "objavljeni" ? "filled" : "outlined"} onClick={() => setFilter("objavljeni")} />
                        <Chip label="Osnutki" clickable color={filter === "osnutki" ? "primary" : "default"} variant={filter === "osnutki" ? "filled" : "outlined"} onClick={() => setFilter("osnutki")} />
                    </Stack>
                </Paper>

                {prikazaniAlbumi.length === 0 ? (
                    <Paper className="no-albums" elevation={0}>
                        <Avatar className="empty-album-icon"><CollectionsOutlinedIcon /></Avatar>
                        <Typography variant="h6">Ni najdenih albumov</Typography>
                        <Typography color="text.secondary">Poskusi spremeniti iskalni niz ali ustvari nov album.</Typography>
                    </Paper>
                ) : (
                    <Box className="album-grid">
                        {prikazaniAlbumi.map((album) => (
                            <Paper key={album.id} className="album-card" elevation={0} onClick={() => setIzbranAlbum(album)}>
                                <Box className={`album-cover ${album.barva}`}>
                                    {album.naslovnica ? <img src={album.naslovnica} alt={`Naslovnica albuma ${album.naziv}`} /> : <CollectionsOutlinedIcon />}
                                    <IconButton className="album-more" aria-label="Možnosti albuma" onClick={(event) => odpriMeni(event, album)}><MoreVertIcon /></IconButton>
                                    <Chip className="album-status" size="small" icon={album.objavljen ? <PublicIcon /> : <LockOutlinedIcon />} label={album.objavljen ? "Objavljen" : "Osnutek"} />
                                </Box>
                                <Box className="album-card-info">
                                    <Typography variant="h6" noWrap>{album.naziv}</Typography>
                                    <Typography className="album-description" color="text.secondary" noWrap>{album.opis || "Brez opisa"}</Typography>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
                                        <Stack direction="row" spacing={0.7} alignItems="center"><PhotoOutlinedIcon fontSize="small" color="action" /><Typography variant="body2" color="text.secondary">{album.steviloSlik} slik</Typography></Stack>
                                        <Typography variant="caption" color="text.secondary">{album.datum}</Typography>
                                    </Stack>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>

            <Menu anchorEl={meniSidro} open={Boolean(meniSidro)} onClose={() => setMeniSidro(null)}>
                <MenuItem onClick={() => { setIzbranAlbum(meniAlbum); setMeniSidro(null); }}><CollectionsOutlinedIcon fontSize="small" sx={{ mr: 1 }} />Odpri album</MenuItem>
                <MenuItem onClick={() => odpriUrejanje(meniAlbum)}><EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />Uredi</MenuItem>
                <MenuItem onClick={() => preklopiObjavo(meniAlbum?.id)}>{meniAlbum?.objavljen ? <LockOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> : <PublicIcon fontSize="small" sx={{ mr: 1 }} />}{meniAlbum?.objavljen ? "Umakni objavo" : "Objavi album"}</MenuItem>
                <MenuItem onClick={() => izbrisiAlbum(meniAlbum?.id)} sx={{ color: "error.main" }}><DeleteIcon  fontSize="small" sx={{ mr: 1 }} />Izbriši</MenuItem>
            </Menu>

            <Dialog open={odprtDialog} onClose={() => setOdprtDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>{urejanjeId !== null ? "Uredi album" : "Ustvari nov album"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {napaka && <Alert severity="error">{napaka}</Alert>}
                        <TextField autoFocus required label="Ime albuma" value={obrazec.naziv} onChange={(event) => setObrazec({ ...obrazec, naziv: event.target.value })} fullWidth />
                        <TextField label="Opis" value={obrazec.opis} onChange={(event) => setObrazec({ ...obrazec, opis: event.target.value })} fullWidth multiline minRows={3} />
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
