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
      {
        path: "/historico",
        element: (
          <Suspense fallback={<div>Carregando...</div>}>
            <HistoricoPage />
          </Suspense>
        ),
      },
      {
        path: "/reposicao",
        element: (
          <Suspense fallback={<div>Carregando...</div>}>
            <ReposicaoPage />
          </Suspense>
        ),
      },
      {
        path: "/configuracoes",
        element: (
          <Suspense fallback={<div>Carregando...</div>}>
            <ConfiguracoesPage />
          </Suspense>
        ),
      },
      {
        path: "/ajuda",
        element: (
          <Suspense fallback={<div>Carregando...</div>}>
            <AjudaPage />
          </Suspense>
        ),
      },
      {
        path: "/pedidos",
        element: (
          <Suspense fallback={<div>Carregando...</div>}>
            <PedidosPage />
          </Suspense>
        ),
      },
      // --- Rotas de Admin (Protegidas) ---
      {
        element: (
          <Suspense fallback={<div>Carregando...</div>}>
            <AdminRoute />
          </Suspense>
        ),
        children: [
          {
            path: "/gerenciar-usuarios",
            element: (
              <Suspense fallback={<div>Carregando...</div>}>
                <UserManagementPage />
              </Suspense>
            ),
          },
          {
            path: "/aprovacoes",
            element: (
              <Suspense fallback={<div>Carregando...</div>}>
                <AprovacoesPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
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
