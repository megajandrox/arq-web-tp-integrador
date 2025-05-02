import React from 'react';
import { TableFooter, TableRow, TableCell } from '@mui/material';

function CustomTableFooter({ label, totalUsers }) {
  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={7} align="right">
          Total de {label}: <strong>{totalUsers}</strong>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}

export default CustomTableFooter;