// Em: src/pages/RequisicoesPage.jsx (CORRIGIDO)
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
  Stack,

  // ✅ 1. IMPORTE OS COMPONENTES DO MODAL
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

function RequisicoesPage() {
  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 2. ESTADOS PARA CONTROLAR O MODAL E O MOTIVO
  const [motivo, setMotivo] = useState("");
  const [modalState, setModalState] = useState({
    open: false,
    acao: null, // 'aprovar' ou 'recusar'
    requisicaoId: null,
  });

  const fetchRequisicoes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/requisicoes/pendentes");
      setRequisicoes(response.data.content || []); // Garante que é um array
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

  // ✅ 3. FUNÇÕES PARA ABRIR E FECHAR O MODAL
  const handleAbrirModal = (id, acao) => {
    setModalState({ open: true, acao: acao, requisicaoId: id });
    setMotivo(""); // Limpa o motivo anterior
  };

  const handleFecharModal = () => {
    setModalState({ open: false, acao: null, requisicaoId: null });
    setMotivo("");
  };

  // ✅ 4. FUNÇÃO QUE CHAMA A API (QUANDO O ADMIN CONFIRMA)
  const handleConfirmarAcao = async () => {
    const { acao, requisicaoId } = modalState;

    if (!motivo) {
      toast.error("O motivo da ação é obrigatório.");
      return;
    }

    // O body que o seu novo backend espera!
    const body = { motivo };
    const url = `/requisicoes/${requisicaoId}/${acao}`; // ex: /requisicoes/1/aprovar

    setLoading(true); // Ativa o loading
    try {
      // CHAMA A API NOVA!
      await api.put(url, body);

      toast.success(
        `Requisição ${
          acao === "aprovar" ? "aprovada" : "recusada"
        } com sucesso!`
      );
      handleFecharModal();
      fetchRequisicoes(); // Atualiza a lista
    } catch (error) {
      toast.error(error.response?.data?.message || "Falha ao processar ação.");
      console.error("Erro ao confirmar ação:", error);
    } finally {
      setLoading(false); // Desativa o loading
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
                              // 👇 CORRIGIDO AQUI (Bug 1)
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
                              disabled={loading} // (Este já estava certo)
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

      {/* O MODAL DE CONFIRMAÇÃO */}
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
            // 👇 CORRIGIDO AQUI (Bug 2)
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
