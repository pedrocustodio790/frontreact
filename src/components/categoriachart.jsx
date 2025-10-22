// src/components/ActionList.jsx (VERSÃO REFORMADA E MELHORADA)
import React from "react";
import { Box, List, Paper, Typography } from "@mui/material";

/**
 * @param {object} props
 * @param {string} props.title - Título da lista
 * @param {React.ReactNode} props.children - Os ListItems que serão renderizados
 * @param {string} props.emptyMessage - Mensagem para quando a lista estiver vazia
 */
function ActionList({
  title,
  children,
  emptyMessage = "Nenhum item para exibir.",
}) {
  // 1. Verificamos se algum "filho" (children) foi passado
  const hasItems = React.Children.count(children) > 0;

  return (
    // 2. A SUA ESTRUTURA DE LAYOUT (que é excelente!)
    <Paper
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h6" component="h3" gutterBottom>
        {title}
      </Typography>

      {/* 3. O SEU BOX COM SCROLL (perfeito!) */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {hasItems ? (
          // 4. Renderizamos os 'children' dentro da lista
          <List dense>{children}</List>
        ) : (
          // 5. O SEU placeholder (ótimo!)
          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}
          >
            {emptyMessage}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default ActionList;
