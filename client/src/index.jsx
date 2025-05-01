import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import CanvasPage from './pages/canvasPage.jsx';

// Cria uma constante para o gerenciamento de rodas da aplicação.
const router = createBrowserRouter([
  {
    path: "/", //Rota raiz.
    element: <App></App>, //Elemento que irá ser renderizado ao acessar a rota.
  },
  {
    path: "canvas",
    element: <CanvasPage></CanvasPage>
  },
]);

//Renzeriza a aplicação
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


