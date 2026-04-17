import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/layout/AppShell';
import { AppErrorBoundary } from './components/shared/AppErrorBoundary';
import { LoadingCard } from './components/shared/LoadingCard';
import { useCurrentUser } from './hooks/useAuth';
import { useAuthStore } from './stores/auth.store';

const LoginPage = lazy(() => import('./pages/Auth/Login').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/Auth/Register').then((module) => ({ default: module.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.DashboardPage })));
const InvoiceListPage = lazy(() => import('./pages/Invoices/InvoiceList').then((module) => ({ default: module.InvoiceListPage })));
const InvoiceNewPage = lazy(() => import('./pages/Invoices/InvoiceNew').then((module) => ({ default: module.InvoiceNewPage })));
const InvoiceDetailPage = lazy(() => import('./pages/Invoices/InvoiceDetail').then((module) => ({ default: module.InvoiceDetailPage })));
const InvoiceEditPage = lazy(() => import('./pages/Invoices/InvoiceEdit').then((module) => ({ default: module.InvoiceEditPage })));
const ExpenseListPage = lazy(() => import('./pages/Expenses/ExpenseList').then((module) => ({ default: module.ExpenseListPage })));
const ExpenseNewPage = lazy(() => import('./pages/Expenses/ExpenseNew').then((module) => ({ default: module.ExpenseNewPage })));
const ExpenseAnalyticsPage = lazy(() => import('./pages/Expenses/ExpenseAnalytics').then((module) => ({ default: module.ExpenseAnalyticsPage })));
const CashFlowPage = lazy(() => import('./pages/CashFlow/CashFlow').then((module) => ({ default: module.CashFlowPage })));
const ClientListPage = lazy(() => import('./pages/Clients/ClientList').then((module) => ({ default: module.ClientListPage })));
const ClientNewPage = lazy(() => import('./pages/Clients/ClientNew').then((module) => ({ default: module.ClientNewPage })));
const ClientDetailPage = lazy(() => import('./pages/Clients/ClientDetail').then((module) => ({ default: module.ClientDetailPage })));
const VendorListPage = lazy(() => import('./pages/Vendors/VendorList').then((module) => ({ default: module.VendorListPage })));
const VendorNewPage = lazy(() => import('./pages/Vendors/VendorNew').then((module) => ({ default: module.VendorNewPage })));
const ReportsHomePage = lazy(() => import('./pages/Reports/ReportsHome').then((module) => ({ default: module.ReportsHomePage })));
const ReportDetailPage = lazy(() => import('./pages/Reports/ReportDetail').then((module) => ({ default: module.ReportDetailPage })));
const SettingsPage = lazy(() => import('./pages/Settings/Settings').then((module) => ({ default: module.SettingsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFoundPage })));

function RouteLoadingFallback() {
  return (
    <div className="grid gap-4">
      <LoadingCard label="Opening the next workspace screen..." />
    </div>
  );
}

function AuthLayout({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(194,65,12,0.16),transparent_22%),linear-gradient(135deg,#eff6ff,#f8fafc)] p-4">
        <div className="w-full max-w-xl rounded-[1.75rem] border border-blue-100 bg-white/95 p-8 shadow-xl shadow-blue-100/40">
          {children}
        </div>
      </div>
    </Suspense>
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
      <Suspense fallback={<RouteLoadingFallback />}>
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
          <Route path="/clients/new" element={<ClientNewPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />
          <Route path="/vendors" element={<VendorListPage />} />
          <Route path="/vendors/new" element={<VendorNewPage />} />
          <Route path="/reports" element={<ReportsHomePage />} />
          <Route path="/reports/:type" element={<ReportDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <Routes>
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
        <Route path="/*" element={<ProtectedApp />} />
      </Routes>
    </AppErrorBoundary>
  );
}
