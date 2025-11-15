import React from 'react';

// Imports do MUI (Corretos)
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// (Removemos o import do .css, pois o MUI não precisa dele)

function UserManagement({ users, onDeleteUser }) {
  // Começamos direto com o TableContainer (a parte boa do seu código)
  return (
    <TableContainer>
      <Table stickyHeader aria-label="tabela de usuários">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell> {/* ✅ ATUALIZADO */}
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Cargo</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Se não houver usuários, mostre uma linha */}
          {users.length === 0 && (
             <TableRow>
               <TableCell colSpan={5} align="center">
                 Nenhum usuário encontrado para este domínio.
               </TableCell>
             </TableRow>
          )}

          {users.map((user) => (
            <TableRow hover key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.nome}</TableCell> {/* ✅ ATUALIZADO */}
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {/* O <Chip> do MUI é perfeito para o Cargo */}
                <Chip
                  label={user.role}
                  color={user.role === 'ADMIN' ? 'secondary' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                {/* O <IconButton> para excluir */}
                <Tooltip title="Excluir Usuário">
                  {/* (Desabilita o botão se for o admin 'principal') */}
                  <IconButton
                    color="error"
                    onClick={() => onDeleteUser(user.id)}
                    disabled={user.email === 'admin@stockbot.com'} 
                  >
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

// Apenas um export default
export default UserManagement;