import { jsx as _jsx } from "react/jsx-runtime";
import { PageHeader } from '../../components/shared/PageHeader';
export function SettingsPage() {
    return (_jsx("div", { children: _jsx(PageHeader, { title: "Settings", description: "Business defaults, currency, and invoice defaults will live here." }) }));
}
