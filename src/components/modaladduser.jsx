import { useState } from "react";
import api from "../services/api";

// Imports de componentes do MUI para o Dialog
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
  FormHelperText,
  CircularProgress,
  Box,
} from "@mui/material";

function ModalAddUser({ isVisible, onClose, onUserAdded }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Limpa o formulário sempre que o modal for fechado
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      // Pequeno delay para a animação de saída
      setEmail("");
      setSenha("");
      setRole("USER");
      setError("");
    }, 300);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const novoUsuario = { email, senha, role };

    try {
      await api.post("/users", novoUsuario); // Lembre-se de ajustar o '/api' se necessário
      onUserAdded();
      handleClose();
    } catch (err) {
      console.error("Erro ao criar utilizador:", err);
      setError(
        err.response?.data?.message || "Ocorreu um erro ao criar o utilizador."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // A "div" principal vira o <Dialog>
    // A prop 'isVisible' vira 'open'
    <Dialog open={isVisible} onClose={handleClose}>
      {/* O <h2> vira <DialogTitle> */}
      <DialogTitle fontWeight="bold">Adicionar Novo Utilizador</DialogTitle>

      {/* O conteúdo do formulário vai dentro de <DialogContent> */}
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Preencha os dados abaixo para criar uma nova conta de utilizador.
        </DialogContentText>

        {/* O <form> vira um <Box component="form"> */}
        <Box component="form" id="add-user-form" onSubmit={handleSubmit}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="email"
            label="Endereço de E-mail"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="password"
            label="Senha Provisória"
            type="password"
            fullWidth
            variant="outlined"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {/* O <select> vira um componente <Select> do MUI */}
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="role-select-label">Cargo</InputLabel>
            <Select
              labelId="role-select-label"
              id="role"
              value={role}
              label="Cargo"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="USER">Utilizador Padrão</MenuItem>
              <MenuItem value="ADMIN">Administrador</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <FormHelperText error sx={{ mt: 2 }}>
              {error}
            </FormHelperText>
          )}
        </Box>
      </DialogContent>

      {/* Os botões de ação vão para <DialogActions> */}
      <DialogActions sx={{ p: "0 24px 24px 24px" }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          type="submit"
          form="add-user-form" // Associa este botão ao formulário
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
