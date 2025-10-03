import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { ThemeContext } from "../context/ThemeContext.jsx";
import api from "../services/api"; // Lembre-se de remover o /api das chamadas
import { jwtDecode } from "jwt-decode";

import {
  Box, Container, Typography, Paper, FormControlLabel, Switch, TextField, Button, CircularProgress
} from "@mui/material";
import UserManagement from "../components/usermanagement.jsx";
import ModalAddUser from "../components/modaladduser.jsx";

function ConfiguracoesPage() {
  // --- ESTADOS ---
  const { theme, toggleTheme, colorMode, toggleColorMode, increaseFontSize, decreaseFontSize } = useContext(ThemeContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [limiteEstoque, setLimiteEstoque] = useState(5); // Estado para o limite

  // --- LÓGICA DE DADOS (useEffect, handlers, etc.) ---
  useEffect(() => {
    // ... sua lógica para checar se é admin ...
  }, []);
  
  // Exemplo de como buscar o limite inicial
  useEffect(() => {
    const fetchLimite = async () => {
        try {
            const response = await api.get('/configuracoes/limiteEstoqueBaixo');
            setLimiteEstoque(response.data);
        } catch (error) {
            console.error("Não foi possível buscar o limite de estoque.");
        }
    };
    if (isAdmin) fetchLimite();
  }, [isAdmin]);

  const handleSalvarLimite = async () => {
    try {
      await api.put('/configuracoes/limiteEstoqueBaixo', { threshold: parseInt(limiteEstoque, 10) });
      toast.success('Limite de estoque baixo atualizado com sucesso!');
    } catch (error) {
      toast.error('Falha ao atualizar o limite.');
    }
  };

  // ... (suas outras funções: fetchUsers, handleVerifyPassword, etc.)

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
          Configurações
        </Typography>

        {/* --- SEÇÃO DE APARÊNCIA --- */}
        <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>Aparência</Typography>
          <FormControlLabel control={<Switch checked={theme === "dark"} onChange={toggleTheme} />} label="Modo Escuro" />
          <FormControlLabel control={<Switch checked={colorMode === 'colorblind'} onChange={toggleColorMode} />} label="Modo para Daltonismo" />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">Tamanho da Fonte</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button variant="outlined" onClick={decreaseFontSize}>A-</Button>
                <Button variant="outlined" onClick={increaseFontSize}>A+</Button>
            </Box>
          </Box>
        </Paper>

        {/* --- SEÇÃO DE CONFIGURAÇÕES DE ESTOQUE (APENAS ADMIN) --- */}
        {isAdmin && (
            <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Configurações de Estoque</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        label="Limite para Estoque Baixo"
                        type="number"
                        size="small"
                        value={limiteEstoque}
                        onChange={(e) => setLimiteEstoque(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleSalvarLimite}>Salvar</Button>
                </Box>
            </Paper>
        )}

        {/* --- SEÇÃO DE GESTÃO DE UTILIZADORES (APENAS ADMIN) --- */}
        {isAdmin && (
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            {/* ... sua lógica de gestão de usuários ... */}
          </Paper>
        )}
      </Container>
      <ModalAddUser isVisible={isAddUserModalVisible} onClose={() => setAddUserModalVisible(false)} onUserAdded={() => {}} />
    </Box>
  );
}

export default ConfiguracoesPage;