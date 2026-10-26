import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../services/api";

const UrediSliko = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [size, setSize] = useState("");

    useEffect(() => {
        api.get(`/slike/${id}`)
            .then((res) => {
                setName(res.data.name ?? "");
                setType(res.data.type ?? "");
                setSize(res.data.size ?? "");
            })
            .catch((err) => console.error(err));
    }, [id]);

    const shrani = () => {
        api.put(`/slike/${id}`, { name, type, size })
            .then(() => navigate("/slike"))
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <Button variant="contained" onClick={() => navigate("/slike")}>Nazaj na slike</Button>
            <p>Urejanje slike</p>
            <TextField label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} /><br />
            <TextField label="Type" variant="outlined" value={type} onChange={(e) => setType(e.target.value)} /><br />
            <TextField label="Size" variant="outlined" value={size} onChange={(e) => setSize(e.target.value)} /><br />
            <Button variant="contained" onClick={shrani}>Shrani</Button>
        </div>
    );
};

export default UrediSliko;