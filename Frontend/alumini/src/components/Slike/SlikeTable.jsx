import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';

export default function SlikeTable({ slike, onDelete }) {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
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
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {slika.id}
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
                </Button>{' '}
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
  );
}