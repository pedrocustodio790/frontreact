import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Você deve usar a sua instância configurada do Axios
import { toast } from 'react-toastify';

// Imports do Material-UI
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';

const apiUrl = 'http://localhost:8080/api/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Estado de loading para o botão
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/auth/login`, { email, senha });
      const token = response.data.token;
      localStorage.setItem('jwt-token', token);
      navigate('/'); // Navega para o dashboard após o login
    } catch (error) {
      console.error('Erro de login:', error);
      // Usando toast para um feedback mais elegante
      toast.error('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container principal para centralizar o conteúdo na tela
    <Container
      component="main"
      maxWidth="xs" // Limita a largura máxima do formulário
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      {/* Paper cria o "card" de login com sombra e cor de fundo do tema */}
      <Paper
        elevation={6}
        sx={{
          p: 4, // padding
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" fontWeight="bold">
          Acessar o StockBot
        </Typography>

        {/* O <form> vira um <Box component="form"> */}
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
            {/* Stack é ótimo para organizar formulários com espaçamento */}
            <Stack spacing={2}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Endereço de E-mail"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Senha"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary" // Pega a cor do nosso tema!
                    disabled={loading} // Desabilita o botão durante o login
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </Button>
            </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;