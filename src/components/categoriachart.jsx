import React from 'react';

// Imports do MUI
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Divider
} from '@mui/material';

// Ícone para ilustrar
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * @param {object} props
 * @param {string} props.title - Título da lista
 * @param {Array<object>} props.items - Array de itens para listar (espera-se { nome, quantidade })
 * @param {string} props.emptyMessage - Mensagem para quando a lista estiver vazia
 */
function ActionList({ title, items = [], emptyMessage = "Nenhum item para exibir." }) {
  return (
    // Paper serve como o contêiner principal, com cor e sombra do tema
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" component="h3" gutterBottom>
        {title}
      </Typography>

      {/* Box para conter a lista e permitir scroll se ela for muito grande */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {items.length > 0 ? (
          <List dense> {/* dense = deixa a lista um pouco mais compacta */}
            {items.map((item, index) => (
              <React.Fragment key={item.id || index}>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    {/* Um ícone para dar um toque visual */}
                    <WarningAmberIcon color="warning" /> 
                  </ListItemIcon>
                  <ListItemText
                    primary={item.nome}
                    secondary={`Quantidade: ${item.quantidade}`} // Texto secundário, menor e mais claro
                  />
                </ListItem>
                {/* Adiciona um divisor entre os itens, exceto no último */}
                {index < items.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            {emptyMessage}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default ActionList;