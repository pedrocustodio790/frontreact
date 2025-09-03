import { jwtDecode } from 'jwt-decode';

/**
 * Verifica se o utilizador logado tem a permissão de ADMIN.
 * @returns {boolean} - Retorna true se for ADMIN, false caso contrário.
 */
export const isAdmin = () => {
  const token = localStorage.getItem('jwt-token');

  // Se não houver token, definitivamente não é admin.
  if (!token) {
    return false;
  }

  try {
    // Decodifica o token para ler o seu conteúdo (payload).
    const decodedToken = jwtDecode(token);
    
    // O campo 'roles' é um array. Verificamos se ele inclui 'ROLE_ADMIN'.
    return decodedToken.roles && decodedToken.roles.includes('ROLE_ADMIN');
  } catch (error) {
    // Se o token for inválido ou expirar, consideramos que não é admin.
    console.error("Erro ao decodificar o token:", error);
    return false;
  }
};
