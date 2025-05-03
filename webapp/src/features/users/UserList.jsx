import { useEffect, useState } from 'react';
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
  Tooltip,
  Button,
  Paper,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd'; // Icono para agregar roles
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Icono de tres puntos
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Ícono de check
import CancelIcon from '@mui/icons-material/Cancel'; // Ícono de cruz
import '@/styles/TableStyles.css';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import CustomTableFooter from '@/components/CustomTableFooter';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null); // Estado para controlar el menú desplegable
  const [menuUser, setMenuUser] = useState(null); // Usuario seleccionado para el menú
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleMenuOpen = (event, user) => {
    setMenuAnchor(event.currentTarget);
    setMenuUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuUser(null);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    fetch(`/api/users/${selectedUser.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el usuario');
        }
        setUsers(users.filter((u) => u.id !== selectedUser.id));
        alert(`Usuario ${selectedUser.username} eliminado`);
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
      })
      .finally(() => {
        setIsDialogOpen(false);
        setSelectedUser(null);
      });
  };

  const cancelDelete = () => {
    setSelectedUser(null);
    setIsDialogOpen(false);
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
        <Typography variant="h5">Lista de Usuarios</Typography>
        <Box>
          <Tooltip title="Agregar un nuevo usuario" arrow>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/users/new')}
              style={{ marginRight: '8px' }}
            >
              Nuevo Usuario
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre de Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Fecha de Actualización</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">
                  {user.is_active ? (
                    <CheckCircleIcon color="success" /> // Ícono verde para activo
                  ) : (
                    <CancelIcon color="error" /> // Ícono rojo para inactivo
                  )}
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(user.updated_at).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(event) => handleMenuOpen(event, user)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor) && menuUser?.id === user.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => navigate(`/users/edit/${user.id}`)}>
                      <EditIcon fontSize="small" sx={{ mr: 1 }} />
                      Editar
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(user)}>
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                      Eliminar
                    </MenuItem>
                    <MenuItem onClick={() => navigate(`/users/${user.id}/assign-roles`)}>
                      <GroupAddIcon fontSize="small" sx={{ mr: 1 }} />
                      Asignar Roles
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <CustomTableFooter label={'usuarios'} totalUsers={users.length} />
        </Table>
      </TableContainer>

      <ConfirmDeleteDialog
        open={isDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        username={selectedUser?.username}
      />
    </div>
  );
}

export default UserList;