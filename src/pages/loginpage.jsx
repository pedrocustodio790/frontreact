// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginpage.css'; // Vamos criar este CSS

const apiUrl = 'http://localhost:8080/api/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate(); // Hook do React Router para navegar entre páginas

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, { email, senha });
      
      // Se o login for bem-sucedido, o backend enviará o token
      const token = response.data.token;

      // 1. Salva o token no armazenamento do navegador
      localStorage.setItem('jwt-token', token);

      // 2. Navega o usuário para a página principal (dashboard)
      navigate('/');

    } catch (error) {
      console.error('Erro de login:', error);
      alert('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <form id="login-form" onSubmit={handleLogin}>
          <h2>Acessar o StockBot</h2>
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            id="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required 
          />
          <button type="submit">Entrar</button>
        </form>
        {/* Você pode adicionar um link para uma página de registro aqui depois */}
      </div>
    </div>
  );
}

export default LoginPage;