import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSave = () => {
    const userData = {
      username: user.username,
      email: user.email,
      is_active: user.is_active ? 1 : 0,
    };

    fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar el usuario');
        }
        return response.json();
      })
      .then((data) => {
        alert(`Usuario ${data.username} actualizado correctamente`);
        navigate('/');
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
      });
  };

  const handleResetPassword = () => {
    alert(`Contraseña del usuario ${user.username} reseteada`);
    setIsResetDialogOpen(false);
  };

  const openResetDialog = () => {
    setIsResetDialogOpen(true);
  };

  const closeResetDialog = () => {
    setIsResetDialogOpen(false);
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Editar Usuario
      </Typography>
      <TextField
        fullWidth
        label="Nombre de Usuario"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        margin="normal"
      />
      <FormControlLabel
        control={
          <Switch
            checked={user.is_active}
            onChange={(e) => setUser({ ...user, is_active: e.target.checked })}
            color="primary"
          />
        }
        label="Activo"
        sx={{ mt: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={openResetDialog}>
          Resetear Contraseña
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Box>
      </Box>
      <Dialog open={isResetDialogOpen} onClose={closeResetDialog}>
        <DialogTitle>Resetear Contraseña</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas resetear la contraseña de <strong>{user.username}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResetDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleResetPassword} color="primary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditUser;