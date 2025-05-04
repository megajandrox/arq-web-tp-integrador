import { useEffect, useState } from 'react';
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
  Button,
  Paper,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import '@/styles/TableStyles.css';

function PermissionList() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch('/api/permissions')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los permisos');
        }
        return response.json();
      })
      .then((data) => {
        setPermissions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = (permissionId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este permiso?')) {
      fetch(`/api/permissions/${permissionId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al eliminar el permiso');
          }
          setPermissions(permissions.filter((permission) => permission.id !== permissionId));
          alert('Permiso eliminado correctamente');
        })
        .catch((err) => {
          alert(`Error: ${err.message}`);
        });
    }
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
        <Typography variant="h5">Lista de Permisos</Typography>
        <Tooltip title="Agregar un nuevo permiso" arrow>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/permissions/new')}
          >
            Nuevo Permiso
          </Button>
        </Tooltip>
      </Box>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre del Permiso</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>{permission.id}</TableCell>
                <TableCell>{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell>
                  <div className="actions-container">
                    <Tooltip title="Editar este permiso" arrow>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/permissions/edit/${permission.id}`)}
                        style={{ marginRight: '8px' }}
                      >
                      </Button>
                    </Tooltip>
                    <Tooltip title="Eliminar este permiso" arrow>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(permission.id)}
                      >
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} align="right">
                Total de permisos: <strong>{permissions.length}</strong>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PermissionList;