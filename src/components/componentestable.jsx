// Em: src/components/ComponentesTable.jsx
import React from "react";

// Imports do MUI (necessários para este componente)
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ComponentesTable({ componentes, onEdit, onDelete, isAdmin }) {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
      <TableContainer>
        <Table stickyHeader aria-label="tabela de componentes">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Patrimônio</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantidade</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Localização</TableCell>
              {/* O {" "} FOI REMOVIDO DAQUI */}
              <TableCell sx={{ fontWeight: "bold" }}>Categoria</TableCell>
              {/* O {" "} FOI REMOVIDO DAQUI */}
              {isAdmin && (
                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                  Ações
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {componentes.length > 0 ? (
              componentes.map((componente) => (
                <TableRow hover key={componente.id}>
                  <TableCell>{componente.nome}</TableCell>
                  <TableCell>{componente.codigoPatrimonio}</TableCell>
                  <TableCell>{componente.quantidade}</TableCell>
                  <TableCell>{componente.localizacao}</TableCell>
                  {/* O {" "} FOI REMOVIDO DAQUI */}
                  <TableCell>{componente.categoria}</TableCell>
                  {/* O {" "} FOI REMOVIDO DAQUI */}
                  {isAdmin && (
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          color="info"
                          size="small"
                          onClick={() => onEdit(componente)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => onDelete(componente.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} align="center">
                  <Typography color="text.secondary" sx={{ p: 3 }}>
                    Nenhum componente encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ComponentesTable;
