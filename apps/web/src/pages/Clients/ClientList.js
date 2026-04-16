import { jsx as _jsx } from "react/jsx-runtime";
import { PageHeader } from '../../components/shared/PageHeader';
export function ClientListPage() {
    return (_jsx("div", { children: _jsx(PageHeader, { title: "Clients", description: "Client list and balance summaries live here." }) }));
}
