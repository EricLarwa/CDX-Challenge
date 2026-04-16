import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/layout/AppShell';
import { useCurrentUser } from './hooks/useAuth';
import { LoginPage } from './pages/Auth/Login';
import { RegisterPage } from './pages/Auth/Register';
import { CashFlowPage } from './pages/CashFlow/CashFlow';
import { ClientDetailPage } from './pages/Clients/ClientDetail';
import { ClientListPage } from './pages/Clients/ClientList';
import { DashboardPage } from './pages/Dashboard';
import { ExpenseListPage } from './pages/Expenses/ExpenseList';
import { ExpenseNewPage } from './pages/Expenses/ExpenseNew';
import { InvoiceDetailPage } from './pages/Invoices/InvoiceDetail';
import { InvoiceListPage } from './pages/Invoices/InvoiceList';
import { InvoiceNewPage } from './pages/Invoices/InvoiceNew';
import { ReportsHomePage } from './pages/Reports/ReportsHome';
import { SettingsPage } from './pages/Settings/Settings';
import { VendorListPage } from './pages/Vendors/VendorList';
import { useAuthStore } from './stores/auth.store';

function AuthLayout() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #e0e7ff, #f8fafc)' }}>
      <div style={{ width: 'min(480px, 100%)', background: 'white', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #dbeafe' }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}

function ProtectedApp() {
  const token = useAuthStore((state) => state.token);
  useCurrentUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/invoices" element={<InvoiceListPage />} />
        <Route path="/invoices/new" element={<InvoiceNewPage />} />
        <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="/expenses" element={<ExpenseListPage />} />
        <Route path="/expenses/new" element={<ExpenseNewPage />} />
        <Route path="/cashflow" element={<CashFlowPage />} />
        <Route path="/clients" element={<ClientListPage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
        <Route path="/vendors" element={<VendorListPage />} />
        <Route path="/reports" element={<ReportsHomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout />} />
      <Route path="/register" element={<AuthLayout />} />
      <Route path="/*" element={<ProtectedApp />} />
    </Routes>
  );
}
