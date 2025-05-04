import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom'; // Importar NavLink para la navegación
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import AssignmentIcon from '@mui/icons-material/Assignment';
import './Sidebar.css';

function Sidebar({ selectedSection, onSelect }) {
  return (
    <Drawer variant="permanent" anchor="left" className="sidebar">
      <List>
        <ListItem
          button
          component={NavLink}
          to="/"
          className={({ isActive }) => (isActive ? 'sidebar-item selected' : 'sidebar-item')}
          onClick={() => onSelect('users')}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/roles"
          className={({ isActive }) => (isActive ? 'sidebar-item selected' : 'sidebar-item')}
          onClick={() => onSelect('roles')}
        >
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText primary="Roles" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/permissions"
          className={({ isActive }) => (isActive ? 'sidebar-item selected' : 'sidebar-item')}
          onClick={() => onSelect('permissions')}
        >
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Permisos" />
        </ListItem>
        <ListItem b button
          component={NavLink}
          to="/reports"
          className={({ isActive }) => (isActive ? 'sidebar-item selected' : 'sidebar-item')}
          onClick={() => onSelect('reports')}
        >
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Reportes" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;