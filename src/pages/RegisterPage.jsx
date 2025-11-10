// Em src/pages/RegisterPage.jsx
import { useState, useRef } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import api from "../services/api";

import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const schema = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  senha: yup
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("A senha é obrigatória"),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    // 1. Criar um objeto FormData para enviar dados e arquivo
    const formData = new FormData();

    // 2. Adicionar os dados do formulário
    formData.append("nome", data.nome);
    formData.append("email", data.email);
    formData.append("senha", data.senha);

    // 3. Adicionar o arquivo de imagem, se existir
    if (imageFile) {
      formData.append("fotoPerfil", imageFile);
    }

    try {
      await api.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Essencial para envio de arquivos
        },
      });

      toast.success("Conta criada com sucesso! Faça o login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao criar conta.");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        // <--- CORRIGIDO (Adicionado para centralizar)
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          // marginTop: 20, // <--- CORRIGIDO (REMOVIDO!)
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2, // (bônus, pra ficar bonito igual o login)
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Criar Conta
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 3, width: "100%" }} // <--- BÔNUS (garante 100% de largura)
        >
          <Grid container spacing={2}>
            <Grid
              size={12} // <--- CORRIGIDO (de 13 para 12)
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={imagePreview}
                sx={{ width: 90, height: 90, mb: 1 }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current.click()}
              >
                Escolher Foto
              </Button>
            </Grid>

            <Grid size={12}>
              {/* <--- CORRIGIDO (Adicionado size) */}
              <Controller
                name="nome"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Nome Completo"
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Endereço de Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              {/* <--- CORRIGIDO (Adicionado size) */}
              <Controller
                name="senha"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Senha"
                    type="password"
                    error={!!errors.senha}
                    helperText={errors.senha?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }} // (ajustei a margem mt)
          >
            Cadastrar
          </Button>
          <Grid container justifyContent="center">
            <Grid>
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
