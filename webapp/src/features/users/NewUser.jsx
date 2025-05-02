import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, FormControlLabel, Switch } from '@mui/material';

function NewUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    is_active: true, // Estado inicial del campo "activo"
  });

  const handleSave = () => {
    // Simulación de guardar el nuevo usuario
    alert(`Usuario ${user.username} creado con estado ${user.is_active ? 'Activo' : 'Inactivo'}`);
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Usuario
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
}

export default NewUser;