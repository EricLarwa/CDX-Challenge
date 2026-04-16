import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function PageHeader(props) {
    return (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }, children: [_jsxs("div", { children: [props.eyebrow ? (_jsx("div", { style: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6366f1' }, children: props.eyebrow })) : null, _jsx("h2", { style: { margin: '0.3rem 0', fontSize: '2rem', color: '#0f172a' }, children: props.title }), props.description ? _jsx("p", { style: { margin: 0, color: '#475569' }, children: props.description }) : null] }), props.actions ? _jsx("div", { children: props.actions }) : null] }));
}
