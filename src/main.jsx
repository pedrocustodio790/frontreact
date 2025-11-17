// Em: src/main.jsx
import React from "react"; // Import React
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import LoginPage from "./pages/loginpage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/dashboardpage.jsx";
import ComponentesPage from "./pages/componentepages.jsx";
import HistoricoPage from "./pages/historicopage.jsx";
import ReposicaoPage from "./pages/reposicaopage.jsx";
import ConfiguracoesPage from "./pages/configuracaopages.jsx";
import AjudaPage from "./pages/ajudapage.jsx";
import UserManagementPage from "./pages/UserManagementpage.jsx";
import AprovacoesPage from "./pages/Aprovacaopages.jsx";
import PedidosPage from "./pages/Pedidopages.jsx";
import AdminRoute from "./components/Adminroute.jsx";
import { ThemeProvider } from "./context/themecontext.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // --- Rotas Normais (Todos logados) ---
      { index: true, element: <DashboardPage /> },
      { path: "/componentes", element: <ComponentesPage /> },
      { path: "/historico", element: <HistoricoPage /> },
      { path: "/reposicao", element: <ReposicaoPage /> },
      { path: "/configuracoes", element: <ConfiguracoesPage /> }, // Ajuste se for só Admin
      { path: "/ajuda", element: <AjudaPage /> },

      // ✅ A NOVA PÁGINA DE "PEDIR A MAKITA" (para todos)
      { path: "/pedidos", element: <PedidosPage /> },

      // --- Rotas de Admin (Protegidas) ---
      {
        element: <AdminRoute />,
        children: [
          { path: "/gerenciar-usuarios", element: <UserManagementPage /> },

          // ✅ A NOVA PÁGINA DE APROVAÇÕES (para Admin)
          { path: "/aprovacoes", element: <AprovacoesPage /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
      />
    </ThemeProvider>
  </React.StrictMode>
);
