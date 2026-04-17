import { useNavigate } from 'react-router-dom';

import { InvoiceForm, type InvoiceFormValues } from '../../components/forms/InvoiceForm';
import { PageHeader } from '../../components/shared/PageHeader';
import { useCreateInvoice } from '../../hooks/useInvoices';

const defaultValues: InvoiceFormValues = {
  clientId: '',
  issueDate: '2026-04-16T00:00:00.000Z',
  dueDate: '2026-04-30T00:00:00.000Z',
  taxRate: '0',
  notes: '',
  lineItems: [{ description: '', quantity: '1', unitPrice: '0', sortOrder: 0 }],
};

export function InvoiceNewPage() {
  const navigate = useNavigate();
  const createInvoice = useCreateInvoice();

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
          navigate(`/invoices/${invoice.id}`);
        }}
      />
    </div>
  );
}
