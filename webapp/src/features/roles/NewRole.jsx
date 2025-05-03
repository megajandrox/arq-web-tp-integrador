import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';

function NewRole() {
  const navigate = useNavigate();
  const [role, setRole] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!role.name || !role.description) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    fetch('/api/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(role),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al crear el rol');
        }
        return response.json();
      })
      .then((data) => {
        alert(`Rol "${data.name}" creado correctamente`);
        navigate('/roles');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Rol
      </Typography>
      {error && <Typography color="error">Error: {error}</Typography>}
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/roles')}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
}

export default NewRole;