// Em src/pages/ComponentesPage.jsx (REFORMADO)
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import Papa from "papaparse";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import ModalComponente from "../components/modalcomponente";
import api from "../services/api";
import { isAdmin } from "../services/authService";
// ✅ 1. IMPORTE O COMPONENTE QUE ACABAMOS DE ATUALIZAR
import ComponentesTable from "../components/componentestable";
function ComponentesPage() {
  // --- TODA A SUA LÓGICA "INTELIGENTE" (PERFEITA) ---
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    // ... (sua função fetchData - perfeita)
    setLoading(true);
    try {
      const response = await api.get("/componentes");
      setComponentes(response.data);
    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      toast.error("Não foi possível carregar os componentes.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (componente) => {
    // ... (sua função handleEdit - perfeita)
    setComponenteEmEdicao(componente);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    // ... (sua função handleDelete - perfeita)
    if (window.confirm("Você tem certeza que deseja excluir este item?")) {
      try {
        await api.delete(`/componentes/${id}`);
        toast.success("Item excluído com sucesso!");
        fetchData();
      } catch (error) {
        toast.error("Falha ao excluir o item.");
        console.error(error);
      }
    }
  };

  const handleAdd = () => {
    // ... (sua função handleAdd - perfeita)
    setComponenteEmEdicao(null);
    setModalVisible(true);
  };

  const handleImportClick = () => {
    // ... (sua função handleImportClick - perfeita)
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    // ... (sua função handleFileUpload - perfeita)
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    toast.info("Processando arquivo CSV...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // ✅ API CORRIGIDA PARA BATCH
          await api.post("/componentes/batch", results.data);
          toast.success(
            `${results.data.length} componentes importados com sucesso!`
          );
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
      },
    });
  };

  useEffect(() => {
    setIsUserAdmin(isAdmin());
    fetchData();
  }, []);

  const headers = [
    // ... (sua lógica de headers - perfeita)
    { label: "ID", key: "id" },
    { label: "Nome", key: "nome" },
    { label: "Patrimônio", key: "codigoPatrimonio" },
    { label: "Quantidade", key: "quantidade" },
    { label: "Localização", key: "localizacao" },
    { label: "Categoria", key: "categoria" },
  ];

  const csvReport = {
    // ... (sua lógica do csvReport - perfeita)
    data: componentes,
    headers: headers,
    filename: "Relatorio_Componentes.csv",
  };

  // --- JSX "LIMPO" ---
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
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv"
        onChange={handleFileUpload}
      />

      <Container maxWidth="xl">
        {/* O Header (perfeito) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gerenciamento de Itens
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* ... (seus botões de Import, Add, Export - perfeitos) ... */}
            {isUserAdmin && (
              <Button
                variant="contained"
                startIcon={<UploadFileIcon />}
                onClick={handleImportClick}
              >
                Importar CSV
              </Button>
            )}
            {isUserAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                color="primary"
              >
                Adicionar Item
              </Button>
            )}
            <CSVLink {...csvReport} style={{ textDecoration: "none" }}>
              <Button variant="outlined" startIcon={<FileDownloadIcon />}>
                Exportar CSV
              </Button>
            </CSVLink>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          // ✅ 2. A "REFORMA" ACONTECEU AQUI!
          // Trocamos 70 linhas de tabela por UMA linha de componente.
          <ComponentesTable
            componentes={componentes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAdmin={isUserAdmin}
          />
        )}
      </Container>

      {/* O Modal (perfeito) */}
      <ModalComponente
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onComponenteAdicionado={fetchData}
        componenteParaEditar={componenteEmEdicao}
      />
    </Box>
  );
}

export default ComponentesPage;
