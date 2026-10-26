import React from "react";
// import { Route } from "react-router";
import { Routes,Route } from "react-router";
import DodajSliko from "../Slike/DodajSliko";
import UrediSliko from "../Slike/UrediSliko";
import Slike from "../Slike/Slike";
import PageNotFound from "../PageNotFound/PageNotFound";

export default function Routing(){
    return(
        <Routes>
            <Route path="/" element={<Slike />} />
            <Route path="/slike" element={<Slike />} />
            <Route path="/slike/dodaj" element={<DodajSliko />} />
            <Route path="/slike/uredi/:id" element={<UrediSliko />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}