import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

// Imports do MUI
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton,
} from "@mui/material";

// Ícones
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// Imports do Recharts (Gráficos Bonitos)
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Seus Componentes
import KpiCard from "../components/kpicard";

console.log("📊 DashboardPage carregada");

function DashboardPage() {
  console.log("🎯 Componente DashboardPage renderizado");

  // Estados para armazenar os dados que vêm do Back-end
  const [kpis, setKpis] = useState({
    totalItens: 0,
    totalUnidades: 0,
    itensEmFalta: 0,
  });
  const [statsCategorias, setStatsCategorias] = useState([]); // Para o gráfico
  const [estoqueBaixo, setEstoqueBaixo] = useState([]); // Para a lista
  const [loading, setLoading] = useState(true);

  // Função que carrega tudo
  useEffect(() => {
    console.log("🔄 useEffect executado - buscando dados do dashboard");

    const fetchData = async () => {
      try {
        console.log("📡 Iniciando busca de dados do dashboard...");

        // Chamamos as 3 rotas otimizadas do Back-end em paralelo
        const [resKpis, resStats, resBaixo] = await Promise.all([
          api.get("/dashboard/kpis"),
          api.get("/dashboard/stats-categorias"),
          api.get("/dashboard/estoque-baixo"),
        ]);

        console.log("✅ Dados recebidos:", {
          kpis: resKpis.data,
          stats: resStats.data,
          estoqueBaixo: resBaixo.data,
        });

        setKpis(resKpis.data);
        setStatsCategorias(resStats.data);
        setEstoqueBaixo(resBaixo.data);

        console.log("📊 Dashboard atualizado com sucesso");
      } catch (error) {
        console.error("❌ Erro ao carregar dashboard:", error);
        toast.error("Erro ao carregar dados do dashboard");
      } finally {
        console.log("🏁 Finalizando carregamento do dashboard");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função simples de PDF (Imprimir tela)
  const handleGeneratePdf = () => {
    console.log("📄 Gerando relatório PDF/impressão");
    window.print();
  };

  if (loading) {
    console.log("⏳ Dashboard em estado de loading");
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={140} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={140} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={140} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  console.log("🎨 Renderizando dashboard com dados:", {
    kpis,
    statsCategorias: statsCategorias.length,
    estoqueBaixo: estoqueBaixo.length,
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        {/* Cabeçalho com Botão PDF */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGeneratePdf}
          >
            Gerar Relatório
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* --- 1. OS CARDS (KPIs) --- */}
          <Grid item xs={12} md={4}>
            <KpiCard title="Total de Tipos de Itens" value={kpis.totalItens} />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard title="Total de Unidades" value={kpis.totalUnidades} />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard
              title="Itens Zerados (Falta)"
              value={kpis.itensEmFalta}
              isCritical={kpis.itensEmFalta > 0} // Fica vermelho se > 0
            />
          </Grid>

          {/* --- 2. O GRÁFICO (Recharts) --- */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, height: 400, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Distribuição por Categoria
              </Typography>
              {/* ResponsiveContainer faz o gráfico se ajustar ao tamanho da tela */}
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={statsCategorias}
                  margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="quantidade"
                    name="Quantidade de Itens"
                    barSize={40}
                    fill="#1976d2"
                    radius={[4, 4, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* --- 3. A LISTA DE ALERTA (Estoque Baixo) --- */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 0, height: 400, boxShadow: 3, overflow: "auto" }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#fff3e0",
                  borderBottom: "1px solid #ffe0b2",
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="warning.dark">
                  ⚠️ Alerta: Estoque Baixo
                </Typography>
              </Box>

              <List>
                {estoqueBaixo.length === 0 ? (
                  <Typography sx={{ p: 2, color: "text.secondary" }}>
                    Tudo certo! Nenhum item com estoque crítico.
                  </Typography>
                ) : (
                  estoqueBaixo.map((item) => (
                    <React.Fragment key={item.id}>
                      <ListItem>
                        <ListItemIcon>
                          <WarningAmberIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.nome}
                          secondary={
                            <>
                              <Typography variant="caption" display="block">
                                Patrimônio: {item.codigoPatrimonio || "N/A"}
                              </Typography>
                              <Typography
                                variant="caption"
                                fontWeight="bold"
                                color="error"
                              >
                                Restam apenas: {item.quantidade}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardPage;
