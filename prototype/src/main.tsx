import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css'
import App from './App.tsx'
import LandingPage from './pages/LandingPage'
import PantryPage from './pages/PantryPage.tsx'
import FavoritesPage from './pages/FavoritesPage.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <LandingPage /> },
      { path: "pantry", element: <PantryPage /> },
      { path: "favorites", element: <FavoritesPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
