// Em: src/components/ModalAddUser.jsx (VERSÃO 100% CORRIGIDA)
import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// Imports do React Hook Form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Imports do MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
// Importa o helper que JÁ TEMOS
import { getLoggedUser } from "../services/authService"; 

// MUDANÇA: O Schema de validação agora INCLUI o 'nome'
const schema = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"), // <-- CAMPO ADICIONADO
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  senha: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("A senha é obrigatória"),
  role: yup.string().required("A função é obrigatória"),
});

function ModalAddUser({ isVisible, onClose, onUserAdded }) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // MUDANÇA: Valores padrão atualizados
    defaultValues: {
      nome: "", // <-- CAMPO ADICIONADO
      email: "",
      senha: "",
      role: "USER",
    },
  });

  // Limpa o formulário quando o modal é fechado (Correto)
  useEffect(() => {
    if (!isVisible) {
      reset();
    }
  }, [isVisible, reset]);

  // MUDANÇA: O Submit agora envia o payload COMPLETO
  const onSubmit = async (data) => {
    // 'data' tem {nome, email, senha, role}
    setLoading(true);

    // 1. Pega o usuário Admin logado (para achar o domínio)
    const adminUser = getLoggedUser();
    if (!adminUser) {
        toast.error("Erro fatal: Admin não encontrado. Faça login novamente.");
        setLoading(false);
        return;
    }

    // 2. Monta o payload final que o RegisterDTO (Back-end) espera
    const payload = {
      ...data,
      dominio: adminUser.dominio, // <-- ADICIONA O DOMÍNIO DO ADMIN
    };

    try {
      // 3. Envia o payload completo
      await api.post("/api/users", payload); 
      toast.success("Novo usuário criado com sucesso!");
      onUserAdded();
      onClose();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.error(
        error.response?.data?.message || "Falha ao criar usuário."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isVisible} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle fontWeight="bold">Adicionar Novo Usuário</DialogTitle>

        <DialogContent>
          {/* MUDANÇA: Adicionado o Controller para NOME */}
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus // Foca no nome
                required
                margin="dense"
                label="Nome Completo"
                type="text"
                fullWidth
                variant="outlined"
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="senha"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                margin="dense"
                label="Senha Provisória"
                type="password"
                fullWidth
                variant="outlined"
                error={!!errors.senha}
                helperText={errors.senha?.message}
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required margin="dense">
                <InputLabel id="role-select-label">Função</InputLabel>
                <Select
                  {...field}
                  labelId="role-select-label"
                  label="Função"
                  error={!!errors.role}
                >
                  <MenuItem value="USER">User (Usuário)</MenuItem>
                  <MenuItem value="ADMIN">Admin (Administrador)</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </DialogContent>

        <DialogActions sx={{ p: "0 24px 16px" }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Criar Usuário"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ModalAddUser;