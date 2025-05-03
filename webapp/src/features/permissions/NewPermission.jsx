import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';

function NewPermission() {
  const navigate = useNavigate();
  const [permission, setPermission] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!permission.name || !permission.description) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    fetch('/api/permissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permission),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al crear el permiso');
        }
        return response.json();
      })
      .then((data) => {
        alert(`Permiso "${data.name}" creado correctamente`);
        navigate('/permissions');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Permiso
      </Typography>
      {error && <Typography color="error">Error: {error}</Typography>}
      <TextField
        fullWidth
        label="Nombre del Permiso"
        value={permission.name}
        onChange={(e) => setPermission({ ...permission, name: e.target.value })}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Descripción"
        value={permission.description}
        onChange={(e) => setPermission({ ...permission, description: e.target.value })}
        margin="normal"
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/permissions')}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
}

export default NewPermission;