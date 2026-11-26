import { Link } from "react-router";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import AuthButton from "./AuthButton";

export default function AuthTopbar() {
    return (
        <Box className="album-topbar">
            <Box className="album-brand">
                <Avatar className="album-brand-icon"><CollectionsOutlinedIcon /></Avatar>
                <Typography variant="h6">Alumini</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
                <Button component={Link} to="/slike" color="inherit">Slike</Button>
                <Button component={Link} to="/albumi" color="inherit">Albumi</Button>
                <AuthButton aktiven />
            </Stack>
        </Box>
    );
}