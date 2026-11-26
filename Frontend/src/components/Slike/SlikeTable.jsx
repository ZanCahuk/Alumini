import * as React from "react";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useNavigate } from "react-router";
import api from "../../services/api";

export const slikaUrl = (id) =>
  `${api.defaults.baseURL ?? ""}/slike/prejmi/${id}`;

export default function SlikeTable({ slike, onDelete }) {
  const navigate = useNavigate();
  const [odprta, setOdprta] = useState(null);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela slik">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Slika</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slike.map((slika) => (
              <TableRow
                key={slika.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {slika.id}
                </TableCell>
                <TableCell>
                  <img
                    src={slikaUrl(slika.id)}
                    alt={slika.name || "Slika"}
                    loading="lazy"
                    onClick={() => setOdprta(slika)}
                    onError={(e) => {
                      e.currentTarget.style.opacity = 0.3;
                    }}
                    style={{
                      width: 80,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  />
                </TableCell>
                <TableCell align="right">{slika.name}</TableCell>
                <TableCell align="right">{slika.type}</TableCell>
                <TableCell align="right">{slika.size}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/slike/uredi/${slika.id}`)}
                  >
                    Uredi
                  </Button>{" "}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => onDelete(slika.id)}
                  >
                    Izbriši
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(odprta)}
        onClose={() => setOdprta(null)}
        maxWidth="lg"
      >
        <DialogContent sx={{ p: 1 }}>
          {odprta && (
            <img
              src={slikaUrl(odprta.id)}
              alt={odprta.name || "Slika"}
              style={{ maxWidth: "100%", maxHeight: "80vh", display: "block" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
