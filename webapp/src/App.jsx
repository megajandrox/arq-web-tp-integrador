import React, { useState } from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Avatar, Box } from '@mui/material';
import Sidebar from './features/sidebar/Sidebar';
import UserList from './features/users/UserList';
import RoleList from './features/roles/RoleList';
import PermissionList from './features/permissions/PermissionList';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Color principal
    },
    secondary: {
      main: '#dc004e', // Color secundario
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
      <div className="app-container">
        <CssBaseline />

        {/* Header */}
        <AppBar position="fixed" className="app-header">
          <Toolbar>
            <Typography variant="h6" className="app-title" sx={{ flexGrow: 1 }}>
              Manager API
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar alt="Usuario" src="/path/to/avatar.jpg" />
              <Typography variant="body1" className="app-user">
                Usuario: <strong>{loggedInUser}</strong>
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Layout con Sidebar y Contenido */}
        <div className="app-layout">
          <Sidebar selectedSection={selectedSection} onSelect={setSelectedSection} />
          <main className="app-main">{renderContent()}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
