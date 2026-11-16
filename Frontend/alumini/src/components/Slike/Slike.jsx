import { Button, Pagination, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../../services/api";
import SlikeTable from "./SlikeTable";

const VELIKOST_STRANI = 5;

const Slike = () => {
    const [slike, setSlike] = useState([]);
    const [iskanje, setIskanje] = useState("");
    const [stran, setStran] = useState(0);          
    const [steviloStrani, setSteviloStrani] = useState(0);
    const [skupaj, setSkupaj] = useState(0);

    const pridobiSlike = useCallback(() => {
        api.get("/slike/iskanje", {
            params: { q: iskanje, page: stran, size: VELIKOST_STRANI },
        })
            .then((res) => {
                const { content, page } = res.data;
                if (content.length === 0 && stran > 0) {
                    setStran(stran - 1);
                    return;
                }
                setSlike(content);
                setSteviloStrani(page.totalPages);
                setSkupaj(page.totalElements);
            })
            .catch((err) => console.error(err));
    }, [iskanje, stran]);

    useEffect(() => {
        pridobiSlike();
    }, [pridobiSlike]);

    const izbrisiSliko = (id) => {
        if (!window.confirm("Ali res želite izbrisati sliko?")) return;
        api.delete(`/slike/${id}`)
            .then(pridobiSlike)
            .catch((err) => console.error(err));
    };

    const spremeniIskanje = (e) => {
        setIskanje(e.target.value);
        setStran(0);                                 
    };

    return (
        <>
            <h1>Slike</h1>
            <Link to="/albumi" style={{ marginRight: 12, textDecoration: "none" }}>
                <Button variant="outlined">Albumi</Button>
            </Link>
            <Link to="/slike/dodaj">
                <Button variant="contained">Dodaj Sliko</Button>
            </Link>

            <TextField
                label="Išči po imenu ali tipu"
                variant="outlined"
                size="small"
                value={iskanje}
                onChange={spremeniIskanje}
                style={{ marginLeft: 16 }}
            />

            <SlikeTable slike={slike} onDelete={izbrisiSliko} />

            {skupaj === 0 ? (
                <p>Ni zadetkov.</p>
            ) : (
                <>
                    <p>Skupaj zadetkov: {skupaj}</p>
                    {steviloStrani > 1 && (
                        <Pagination
                            count={steviloStrani}
                            page={stran + 1}          // MUI šteje od 1
                            onChange={(e, vrednost) => setStran(vrednost - 1)}
                            color="primary"
                        />
                    )}
                </>
            )}
        </>
    );
};

export default Slike;