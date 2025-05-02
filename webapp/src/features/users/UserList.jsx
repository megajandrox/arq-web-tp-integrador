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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import '@/styles/TableStyles.css';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import CustomTableFooter from '@/components/CustomTableFooter';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
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
        <Typography>Lista de Usuarios</Typography>
        <Tooltip title="Agregar un nuevo usuario" arrow>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            style={{ marginLeft: '8px' }}
            onClick={() => navigate('/users/new')}
          >
          </Button>
        </Tooltip>
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
                <TableCell>{user.is_active ? 'Sí' : 'No'}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(user.updated_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="actions-container">
                    <Tooltip title="Editar usuario" arrow>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/users/edit/${user.id}`)}
                        style={{ marginRight: '8px' }}
                      >
                      </Button>
                    </Tooltip>
                    <Tooltip title="Eliminar usuario" arrow>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(user)}
                      >
                      </Button>
                    </Tooltip>
                  </div>
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