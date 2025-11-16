// Em: src/pages/UserManagementPage.jsx (VERSÃO OTIMIZADA)
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
  TablePagination, // MUDANÇA: Importar o componente de paginação
} from "@mui/material";

// Imports de Ícones
import AddIcon from "@mui/icons-material/Add";
import KeyIcon from "@mui/icons-material/Key";

// Imports dos Modais
import ModalAddUser from "../components/modaladduser";
import ModalResetPassword from "../components/ModalUserResetPassword";


const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace('/api', '');
const FOTOS_URL_BASE = `${API_BASE_URL}/user-photos/`; 

function UserManagementPage() {
  const [users, setUsers] = useState([]); // MUDANÇA: Agora guarda só o 'content'
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState(null);

  // --- MUDANÇA: Estados de Paginação ---
  const [page, setPage] = useState(0); // A página atual (começa em 0)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Itens por página
  const [totalElements, setTotalElements] = useState(0); // Total de itens no DB

  // Função para buscar os usuários da API (agora paginada)
  const fetchUsers = async (currentPage, currentRowsPerPage) => {
    setLoading(true);
    try {
      // MUDANÇA: Envia os parâmetros de paginação e ordena por nome
      const response = await api.get(
        `/users?page=${currentPage}&size=${currentRowsPerPage}&sort=nome,asc`
      );

      // MUDANÇA: A API retorna um objeto Page
      setUsers(response.data.content); // O array de usuários está em 'content'
      setTotalElements(response.data.totalElements); // O total de usuários
    } catch (error) {
      toast.error("Falha ao carregar usuários. Acesso negado?");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Busca os usuários quando a página (ou rowsPerPage) muda
  useEffect(() => {
    fetchUsers(page, rowsPerPage);
  }, [page, rowsPerPage]); // MUDANÇA: Dispara de novo se 'page' ou 'rowsPerPage' mudar

  // --- Handlers (Funções de Ação) ---

  const handleUserAdded = () => {
    toast.success("Novo usuário criado com sucesso!");
    // MUDANÇA: Volta para a primeira página para ver o novo usuário
    setPage(0);
    fetchUsers(0, rowsPerPage);
  };

  const handleOpenResetModal = (user) => {
    setUserToReset(user);
  };

  const handleCloseResetModal = () => {
    setUserToReset(null);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success("Função do usuário atualizada!");
      // O 'setUsers' aqui está ok, pois só atualiza a lista local
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

  // --- MUDANÇA: Handlers de Paginação ---

  const handleChangePage = (event, newPage) => {
    setPage(newPage); // O MUI já manda o número da nova página (0, 1, 2...)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Pega o novo valor (10, 25, 50)
    setPage(0); // Volta para a primeira página
  };

  // Bloco de "Loading" (está correto)
  if (loading && users.length === 0) {
    // MUDANÇA: Mostra o loading só na primeira carga
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
        {/* Header (está correto) */}
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
            onClick={() => setIsAddModalOpen(true)}
          >
            Adicionar Usuário
          </Button>
        </Box>

        {/* Tabela de Usuários */}
        <Paper sx={{ boxShadow: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                {/* ... O seu TableHead (Foto, Nome, Email, etc) está perfeito ... */}
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
                {/* O .map() agora funciona, pois 'users' é o array 'content' */}
                {users.map((user) => (
                  <TableRow hover key={user.id}>
                    {/* ... O seu .map() (Avatar, Nome, Email, Select) está perfeito ... */}
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

          {/* MUDANÇA: Adicionar o componente de Paginação */}
          <TablePagination
            component="div"
            count={totalElements} // O total de itens que existem no DB
            page={page} // A página atual
            onPageChange={handleChangePage} // Função para mudar de página
            rowsPerPage={rowsPerPage} // Quantos itens por página
            onRowsPerPageChange={handleChangeRowsPerPage} // Função para mudar itens por página
            rowsPerPageOptions={[5, 10, 25]} // Opções de "itens por página"
          />
        </Paper>
      </Container>

      {/* Os modais (estão corretos) */}
      <ModalAddUser
        isVisible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
      <ModalResetPassword
        isVisible={!!userToReset}
        onClose={handleCloseResetModal}
        userToReset={userToReset}
      />
    </Box>
  );
}

export default UserManagementPage;
