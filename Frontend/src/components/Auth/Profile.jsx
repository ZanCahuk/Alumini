import { Link, Navigate } from "react-router";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";
import AuthTopbar from "./AuthTopbar";
import "../Albumi/Albumi.css";

export default function Profile() {
    const { user, loading, logout } = useAuth();

    if (loading) return null;
    if (!user) return <Navigate to="/prijava" replace />;

    return (
        <Box className="album-page">
            <AuthTopbar />
            <Box className="album-content">
                <Button component={Link} to="/slike" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
                    Nazaj na slike
                </Button>

                <Paper
                    elevation={0}
                    sx={{ maxWidth: 420, mx: "auto", p: 4, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
                >
                    <Typography variant="h4" className="album-title" sx={{ mb: 3 }}>Profil</Typography>
                    <Stack spacing={1.5}>
                        <Typography><b>Uporabniško ime:</b> {user.username}</Typography>
                        <Typography><b>E-pošta:</b> {user.email}</Typography>
                        <Typography>
                            <b>Registriran:</b>{" "}
                            {new Date(user.casKreiranja).toLocaleDateString("sl-SI")}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<LogoutIcon />}
                            onClick={logout}
                            sx={{ mt: 2 }}
                        >
                            Odjava
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
}