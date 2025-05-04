import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const UsersWithoutRolesReport = ({ data }) => (
  <TableContainer component={Paper} sx={{ mt: 4 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><strong>ID</strong></TableCell>
          <TableCell><strong>Nombre de Usuario</strong></TableCell>
          <TableCell><strong>Email</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.users_without_roles_report.map((user) => (
          <TableRow key={user.user_id}>
            <TableCell>{user.user_id}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default UsersWithoutRolesReport;