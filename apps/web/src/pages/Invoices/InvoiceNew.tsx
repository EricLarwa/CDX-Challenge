import { useNavigate } from 'react-router-dom';

import { InvoiceForm, type InvoiceFormValues } from '../../components/forms/InvoiceForm';
import { PageHeader } from '../../components/shared/PageHeader';
import { useCreateInvoice } from '../../hooks/useInvoices';
import { useAuthStore } from '../../stores/auth.store';

export function InvoiceNewPage() {
  const navigate = useNavigate();
  const createInvoice = useCreateInvoice();
  const preferences = useAuthStore((state) => state.preferences);
  const today = new Date('2026-04-16T00:00:00.000Z');
  const dueDate = new Date(today);
  dueDate.setUTCDate(today.getUTCDate() + preferences.defaultPaymentTerms);

  const defaultValues: InvoiceFormValues = {
    clientId: '',
    issueDate: today.toISOString(),
    dueDate: dueDate.toISOString(),
    taxRate: preferences.defaultTaxRate,
    notes: '',
    lineItems: [{ description: '', quantity: '1', unitPrice: '0', sortOrder: 0 }],
  };

  return (
    <div>
      <PageHeader title="New invoice" description="Create an invoice with line items, due dates, notes, and live totals." />
      <InvoiceForm
        defaultValues={defaultValues}
        errorMessage={createInvoice.isError ? 'Could not create invoice.' : undefined}
        isPending={createInvoice.isPending}
        submitLabel="Create invoice"
        onSubmit={async (payload) => {
          const invoice = await createInvoice.mutateAsync(payload);
          navigate(`/invoices/${invoice.id}`, { state: { notice: 'Invoice created. Review it, then send it when you are ready.' } });
        }}
      />
    </div>
  );
}
