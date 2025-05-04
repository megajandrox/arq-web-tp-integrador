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

function AssignPermissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/roles/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener la información del rol');
        }
        return response.json();
      })
      .then((data) => {
        setRole(data);
      })
      .catch((err) => {
        setError(err.message);
      });

    fetch('/api/permissions')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los permisos');
        }
        return response.json();
      })
      .then((data) => {
        setPermissions(data);
      })
      .catch((err) => {
        setError(err.message);
      });

    fetch(`/api/roles/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los permisos actuales del rol');
        }
        return response.json();
      })
      .then((data) => {
		if (!(data.permissions.length === 0)) {
			setCurrentPermissions(data.permissions.map((permission) => permission.id));
			setSelectedPermissions(data.permissions.map((permission) => permission.id));
		} else {
			setCurrentPermissions([]);
			setSelectedPermissions([]);
		}
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handlePermissionToggle = (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const handleSave = () => {
    const deleteRequests = currentPermissions.map((permissionId) => {
      return fetch(`/api/roles/${id}/permissions?role_id=${id}&permission_id=${permissionId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
        },
      }).then((response) => {
        if (response.status === 204) {
          return null;
        }
        if (!response.ok) {
          throw new Error(`Error al eliminar el permiso con ID ${permissionId}`);
        }
      });
    });

    Promise.all(deleteRequests)
      .then(() => {
        const addRequests = selectedPermissions.map((permissionId) => {
          const body = {
            role_id: parseInt(id),
            permission_id: parseInt(permissionId),
          };

          return fetch(`/api/roles/${id}/permissions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`Error al asignar el permiso con ID ${permissionId}`);
            }
          });
        });

        return Promise.all(addRequests);
      })
      .then(() => {
        alert('Permisos actualizados correctamente');
        navigate('/roles');
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
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
        Asignar Permisos al Rol
      </Typography>
      {role && (
        <Typography variant="subtitle1" gutterBottom>
          Rol: <strong>{role.name}</strong>
        </Typography>
      )}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Seleccionar</TableCell>
              <TableCell>Nombre del Permiso</TableCell>
              <TableCell>Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                  />
                </TableCell>
                <TableCell>{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
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

export default AssignPermissions;