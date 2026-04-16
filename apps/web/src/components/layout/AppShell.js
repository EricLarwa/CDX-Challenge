import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
];
export function AppShell({ children }) {
    return (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', background: '#f5f7fb' }, children: [_jsxs("aside", { style: { background: '#0f172a', color: '#e2e8f0', padding: '2rem 1.25rem' }, children: [_jsxs("div", { style: { marginBottom: '2rem' }, children: [_jsx("div", { style: { fontSize: '0.8rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8' }, children: "FinanceOS" }), _jsx("h1", { style: { margin: '0.4rem 0 0', fontSize: '1.6rem' }, children: "Operating System" })] }), _jsx("nav", { style: { display: 'grid', gap: '0.5rem' }, children: navItems.map(([to, label]) => (_jsx(NavLink, { to: to, style: ({ isActive }) => ({
                                color: '#e2e8f0',
                                textDecoration: 'none',
                                padding: '0.75rem 0.9rem',
                                borderRadius: '0.8rem',
                                background: isActive ? 'rgba(99,102,241,0.22)' : 'transparent',
                            }), children: label }, to))) })] }), _jsxs("div", { children: [_jsx("header", { style: { padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid #e2e8f0' }, children: _jsx("strong", { children: "Small business finance, without spreadsheet sprawl." }) }), _jsx("main", { style: { padding: '1.5rem' }, children: children })] })] }));
}
