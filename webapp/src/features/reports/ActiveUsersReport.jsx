import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const ActiveUsersReport = ({ data }) => (
  <TableContainer component={Paper} sx={{ mt: 4 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><strong>Tipo</strong></TableCell>
          <TableCell><strong>Valor</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Usuarios Activos</TableCell>
          <TableCell>{data.active_users_report.active_users}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Usuarios Inactivos</TableCell>
          <TableCell>{data.active_users_report.inactive_users}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Porcentaje de Usuarios Activos</TableCell>
          <TableCell>{data.active_users_report.active_percentage}%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

export default ActiveUsersReport;