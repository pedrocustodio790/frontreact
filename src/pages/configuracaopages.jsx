import { useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import Sidebar from '../components/sidebar';
import UserManagement from '../components/usermanagement'; // Importa o novo componente

function ConfiguracoesPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);

  // Este useEffect verifica o cargo do utilizador e busca a lista de utilizadores se for admin
  useEffect(() => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRoles = decodedToken.roles || [];
        
        // Verifica se o utilizador tem o cargo de ADMIN
        if (userRoles.includes('ROLE_ADMIN')) {
          setIsAdmin(true);
          fetchUsers(); // Se for admin, busca a lista de utilizadores
        }
      } catch (error) {
        console.error("Erro ao descodificar o token:", error);
      }
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar utilizadores:", error);
      alert('Você não tem permissão para ver esta lista.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Tem a certeza de que deseja excluir este utilizador?')) {
      try {
        await api.delete(`/api/users/${id}`);
        fetchUsers(); // Recarrega a lista após a exclusão
      } catch (error) {
        console.error("Erro ao excluir utilizador:", error);
        alert('Falha ao excluir o utilizador.');
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard">
          <h1>Configurações</h1>
        </div>

        {/* Secção de Aparência (já existente) */}
        <div className="settings-section">
          <h2>Preferências de Aparência</h2>
          <div className="setting-item">
            <span>Modo Escuro</span>
            <label className="switch">
              <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {/* Secção de Gestão de Utilizadores (só aparece para admins) */}
        {isAdmin && (
          <div className="settings-section">
            <h2>Gestão de Utilizadores</h2>
            <UserManagement users={users} onDeleteUser={handleDeleteUser} />
          </div>
        )}
      </main>
    </div>
  );
}

export default ConfiguracoesPage;
