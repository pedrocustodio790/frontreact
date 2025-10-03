import React from 'react';

// Imports do MUI
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip, // Ótimo para exibir "badges" de status ou cargos
  IconButton,
  Tooltip // Ótimo para dar dicas em ícones
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function UserManagement({ users, onDeleteUser }) {
  return (
    // O <div> principal é removido, pois a <Paper> na página pai já serve de container.
    // Começamos direto com o TableContainer.
    <TableContainer>
      <Table stickyHeader aria-label="tabela de usuários">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Cargo</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow hover key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {/* O <span> para o cargo vira um <Chip> do MUI, que é mais elegante */}
                <Chip
                  label={user.role}
                  color={user.role === 'ADMIN' ? 'secondary' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                {/* O <button> de excluir vira um <IconButton> para consistência */}
                <Tooltip title="Excluir Usuário">
                  <IconButton color="error" onClick={() => onDeleteUser(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserManagement;