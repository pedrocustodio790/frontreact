// Em: src/pages/RequisicoesPage.jsx (Ajustado)
import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
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
  Stack, // Importe o Stack para os botões
} from "@mui/material";

function RequisicoesPage() {
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequisicoes = async () => {
    setLoading(true);
    try {
      // ✅ BUG 1 CORRIGIDO: /api/ removido
      const response = await api.get("/requisicoes/pendentes"); 
      setRequisicoes(response.data.content); // Assumindo que é paginado
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

  // ✅ Lógica de Ação Atualizada
  const handleAprovar = async (id) => {
    try {
      // ✅ BUG 1 CORRIGIDO: /api/ removido
      await api.put(`/requisicoes/${id}/aprovar`); // Endpoint "Aprovar"
      toast.success("Requisição APROVADA!");
      fetchRequisicoes();
    } catch (error) {
      toast.error("Falha ao aprovar a requisição.");
      console.error(error);
    }
  };

  const handleRecusar = async (id) => {
    try {
      // ✅ BUG 1 CORRIGIDO: /api/ removido
      await api.put(`/requisicoes/${id}/recusar`); // Endpoint "Recusar"
      toast.warn("Requisição RECUSADA.");
      fetchRequisicoes();
    } catch (error) {
      toast.error("Falha ao recusar a requisição.");
      console.error(error);
    }
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
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
                    <TableCell sx={{ fontWeight: "bold" }}>Patrimônio</TableCell>
                    {/* ✅ BUG 2 CORRIGIDO: Novas Colunas */}
                    <TableCell sx={{ fontWeight: "bold" }}>Qtd. Pedida</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Solicitante</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: 'center' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requisicoes.length > 0 ? (
                    requisicoes.map((req) => (
                      <TableRow hover key={req.id}>
                        <TableCell>{req.componenteNome}</TableCell>
                        <TableCell>{req.componenteCodigoPatrimonio}</TableCell>
                        {/* ✅ BUG 2 CORRIGIDO: Novos Dados */}
                        <TableCell>{req.quantidade}</TableCell>
                        <TableCell>{req.usuarioNome}</TableCell> 
                        <TableCell>
                          {new Date(req.dataRequisicao).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {/* ✅ Ações Atualizadas */}
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => handleAprovar(req.id)}
                            >
                              Aprovar
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => handleRecusar(req.id)}
                            >
                              Recusar
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
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