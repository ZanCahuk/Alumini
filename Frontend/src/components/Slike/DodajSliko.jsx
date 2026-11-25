import { Container, Typography, Box, CircularProgress } from '@mui/material';
import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../services/api";

const MAX_VELIKOST = 10 * 1024 * 1024; // 10 MB, enako kot na backendu

const DodajSliko = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const dodajSliko = async (file) => {
        const validTypes = ['image/jpeg', 'image/png'];
        if (!file || !validTypes.includes(file.type)) {
            alert("Nalagate lahko samo slike (jpg, png)");
            return;
        }
        if (file.size > MAX_VELIKOST) {
            alert("Slika je prevelika (največ 10 MB)");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("ime", file.name);

        try {
            const res = await api.post("/slike/upload", formData);
            if (res.data?.uspelo === false) {
                alert("Napaka pri nalaganju: " + (res.data.napaka || ""));
            } else {
                navigate("/slike");
            }
        } catch (err) {
            console.error("Napaka", err);
            alert("Napaka pri nalaganju: " + (err.response?.data?.napaka || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h5" gutterBottom>Dodajanje slik</Typography>

            <Box
                onDragEnter={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    if (!loading) dodajSliko(e.dataTransfer.files[0]);
                }}
                onClick={() => !loading && document.getElementById("file-upload").click()}
                style={{
                    border: "2px dashed #ccc",
                    borderRadius: "8px",
                    padding: "40px",
                    textAlign: "center",
                    cursor: loading ? "default" : "pointer",
                    backgroundColor: loading ? "#f0f0f0" : "#f9f9f9",
                    userSelect: "none",
                    opacity: loading ? 0.6 : 1
                }}
            >
                <Typography variant="body1">Povlecite sliko sem ali kliknite za izbiro</Typography>
                <small style={{ color: "#888" }}>(.jpg, .png, do 10 MB)</small>
            </Box>

            <input
                type="file"
                accept="image/jpeg,image/png"
                id="file-upload"
                style={{ display: "none" }}
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) dodajSliko(file);
                    e.target.value = "";
                }}
            />

            {loading && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" ml={1}>Počakajte, nalaganje ...</Typography>
                </Box>
            )}
        </Container>
    );
};

export default DodajSliko;