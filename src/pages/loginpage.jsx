import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Imports do Material-UI
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Grid,
  Link,
  CircularProgress, // MUDANÇA: Importar o CircularProgress
} from "@mui/material";

// MUDANÇA: O Schema de validação agora INCLUI o 'dominio'
const schema = yup.object().shape({
  dominio: yup.string().required("O domínio é obrigatório"),
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  senha: yup.string().required("A senha é obrigatória"),
});

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // MUDANÇA: Valores padrão agora incluem 'dominio'
    defaultValues: { email: "", senha: "", dominio: "" },
  });

  // MUDANÇA: A lógica de onSubmit foi atualizada
  const onSubmit = async (data) => {
    // 'data' já contém { email, senha, dominio }
    setLoading(true);
    try {
      // 1. Envia o objeto 'data' completo
      const response = await api.post(`/auth/login`, data);

      // 2. O back-end agora retorna { token, usuarioDTO }
      const { token, usuario } = response.data;
      
      // 3. Salva AMBOS no localStorage
      localStorage.setItem("jwt-token", token);
      localStorage.setItem("user-data", JSON.stringify(usuario)); // Salva o objeto do usuário
      
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // 4. Recarrega a aplicação para o Layout ler o novo usuário
      navigate("/");
      window.location.reload(); 

    } catch (error) {
      console.error("Erro de login:", error);
      // 5. O back-end agora envia a mensagem de erro correta
      toast.error(
        error.response?.data?.message || "E-mail, senha ou domínio inválidos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" fontWeight="bold">
          Acessar o StockBot
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1, width: "100%" }}
        >
          <Stack spacing={2}>
            
            {/* MUDANÇA: Adicionado o Controller para o DOMÍNIO */}
            <Controller
              name="dominio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Domínio da Empresa"
                  autoComplete="organization" // (ajuda o navegador a preencher)
                  autoFocus // Foca neste campo primeiro
                  error={!!errors.dominio}
                  helperText={errors.dominio?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Endereço de E-mail"
                  autoComplete="email"
                  // autoFocus // (removido daqui)
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
                  margin="normal"
                  required
                  fullWidth
                  label="Senha"
                  type="password"
                  autoComplete="current-password"
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {/* MUDANÇA: Mostra o spinner de loading */}
              {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  Não tem uma conta? Cadastre-se
                </Link>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;