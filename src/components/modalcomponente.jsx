// Em: src/components/ModalComponente.jsx

import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Typography, // <--- Importe o Typography
} from "@mui/material";

function ModalComponente({
  isVisible,
  onClose,
  onComponenteAdicionado,
  componenteParaEditar,
}) {
  // --- Estados do Formulário (Nível Superior) ---
  const [nome, setNome] = useState("");
  const [codigoPatrimonio, setCodigoPatrimonio] = useState("");
  const [localizacao, setLocalizacao] = useState("Padrão");
  const [categoria, setCategoria] = useState("Geral");

  // --- Estados da Lógica de Ajuste (Nível Superior) ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [estoqueAtual, setEstoqueAtual] = useState(0);
  const [tipoAjuste, setTipoAjuste] = useState("entrada");
  const [quantidadeAjuste, setQuantidadeAjuste] = useState(0);
  // (O 'quantidade' antigo saiu, pois agora é 'estoqueAtual' ou 'quantidadeAjuste')

  useEffect(() => {
    if (isVisible) {
      if (componenteParaEditar) {
        // MODO DE EDIÇÃO
        setIsEditMode(true);
        setNome(componenteParaEditar.nome);
        setCodigoPatrimonio(componenteParaEditar.codigoPatrimonio || "");
        setLocalizacao(componenteParaEditar.localizacao || "Padrão");
        setCategoria(componenteParaEditar.categoria || "Geral");
        setEstoqueAtual(componenteParaEditar.quantidade); // Guarda o estoque

        // Zera os campos de ajuste
        setTipoAjuste("entrada");
        setQuantidadeAjuste(0);
      } else {
        // MODO DE ADIÇÃO
        setIsEditMode(false);
        setNome("");
        setCodigoPatrimonio("");
        setLocalizacao("Padrão");
        setCategoria("Geral");
        setEstoqueAtual(1); // (Este será o "Estoque Inicial")
      }
    }
  }, [componenteParaEditar, isVisible]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let quantidadeFinal;

    if (isEditMode) {
      // --- LÓGICA DE EDIÇÃO (COM AJUSTE) ---
      if (quantidadeAjuste < 0) {
        toast.error("Ajuste não pode ser negativo.");
        return;
      }

      if (tipoAjuste === "entrada") {
        quantidadeFinal = estoqueAtual + quantidadeAjuste;
      } else {
        // Saída
        quantidadeFinal = estoqueAtual - quantidadeAjuste;
        if (quantidadeFinal < 0) {
          toast.error("Ajuste de saída maior que o estoque atual.");
          return;
        }
      }
    } else {
      // --- LÓGICA DE ADIÇÃO (NOVO ITEM) ---
      quantidadeFinal = estoqueAtual; // (Que foi pego do campo "Estoque Inicial")
    }

    const dadosComponente = {
      nome,
      codigoPatrimonio,
      quantidade: quantidadeFinal, // <--- Enviando a quantidade calculada
      localizacao,
      categoria,
      observacoes: "",
    };

    try {
      if (isEditMode) {
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
    }
  };

  return (
    <Dialog open={isVisible} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle fontWeight="bold">
          {isEditMode ? "Editar Componente" : "Adicionar Novo Componente"}
        </DialogTitle>

        <DialogContent>
          {/* Campos de Dados (Nome, Patrimônio, etc.) */}
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
            // Desabilitado na edição para não mudar o nome
            disabled={isEditMode}
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
            margin="dense"
            id="localizacao"
            label="Localização"
            type="text"
            fullWidth
            variant="outlined"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
          />
          <TextField
            margin="dense"
            id="categoria"
            label="Categoria"
            type="text"
            fullWidth
            variant="outlined"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          {/* --- CAMPO DE QUANTIDADE/AJUSTE (LÓGICA NOVA) --- */}
          {isEditMode ? (
            // MODO DE EDIÇÃO (Mostra o box de Ajuste)
            <Box
              sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2, mt: 2 }}
            >
              <Typography variant="body1" fontWeight="bold">
                Estoque Atual: {estoqueAtual}
              </Typography>
              <FormControl component="fieldset" margin="dense">
                <FormLabel component="legend">Tipo de Ajuste</FormLabel>
                <RadioGroup
                  row
                  value={tipoAjuste}
                  onChange={(e) => setTipoAjuste(e.target.value)}
                >
                  <FormControlLabel
                    value="entrada"
                    control={<Radio />}
                    label="Entrada"
                  />
                  <FormControlLabel
                    value="saida"
                    control={<Radio />}
                    label="Saída (Admin)"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                required
                margin="dense"
                id="ajuste"
                label="Quantidade do Ajuste"
                type="number"
                fullWidth
                variant="outlined"
                value={quantidadeAjuste}
                onChange={(e) =>
                  setQuantidadeAjuste(parseInt(e.target.value) || 0)
                }
                slotProps={{ input: { min: 0 } }}
              />
            </Box>
          ) : (
            // MODO DE ADIÇÃO (Mostra o Estoque Inicial)
            <TextField
              required
              margin="dense"
              id="quantidade"
              label="Estoque Inicial"
              type="number"
              fullWidth
              variant="outlined"
              value={estoqueAtual} // (reaproveitando o estado)
              onChange={(e) => setEstoqueAtual(parseInt(e.target.value) || 1)}
              slotProps={{ input: { min: 1 } }}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ p: "0 24px 16px" }}>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ModalComponente;
