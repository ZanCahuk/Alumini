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

    return (
        <>
            <h1>Slike</h1>
            <Link to="/slike/dodaj"><Button variant="contained">Dodaj Sliko</Button> </Link>
            <SlikeTable slike={slike} />
        </>
    )
}

export default Slike