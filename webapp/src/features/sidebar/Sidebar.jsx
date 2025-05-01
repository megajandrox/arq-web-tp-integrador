import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import './Sidebar.css';

function Sidebar({ selectedSection, onSelect }) {
  return (
    <Drawer variant="permanent" anchor="left" className="sidebar">
      <List>
        <ListItem
          button
          onClick={() => onSelect('users')}
          className={selectedSection === 'users' ? 'sidebar-item selected' : 'sidebar-item'}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItem>
        <ListItem
          button
          onClick={() => onSelect('roles')}
          className={selectedSection === 'roles' ? 'sidebar-item selected' : 'sidebar-item'}
        >
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText primary="Roles" />
        </ListItem>
        <ListItem
          button
          onClick={() => onSelect('permissions')}
          className={selectedSection === 'permissions' ? 'sidebar-item selected' : 'sidebar-item'}
        >
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Permisos" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;