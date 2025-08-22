// src/components/Sidebar.jsx

import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wrench, History, Settings, LogOut } from 'lucide-react';
import './sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Remove o "crachá" de autenticação do armazenamento
    localStorage.removeItem('jwt-token');
    
    // 2. Redireciona o usuário para a página de login
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>StockBot</h2>
      
      {/* Usamos NavLink para que o link ativo ganhe uma classe "active" automaticamente */}
      <NavLink to="/" className="nav-link"> 
        <LayoutDashboard size={20} /> <span>Dashboard</span> 
      </NavLink>

      <NavLink to="/componentes" className="nav-link">
        <Wrench size={20} /> <span>Componentes</span>
      </NavLink>

      <NavLink to="/historico" className="nav-link">
        <History size={20} /> <span>Histórico</span>
      </NavLink>
      
      {/* Este div empurra os itens de baixo para o rodapé */}
      <div style={{ flexGrow: 1 }}></div>
      
      <NavLink to="/configuracoes" className="nav-link">
        <Settings size={20} /> <span>Configurações</span>
      </NavLink>
      
      {/* O link de sair agora é um botão com a função handleLogout */}
      <button onClick={handleLogout} className="nav-link logout-button">
        <LogOut size={20} /> <span>Sair</span>
      </button>
    </nav>
  );
}

export default Sidebar;