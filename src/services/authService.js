/**
 * Verifica se o usuário está logado.
 * No "Jeito Novo", o usuário está logado se AMBOS
 * o token e os dados do usuário existirem.
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("jwt-token");
  const userData = localStorage.getItem("user-data");
  
  // Se qualquer um dos dois não existir, ele não está logado.
  return token != null && userData != null;
};

/**
 * Verifica se o usuário logado é um ADMIN.
 * Esta é a função que o seu ComponentesPage.jsx usa.
 */
export const isAdmin = () => {
  try {
    // 1. Pega os dados do usuário do "Jeito Novo"
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
 * (BÔNUS) Pega o objeto do usuário logado (ex: para o ProfileMenu)
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