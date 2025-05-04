import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const UsersByRoleReport = ({ data }) => (
  <TableContainer component={Paper} sx={{ mt: 4 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><strong>Rol</strong></TableCell>
          <TableCell><strong>Cantidad de Usuarios</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.users_by_role_report.map((role) => (
          <TableRow key={role.role_name}>
            <TableCell>{role.role_name}</TableCell>
            <TableCell>{role.user_count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default UsersByRoleReport;