import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function StatCard(props) {
    const tones = {
        default: '#0f172a',
        success: '#166534',
        warning: '#b45309',
    };
    return (_jsxs("div", { style: { background: 'white', borderRadius: '1rem', padding: '1rem', border: '1px solid #e2e8f0' }, children: [_jsx("div", { style: { fontSize: '0.85rem', color: '#64748b' }, children: props.label }), _jsx("div", { style: { marginTop: '0.4rem', fontSize: '1.5rem', fontWeight: 700, color: tones[props.tone ?? 'default'] }, children: props.value })] }));
}
