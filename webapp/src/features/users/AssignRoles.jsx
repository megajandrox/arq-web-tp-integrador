import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from '@mui/material';

function AssignRoles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [currentRoles, setCurrentRoles] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la información del usuario');
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        setError(err.message);
      });

    fetch('/api/roles')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los roles');
        }
        return response.json();
      })
      .then((data) => {
        setRoles(data);
      })
      .catch((err) => {
        setError(err.message);
      });

    fetch(`/api/user-roles/roles/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los roles actuales del usuario');
        }
        return response.json();
      })
      .then((data) => {
        if (!(data.roles.length === 0)) {
          setCurrentRoles(data.roles.map((role) => role.id));
          setSelectedRoles(data.roles.map((role) => role.id));
        } else {
          setCurrentRoles([]);
          setSelectedRoles([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleRoleToggle = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleSave = () => {
    const deleteRequests = currentRoles.map((roleId) => {
      return fetch(`/api/user-roles/?user_id=${id}&role_id=${roleId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
        },
      }).then((response) => {
        if (response.status === 204) {
          return null;
        }
        if (!response.status === 204) {
          throw new Error(`Error al eliminar el rol con ID ${roleId}`);
        }
        return response.json();
      });
    });

    Promise.all(deleteRequests)
      .then(() => {
        const addRequests = selectedRoles.map((roleId) => {
          const body = {
            user_id: parseInt(id),
            role_id: parseInt(roleId),
          };

          return fetch(`/api/user-roles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }).then((response) => {
            if (!response.status === 201) {
              throw new Error(`Error al asignar el rol con ID ${roleId}`);
            }
            return response.json();
          });
        });

        return Promise.all(addRequests);
      })
      .then(() => {
        alert('Roles actualizados correctamente');
        navigate('/');
      })
      .catch((err) => {
        alert(`Error al crear: ${err.message}`);
      });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography gutterBottom>
        Asignar Roles al Usuario
      </Typography>
      {user && (
        <Typography variant="subtitle1" gutterBottom>
          Usuario: <strong>{user.username}</strong>
        </Typography>
      )}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Seleccionar</TableCell>
              <TableCell>Nombre del Rol</TableCell>
              <TableCell>Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                  />
                </TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
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

export default AssignRoles;