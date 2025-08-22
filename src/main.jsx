// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importando os componentes de página
import App from "./App.jsx";
import LoginPage from "./pages/loginpage.jsx";
import DashboardPage from "./pages/dashboardpage.jsx";
import ComponentesPage from "./pages/componentepages.jsx"
import "./index.css";

// Configuração do mapa de rotas da aplicação
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // O App agora funciona como um "protetor" de rotas
    children: [
      {
        index: true, // Rota inicial (ex: localhost:5173/)
        element: <DashboardPage />,
      },
      {
        path: "/componentes", // Rota para a página de componentes
        element: <ComponentesPage />,
      },
      // Futuramente, você adicionaria as rotas /historico e /configuracoes aqui
    ],
  },
  {
    path: "/login", // Rota pública para a página de login
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
