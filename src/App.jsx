// Em src/App.jsx
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar"; // O nome do seu arquivo é sidebar.jsx (minúsculo)
import { Box, AppBar, Toolbar, CssBaseline } from "@mui/material";
import { isAuthenticated } from "./services/authService";
import ProfileMenu from "./components/ProfileMenu"; // ✅ 1. Importe o novo menu

const drawerWidth = 250; // O mesmo valor da sua Sidebar

function App() {
  // 1. VERIFICAÇÃO DE SEGURANÇA (o seu código, que está perfeito)
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // 2. O NOVO LAYOUT (com Header/AppBar)
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar (não mudou) */}
      <Sidebar />

      {/* AppBar (Header) no Topo */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          // Garante que o AppBar comece *depois* da Sidebar
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "background.paper", // Usa a cor de fundo do tema
          color: "text.primary", // Usa a cor de texto primária
        }}
      >
        <Toolbar>
          {/* Este Box empurra o ProfileMenu para a direita */}
          <Box sx={{ flexGrow: 1 }} />

          {/* ✅ 2. Adicione o ProfileMenu aqui */}
          <ProfileMenu />
        </Toolbar>
      </AppBar>

      {/* Conteúdo Principal (Onde as páginas são renderizadas) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3, // Padding interno
          width: `calc(100% - ${drawerWidth}px)`,
          backgroundColor: "background.default", // Cor de fundo cinza claro
        }}
      >
        {/* Toolbar é um "espaçador" para o conteúdo não ficar escondido atrás do AppBar */}
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}
export default App;
