import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../services/api";
import { slikaUrl } from "./SlikeTable";

const UrediSliko = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [napaka, setNapaka] = useState("");

  useEffect(() => {
    api
      .get(`/slike/${id}`)
      .then((res) => {
        setName(res.data.name ?? "");
        setType(res.data.type ?? "");
        setSize(res.data.size ?? "");
      })
      .catch((err) => {
        console.error(err);
        setNapaka("Slike ni mogoče naložiti.");
      });
  }, [id]);

  const shrani = () => {
    if (!name.trim()) {
      setNapaka("Ime ne sme biti prazno.");
      return;
    }
    api
      .put(`/slike/${id}`, { name: name.trim() })
      .then(() => navigate("/slike"))
      .catch((err) => {
        console.error(err);
        setNapaka("Shranjevanje ni uspelo.");
      });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Button variant="outlined" onClick={() => navigate("/slike")}>
        Nazaj na slike
      </Button>

      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Urejanje slike
      </Typography>

      {napaka && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {napaka}
        </Alert>
      )}

      <img
        src={slikaUrl(id)}
        alt={name || "Slika"}
        style={{
          maxWidth: "100%",
          maxHeight: 350,
          borderRadius: 8,
          display: "block",
          marginBottom: 16,
        }}
      />

      <TextField
        label="Ime"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setNapaka("");
        }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Tip"
        variant="outlined"
        fullWidth
        value={type}
        disabled
        sx={{ mb: 2 }}
      />
      <TextField
        label="Velikost"
        variant="outlined"
        fullWidth
        value={size}
        disabled
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={shrani}>
        Shrani
      </Button>
    </Box>
  );
};

export default UrediSliko;
