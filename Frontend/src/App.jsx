import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLayout from './components/AdminLayout/AdminLayout.jsx';
import { getAccessToken, getUserFromToken, removeAccessToken } from '../utils/TokenUtilities.js';

// Páginas públicas
import FormLogin from './pages/auth/Login/FormLogin.jsx';
import MenuPublico from './pages/Public/MenuPublico/MenuPublico.jsx';

// Páginas de Admin
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard.jsx';
import AdminUsuarios from './pages/Admin/AdminUsuarios/AdminUsuarios.jsx';
import AdminProductos from './pages/Admin/AdminProductos/AdminProductos.jsx';
import AdminCategorias from './pages/Admin/AdminCategorias/AdminCategorias.jsx';
import AdminMesas from './pages/Admin/AdminMesas/AdminMesas.jsx';
import AdminReportes from './pages/Admin/Reportes/AdminReportes.jsx';
import AdminActividad from './pages/Admin/Actividad/AdminActividad.jsx';

// Páginas de Mesero
import MeseroMesas from './pages/Mesero/MeseroMesas/MeseroMesas.jsx';
import MeseroMisPedidos from './pages/Mesero/MeseroMisPedidos/MeseroMisPedidos.jsx';
import PedidoView from './pages/Mesero/PedidoView/PedidoView.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const PublicLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const App = () => {
  useEffect(() => {
    const checkSession = () => {
      const token = getAccessToken();
      if (token) {
        const user = getUserFromToken();
        if (user && user.exp) {
          // 'user.exp' is typically in seconds, Date.now() is in ms
          if (user.exp * 1000 < Date.now()) {
            console.warn("Session expired. Forcing logout.");
            removeAccessToken();
            window.location.href = '/login';
          }
        }
      }
    };

    // Check immediately on mount
    checkSession();

    // Check every minute if the app is left open
    const intervalId = setInterval(checkSession, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rutas con Header normal */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<FormLogin />} />
          <Route path="/menu" element={<MenuPublico />} />

          {/* Redirect raíz al menú público */}
          <Route path="/" element={<Navigate to="/menu" replace />} />

          {/* Rutas de Mesero */}
          <Route
            path="/mesero/mesas"
            element={
              <ProtectedRoute allowedRoles={['MESERO']}>
                <MeseroMesas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mesero/mis-pedidos"
            element={
              <ProtectedRoute allowedRoles={['MESERO']}>
                <MeseroMisPedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mesero/pedido/:id"
            element={
              <ProtectedRoute allowedRoles={['MESERO']}>
                <PedidoView />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Rutas de Admin (sin Header normal, usan AdminLayout con Sidebar) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMINISTRADOR']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="categorias" element={<AdminCategorias />} />
          <Route path="mesas" element={<AdminMesas />} />
          <Route path="reportes" element={<AdminReportes />} />
          <Route path="actividad-reciente" element={<AdminActividad />} />
          <Route path="pedido/:id" element={<PedidoView />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
