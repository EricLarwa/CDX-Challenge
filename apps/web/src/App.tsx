import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/layout/AppShell';
import { useCurrentUser } from './hooks/useAuth';
import { LoginPage } from './pages/Auth/Login';
import { RegisterPage } from './pages/Auth/Register';
import { CashFlowPage } from './pages/CashFlow/CashFlow';
import { ClientDetailPage } from './pages/Clients/ClientDetail';
import { ClientListPage } from './pages/Clients/ClientList';
import { DashboardPage } from './pages/Dashboard';
import { ExpenseAnalyticsPage } from './pages/Expenses/ExpenseAnalytics';
import { ExpenseListPage } from './pages/Expenses/ExpenseList';
import { ExpenseNewPage } from './pages/Expenses/ExpenseNew';
import { InvoiceDetailPage } from './pages/Invoices/InvoiceDetail';
import { InvoiceEditPage } from './pages/Invoices/InvoiceEdit';
import { InvoiceListPage } from './pages/Invoices/InvoiceList';
import { InvoiceNewPage } from './pages/Invoices/InvoiceNew';
import { NotFoundPage } from './pages/NotFound';
import { ReportDetailPage } from './pages/Reports/ReportDetail';
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
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(194,65,12,0.16),transparent_22%),linear-gradient(135deg,#eff6ff,#f8fafc)] p-4">
      <div className="w-full max-w-xl rounded-[1.75rem] border border-blue-100 bg-white/95 p-8 shadow-xl shadow-blue-100/40">
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
        <Route path="/invoices/:id/edit" element={<InvoiceEditPage />} />
        <Route path="/expenses" element={<ExpenseListPage />} />
        <Route path="/expenses/new" element={<ExpenseNewPage />} />
        <Route path="/expenses/analytics" element={<ExpenseAnalyticsPage />} />
        <Route path="/cashflow" element={<CashFlowPage />} />
        <Route path="/clients" element={<ClientListPage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
        <Route path="/vendors" element={<VendorListPage />} />
        <Route path="/reports" element={<ReportsHomePage />} />
        <Route path="/reports/:type" element={<ReportDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
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
