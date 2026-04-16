import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/dashboard/StatCard';
export function DashboardPage() {
    return (_jsxs("div", { children: [_jsx(PageHeader, { eyebrow: "Overview", title: "Financial health at a glance", description: "The dashboard is positioned for Health Score, KPIs, cash flow, alerts, and quick actions from the spec." }), _jsxs("section", { style: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }, children: [_jsx(StatCard, { label: "Revenue MTD", value: "$3,247.50", tone: "success" }), _jsx(StatCard, { label: "Expenses MTD", value: "$128.00" }), _jsx(StatCard, { label: "Outstanding", value: "$1,800.00", tone: "warning" }), _jsx(StatCard, { label: "Health Score", value: "82 / 100", tone: "success" })] })] }));
}
