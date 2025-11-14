// Em src/pages/RegisterPage.jsx (VERSÃO 100% CORRIGIDA)
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import api from "../services/api";

import {
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";

// MUDANÇA: Schema atualizado com 'nome' e 'dominio' (nome correto)
const schema = yup.object().shape({
  dominio: yup.string().required("O domínio da empresa é obrigatório"),
  nome: yup.string().required("O nome é obrigatório"), // <-- CAMPO ADICIONADO
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  senha: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("A senha é obrigatória"),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // MUDANÇA: Valores padrão atualizados
    defaultValues: {
      dominio: "", // <-- NOME CORRIGIDO
      nome: "", // <-- CAMPO ADICIONADO
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (data) => {
    // 'data' agora tem { dominio, nome, email, senha }
    setLoading(true);
    
    // MUDANÇA: Criamos o payload final que o RegisterDTO espera
    const payload = {
      ...data,
      role: "USER", // <-- CAMPO ADICIONADO (obrigatório pelo DTO)
    };

    try {
      // Enviamos o payload completo
      await api.post("/auth/register", payload);

      toast.success("Conta criada com sucesso! Faça o login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Erro ao criar conta. O e-mail já pode estar em uso neste domínio."
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
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" fontWeight="bold">
          Criar Conta de Empresa
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 3, width: "100%" }}
        >
          <Stack spacing={2}>
            {/* MUDANÇA: Campo 'dominio' (nome corrigido) */}
            <Controller
              name="dominio" // <-- NOME CORRIGIDO
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Domínio da Empresa (ex: 'minhaempresa')"
                  autoFocus
                  error={!!errors.dominio} // <-- NOME CORRIGIDO
                  helperText={
                    errors.dominio?.message || // <-- NOME CORRIGIDO
                    "Este será seu identificador único de login."
                  }
                />
              )}
            />

            {/* MUDANÇA: Adicionado Controller para NOME */}
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Seu Nome Completo"
                  autoComplete="name"
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
                  fullWidth
                  label="Seu Endereço de Email"
                  type="email"
                  autoComplete="email"
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
                  fullWidth
                  label="Senha"
                  type="password"
                  autoComplete="new-password"
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
                />
              )}
            />
          </Stack>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Cadastrar"
            )}
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Já tem uma conta? Faça login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}