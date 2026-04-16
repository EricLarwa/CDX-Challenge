import { jsx as _jsx } from "react/jsx-runtime";
import { PageHeader } from '../../components/shared/PageHeader';
export function InvoiceNewPage() {
    return (_jsx("div", { children: _jsx(PageHeader, { title: "New invoice", description: "Invoice builder placeholder with room for line items and live totals." }) }));
}
