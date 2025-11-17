import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Box, AppBar, Toolbar, CssBaseline } from "@mui/material";
import { isAuthenticated } from "./services/authService";
import ProfileMenu from "./components/ProfileMenu";

console.log("📱 App.jsx carregado - Componente principal");

const drawerWidth = 250;

function App() {
  console.log("🔐 App - Verificando autenticação");

  if (!isAuthenticated()) {
    console.log("❌ Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Usuário autenticado, renderizando layout principal");

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />

      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "background.paper",
          color: "text.primary",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <ProfileMenu />
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          backgroundColor: "background.default",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
export default App;
