import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import ManagerLayout from './layouts/ManagerLayout';
import StaffLayout from './layouts/StaffLayout';

// Dashboards
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ScannerPage from './pages/customer/ScannerPage';
import CartPage from './pages/customer/CartPage';
import OffersPage from './pages/customer/OffersPage';
import OrdersPage from './pages/customer/OrdersPage';
import StoreCatalogPage from './pages/customer/StoreCatalogPage';
import StaffDashboard from './pages/staff/StaffDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Customer Routes */}
        <Route element={<RoleRoute allowedRoles={['CUSTOMER']} />}>
          <Route element={<CustomerLayout />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/catalog" element={<StoreCatalogPage />} />
            <Route path="/customer/scan" element={<ScannerPage />} />
            <Route path="/customer/cart" element={<CartPage />} />
            <Route path="/customer/offers" element={<OffersPage />} />
            <Route path="/customer/orders" element={<OrdersPage />} />
            <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
          </Route>
        </Route>

        {/* Staff Routes */}
        <Route element={<RoleRoute allowedRoles={['STAFF', 'MANAGER']} />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
          </Route>
        </Route>

        {/* Manager Routes */}
        <Route element={<RoleRoute allowedRoles={['MANAGER']} />}>
          <Route element={<ManagerLayout />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager" element={<Navigate to="/manager/dashboard" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
