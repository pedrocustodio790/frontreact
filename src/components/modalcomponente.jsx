// Em: src/components/ModalComponente.jsx (VERSÃO OTIMIZADA)

import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// MUDANÇA: Imports do React Hook Form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  Typography,
  CircularProgress, // MUDANÇA: Importar CircularProgress
} from "@mui/material";

// MUDANÇA: O Schema de Validação (O "Contrato" do formulário)
const schema = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  codigoPatrimonio: yup.string().required("O patrimônio é obrigatório"),
  localizacao: yup.string(),
  categoria: yup.string(),
  // Validação condicional: 'quantidade' (Estoque Inicial) só é
  // obrigatório se *não* estiver em modo de edição.
  quantidade: yup.number().when("$isEditMode", {
    is: false,
    then: (s) =>
      s
        .min(1, "O estoque inicial deve ser pelo menos 1")
        .required("O estoque inicial é obrigatório")
        .typeError("Deve ser um número"),
    otherwise: (s) => s.notRequired(),
  }),
  // 'quantidadeAjuste' é para o modo de edição
  quantidadeAjuste: yup.number().min(0, "O ajuste não pode ser negativo"),
  tipoAjuste: yup.string(),
});

function ModalComponente({
  isVisible,
  onClose,
  onComponenteAdicionado,
  componenteParaEditar,
}) {
  // MUDANÇA: Mantemos apenas os estados de *lógica*, não de formulário
  const [isEditMode, setIsEditMode] = useState(false);
  const [estoqueAtual, setEstoqueAtual] = useState(0); // Apenas para exibição
  const [loading, setLoading] = useState(false); // Estado de loading

  // MUDANÇA: Configuração do React Hook Form
  const {
    control,
    handleSubmit,
    reset, // Função para redefinir/popular o formulário
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // MUDANÇA: Passa o 'isEditMode' para o 'yup'
    context: {
      isEditMode,
    },
    defaultValues: {
      nome: "",
      codigoPatrimonio: "",
      localizacao: "Padrão",
      categoria: "Geral",
      quantidade: 1, // Estoque Inicial padrão
      tipoAjuste: "entrada",
      quantidadeAjuste: 0,
    },
  });

  // MUDANÇA: O useEffect agora usa 'reset()' para popular o form.
  // Esta é a maneira correta e muito mais limpa.
  useEffect(() => {
    if (isVisible) {
      if (componenteParaEditar) {
        // MODO DE EDIÇÃO
        setIsEditMode(true);
        setEstoqueAtual(componenteParaEditar.quantidade); // Guarda o estoque atual (para exibir)
        // Popula o formulário com os dados do item
        reset({
          nome: componenteParaEditar.nome,
          codigoPatrimonio: componenteParaEditar.codigoPatrimonio || "",
          localizacao: componenteParaEditar.localizacao || "Padrão",
          categoria: componenteParaEditar.categoria || "Geral",
          quantidadeAjuste: 0, // Zera o ajuste
          tipoAjuste: "entrada",
        });
      } else {
        // MODO DE ADIÇÃO
        setIsEditMode(false);
        setEstoqueAtual(0);
        // Reseta para os valores padrão
        reset({
          nome: "",
          codigoPatrimonio: "",
          localizacao: "Padrão",
          categoria: "Geral",
          quantidade: 1,
          tipoAjuste: "entrada",
          quantidadeAjuste: 0,
        });
      }
    }
  }, [componenteParaEditar, isVisible, reset]); // 'reset' é uma dependência

  // MUDANÇA: A função de submit do hook
  const onSubmit = async (data) => {
    setLoading(true); // Ativa o loading

    let quantidadeFinal;

    if (isEditMode) {
      // --- LÓGICA DE EDIÇÃO (COM AJUSTE) ---
      // 'data' já contém { tipoAjuste, quantidadeAjuste }
      if (data.tipoAjuste === "entrada") {
        quantidadeFinal = estoqueAtual + data.quantidadeAjuste;
      } else {
        // Saída
        quantidadeFinal = estoqueAtual - data.quantidadeAjuste;
        if (quantidadeFinal < 0) {
          toast.error("Ajuste de saída maior que o estoque atual.");
          setLoading(false);
          return;
        }
      }
    } else {
      // --- LÓGICA DE ADIÇÃO (NOVO ITEM) ---
      // 'data' já contém { quantidade } (do campo "Estoque Inicial")
      quantidadeFinal = data.quantidade;
    }

    // 'data' já tem { nome, codigoPatrimonio, localizacao, categoria }
    const dadosComponente = {
      ...data,
      quantidade: quantidadeFinal, // Enviando a quantidade calculada
      observacoes: "", // Campo que o DTO espera
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
      toast.error(
        error.response?.data?.message ||
          "Falha ao salvar. O Patrimônio já existe?"
      );
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth maxWidth="sm">
      {/* MUDANÇA: O 'handleSubmit' do hook é ligado aqui */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle fontWeight="bold">
          {isEditMode ? "Editar Componente" : "Adicionar Novo Componente"}
        </DialogTitle>

        <DialogContent>
          {/* MUDANÇA: Todos os TextFields agora usam <Controller> */}
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                required
                margin="dense"
                label="Nome do Componente"
                type="text"
                fullWidth
                variant="outlined"
                disabled={isEditMode} // Desabilitado na edição
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            )}
          />
          <Controller
            name="codigoPatrimonio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                margin="dense"
                label="Código do Patrimônio"
                type="text"
                fullWidth
                variant="outlined"
                error={!!errors.codigoPatrimonio}
                helperText={errors.codigoPatrimonio?.message}
              />
            )}
          />
          <Controller
            name="localizacao"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Localização"
                type="text"
                fullWidth
                variant="outlined"
              />
            )}
          />
          <Controller
            name="categoria"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Categoria"
                type="text"
                fullWidth
                variant="outlined"
              />
            )}
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

              {/* MUDANÇA: RadioGroup controlado */}
              <Controller
                name="tipoAjuste"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" margin="dense">
                    <FormLabel component="legend">Tipo de Ajuste</FormLabel>
                    <RadioGroup {...field} row>
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
                )}
              />

              {/* MUDANÇA: Ajuste controlado */}
              <Controller
                name="quantidadeAjuste"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    margin="dense"
                    label="Quantidade do Ajuste"
                    type="number"
                    fullWidth
                    variant="outlined"
                    onChange={(
                      e // Garante que é número
                    ) => field.onChange(parseInt(e.target.value) || 0)}
                    InputProps={{ inputProps: { min: 0 } }}
                    error={!!errors.quantidadeAjuste}
                    helperText={errors.quantidadeAjuste?.message}
                  />
                )}
              />
            </Box>
          ) : (
            // MODO DE ADIÇÃO (Mostra o Estoque Inicial)
            <Controller
              name="quantidade" // (Este é o "Estoque Inicial")
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  margin="dense"
                  label="Estoque Inicial"
                  type="number"
                  fullWidth
                  variant="outlined"
                  onChange={(
                    e // Garante que é número
                  ) => field.onChange(parseInt(e.target.value) || 1)}
                  InputProps={{ inputProps: { min: 1 } }}
                  error={!!errors.quantidade}
                  helperText={errors.quantidade?.message}
                />
              )}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ p: "0 24px 16px" }}>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading} // Desabilita o botão se estiver carregando
          >
            {/* MUDANÇA: Mostra o loading no botão */}
            {loading ? <CircularProgress size={24} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ModalComponente;
