import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// 1. IMPORTAÇÕES ADICIONADAS
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  CircularProgress, // Para o feedback de loading
} from "@mui/material";

function ModalComponente({
  isVisible,
  onClose,
  onComponenteAdicionado,
  componenteParaEditar,
}) {
  // --- ESTADOS ---
  const [nome, setNome] = useState("");
  const [codigoPatrimonio, setCodigoPatrimonio] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [localizacao, setLocalizacao] = useState(""); // ✅ CAMPO ADICIONADO
  const [categoria, setCategoria] = useState(""); // ✅ CAMPO ADICIONADO
  const [loading, setLoading] = useState(false); // ✅ ESTADO DE LOADING

  // --- useEffect (Atualizado) ---
  useEffect(() => {
    if (componenteParaEditar) {
      setNome(componenteParaEditar.nome);
      setCodigoPatrimonio(componenteParaEditar.codigoPatrimonio);
      setQuantidade(componenteParaEditar.quantidade);
      setLocalizacao(componenteParaEditar.localizacao || ""); // Atualiza os novos campos
      setCategoria(componenteParaEditar.categoria || ""); // Atualiza os novos campos
    } else {
      // Limpa o formulário
      setNome("");
      setCodigoPatrimonio("");
      setQuantidade(1);
      setLocalizacao("");
      setCategoria("");
    }
  }, [componenteParaEditar, isVisible]);

  // --- handleSubmit (Atualizado) ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // ✅ Trava o botão

    const dadosComponente = {
      nome,
      codigoPatrimonio,
      quantidade,
      localizacao, // ✅ Usa o estado
      categoria, // ✅ Usa o estado
      observacoes: "", // (Pode adicionar um TextField para este também se quiser)
    };

    try {
      if (componenteParaEditar) {
        await api.put(
          `/componentes/${componenteParaEditar.id}`,
          dadosComponente
        );
        toast.success("Componente atualizado com sucesso!");
      } else {
        await api.post("/componentes", dadosComponente);
        toast.success("Componente adicionado com sucesso!");
      }
      onComponenteAdicionado();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar componente:", error);
      toast.error("Falha ao salvar componente. Verifique os dados.");
    } finally {
      setLoading(false); // ✅ Libera o botão, mesmo se der erro
    }
  };

  return (
    <Dialog open={isVisible} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle fontWeight="bold">
          {componenteParaEditar
            ? "Editar Componente"
            : "Adicionar Novo Componente"}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="nome"
            label="Nome do Componente"
            type="text"
            fullWidth
            variant="outlined"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="patrimonio"
            label="Código do Patrimônio"
            type="text"
            fullWidth
            variant="outlined"
            value={codigoPatrimonio}
            onChange={(e) => setCodigoPatrimonio(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="quantidade"
            label="Quantidade"
            type="number"
            fullWidth
            variant="outlined"
            value={quantidade}
            onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)} // Garante que não seja NaN
            InputProps={{ inputProps: { min: 1 } }}
          />

          {/* ✅ NOVOS CAMPOS ADICIONADOS AO FORMULÁRIO */}
          <TextField
            required
            margin="dense"
            id="categoria"
            label="Categoria"
            type="text"
            fullWidth
            variant="outlined"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="localizacao"
            label="Localização"
            type="text"
            fullWidth
            variant="outlined"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: "0 24px 16px" }}>
          <Button onClick={onClose} disabled={loading}>
            {" "}
            {/* Desabilita no loading */}
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading} // ✅ Desabilita o botão
          >
            {/* ✅ Mostra o loading ou o texto */}
            {loading ? <CircularProgress size={24} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ModalComponente;
