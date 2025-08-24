import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import LoginPage from "./pages/loginpage.jsx";
import DashboardPage from "./pages/dashboardpage.jsx";
import ComponentesPage from "./pages/componentepages.jsx";
import HistoricoPage from "./pages/historicopage.jsx";
import ConfiguracoesPage from "./pages/configuracaopages.jsx"; // 1. Importe a nova página
import "./index.css";
import { ThemeProvider } from './context/themecontext'; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/componentes", element: <ComponentesPage /> },
      { path: "/historico", element: <HistoricoPage /> },
      { path: "/configuracoes", element: <ConfiguracoesPage /> }, // 2. Adicione a nova rota
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolva o RouterProvider com o ThemeProvider */}
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);