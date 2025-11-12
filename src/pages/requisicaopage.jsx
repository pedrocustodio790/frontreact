import { useState, useEffect, useCallback } from "react"; // MUDANÇA: Importar useCallback
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
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TablePagination, // MUDANÇA: Importar Paginação
} from "@mui/material";

function RequisicoesPage() {
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal (estão perfeitos)
  const [motivo, setMotivo] = useState("");
  const [modalState, setModalState] = useState({
    open: false,
    acao: null,
    requisicaoId: null,
  });

  // --- MUDANÇA: Estados de Paginação ---
  const [page, setPage] = useState(0); // A página atual (começa em 0)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Itens por página
  const [totalElements, setTotalElements] = useState(0); // Total de itens no DB

  // MUDANÇA: fetchRequisicoes agora usa useCallback e envia parâmetros
  const fetchRequisicoes = useCallback(async () => {
    setLoading(true);
    try {
      // MUDANÇA: Envia os parâmetros de paginação e ordena por data
      const response = await api.get(
        `/requisicoes/pendentes?page=${page}&size=${rowsPerPage}&sort=dataRequisicao,asc`
      );

      // MUDANÇA: Armazena o 'content' e os totais
      setRequisicoes(response.data.content || []);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      toast.error("Falha ao carregar as requisições pendentes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
    // MUDANÇA: O useCallback depende de 'page' e 'rowsPerPage'
  }, [page, rowsPerPage]);

  // MUDANÇA: O useEffect agora chama a versão do useCallback
  useEffect(() => {
    fetchRequisicoes();
  }, [fetchRequisicoes]);

  // --- MUDANÇA: Handlers de Paginação ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volta para a primeira página
  };

  // Funções do Modal (estão perfeitas)
  const handleAbrirModal = (id, acao) => {
    setModalState({ open: true, acao: acao, requisicaoId: id });
    setMotivo("");
  };

  const handleFecharModal = () => {
    setModalState({ open: false, acao: null, requisicaoId: null });
    setMotivo("");
  };

  const handleConfirmarAcao = async () => {
    const { acao, requisicaoId } = modalState;

    if (!motivo) {
      toast.error("O motivo da ação é obrigatório.");
      return;
    }

    const body = { motivo };
    const url = `/requisicoes/${requisicaoId}/${acao}`;

    setLoading(true);
    try {
      await api.put(url, body);
      toast.success(
        `Requisição ${
          acao === "aprovar" ? "aprovada" : "recusada"
        } com sucesso!`
      );
      handleFecharModal();

      // MUDANÇA: Após uma ação, checar se a página atual ficou vazia
      if (requisicoes.length === 1 && page > 0) {
        setPage(page - 1); // Volta para a página anterior
      } else {
        fetchRequisicoes(); // Apenas recarrega a página atual
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Falha ao processar ação.");
      console.error("Erro ao confirmar ação:", error);
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
          Requisições Pendentes
        </Typography>

        {loading && requisicoes.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  {/* ... O seu TableHead está perfeito ... */}
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Patrimônio
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Qtd. Pedida
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Solicitante
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requisicoes.length > 0 ? (
                    requisicoes.map((req) => (
                      <TableRow hover key={req.id}>
                        {/* ... O seu .map() está perfeito ... */}
                        <TableCell>{req.componenteNome}</TableCell>
                        <TableCell>{req.componenteCodigoPatrimonio}</TableCell>
                        <TableCell>{req.quantidade}</TableCell>
                        <TableCell>{req.usuarioNome}</TableCell>
                        <TableCell>
                          {new Date(req.dataRequisicao).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() =>
                                handleAbrirModal(req.id, "aprovar")
                              }
                              disabled={loading}
                            >
                              Aprovar
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() =>
                                handleAbrirModal(req.id, "recusar")
                              }
                              disabled={loading}
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

      {/* O seu Modal (está perfeito) */}
      <Dialog
        open={modalState.open}
        onClose={handleFecharModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {modalState.acao === "aprovar" ? "Aprovar" : "Recusar"} Requisição
        </DialogTitle>
        <DialogContent>
          {/* ... Conteúdo do modal ... */}
          <DialogContentText sx={{ mb: 2 }}>
            Por favor, insira uma justificativa (motivo) para esta ação. Este
            motivo será salvo no histórico de auditoria.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="motivo"
            label="Motivo da Ação"
            type="text"
            fullWidth
            variant="outlined"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleFecharModal}
            color="secondary"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarAcao}
            variant="contained"
            color={modalState.acao === "aprovar" ? "success" : "error"}
            disabled={loading || !motivo}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Confirmar ${
                modalState.acao === "aprovar" ? "Aprovação" : "Recusa"
              }`
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RequisicoesPage;
