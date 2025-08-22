// src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from '../components/sidebar';
import KpiCard from '../components/kpicard';
import ActionList from '../components/actionList';
import CategoryChart from '../components/categoriachart';


const apiUrl = 'http://localhost:8080/api/componentes';

function DashboardPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lógica para buscar os dados (com o token JWT)
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwt-token');
      if (!token) {
        setLoading(false);
        // A rota protegida já deve redirecionar, mas é uma segurança
        return;
      }
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setComponentes(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lógica de cálculo dos dados para os componentes
  const totalUnidades = componentes.reduce((total, comp) => total + comp.quantidade, 0);
  const itensEmFalta = componentes.filter(comp => comp.quantidade <= 0);
  const itensEstoqueBaixo = componentes.filter(comp => comp.quantidade > 0 && comp.quantidade <= 5);

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard">
          <h1>Dashboard</h1>
          <p>Olá, Usuário! Aqui está um resumo inteligente do seu estoque.</p>
        </div>

        {loading ? (
          <p>Carregando dados do backend...</p>
        ) : (
          <>
            <div className="dashboard-grid">
              <KpiCard 
                title="Total de Componentes" 
                value={componentes.length} 
                description="Componentes cadastrados" 
              />
              <KpiCard 
                title="Itens em Estoque" 
                value={totalUnidades} 
                description="Unidades totais" 
              />
              <KpiCard 
                title="Itens em Falta" 
                value={itensEmFalta.length} 
                description="Ação imediata necessária" 
                isCritical={true}
              />
            </div>

            <div className="section-title">
              <h2>Ação Imediata</h2>
            </div>
            
            <div className="action-grid">
              <ActionList 
                title="Itens em Falta (Estoque Zerado)" 
                items={itensEmFalta} 
              />
              <ActionList 
                title="Itens com Estoque Baixo" 
                items={itensEstoqueBaixo} 
              />
            </div>
            
            {/* MUDANÇA: A SEÇÃO DO GRÁFICO FOI ADICIONADA AQUI */}
            <div className="charts-grid" style={{ marginTop: '2rem' }}>
              <CategoryChart componentes={componentes} />
            </div>

          </>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;