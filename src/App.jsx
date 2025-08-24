import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Pega o "crachá" (token) do armazenamento do navegador
    const token = localStorage.getItem('jwt-token');

    // Se NÃO houver token, o usuário não está logado. Redireciona para o login.
    if (!token) {
      navigate('/login');
    }
  }, [navigate]); // Roda essa verificação sempre que a página carregar

  // O <Outlet /> é um espaço reservado onde o React Router vai renderizar
  // a página correta (DashboardPage, ComponentesPage, etc.) que está
  // definida no seu arquivo main.jsx.
  return <Outlet />;
}

export default App;