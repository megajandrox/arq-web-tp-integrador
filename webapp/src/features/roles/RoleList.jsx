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

function RoleList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                <TableCell>
				<div className="actions-container">
				  <Tooltip title="Editar rol" arrow>
					<Button
					  variant="contained"
					  color="primary"
					  startIcon={<EditIcon />}
					  onClick={() => alert(`Editar rol: ${role.name}`)}
					  style={{ marginRight: '8px' }}
					>
					</Button>
				  </Tooltip>
				  <Tooltip title="Eliminar rol" arrow>
					<Button
						variant="outlined"
						color="error"
						startIcon={<DeleteIcon />}
						onClick={() => alert(`Eliminar rol: ${role.name}`)}
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