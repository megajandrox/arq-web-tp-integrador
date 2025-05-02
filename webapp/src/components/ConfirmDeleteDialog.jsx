import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function ConfirmDeleteDialog({ open, onClose, onConfirm, username }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar al usuario <strong>{username}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteDialog;