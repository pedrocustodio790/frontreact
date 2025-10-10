import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom"; // ✅ RouterLink importado
import api from "../services/api";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form"; // ✅ Imports para o formulário
import { yupResolver } from "@hookform/resolvers/yup"; // ✅ Imports para o formulário
import * as yup from "yup"; // ✅ Imports para o formulário

// Imports do Material-UI
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Grid, // ✅ Grid importado
  Link, // ✅ Link do MUI importado
} from "@mui/material";

// ✅ Schema de validação, igual fizemos no RegisterPage
const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  senha: yup.string().required("A senha é obrigatória"),
});

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Configuração do react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", senha: "" },
  });

  // ✅ A função agora se chama onSubmit e recebe os dados do formulário
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post(`/auth/login`, {
        email: data.email,
        senha: data.senha,
      });
      const token = response.data.token;
      localStorage.setItem("jwt-token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Atualiza o header para futuras requisições
      navigate("/");
    } catch (error) {
      console.error("Erro de login:", error);
      toast.error("E-mail ou senha inválidos.");
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
            {/* ✅ TextField agora usa o Controller */}
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
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            {/* ✅ TextField agora usa o Controller */}
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
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            {/* ✅ Grid com o Link movido para o lugar correto, dentro do Stack */}
            <Grid container justifyContent="flex-end">
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
