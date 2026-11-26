import React from "react";
import { Routes, Route } from "react-router";
import Login from "../Auth/Login";
import Profile from "../Auth/Profile";
import DodajSliko from "../Slike/DodajSliko";
import UrediSliko from "../Slike/UrediSliko";
import Slike from "../Slike/Slike";
import Albumi from "../Albumi/Albumi";
import UrediAlbum from "../Albumi/UrediAlbum";
import PageNotFound from "../PageNotFound/PageNotFound";

export default function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Slike />} />
            <Route path="/slike" element={<Slike />} />
            <Route path="/albumi" element={<Albumi />} />
            <Route path="/albumi/uredi/:id" element={<UrediAlbum />} />
            <Route path="/slike/dodaj" element={<DodajSliko />} />
            <Route path="/slike/uredi/:id" element={<UrediSliko />} />
            <Route path="/prijava" element={<Login />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}