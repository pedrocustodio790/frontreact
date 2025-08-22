// src/pages/ComponentesPage.jsx

import Sidebar from '../components/sidebar';

function ComponentesPage() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard">
          <h1>Gerenciamento de Componentes</h1>
          <p>Adicione, edite e remova componentes do seu estoque.</p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          {/* Futuramente, aqui ficará a tabela com os componentes, botões de ação, etc. */}
          <h2>Página de Componentes em construção...</h2>
          <p>Aqui você poderá ver uma tabela com todos os itens do seu estoque.</p>
        </div>
      </main>
    </div>
  );
}

export default ComponentesPage;