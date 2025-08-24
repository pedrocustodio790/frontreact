import { useContext } from 'react';
import { ThemeContext } from '../context/themecontext';
import Sidebar from '../components/sidebar';

function ConfiguracoesPage() {
  // 2. Use o context para aceder ao tema atual e à função de alternância
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="header-dashboard">
          <h1>Configurações</h1>
        </div>

        <div className="settings-section">
          <h2>Preferências de Aparência</h2>
          <div className="setting-item">
            <span>Modo Escuro</span>
            <label className="switch">
              {/* 3. Conecte o interruptor ao estado e à função do tema */}
              <input 
                type="checkbox" 
                onChange={toggleTheme} 
                checked={theme === 'dark'}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {/* Adicione aqui os outros contentores para as futuras funcionalidades */}
        {/* <div className="settings-section"> ... </div> */}

      </main>
    </div>
  );
}

export default ConfiguracoesPage;
