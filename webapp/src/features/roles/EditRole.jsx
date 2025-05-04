import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function EditRole() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/roles/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos del rol');
        }
        return response.json();
      })
      .then((data) => {
        setRole(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSave = () => {
    const roleData = {
      name: role.name,
      description: role.description,
    };

    fetch(`/api/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar el rol');
        }
        return response.json();
      })
      .then((data) => {
        alert(`Rol ${data.name} actualizado correctamente`);
        navigate('/roles');
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
      });
  };

  const handleResetPermissions = () => {
    alert(`Permisos del rol ${role.name} reseteados`);
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
        Editar Rol
      </Typography>
      <TextField
        fullWidth
        label="Nombre del Rol"
        value={role.name}
        onChange={(e) => setRole({ ...role, name: e.target.value })}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Descripción"
        value={role.description}
        onChange={(e) => setRole({ ...role, description: e.target.value })}
        margin="normal"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/roles')}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default EditRole;