// Em: src/pages/ComponentesPage.jsx (VERSÃO OTIMIZADA)

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import Papa from "papaparse";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  TextField, // MUDANÇA: Importar o campo de busca
  Paper, // MUDANÇA: Para envolver a tabela e paginação
  TablePagination, // MUDANÇA: Importar a paginação
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SearchIcon from "@mui/icons-material/Search"; // MUDANÇA: Ícone de busca

import api from "../services/api";
import { isAdmin } from "../services/authService";
import ComponentesTable from "../components/componentestable";
import ModalComponente from "../components/modalcomponente";
import ModalSolicitarItem from "../components/ModalSolicitarItem";

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]); // MUDANÇA: Guarda só o 'content'
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const fileInputRef = useRef(null);

  // Estados dos Modais
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [itemParaSolicitar, setItemParaSolicitar] = useState(null);

  // --- MUDANÇA: Estados de Paginação e Busca ---
  const [page, setPage] = useState(0); // A página atual (começa em 0)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Itens por página
  const [totalElements, setTotalElements] = useState(0); // Total de itens no DB
  const [termoDeBusca, setTermoDeBusca] = useState(""); // O que o usuário digita
  const [debouncedTermo, setDebouncedTermo] = useState(""); // O termo após o delay

  // --- MUDANÇA: Efeito de "Debounce" para a Busca ---
  // Isso evita uma chamada de API a cada letra digitada.
  // Só faz a busca 500ms *depois* que o usuário parar de digitar.
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTermo(termoDeBusca);
      setPage(0); // Volta para a página 0 sempre que uma nova busca é feita
    }, 500);

    return () => {
      clearTimeout(timerId); // Limpa o timer se o usuário digitar de novo
    };
  }, [termoDeBusca]);

  // --- MUDANÇA: Função de API e Handlers ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/componentes?page=${page}&size=${rowsPerPage}&termo=${debouncedTermo}&sort=nome,asc`
      );
      setComponentes(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Erro ao buscar componentes:", error);
      toast.error("Não foi possível carregar os componentes.");
    } finally {
      setLoading(false);
    }
    // MUDANÇA: O useCallback agora tem as dependências que a função usa
  }, [page, rowsPerPage, debouncedTermo]);

  // MUDANÇA: O useEffect principal agora depende SÓ de fetchData
  useEffect(() => {
    setIsUserAdmin(isAdmin());
    fetchData();
  }, [fetchData]); // Dispara a busca quando eles mudam

  // --- Handlers do ADMIN (CRUD) ---
  // (handleAdd, handleDelete... estão OK, pois já chamam fetchData())
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
        fetchData(); // Recarrega os dados da página atual
      } catch (error) {
        console.error("Erro ao excluir:", error);
        toast.error(
          error.response?.data?.message || "Falha ao excluir o item."
        );
      }
    }
  };

  // --- Handlers do USER (Solicitação) ---
  const handleOpenSolicitar = (componente) => {
    setItemParaSolicitar(componente);
  };

  const handleCloseSolicitar = () => {
    setItemParaSolicitar(null);
  };

  const handleSolicitado = () => {
    handleCloseSolicitar();
    fetchData(); // Recarrega os dados para (talvez) atualizar o estoque
  };

  // --- MUDANÇA: Handlers de Paginação ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volta para a primeira página
  };

  // --- Handlers do CSV (Import/Export) ---
  // (Estão OK, mas o 'csvReport' só vai exportar a PÁGINA ATUAL)
  // ... (handleImportClick, handleFileUpload) ...
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
          setPage(0); // Volta pra página 1
          fetchData();
        } catch (error) {
          console.error("Erro ao importar CSV:", error);
          toast.error(
            error.response?.data?.message || "Falha ao importar dados."
          );
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
    data: componentes, // ATENÇÃO: Isso só vai exportar a PÁGINA ATUAL
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
            flexWrap: "wrap", // Permite que os botões quebrem a linha em telas pequenas
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gerenciamento de Itens
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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

        {/* MUDANÇA: Barra de Busca */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por nome, patrimônio, categoria ou localização..."
            value={termoDeBusca}
            onChange={(e) => setTermoDeBusca(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  position="start"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
              ),
            }}
          />
        </Box>

        {/* MUDANÇA: Paper envolvendo a Tabela e a Paginação */}
        <Paper sx={{ boxShadow: 3, overflow: "hidden" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ComponentesTable
              componentes={componentes} // MUDANÇA: Agora é o array 'content'
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSolicitar={handleOpenSolicitar}
              isAdmin={isUserAdmin}
            />
          )}

          {/* MUDANÇA: Componente de Paginação */}
          <TablePagination
            component="div"
            count={totalElements} // Total de itens no DB
            page={page} // Página atual
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage} // Itens por página
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
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
