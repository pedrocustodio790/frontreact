// Em src/components/ProfileMenu.jsx (VERSÃO CORRIGIDA E OTIMIZADA)
import { useState } from "react"; // MUDANÇA: useEffect e api não são mais necessários
import { useNavigate } from "react-router-dom";
// MUDANÇA: 'api' não é mais necessário aqui
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Skeleton, // O Skeleton ainda é útil
} from "@mui/material";

// URL base das fotos (está correto)
const FOTOS_URL_BASE = "http://localhost:8080/user-photos/";

function ProfileMenu() {
  // MUDANÇA: Lemos os dados do usuário DIRETAMENTE do localStorage
  // Isso é muito mais rápido e evita chamadas de API desnecessárias
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("user-data");
    try {
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Falha ao ler 'user-data' do localStorage", e);
      return null;
    }
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  // MUDANÇA: O useEffect(api.get(...)) foi REMOVIDO.

  // Funções do Menu (estão corretas)
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // MUDANÇA: Função de Logout CORRIGIDA
  const handleLogout = () => {
    // 1. Remove AMBOS os itens do localStorage
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("user-data");
    
    // 2. Limpa o header da API (boa prática)
    // (Precisamos importar o 'api' se formos fazer isso)
    // api.defaults.headers.common["Authorization"] = null;

    // 3. Navega e recarrega para limpar todo o estado do React
    navigate("/login");
    window.location.reload(); 
  };

  // Se o 'user-data' não for encontrado (o que não deve acontecer
  // se o usuário estiver logado), mostramos o Skeleton.
  if (!user) {
    return <Skeleton variant="circular" width={40} height={40} />;
  }

  // Define a fonte da imagem do Avatar (lógica correta)
  const avatarSrc = user.caminhoFotoPerfil
    ? `${FOTOS_URL_BASE}${user.caminhoFotoPerfil}`
    : ""; 

  return (
    <Box>
      <IconButton onClick={handleClick} size="small">
        <Avatar
          src={avatarSrc}
          sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
        >
          {/* Fallback (lógica correta) */}
          {user.nome ? user.nome[0].toUpperCase() : "?"}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
          {/* MUDANÇA: Mostra o domínio/empresa! */}
          <Typography variant="caption" color="text.secondary">
            Domínio: <strong>{user.dominio}</strong>
          </Typography>
        </Box>
        <MenuItem onClick={handleLogout}>Sair</MenuItem>
      </Menu>
    </Box>
  );
}

export default ProfileMenu;