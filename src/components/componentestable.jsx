import React from 'react';
import './componentestable.css';

// 1. A tabela agora recebe 'isAdmin' como uma prop
function ComponentesTable({ componentes, onEdit, onDelete, isAdmin }) {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Patrimônio</th>
                        <th>Quantidade</th>
                        {/* 2. A coluna 'Ações' SÓ APARECE se isAdmin for true */}
                        {isAdmin && <th>Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {componentes.length > 0 ? (
                        componentes.map(componente => (
                            <tr key={componente.id}>
                                <td>{componente.nome}</td>
                                <td>{componente.codigoPatrimonio}</td>
                                <td>{componente.quantidade}</td>
                                {/* 3. Os botões SÓ APARECEM se isAdmin for true */}
                                {isAdmin && (
                                    <td>
                                        <button className="btn-edit" onClick={() => onEdit(componente)}>Editar</button>
                                        <button className="btn-delete" onClick={() => onDelete(componente.id)}>Excluir</button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            {/* Ajusta o colspan com base na permissão */}
                            <td colSpan={isAdmin ? 4 : 3}>Nenhum componente encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ComponentesTable;
