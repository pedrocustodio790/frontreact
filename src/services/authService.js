// Em: src/services/authService.js (O CÓDIGO FINAL E CORRETO)

// (Não precisamos de jwt-decode aqui!)

/**
 * Verifica se o usuário está logado.
 * (Verifica se o token E os dados do usuário existem)
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("jwt-token");
  const userData = localStorage.getItem("user-data");
  
  // Se qualquer um dos dois não existir, ele não está logado.
  return token != null && userData != null;
};

/**
 * Verifica se o usuário logado é um ADMIN.
 * (Lê o 'user-data' do localStorage)
 * ESTA É A FUNÇÃO QUE O SIDEBAR PRECISA.
 */
export const isAdmin = () => {
  try {
    // 1. Pega os dados do usuário
    const userDataString = localStorage.getItem("user-data");
    
    if (!userDataString) {
      return false; // Não tem dados do usuário = não é admin
    }
    
    // 2. Converte o texto (JSON) de volta para um objeto
    const userData = JSON.parse(userDataString); 
    
    // 3. Verifica o 'role' de dentro do objeto
    return userData.role === "ADMIN"; 

  } catch (error) {
    console.error("Erro ao verificar 'role' do usuário:", error);
    return false; // Se der erro ao ler o JSON, não é admin
  }
};

/**
 * Pega o objeto do usuário logado (para o ProfileMenu)
 */
export const getLoggedUser = () => {
    try {
     const userDataString = localStorage.getItem("user-data");
     return userDataString ? JSON.parse(userDataString) : null;
   } catch (error) {
     console.error("Erro ao ler dados do usuário:", error);
     return null;
   }
}