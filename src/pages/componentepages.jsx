// Em: src/pages/ComponentesPage.jsx (VERSÃO FINAL LIMPA)

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

import api from "../services/api";
import { isAdmin } from "../services/authService";
import ComponentesTable from "../components/componentestable";
import ModalComponente from "../components/modalcomponente";
import ModalSolicitarItem from "../components/ModalSolicitarItem"; // ✅ Importa o modal de solicitação

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const fileInputRef = useRef(null);

  // Estados dos Modais
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [itemParaSolicitar, setItemParaSolicitar] = useState(null); // ✅ Estado para o novo modal

  // --- Funções de API e Handlers ---
  const fetchData = async () => {
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

  useEffect(() => {
    setIsUserAdmin(isAdmin());
    fetchData();
  }, []);

  // --- Handlers do ADMIN (CRUD) ---
  const handleAdd = () => {
    setComponenteEmEdicao(null);
    setModalVisible(true);
  };

  const handleEdit = (componente) => {
    setComponenteEmEdicao(componente);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Você tem certeza que deseja excluir este item?")) {
      try {
        await api.delete(`/componentes/${id}`);
        toast.success("Item excluído com sucesso!");
        fetchData();
      } catch (error) {
        toast.error("Falha ao excluir o item.");
      }
    }
  };

  // --- ✅ Handlers do USER (Solicitação) ---
  const handleOpenSolicitar = (componente) => {
    setItemParaSolicitar(componente);
  };

  const handleCloseSolicitar = () => {
    setItemParaSolicitar(null);
  };

  const handleSolicitado = () => {
    handleCloseSolicitar();
    // Você pode adicionar fetchData() se quiser atualizar a lista após solicitar
  };

  // --- Handlers do CSV (Import/Export) ---
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
        try {
          await api.post("/componentes/batch", results.data);
          toast.success(`${results.data.length} componentes importados!`);
          fetchData();
        } catch (error) {
          toast.error("Falha ao importar dados.");
        } finally {
          setLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: () => {
        setLoading(false);
        toast.error("Erro ao ler o arquivo CSV.");
      },
    });
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "Nome", key: "nome" },
    { label: "Patrimônio", key: "codigoPatrimonio" },
    { label: "Quantidade", key: "quantidade" },
    { label: "Localização", key: "localizacao" },
    { label: "Categoria", key: "categoria" },
  ];

  const csvReport = {
    data: componentes,
    headers: headers,
    filename: "Relatorio_Componentes.csv",
  };

  // --- JSX ---
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
        {/* Header (com os botões) */}
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
            {isUserAdmin && (
              <>
                <Button
                  variant="contained"
                  startIcon={<UploadFileIcon />}
                  onClick={handleImportClick}
                >
                  Importar CSV
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                  color="primary"
                >
                  Adicionar Item
                </Button>
              </>
            )}
            <CSVLink {...csvReport} style={{ textDecoration: "none" }}>
              <Button variant="outlined" startIcon={<FileDownloadIcon />}>
                Exportar CSV
              </Button>
            </CSVLink>
          </Box>
        </Box>

        {/* Tabela de Componentes */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ComponentesTable
            componentes={componentes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSolicitar={handleOpenSolicitar} // ✅ A PROP "onSolicitar" ESTÁ AQUI
            isAdmin={isUserAdmin}
          />
        )}
      </Container>

      <ModalComponente
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onComponenteAdicionado={fetchData}
        componenteParaEditar={componenteEmEdicao}
      />

      <ModalSolicitarItem
        isVisible={!!itemParaSolicitar}
        onClose={handleCloseSolicitar}
        onSolicitado={handleSolicitado}
        itemParaSolicitar={itemParaSolicitar}
      />
    </Box>
  );
}

export default ComponentesPage;
