import { createPaymentSchema } from '@financeos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import type { z } from 'zod';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { PageHeader } from '../../components/shared/PageHeader';
import { useInvoiceDetail, useRecordPayment, useSendInvoice } from '../../hooks/useInvoices';

type PaymentFormValues = z.input<typeof createPaymentSchema>;

const statusTone: Record<string, { bg: string; fg: string }> = {
  DRAFT: { bg: '#e2e8f0', fg: '#334155' },
  SENT: { bg: '#fef3c7', fg: '#92400e' },
  VIEWED: { bg: '#dbeafe', fg: '#1d4ed8' },
  PARTIALLY_PAID: { bg: '#fde68a', fg: '#92400e' },
  PAID: { bg: '#dcfce7', fg: '#166534' },
  OVERDUE: { bg: '#fee2e2', fg: '#b91c1c' },
  CANCELLED: { bg: '#e5e7eb', fg: '#4b5563' },
};

export function InvoiceDetailPage() {
  const { id } = useParams();
  const invoiceQuery = useInvoiceDetail(id);
  const sendInvoice = useSendInvoice(id);
  const recordPayment = useRecordPayment(id);
  const invoice = invoiceQuery.data;
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      amount: invoice ? String(Math.max(0, Number(invoice.total) - Number(invoice.amountPaid)).toFixed(2)) : '0.00',
      paidAt: new Date().toISOString(),
      method: 'ACH',
      notes: '',
    },
  });

  const remainingBalance = invoice
    ? Math.max(0, Number(invoice.total) - Number(invoice.amountPaid)).toFixed(2)
    : '0.00';

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PageHeader
        title={invoice?.invoiceNumber ?? 'Invoice detail'}
        description={invoice ? `Issued ${new Date(invoice.issueDate).toLocaleDateString()} · Due ${new Date(invoice.dueDate).toLocaleDateString()}` : 'Timeline, payment log, and PDF actions land here.'}
        actions={
          invoice ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <ButtonLink to="/invoices" tone="secondary">
                Back to invoices
              </ButtonLink>
              <ButtonLink to="/reports/ar-aging" tone="secondary">
                AR aging
              </ButtonLink>
              <ButtonLink to={`/invoices/${invoice.id}/edit`} tone="secondary">
                Edit invoice
              </ButtonLink>
              <span
                style={{
                  padding: '0.45rem 0.7rem',
                  borderRadius: '999px',
                  background: statusTone[invoice.status]?.bg ?? '#e2e8f0',
                  color: statusTone[invoice.status]?.fg ?? '#334155',
                  fontWeight: 700,
                }}
              >
                {invoice.status}
              </span>
              <button
                type="button"
                disabled={sendInvoice.isPending || invoice.status !== 'DRAFT'}
                onClick={() => void sendInvoice.mutateAsync()}
                style={{ padding: '0.8rem 1rem', borderRadius: '0.8rem', border: '1px solid #cbd5e1', background: 'white' }}
              >
                {sendInvoice.isPending ? 'Sending...' : 'Mark sent'}
              </button>
            </div>
          ) : null
        }
      />

      {invoice ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
              <strong>Line items</strong>
              <div style={{ marginTop: '0.35rem', color: '#64748b' }}>
                Client: {invoice.clientName ?? 'Unknown client'}
              </div>
              <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.75rem' }}>
                {invoice.lineItems.map((item) => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
                    <span>{item.description}</span>
                    <span>{item.quantity}</span>
                    <span>${item.unitPrice}</span>
                    <strong style={{ textAlign: 'right' }}>${item.total}</strong>
                  </div>
                ))}
              </div>
              {invoice.notes ? (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', color: '#64748b' }}>
                  {invoice.notes}
                </div>
              ) : null}
            </div>

            <div style={{ background: '#0f172a', color: 'white', borderRadius: '1rem', padding: '1rem', display: 'grid', gap: '0.5rem' }}>
              <strong>Totals</strong>
              <div>Subtotal: ${invoice.subtotal}</div>
              <div>Tax: ${invoice.taxAmount}</div>
              <div>Total: ${invoice.total}</div>
              <div>Paid: ${invoice.amountPaid}</div>
              <div style={{ fontWeight: 700 }}>Remaining: ${remainingBalance}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem' }}>
              <strong>Payment log</strong>
              <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.75rem' }}>
                {invoice.payments.length ? (
                  invoice.payments.map((payment) => (
                    <div key={payment.id} style={{ padding: '0.9rem', borderRadius: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <strong>${payment.amount}</strong>
                        <span>{new Date(payment.paidAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ marginTop: '0.35rem', color: '#64748b' }}>{payment.method ?? 'Payment recorded'}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#64748b' }}>No payments recorded yet.</div>
                )}
              </div>
            </div>

            <form
              onSubmit={paymentForm.handleSubmit(async (values) => {
                await recordPayment.mutateAsync({
                  amount: values.amount,
                  paidAt: values.paidAt,
                  method: values.method || undefined,
                  notes: values.notes || undefined,
                });
                paymentForm.reset({
                  amount: remainingBalance,
                  paidAt: new Date().toISOString(),
                  method: 'ACH',
                  notes: '',
                });
              })}
              style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem', display: 'grid', gap: '0.75rem' }}
            >
              <strong>Record payment</strong>
              <label style={{ display: 'grid', gap: '0.35rem' }}>
                <span>Amount</span>
                <input {...paymentForm.register('amount')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
              </label>
              <label style={{ display: 'grid', gap: '0.35rem' }}>
                <span>Paid at</span>
                <input {...paymentForm.register('paidAt')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
              </label>
              <label style={{ display: 'grid', gap: '0.35rem' }}>
                <span>Method</span>
                <input {...paymentForm.register('method')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
              </label>
              <label style={{ display: 'grid', gap: '0.35rem' }}>
                <span>Notes</span>
                <textarea {...paymentForm.register('notes')} rows={3} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
              </label>
              {recordPayment.isError ? <p style={{ color: '#b91c1c', margin: 0 }}>Could not record payment.</p> : null}
              <button type="submit" style={{ padding: '0.9rem 1rem', borderRadius: '0.8rem', border: 0, background: '#4f46e5', color: 'white', fontWeight: 700 }}>
                {recordPayment.isPending ? 'Saving payment...' : 'Record payment'}
              </button>
            </form>
          </div>
        </>
      ) : null}
    </div>
  );
}
