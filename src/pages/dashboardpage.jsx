import { useState, useEffect } from 'react';
import api from '../services/api';

// Imports dos seus componentes
import Sidebar from '../components/sidebar';
import KpiCard from '../components/kpicard';
import ActionList from '../components/actionlist';
import CategoryChart from '../components/categoriachart';

function DashboardPage() {
  // CORREÇÃO: Inicia o estado com um array vazio para evitar erros
  const [componentes, setComponentes] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/componentes');
        // Garante que estamos a colocar um array no estado, mesmo que a API retorne algo inesperado
        if (Array.isArray(response.data)) {
            setComponentes(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar componentes:", error);
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
          <p>Olá, Utilizador! Aqui está um resumo inteligente do seu stock.</p>
        </div>

        {loading ? (
          <p>A carregar dados do backend...</p>
        ) : (
          <>
            <div className="dashboard-grid">
              <KpiCard 
                title="Total de Componentes" 
                value={componentes.length} 
                description="Componentes cadastrados" 
              />
              <KpiCard 
                title="Itens em Stock" 
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
                title="Itens em Falta (Stock Zerado)" 
                items={itensEmFalta} 
              />
              <ActionList 
                title="Itens com Stock Baixo" 
                items={itensEstoqueBaixo} 
              />
            </div>
            
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
