import React, { useState } from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Avatar, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './features/sidebar/Sidebar';
import UserList from './features/users/UserList';
import RoleList from './features/roles/RoleList';
import EditRole from './features/roles/EditRole';
import NewRole from './features/roles/NewRole';
import PermissionList from './features/permissions/PermissionList';
import NewPermission from './features/permissions/NewPermission';
import EditPermission from './features/permissions/EditPermission';
import EditUser from './features/users/EditUser';
import NewUser from './features/users/NewUser'; // Importar el componente de creación de usuario
import AssignRoles from './features/users/AssignRoles'; // Importar el nuevo componente
import AssignPermissions from './features/roles/AssignPermissions'; // Importar el nuevo componente
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [selectedSection, setSelectedSection] = useState('users');
  const [loggedInUser] = useState('admin@example.com'); // Simulación de usuario logueado

  const renderContent = () => {
    switch (selectedSection) {
      case 'users':
        return <UserList />;
      case 'roles':
        return <RoleList />;
      case 'permissions':
        return <PermissionList />;
      default:
        return <div>Seleccione una sección</div>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app-container">
          <CssBaseline />

          {/* Header */}
          <AppBar position="fixed" className="app-header">
            <Toolbar>
              <Typography variant="h6" className="app-title" sx={{ flexGrow: 1 }}>
                User Manager
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar alt="Usuario" src="/path/to/avatar.jpg" />
                <Typography variant="body1" className="app-user">
                  Usuario: <strong>{loggedInUser}</strong>
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <div className="app-layout">
            <Sidebar selectedSection={selectedSection} onSelect={setSelectedSection} />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<UserList />} />
                <Route path="/users/new" element={<NewUser />} />
                <Route path="/users/edit/:id" element={<EditUser />} />
                <Route path="/users/:id/assign-roles" element={<AssignRoles />} /> 
                <Route path="/roles" element={<RoleList />} />
                <Route path="/roles/new" element={<NewRole />} />
                <Route path="/roles/edit/:id" element={<EditRole />} />
                <Route path="/permissions" element={<PermissionList />} />
                <Route path="/permissions/new" element={<NewPermission />} />
                <Route path="/permissions/edit/:id" element={<EditPermission />} />
                <Route path="/roles/:id/assign-permissions" element={<AssignPermissions />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
