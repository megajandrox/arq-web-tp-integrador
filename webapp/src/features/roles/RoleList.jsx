import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Tooltip,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '@/styles/TableStyles.css';

function RoleList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRole, setMenuRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/roles')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los roles');
        }
        return response.json();
      })
      .then((data) => {
        setRoles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleMenuOpen = (event, role) => {
    setMenuAnchor(event.currentTarget);
    setMenuRole(role);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuRole(null);
  };

  const handleDelete = (role) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el rol "${role.name}"?`)) {
      fetch(`/api/roles/${role.id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al eliminar el rol');
          }
          setRoles(roles.filter((r) => r.id !== role.id));
          alert(`Rol "${role.name}" eliminado correctamente`);
        })
        .catch((err) => {
          alert(`Error: ${err.message}`);
        });
    }
    handleMenuClose();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Lista de Roles</Typography>
        <Tooltip title="Agregar un nuevo rol" arrow>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/roles/new')}
          >
            Nuevo Rol
          </Button>
        </Tooltip>
      </Box>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre del Rol</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(event) => handleMenuOpen(event, role)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor) && menuRole?.id === role.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => navigate(`/roles/edit/${role.id}`)}>
                      <EditIcon fontSize="small" sx={{ mr: 1 }} />
                      Editar
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(role)}>
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                      Eliminar
                    </MenuItem>
                    <MenuItem onClick={() => navigate(`/roles/${role.id}/assign-permissions`)}>
                      <LockIcon fontSize="small" sx={{ mr: 1 }} />
                      Asignar Permisos
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} align="right">
                Total de roles: <strong>{roles.length}</strong>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}

export default RoleList;