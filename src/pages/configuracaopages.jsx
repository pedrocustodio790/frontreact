import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { ThemeContext } from "../context/ThemeContext.jsx";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

import {
  Box,
  Container,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import UserManagement from "../components/usermanagement.jsx";
import ModalAddUser from "../components/modaladduser.jsx";

function ConfiguracoesPage() {
  // --- ESTADOS ---
  // ✅ As funções agora serão usadas no JSX
  const { theme, toggleTheme, increaseFontSize, decreaseFontSize } =
    useContext(ThemeContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [limiteEstoque, setLimiteEstoque] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.role === "ADMIN");
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.get("/configuracoes/limiteEstoqueBaixo");
        setLimiteEstoque(response.data);
      } catch (error) {
        console.error("Não foi possível buscar o limite de estoque.", error);
      }
    };
    if (isAdmin) {
      fetchInitialData();
    }
  }, [isAdmin]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (isVerified) {
        setLoading(true);
        try {
          const response = await api.get("/usuarios");
          setUsers(response.data);
        } catch (error) {
          // ✅ Adicionado console.error para "usar" a variável error
          console.error("Erro ao carregar usuários:", error);
          toast.error("Não foi possível carregar a lista de usuários.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUsers();
  }, [isVerified]);

  // --- HANDLERS ---
  const handleSalvarLimite = async () => {
    try {
      await api.put("/configuracoes/limiteEstoqueBaixo", {
        threshold: parseInt(limiteEstoque, 10),
      });
      toast.success("Limite de estoque baixo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar limite:", error);
      toast.error("Falha ao atualizar o limite.");
    }
  };

  const handleVerifyPassword = async () => {
    setLoading(true);
    try {
      await api.post("/auth/verify-password", { password });
      setIsVerified(true);
      toast.success("Identidade verificada com sucesso!");
    } catch (error) {
      console.error("Erro na verificação de senha:", error);
      toast.error("Senha incorreta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Configurações
        </Typography>

        {/* --- SEÇÃO DE APARÊNCIA (COM FUNÇÕES CONECTADAS) --- */}
        <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            Aparência
          </Typography>
          {/* ✅ 'onChange' conectado */}
          <FormControlLabel
            control={
              <Switch checked={theme === "dark"} onChange={toggleTheme} />
            }
            label="Modo Escuro"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">Tamanho da Fonte</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* ✅ 'onClick' conectado */}
              <Button variant="outlined" onClick={decreaseFontSize}>
                A-
              </Button>
              <Button variant="outlined" onClick={increaseFontSize}>
                A+
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* --- SEÇÃO DE CONFIGURAÇÕES DE ESTOQUE (COM FUNÇÃO CONECTADA) --- */}
        {isAdmin && (
          <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configurações de Estoque
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="Limite para Estoque Baixo"
                type="number"
                size="small"
                value={limiteEstoque}
                onChange={(e) => setLimiteEstoque(e.target.value)}
              />
              {/* ✅ 'onClick' conectado */}
              <Button variant="contained" onClick={handleSalvarLimite}>
                Salvar
              </Button>
            </Box>
          </Paper>
        )}

        {/* --- SEÇÃO DE GESTÃO DE UTILIZADORES --- */}
        {isAdmin && (
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Gestão de Utilizadores
            </Typography>
            {!isVerified ? (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}
              >
                <TextField
                  label="Digite sua senha para continuar"
                  type="password"
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleVerifyPassword()
                  }
                />
                <Button
                  variant="contained"
                  onClick={handleVerifyPassword}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Verificar"}
                </Button>
              </Box>
            ) : (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mb: 2 }}
                  onClick={() => setAddUserModalVisible(true)}
                >
                  Adicionar Novo Utilizador
                </Button>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <UserManagement users={users} onUserUpdate={() => {}} />
                )}
              </Box>
            )}
          </Paper>
        )}
      </Container>
      <ModalAddUser
        isVisible={isAddUserModalVisible}
        onClose={() => setAddUserModalVisible(false)}
        onUserAdded={() => {}}
      />
    </Box>
  );
}

export default ConfiguracoesPage;
