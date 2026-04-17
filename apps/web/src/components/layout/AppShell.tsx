import { BarChart3, Briefcase, LayoutDashboard, Receipt, Settings, Users, WalletCards } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

import { cn } from '../../lib/utils';
import { useAuthStore } from '../../stores/auth.store';
import { Button } from '../ui/button';

const navItems = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/invoices', 'Invoices', Receipt],
  ['/expenses', 'Expenses', WalletCards],
  ['/cashflow', 'Cash Flow', BarChart3],
  ['/clients', 'Clients', Users],
  ['/vendors', 'Vendors', Briefcase],
  ['/reports', 'Reports', BarChart3],
  ['/settings', 'Settings', Settings],
] as const;

export function AppShell({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <div className="grid min-h-screen bg-transparent print:block md:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-slate-800/60 bg-slate-950 px-5 py-6 text-slate-200 print:hidden md:border-b-0 md:border-r md:px-5 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="text-xs uppercase tracking-[0.24em] text-blue-300">FinanceOS</div>
          <h1 className="mt-2 text-3xl font-semibold">Operating System</h1>
          <p className="mt-2 text-sm text-slate-400">A calmer home for invoices, expenses, and the money story in between.</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1 md:grid md:overflow-visible md:pb-0">
          {navItems.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-900 md:shrink',
                  isActive && 'bg-blue-600/20 text-white ring-1 ring-blue-400/30',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:mt-10">
          <div className="text-sm text-slate-400">{user?.businessName ?? user?.email ?? 'FinanceOS user'}</div>
          <Button
            type="button"
            variant="secondary"
            onClick={clearSession}
            className="mt-3 w-full border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800"
          >
            Sign out
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-slate-200 bg-white/85 px-4 py-4 backdrop-blur print:hidden sm:px-6">
          <strong className="text-sm font-semibold text-slate-800">Small business finance, without spreadsheet sprawl.</strong>
        </header>
        <main className="p-4 print:p-0 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
