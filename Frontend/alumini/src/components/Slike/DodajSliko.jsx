import { Button, Checkbox, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../services/api";


const DodajSliko = () => {
    const [name, setName] = useState(0);
    const [type, setType] = useState("");
    const [size, setSize] = useState(0);
    let navigate = useNavigate();

    const dodajSliko = () => {
        api.post("/slike", {
            
            name: name,
            type: type,
            size: size
        }).then((res) => console.log(XPathResult.data));
    }

    return(
        <div>
            <Button variant="contained" onClick={() => navigate("/slike")}>Nazaj na slike</Button>
            <p>Dodajanje slik</p>
            <TextField variant="outlined" value={name} onChange={(event) => setName(event.target.value)}/><br />
            <TextField variant="outlined" value={type} onChange={(event) => setType(event.target.value)}/><br />
            <TextField variant="outlined" value={size} onChange={(event) => setSize(event.target.value)} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}/><br />
            <Button variant="contained" onClick={dodajSliko}>Dodaj</Button>
        </div>
    )
}
export default DodajSliko