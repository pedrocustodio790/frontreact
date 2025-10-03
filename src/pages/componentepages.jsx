import { useState, useEffect, useRef } from 'react'; // Adicionado useRef
import { toast } from 'react-toastify';
import { CSVLink } from "react-csv";
import Papa from 'papaparse'; // Importação do PapaParse

import { Box, Button, CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import ModalComponente from '../components/modalcomponente';
import api from '../services/api';
import { isAdmin } from '../services/authService';

function ComponentesPage() {
    const [componentes, setComponentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const fileInputRef = useRef(null); // Referência para o input de arquivo

    // --- FUNÇÕES DE CONTROLE (CRUD) ---
    const fetchData = async () => { /* ... sua função fetchData ... */ };
    const handleEdit = (componente) => { /* ... sua função handleEdit ... */ };
    const handleDelete = async (id) => { /* ... sua função handleDelete ... */ };
    const handleAdd = () => { /* ... sua função handleAdd ... */ };

    // --- FUNÇÕES PARA IMPORTAÇÃO DE CSV ---
    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        toast.info("Processando arquivo CSV...");

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                console.log("Dados lidos do CSV:", results.data);
                try {
                    await api.post('/componentes/batch', results.data);
                    toast.success(`${results.data.length} componentes importados com sucesso!`);
                    fetchData();
                } catch (error) {
                    console.error("Erro ao importar componentes:", error);
                    toast.error("Falha ao importar dados. Verifique o console.");
                } finally {
                    setLoading(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }
            },
            error: (error) => {
                setLoading(false);
                toast.error("Erro ao ler o arquivo CSV.");
                console.error("Erro do PapaParse:", error);
            }
        });
    };

    useEffect(() => {
        setIsUserAdmin(isAdmin());
        fetchData();
    }, []);

    // --- LÓGICA PARA EXPORTAÇÃO DE CSV ---
    const headers = [
        { label: "ID", key: "id" },
        { label: "Nome", key: "nome" },
        { label: "Patrimônio", key: "codigoPatrimonio" },
        // ... adicione as outras colunas que desejar
    ];

    const csvReport = {
        data: componentes,
        headers: headers,
        filename: 'Relatorio_Componentes.csv'
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
            {/* Input de arquivo escondido */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".csv"
                onChange={handleFileUpload}
            />

            <Container maxWidth="xl">
                {/* Cabeçalho da página com botões organizados */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Gerenciamento de Itens
                    </Typography>
                    
                    {/* Contêiner para todos os botões de ação */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {isUserAdmin && (
                            <Button variant="contained" startIcon={<UploadFileIcon />} onClick={handleImportClick}>
                                Importar CSV
                            </Button>
                        )}
                        {isUserAdmin && (
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} color="primary">
                                Adicionar Item
                            </Button>
                        )}
                        <CSVLink {...csvReport} style={{ textDecoration: 'none' }}>
                            <Button variant="outlined" startIcon={<FileDownloadIcon />}>
                                Exportar CSV
                            </Button>
                        </CSVLink>
                    </Box>
                </Box>

                {/* Tabela de componentes */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3 }}>
                        {/* ... seu componente de Tabela vai aqui ... */}
                    </Paper>
                )}
            </Container>
            
            <ModalComponente isVisible={isModalVisible} onClose={() => setModalVisible(false)} onComponenteAdicionado={fetchData} componenteParaEditar={componenteEmEdicao} />
        </Box>
    );
}

export default ComponentesPage;