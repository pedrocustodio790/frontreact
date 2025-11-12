// Em: src/pages/PedidosPage.jsx (VERSÃO OTIMIZADA)
import React, { useState, useEffect, useCallback } from "react"; // MUDANÇA: Importar useCallback
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination, // MUDANÇA: Importar Paginação
} from "@mui/material";
import api from "../services/api";
import { toast } from "react-toastify";

function PedidosPage() {
  const [meusPedidos, setMeusPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);

  // Form states (estão perfeitos)
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [justificativa, setJustificativa] = useState("");

  // --- MUDANÇA: Estados de Paginação ---
  const [page, setPage] = useState(0); // A página atual (começa em 0)
  const [rowsPerPage, setRowsPerPage] = useState(5); // Itens por página (5 é bom aqui)
  const [totalElements, setTotalElements] = useState(0); // Total de itens no DB

  // MUDANÇA: fetchMeusPedidos agora usa useCallback e envia parâmetros
  const fetchMeusPedidos = useCallback(async () => {
    setLoading(true);
    try {
      // MUDANÇA: Envia os parâmetros e ordena por data (mais novo primeiro)
      const response = await api.get(
        `/pedidos-compra/me?page=${page}&size=${rowsPerPage}&sort=dataPedido,desc`
      );

      // MUDANÇA: Pega os dados do objeto Page
      setMeusPedidos(response.data.content || []);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      toast.error("Falha ao carregar seus pedidos.");
      console.error("Erro fetchMeusPedidos:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]); // MUDANÇA: Depende da paginação

  // MUDANÇA: O useEffect agora chama a versão do useCallback
  useEffect(() => {
    fetchMeusPedidos();
  }, [fetchMeusPedidos]);

  // --- MUDANÇA: Handlers de Paginação ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volta para a primeira página
  };

  // MUDANÇA: O handleSubmit agora reseta a paginação
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      await api.post("/pedidos-compra", {
        nomeItem,
        quantidade,
        justificativa,
      });
      toast.success("Pedido de compra enviado para aprovação!");
      // Limpa o form
      setNomeItem("");
      setQuantidade(1);
      setJustificativa("");

      // MUDANÇA: Força a tabela a voltar para a página 0
      if (page === 0) {
        fetchMeusPedidos(); // Se já está na pág 0, só recarrega
      } else {
        setPage(0); // Se não, vai para pág 0 (que vai trigar o fetch)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Falha ao enviar pedido.");
      console.error("Erro handleSubmit Pedido:", error);
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}
    >
      <Container maxWidth="lg">
        {/* Seção 1: Formulário de Pedido (Sem mudanças, já estava perfeito) */}
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          Solicitar Compra de Novo Item
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Use este formulário para solicitar a compra de um item que NÃO existe
          no estoque (Ex: "Makita", "Novos Computadores").
        </Typography>
        <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* ... Todo o seu formulário (TextFields, Button) está 100% correto ... */}
            <TextField
              label="Nome do Item"
              value={nomeItem}
              onChange={(e) => setNomeItem(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantidade"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              required
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { min: 1 } }} // slotProps foi depreciado
            />
            <TextField
              label="Justificativa (Por que você precisa disso?)"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              multiline
              rows={3}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              disabled={loadingForm || !nomeItem}
            >
              {loadingForm ? (
                <CircularProgress size={24} />
              ) : (
                "Enviar Solicitação de Compra"
              )}
            </Button>
          </Box>
        </Paper>

        {/* Seção 2: Meus Pedidos Anteriores (COM PAGINAÇÃO) */}
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          Meus Pedidos de Compra Anteriores
        </Typography>
        {loading && meusPedidos.length === 0 ? ( // MUDANÇA: Mostra o loading só na primeira carga
          <CircularProgress />
        ) : (
          <Paper sx={{ boxShadow: 3, overflow: "hidden" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  {/* ... Seu TableHead está perfeito ... */}
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Qtd.</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meusPedidos.length > 0 ? (
                    // MUDANÇA: O .map() agora funciona
                    meusPedidos.map((pedido) => (
                      <TableRow hover key={pedido.id}>
                        {/* ... Seu .map() está perfeito ... */}
                        <TableCell>{pedido.nomeItem}</TableCell>
                        <TableCell>{pedido.quantidade}</TableCell>
                        <TableCell>
                          {pedido.dataPedido
                            ? new Date(pedido.dataPedido).toLocaleDateString(
                                "pt-BR"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>{pedido.status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="text.secondary" sx={{ p: 2 }}>
                          Você ainda não fez nenhum pedido de compra.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
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
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default PedidosPage;
