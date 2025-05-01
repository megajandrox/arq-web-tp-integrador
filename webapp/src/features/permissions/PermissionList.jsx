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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '@/styles/TableStyles.css';

function PermissionList() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <div>
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
					onClick={() => alert(`Editar permiso: ${permission.name}`)}
					style={{ marginRight: '8px' }}
				  >
				  </Button>
				  </Tooltip>
				  <Tooltip title="Eliminar este permiso" arrow>
					<Button
						variant="outlined"
						color="error"
						startIcon={<DeleteIcon />}
						onClick={() => alert(`Eliminar permiso: ${permission.name}`)}
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