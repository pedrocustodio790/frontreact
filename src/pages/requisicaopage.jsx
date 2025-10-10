import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// ✅ Imports de Componentes do MUI
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function RequisicoesPage() {
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequisicoes = async () => {
    setLoading(true);
    try {
      // ✅ API PATH CORRIGIDO
      const response = await api.get("/requisicoes/pendentes");
      setRequisicoes(response.data);
    } catch (error) {
      toast.error("Falha ao carregar as requisições pendentes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisicoes();
  }, []);

  const handleMarcarConcluido = async (id) => {
    try {
      // ✅ API PATH CORRIGIDO
      await api.put(`/requisicoes/${id}/concluir`);
      toast.success("Requisição marcada como concluída!");
      fetchRequisicoes(); // Recarrega a lista para remover o item concluído
    } catch (error) {
      toast.error("Falha ao atualizar a requisição.");
      console.error(error);
    }
  };

  // ✅ A Sidebar não é mais necessária aqui, pois ela já está no App.jsx envolvendo o <Outlet>
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
          Requisições Pendentes
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Patrimônio/Identificador
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Data da Requisição
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requisicoes.length > 0 ? (
                    requisicoes.map((req) => (
                      <TableRow hover key={req.id}>
                        <TableCell>{req.componenteNome}</TableCell>
                        <TableCell>{req.componenteCodigoPatrimonio}</TableCell>
                        <TableCell>
                          {new Date(req.dataRequisicao).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleMarcarConcluido(req.id)}
                          >
                            Marcar como Concluído
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Nenhuma requisição pendente.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default RequisicoesPage;
