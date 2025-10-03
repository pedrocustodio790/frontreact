// src/components/sidebar.jsx
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material';
import { LayoutDashboard, Wrench, History, ArchiveRestore, Settings, LogOut } from 'lucide-react';

const drawerWidth = 250;

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt-token');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      // ✅ 1. ESTILOS DO DRAWER ADICIONADOS AQUI
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          // Cores vindas diretamente do nosso tema!
          backgroundColor: 'background.paper',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>StockBot</Typography>
      </Toolbar>
      <Divider />

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List>
          {/* ✅ 2. ESTILO DE LINK ATIVO ADICIONADO AQUI */}
          <ListItemButton
            component={NavLink}
            to="/"
            sx={{ '&.active': { backgroundColor: 'action.selected' } }}
          >
            <ListItemIcon><LayoutDashboard size={20} /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          
          <ListItemButton
            component={NavLink}
            to="/componentes"
            sx={{ '&.active': { backgroundColor: 'action.selected' } }}
          >
            <ListItemIcon><Wrench size={20} /></ListItemIcon>
            <ListItemText primary="Componentes" />
          </ListItemButton>

          {/* Adicione o sx={{ '&.active': ... }} para os outros links também */}
          <ListItemButton component={NavLink} to="/historico" sx={{ '&.active': { backgroundColor: 'action.selected' } }}>
            <ListItemIcon><History size={20} /></ListItemIcon>
            <ListItemText primary="Histórico" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/reposicao" sx={{ '&.active': { backgroundColor: 'action.selected' } }}>
            <ListItemIcon><ArchiveRestore size={20} /></ListItemIcon>
            <ListItemText primary="Reposição" />
          </ListItemButton>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <List>
          <Divider />
          <ListItemButton component={NavLink} to="/configuracoes" sx={{ '&.active': { backgroundColor: 'action.selected' } }}>
            <ListItemIcon><Settings size={20} /></ListItemIcon>
            <ListItemText primary="Configurações" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/ajuda" sx={{ '&.active': { backgroundColor: 'action.selected' } }}>
            <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
            <ListItemText primary="Ajuda" />
          </ListItemButton>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogOut size={20} /></ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;