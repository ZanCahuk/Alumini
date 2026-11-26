import { Link } from "react-router";
import { Button } from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import { useAuth } from "../../context/AuthContext";

export default function AuthButton({ aktiven = false }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    return user ? (
        <Button
            component={Link}
            to="/profil"
            color="inherit"
            variant={aktiven ? "contained" : "text"}
            disableElevation
            startIcon={<PersonOutlineIcon />}
        >
            {user.username}
        </Button>
    ) : (
        <Button
            component={Link}
            to="/prijava"
            color="inherit"
            variant={aktiven ? "contained" : "text"}
            disableElevation
        >
            Prijava
        </Button>
    );
}