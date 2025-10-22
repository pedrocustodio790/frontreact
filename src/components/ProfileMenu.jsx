// Em src/components/ProfileMenu.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Skeleton,
} from "@mui/material";

// URL base das fotos, igual à da UserManagementPage
const FOTOS_URL_BASE = "http://localhost:8080/user-photos/";

function ProfileMenu() {
  const [user, setUser] = useState(null); // Guarda os dados do usuário
  const [anchorEl, setAnchorEl] = useState(null); // Controla o menu
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  // Busca os dados do usuário ("/api/users/me") quando o componente carrega
  useEffect(() => {
    api
      .get("/users/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Falha ao buscar dados do usuário:", error);
      });
  }, []);

  // Funções do Menu
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Função de Logout
  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    navigate("/login");
  };

  // Se ainda estiver carregando, mostra um esqueleto
  if (!user) {
    return <Skeleton variant="circular" width={40} height={40} />;
  }

  // Define a fonte da imagem do Avatar
  const avatarSrc = user.caminhoFotoPerfil
    ? `${FOTOS_URL_BASE}${user.caminhoFotoPerfil}`
    : ""; // Deixa vazio se não houver foto

  return (
    <Box>
      <IconButton onClick={handleClick} size="small">
        <Avatar
          src={avatarSrc}
          sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
        >
          {/* Fallback: Mostra a primeira letra do nome se a foto falhar ou não existir */}
          {user.nome ? user.nome[0].toUpperCase() : "?"}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // Posiciona o menu
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            {user.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <MenuItem onClick={handleLogout}>Sair</MenuItem>
      </Menu>
    </Box>
  );
}

export default ProfileMenu;
