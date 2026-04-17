import { useNavigate, useParams } from 'react-router-dom';

import { InvoiceForm, type InvoiceFormValues } from '../../components/forms/InvoiceForm';
import { ButtonLink } from '../../components/shared/ButtonLink';
import { PageHeader } from '../../components/shared/PageHeader';
import { useInvoiceDetail, useUpdateInvoice } from '../../hooks/useInvoices';

function buildDefaultValues(invoice: {
  clientId: string;
  issueDate: string;
  dueDate: string;
  taxRate: string;
  notes: string | null;
  lineItems: Array<{ description: string; quantity: string; unitPrice: string; sortOrder: number }>;
}): InvoiceFormValues {
  return {
    clientId: invoice.clientId,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    taxRate: invoice.taxRate,
    notes: invoice.notes ?? '',
    lineItems: invoice.lineItems.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      sortOrder: item.sortOrder,
    })),
  };
}

export function InvoiceEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const invoiceQuery = useInvoiceDetail(id);
  const updateInvoice = useUpdateInvoice(id);
  const invoice = invoiceQuery.data;

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader
        title={invoice ? `Edit ${invoice.invoiceNumber}` : 'Edit invoice'}
        description="Update line items, dates, notes, and totals before the invoice is finalized."
        actions={
          id ? (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <ButtonLink to={`/invoices/${id}`} tone="secondary">
                Back to invoice
              </ButtonLink>
              <ButtonLink to="/invoices" tone="secondary">
                All invoices
              </ButtonLink>
            </div>
          ) : undefined
        }
      />
      {invoice ? (
        <InvoiceForm
          defaultValues={buildDefaultValues(invoice)}
          errorMessage={updateInvoice.isError ? 'Could not update invoice.' : undefined}
          isPending={updateInvoice.isPending}
          submitLabel="Save invoice"
          onSubmit={async (payload) => {
            const updated = await updateInvoice.mutateAsync(payload);
            navigate(`/invoices/${updated.id}`);
          }}
        />
      ) : (
        <div style={{ color: '#64748b' }}>Loading invoice details...</div>
      )}
    </div>
  );
}
