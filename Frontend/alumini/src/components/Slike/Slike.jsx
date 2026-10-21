import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../../services/api";
import SlikeTable from "./SlikeTable";



const Slike = () => {
    const [slike, setSlike] = useState([]);
    useEffect(() => {
        const pridobiSlike = () => {
            api.get("/slike").then((res) => {
                setSlike(res.data);
                console.log(res)
            });
        }
        pridobiSlike();
    }, []);

    const izbrisiSliko = (id) => {
        if (!window.confirm("Ali res želite izbrisati sliko?")) return;
        api.delete(`/slike/${id}`)
            .then(() => setSlike((prev) => prev.filter((s) => s.id !== id)))
            .catch((err) => console.error(err));
    };


    return (
        <>
            <h1>Slike</h1>
            <Link to="/slike/dodaj"><Button variant="contained">Dodaj Sliko</Button> </Link>
            <SlikeTable slike={slike} onDelete={izbrisiSliko} />
        </>
    )
}

export default Slike