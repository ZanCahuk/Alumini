import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../context/AuthContext";
import AuthTopbar from "./AuthTopbar";
import "../Albumi/Albumi.css";

export default function Login() {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [registracija, setRegistracija] = useState(false);
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [napaka, setNapaka] = useState("");
    const [nalaganje, setNalaganje] = useState(false);

    const spremeni = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const preklopi = () => {
        setRegistracija((r) => !r);
        setNapaka("");
    };

    const oddaj = async (e) => {
        e.preventDefault();
        setNapaka("");
        setNalaganje(true);
        try {
            if (registracija) {
                await register(form.username, form.email, form.password);
            } else {
                await login(form.username, form.password);
            }
            navigate("/slike");
        } catch (err) {
            setNapaka(
                err.response?.data?.message ||
                (registracija ? "Registracija ni uspela (preveri vnos)" : "Prijava ni uspela")
            );
        } finally {
            setNalaganje(false);
        }
    };

    return (
        <Box className="album-page">
            <AuthTopbar />

            <Box className="album-content">
                <Button
                    component={Link}
                    to="/slike"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                >
                    Nazaj na slike
                </Button>

                <Paper
                    elevation={0}
                    sx={{ maxWidth: 420, mx: "auto", p: 4, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
                >
                    <Typography variant="h4" className="album-title" sx={{ mb: 0.5 }}>
                        {registracija ? "Registracija" : "Prijava"}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        {registracija ? "Ustvari nov račun." : "Prijavi se v svoj račun."}
                    </Typography>

                    {napaka && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setNapaka("")}>{napaka}</Alert>}

                    <form onSubmit={oddaj}>
                        <Stack spacing={2}>
                            <TextField
                                name="username"
                                label="Uporabniško ime"
                                value={form.username}
                                onChange={spremeni}
                                helperText={registracija ? "Vsaj 3 znaki" : ""}
                                required
                                fullWidth
                            />
                            {registracija && (
                                <TextField
                                    name="email"
                                    type="email"
                                    label="E-pošta"
                                    value={form.email}
                                    onChange={spremeni}
                                    required
                                    fullWidth
                                />
                            )}
                            <TextField
                                name="password"
                                type="password"
                                label="Geslo"
                                value={form.password}
                                onChange={spremeni}
                                helperText={registracija ? "Vsaj 6 znakov" : ""}
                                required
                                fullWidth
                            />
                            <Button type="submit" variant="contained" size="large" disabled={nalaganje}>
                                {registracija ? "Registriraj se" : "Prijava"}
                            </Button>
                        </Stack>
                    </form>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
                        {registracija ? "Že imaš račun? " : "Nimaš računa? "}
                        <Button size="small" onClick={preklopi} sx={{ textTransform: "none" }}>
                            {registracija ? "Prijava" : "Registracija"}
                        </Button>
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}