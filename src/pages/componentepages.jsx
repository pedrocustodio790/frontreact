import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import Papa from "papaparse";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import ModalComponente from "../components/modalcomponente";
import api from "../services/api";
import { isAdmin } from "../services/authService";

function ComponentesPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [componenteEmEdicao, setComponenteEmEdicao] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ --- FUNÇÕES DE CONTROLE (CRUD) IMPLEMENTADAS --- ✅
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

  const handleEdit = (componente) => {
    setComponenteEmEdicao(componente);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Você tem certeza que deseja excluir este item?")) {
      try {
        await api.delete(`/componentes/${id}`);
        toast.success("Item excluído com sucesso!");
        fetchData(); // Atualiza a lista após a exclusão
      } catch (error) {
        toast.error("Falha ao excluir o item.");
        console.error(error);
      }
    }
  };

  const handleAdd = () => {
    setComponenteEmEdicao(null); // Garante que o modal estará no modo de "adicionar"
    setModalVisible(true);
  };

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
        try {
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

  // --- LÓGICA PARA EXPORTAÇÃO DE CSV ---
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
          <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
            {/* ✅ --- TABELA DE COMPONENTES IMPLEMENTADA --- ✅ */}
            <TableContainer>
              <Table stickyHeader aria-label="tabela de componentes">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Patrimônio
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Quantidade
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Localização
                    </TableCell>
                    {isUserAdmin && (
                      <TableCell
                        sx={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        Ações
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {componentes.map((componente) => (
                    <TableRow hover key={componente.id}>
                      <TableCell>{componente.nome}</TableCell>
                      <TableCell>{componente.codigoPatrimonio}</TableCell>
                      <TableCell>{componente.quantidade}</TableCell>
                      <TableCell>{componente.localizacao}</TableCell>
                      {isUserAdmin && (
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              color="info"
                              size="small"
                              onClick={() => handleEdit(componente)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDelete(componente.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>

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
