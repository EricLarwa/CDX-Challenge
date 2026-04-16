import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  ['/', 'Dashboard'],
  ['/invoices', 'Invoices'],
  ['/expenses', 'Expenses'],
  ['/cashflow', 'Cash Flow'],
  ['/clients', 'Clients'],
  ['/vendors', 'Vendors'],
  ['/reports', 'Reports'],
  ['/settings', 'Settings'],
] as const;

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', background: '#f5f7fb' }}>
      <aside style={{ background: '#0f172a', color: '#e2e8f0', padding: '2rem 1.25rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8' }}>FinanceOS</div>
          <h1 style={{ margin: '0.4rem 0 0', fontSize: '1.6rem' }}>Operating System</h1>
        </div>
        <nav style={{ display: 'grid', gap: '0.5rem' }}>
          {navItems.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                color: '#e2e8f0',
                textDecoration: 'none',
                padding: '0.75rem 0.9rem',
                borderRadius: '0.8rem',
                background: isActive ? 'rgba(99,102,241,0.22)' : 'transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <header style={{ padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
          <strong>Small business finance, without spreadsheet sprawl.</strong>
        </header>
        <main style={{ padding: '1.5rem' }}>{children}</main>
      </div>
    </div>
  );
}
