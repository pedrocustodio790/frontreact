import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";

// 🔥 IMPORTANTE: Usar lazy loading para as páginas
const LoginPage = lazy(() => import("./pages/loginpage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const DashboardPage = lazy(() => import("./pages/dashboardpage.jsx"));
const ComponentesPage = lazy(() => import("./pages/componentepages.jsx"));
const HistoricoPage = lazy(() => import("./pages/historicopage.jsx"));
const ReposicaoPage = lazy(() => import("./pages/reposicaopage.jsx"));
const ConfiguracoesPage = lazy(() => import("./pages/configuracaopages.jsx"));
const AjudaPage = lazy(() => import("./pages/ajudapage.jsx"));
const UserManagementPage = lazy(() => import("./pages/UserManagementpage.jsx"));
const AprovacoesPage = lazy(() => import("./pages/Aprovacaopages.jsx"));
const PedidosPage = lazy(() => import("./pages/Pedidopages.jsx"));
const AdminRoute = lazy(() => import("./components/Adminroute.jsx"));

import { ThemeProvider } from "./context/themecontext.jsx";
import "./index.css";

console.log("🚀 Main.jsx carregado - Aplicação iniciando");

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Carregando...</div>}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "/componentes",
        element: (
          <Suspense fallback={<div>Carregando...</div>}>
            <ComponentesPage />
          </Suspense>
        ),
      },
      // ... repita para todas as outras rotas
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Carregando...</div>}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<div>Carregando...</div>}>
        <RegisterPage />
      </Suspense>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Suspense fallback={<div>Carregando aplicação...</div>}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
      />
    </ThemeProvider>
  </React.StrictMode>
);
