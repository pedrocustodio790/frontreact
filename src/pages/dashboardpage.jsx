import { useState, useEffect, useMemo } from 'react'; // useMemo importado
import api from '../services/api';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { 
    Box, 
    Button, 
    CircularProgress, 
    Container, 
    Grid, 
    Paper, 
    Typography 
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import KpiCard from '../components/kpicard';
import ActionList from '../components/actionlist';
import CategoryChart from '../components/categoriachart';

function DashboardPage() {
    const [componentes, setComponentes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
  try {
    const response = await api.get('/componentes')
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

    // A lógica do PDF continua igual e perfeita.
    const handleGeneratePdf = async () => {
        // ... sua lógica de gerar PDF ...
    };
    
    // ✅ SUA LÓGICA DE CÁLCULO AGORA OTIMIZADA COM useMemo
    const { totalUnidades, itensEmFalta, itensEstoqueBaixo } = useMemo(() => {
        const totalUnidades = componentes.reduce((total, comp) => total + comp.quantidade, 0);
        const itensEmFalta = componentes.filter(comp => comp.quantidade <= 0);
        const itensEstoqueBaixo = componentes.filter(comp => comp.quantidade > 0 && comp.quantidade <= 5);
        
        return { totalUnidades, itensEmFalta, itensEstoqueBaixo };
    }, [componentes]);

    return (
        // O conteúdo principal da página, sem o Box exterior
        <Box 
            component="main" 
            sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}
        >
            <Container maxWidth="xl">
                {/* 👇 TODA A PARTE VISUAL DE VOLTA AQUI 👇 */}

                {/* Header da página */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                  <Grid container spacing={3}>
    {/* --- LINHA DOS KPIs --- */}
    <Grid size={{ xs: 12, md: 4 }}>
        <KpiCard title="Total de Itens" value={componentes.length} />
    </Grid>
    <Grid size={{ xs: 12, md: 4 }}>
        <KpiCard title="Unidades em Stock" value={totalUnidades} />
    </Grid>
    <Grid size={{ xs: 12, md: 4 }}>
        <KpiCard title="Itens em Falta" value={itensEmFalta.length} />
    </Grid>
    
    {/* --- LINHA DAS AÇÕES E GRÁFICO --- */}
    <Grid size={{ xs: 12, lg: 8 }}>
        <Paper sx={{ p: 2, height: '100%' }}>
            <CategoryChart componentes={componentes} />
        </Paper>
    </Grid>
    <Grid size={{ xs: 12, lg: 4 }}>
        <Paper sx={{ p: 2, height: '100%' }}>
            <ActionList title="Itens com Stock Baixo" items={itensEstoqueBaixo} />
        </Paper>
    </Grid>
</Grid>
                )}
            </Container>
        </Box>
    );
}
export default DashboardPage;