// src/pages/DashboardPage.jsx (VERSÃO FINAL COMPLETA)

import React, { useState, useEffect, useMemo } from "react"; // 1. React importado
import api from "../services/api";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 2. Imports do MUI (Layout)
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
  ListItem, // Importado
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

// 3. Imports do MUI (Ícones)
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // Importado
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // (Seu import estava com WarningAmberIcon.js)

// 4. Imports dos seus Componentes
import KpiCard from "../components/kpicard";
import ActionList from "../components/actionList";
import CategoryChart from "../components/categoriachart";

function DashboardPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await api.get("/componentes");
      if (Array.isArray(response.data)) {
        setComponentes(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados!", error);
      toast.error("Não foi possível carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ 5. LÓGICA DO PDF IMPLEMENTADA
  const handleGeneratePdf = () => {
    toast.info("Gerando relatório...");
    const doc = new jsPDF();

    doc.text("Relatório de Componentes - StockBot", 14, 16);
    doc.setFontSize(12);

    // Definindo os headers da tabela
    const tableHeaders = ["ID", "Nome", "Patrimônio", "Localização", "Qtd."];

    // Mapeando os dados dos componentes para o formato da tabela
    const tableData = componentes.map((comp) => [
      comp.id,
      comp.nome,
      comp.codigoPatrimonio || "N/A",
      comp.localizacao || "N/A",
      comp.quantidade,
    ]);

    // Usando autoTable para criar a tabela
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 25, // Posição onde a tabela começa
    });

    // Salvando o arquivo
    doc.save("relatorio_componentes.pdf");
  };

  // ✅ Lógica do useMemo (estava perfeita)
  const { totalUnidades, itensEmFalta, itensEstoqueBaixo } = useMemo(() => {
    const totalUnidades = componentes.reduce(
      (total, comp) => total + comp.quantidade,
      0
    );
    const itensEmFalta = componentes.filter((comp) => comp.quantidade <= 0);
    const itensEstoqueBaixo = componentes.filter(
      (comp) => comp.quantidade > 0 && comp.quantidade <= 5
    );

    return { totalUnidades, itensEmFalta, itensEstoqueBaixo };
  }, [componentes]);

  // ✅ JSX (return) - Estava perfeito
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
        {/* Header da página */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGeneratePdf}
          >
            Gerar Relatório
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* --- LINHA DOS KPIs --- */}
            <Grid item xs={12} md={4}>
              <KpiCard title="Total de Itens" value={componentes.length} />
            </Grid>
            <Grid item xs={12} md={4}>
              <KpiCard title="Unidades em Stock" value={totalUnidades} />
            </Grid>
            <Grid item xs={12} md={4}>
              <KpiCard title="Itens em Falta" value={itensEmFalta.length} />
            </Grid>

            {/* --- LINHA DAS AÇÕES E GRÁFICO --- */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <CategoryChart componentes={componentes} />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              {/* Usando o ActionList "reformado" */}
              <ActionList title="Itens com Stock Baixo">
                {itensEstoqueBaixo.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemIcon>
                        <WarningAmberIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.nome}
                        secondary={`Património: ${item.codigoPatrimonio} | Stock: ${item.quantidade}`}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </ActionList>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default DashboardPage;
