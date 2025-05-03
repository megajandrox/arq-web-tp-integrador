import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';

function EditPermission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/permissions/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos del permiso');
        }
        return response.json();
      })
      .then((data) => {
        setPermission(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSave = () => {
    const permissionData = {
      name: permission.name,
      description: permission.description,
    };

    fetch(`/api/permissions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permissionData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar el permiso');
        }
        return response.json();
      })
      .then((data) => {
        alert(`Permiso "${data.name}" actualizado correctamente`);
        navigate('/permissions');
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
      });
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
        Editar Permiso
      </Typography>
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

export default EditPermission;