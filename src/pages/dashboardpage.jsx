// Em: src/pages/DashboardPage.jsx (VERSÃO PROFISSIONAL)
import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Link as RouterLink } from "react-router-dom"; // Para o link de "ver todos"

// Imports do MUI
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

// Imports de Ícones
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AssignmentIcon from "@mui/icons-material/Assignment"; // Para Requisições
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Para Pedidos
import InventoryIcon from "@mui/icons-material/Inventory"; // Para Itens

// Imports dos seus Componentes de Dashboard
import KpiCard from "../components/kpicard";
import ActionList from "../components/actionList";
import CategoryChart from "../components/categoriachart"; // O gráfico de pizza!

function DashboardPage() {
  // Estados separados para cada parte do dashboard
  const [kpis, setKpis] = useState(null);
  const [itensEstoqueBaixo, setItensEstoqueBaixo] = useState([]);
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [loadingEstoqueBaixo, setLoadingEstoqueBaixo] = useState(true);

  // Busca os 4 cards (KPIs)
  useEffect(() => {
    const fetchKpis = async () => {
      try {
        setLoadingKpis(true);
        // 1. CHAMA A NOVA API DE KPIs
        const response = await api.get("/dashboard/kpis");
        setKpis(response.data);
      } catch (error) {
        toast.error("Erro ao carregar indicadores.");
        console.error("Erro KPIs:", error);
      } finally {
        setLoadingKpis(false);
      }
    };
    fetchKpis();
  }, []);

  // Busca a lista de itens com estoque baixo
  useEffect(() => {
    const fetchEstoqueBaixo = async () => {
      try {
        setLoadingEstoqueBaixo(true);
        // 2. CHAMA A NOVA API DE ESTOQUE BAIXO
        const response = await api.get("/dashboard/estoque-baixo");
        // Pega apenas os 5 primeiros para a lista
        setItensEstoqueBaixo(response.data.slice(0, 5));
      } catch (error) {
        toast.error("Erro ao carregar itens com estoque baixo.");
        console.error("Erro Estoque Baixo:", error);
      } finally {
        setLoadingEstoqueBaixo(false);
      }
    };
    fetchEstoqueBaixo();
  }, []);
  
  // (Removemos o 'useMemo' e o 'handleGeneratePdf' daqui)
  // (O 'handleGeneratePdf' deve ficar na 'ComponentesPage.jsx', junto da tabela principal)

  // --- Renderização ---
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>
          Dashboard
        </Typography>

        {/* --- 1. LINHA DOS KPIs (CARDS) --- */}
        <Grid container spacing={3} mb={3}>
          {loadingKpis ? (
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <CircularProgress />
            </Grid>
          ) : (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Itens c/ Estoque Baixo"
                  value={kpis?.itensComEstoqueBaixo || 0}
                  icon={<WarningAmberIcon />}
                  color="warning.main"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Requisições Pendentes"
                  value={kpis?.requisicoesPendentes || 0}
                  icon={<AssignmentIcon />}
                  color="info.main"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Pedidos de Compra"
                  value={kpis?.pedidosCompraPendentes || 0}
                  icon={<ShoppingCartIcon />}
                  color="error.main"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Itens Cadastrados"
                  value={kpis?.totalItensCadastrados || 0}
                  icon={<InventoryIcon />}
                  color="text.secondary"
                />
              </Grid>
            </>
          )}
        </Grid>

        {/* --- 2. LINHA DOS GRÁFICOS E LISTAS --- */}
        <Grid container spacing={3}>
          {/* Coluna do Gráfico de Pizza (O 'CategoryChart' agora se vira sozinho) */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Itens por Categoria (Quantidade Total)
              </Typography>
              {/* 3. O 'CategoryChart' agora busca seus próprios dados */}
              <CategoryChart />
            </Paper>
          </Grid>

          {/* Coluna da Lista de Ações (Estoque Baixo) */}
          <Grid item xs={12} lg={4}>
            <ActionList title="Itens com Estoque Baixo">
              {loadingEstoqueBaixo ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {itensEstoqueBaixo.length === 0 && (
                     <ListItem>
                       <ListItemText primary="Nenhum item com estoque baixo." />
                     </ListItem>
                  )}

                  {itensEstoqueBaixo.map((item) => (
                    <React.Fragment key={item.id}>
                      <ListItem>
                        <ListItemIcon>
                          <WarningAmberIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.nome}
                          secondary={`Em estoque: ${item.quantidade} (Mínimo: ${item.nivelMinimoEstoque})`}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                  
                  {kpis?.itensComEstoqueBaixo > 5 && (
                    <Button component={RouterLink} to="/componentes" sx={{ mt: 1, ml: 1 }}>
                      Ver todos ({kpis.itensComEstoqueBaixo})
                    </Button>
                  )}
                </>
              )}
            </ActionList>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardPage;