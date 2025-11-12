import React, { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify"; // MUDANÇA: Usar toast para erros

// MUDANÇA: Imports do React Hook Form (como no seu LoginPage)
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Imports de componentes do MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  // FormHelperText, // Não precisamos mais do error state
  CircularProgress,
  Box,
} from "@mui/material";

// MUDANÇA: Definir o "contrato" de validação
const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  senha: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("A senha é obrigatória"),
  role: yup.string().required("O cargo é obrigatório"),
});

function ModalAddUser({ isVisible, onClose, onUserAdded }) {
  // MUDANÇA: O 'loading' é o único estado manual que precisamos
  const [loading, setLoading] = useState(false);

  // MUDANÇA: Configuração do React Hook Form
  const {
    control,
    handleSubmit,
    reset, // Para limpar o formulário
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      senha: "",
      role: "USER", // Valor padrão
    },
  });

  // MUDANÇA: handleClose agora limpa o formulário usando o hook
  const handleClose = () => {
    onClose();
  };

  // MUDANÇA: O handleSubmit agora é o 'onSubmit' do hook
  const onSubmit = async (data) => {
    // 'data' já contém { email, senha, role }
    setLoading(true);

    try {
      await api.post("/users", data); // A 'data' do hook é enviada direto
      toast.success("Novo usuário criado com sucesso!"); // MUDANÇA
      onUserAdded();
      handleClose();
    } catch (err) {
      console.error("Erro ao criar utilizador:", err);
      // MUDANÇA: Usar o toast para erros, em vez do 'error' state
      toast.error(
        err.response?.data?.message || "Ocorreu um erro ao criar o utilizador."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
      // MUDANÇA: Resetar o formulário DEPOIS que a animação de saída terminar
      TransitionProps={{ onExited: () => reset() }}
    >
      <DialogTitle fontWeight="bold">Adicionar Novo Utilizador</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Preencha os dados abaixo para criar uma nova conta de utilizador.
        </DialogContentText>

        {/* MUDANÇA: O 'onSubmit' do hook é ativado aqui */}
        <Box
          component="form"
          id="add-user-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* MUDANÇA: Usar o <Controller> para o Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                required
                margin="dense"
                label="Endereço de E-mail"
                type="email"
                fullWidth
                variant="outlined"
                error={!!errors.email} // Validação do Yup
                helperText={errors.email?.message} // Validação do Yup
              />
            )}
          />

          {/* MUDANÇA: Usar o <Controller> para a Senha */}
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
                error={!!errors.senha} // Validação do Yup
                helperText={errors.senha?.message} // Validação do Yup
              />
            )}
          />

          {/* MUDANÇA: Usar o <Controller> para o Cargo (Role) */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="dense"
                required
                error={!!errors.role} // Validação do Yup
              >
                <InputLabel id="role-select-label">Cargo</InputLabel>
                <Select {...field} labelId="role-select-label" label="Cargo">
                  <MenuItem value="USER">Utilizador Padrão</MenuItem>
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                </Select>
                {/* O helperText do Yup vai aparecer aqui se houver erro */}
              </FormControl>
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: "0 24px 24px 24px" }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          type="submit"
          form="add-user-form"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Criar Utilizador"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalAddUser;
