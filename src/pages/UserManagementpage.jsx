// Em: src/pages/UserManagementPage.jsx (VERSÃO FINAL COMPLETA)
import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// Imports do MUI
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Avatar,
  Button,
  Stack,
  IconButton,
} from "@mui/material";

// Imports de Ícones
import AddIcon from "@mui/icons-material/Add";
import KeyIcon from "@mui/icons-material/Key"; // ✅ 1. Import Faltando

// Imports dos Modais
import ModalAddUser from "../components/modaladduser"; // ✅ 2. Import Corrigido
import ModalResetPassword from "../components/ModalUserResetPassword"; // ✅ 3. Import Faltando

// URL para as fotos de perfil
const FOTOS_URL_BASE = "http://localhost:8080/user-photos/";

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState(null);

  // Função para buscar os usuários da API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Falha ao carregar usuários. Acesso negado?");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Busca os usuários quando a página carrega
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Handlers (Funções de Ação) ---
  const handleUserAdded = () => {
    toast.success("Novo usuário criado com sucesso!");
    fetchUsers(); // Re-busca os usuários
  };

  const handleOpenResetModal = (user) => {
    setUserToReset(user); // Define qual usuário será resetado, o que abre o modal
  };

  const handleCloseResetModal = () => {
    setUserToReset(null); // Fecha o modal
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success("Função do usuário atualizada!");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      toast.error("Falha ao atualizar a função.");
      console.error(error);
    }
  };

  // ✅ 4. Bloco de "Loading" CORRIGIDO (tem que ser ANTES do return principal)
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // --- Renderização da Página ---
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        {/* ✅ 5. Header CORRIGIDO (sem '...') */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Gerenciamento de Usuários
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)} // Abre o modal de ADICIONAR
          >
            Adicionar Usuário
          </Button>
        </Box>

        {/* Tabela de Usuários */}
        <Paper sx={{ boxShadow: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Foto</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Função (Role)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow hover key={user.id}>
                    {/* ✅ 6. Conteúdo do Avatar PREENCHIDO */}
                    <TableCell>
                      <Avatar
                        src={
                          user.caminhoFotoPerfil
                            ? `${FOTOS_URL_BASE}${user.caminhoFotoPerfil}`
                            : ""
                        }
                      >
                        {user.nome ? user.nome[0].toUpperCase() : "?"}
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    {/* ✅ 7. Conteúdo do Dropdown PREENCHIDO */}
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                        >
                          <MenuItem value="ADMIN">Admin</MenuItem>
                          <MenuItem value="USER">User</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>

                    {/* Célula de Ações (Reset de Senha) */}
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          color="warning"
                          size="small"
                          onClick={() => handleOpenResetModal(user)}
                        >
                          <KeyIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Os dois modais ficam aqui */}
      <ModalAddUser
        isVisible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
      <ModalResetPassword
        isVisible={!!userToReset} // Abre se 'userToReset' não for null
        onClose={handleCloseResetModal}
        userToReset={userToReset}
      />
    </Box>
  );
}

export default UserManagementPage;
