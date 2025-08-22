// src/components/CategoryChart.jsx

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// A linha que importava o CSS deve estar aqui, se você criou o arquivo CSS
import "./categoriachart.css";

// Registra os plugins necessários do Chart.js para que o gráfico funcione
ChartJS.register(ArcElement, Tooltip, Legend);

// O componente recebe a lista de todos os componentes como uma "prop"
function CategoryChart({ componentes }) {
  // 1. Processa os dados: agrupa e soma as quantidades por categoria
  const categorias = {};
  componentes.forEach((comp) => {
    if (!categorias[comp.categoria]) {
      categorias[comp.categoria] = 0;
    }
    categorias[comp.categoria] += comp.quantidade;
  });

  // 2. Prepara os dados para o formato que a biblioteca de gráficos entende
  const chartData = {
    labels: Object.keys(categorias),
    datasets: [
      {
        label: "Quantidade de Itens",
        data: Object.values(categorias),
        backgroundColor: [
          "rgba(0, 45, 91, 0.8)", // --azulEscuro
          "rgba(227, 6, 19, 0.8)", // --vermelhoSenai
          "rgba(255, 199, 44, 0.9)", // --amareloOuro
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  // 3. Opções para customizar a aparência do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Componentes por Categoria",
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
}

// Linha ESSENCIAL que exporta o componente para ser usado em outras partes
export default CategoryChart;
