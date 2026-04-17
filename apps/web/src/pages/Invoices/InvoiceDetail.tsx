import { createPaymentSchema } from '@financeos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { z } from 'zod';

import { ButtonLink } from '../../components/shared/ButtonLink';
import { EmptyState } from '../../components/shared/EmptyState';
import { FeedbackBanner } from '../../components/shared/FeedbackBanner';
import { LoadingCard } from '../../components/shared/LoadingCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useCancelInvoice, useDeleteInvoice, useInvoiceDetail, useRecordPayment, useSendInvoice } from '../../hooks/useInvoices';
import { api } from '../../lib/api';
import { getAuthHeaders } from '../../lib/auth-headers';
import { useAuthStore } from '../../stores/auth.store';

type PaymentFormValues = z.input<typeof createPaymentSchema>;

const statusTone: Record<string, 'default' | 'warning' | 'info' | 'success' | 'danger'> = {
  DRAFT: 'default',
  SENT: 'warning',
  VIEWED: 'info',
  PARTIALLY_PAID: 'warning',
  PAID: 'success',
  OVERDUE: 'danger',
  CANCELLED: 'default',
};

export function InvoiceDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);
  const invoiceQuery = useInvoiceDetail(id);
  const sendInvoice = useSendInvoice(id);
  const recordPayment = useRecordPayment(id);
  const cancelInvoice = useCancelInvoice(id);
  const deleteInvoice = useDeleteInvoice();
  const invoice = invoiceQuery.data;
  const [notice, setNotice] = useState<string | null>(
    typeof location.state === 'object' && location.state && 'notice' in location.state ? String(location.state.notice) : null,
  );
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
    <div className="grid gap-4">
      <PageHeader
        title={invoice?.invoiceNumber ?? 'Invoice detail'}
        description={
          invoice
            ? `Issued ${new Date(invoice.issueDate).toLocaleDateString()} · Due ${new Date(invoice.dueDate).toLocaleDateString()}`
            : 'Timeline, payment log, and PDF actions land here.'
        }
        actions={
          invoice ? (
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink to="/invoices" tone="secondary">
                Back to invoices
              </ButtonLink>
              <ButtonLink to="/reports/ar-aging" tone="secondary">
                AR aging
              </ButtonLink>
              <ButtonLink to={`/invoices/${invoice.id}/edit`} tone="secondary">
                Edit invoice
              </ButtonLink>
              <Button
                data-testid="cancel-invoice"
                type="button"
                variant="secondary"
                disabled={cancelInvoice.isPending || invoice.status === 'CANCELLED' || Number(invoice.amountPaid) > 0}
                onClick={() => {
                  if (window.confirm('Cancel this invoice? This is best for drafts or unsent invoices with no payments.')) {
                    void cancelInvoice.mutateAsync().then(() => setNotice('Invoice cancelled.'));
                  }
                }}
              >
                {cancelInvoice.isPending ? 'Cancelling...' : 'Cancel invoice'}
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={deleteInvoice.isPending}
                onClick={() => {
                  if (invoice && window.confirm(`Delete ${invoice.invoiceNumber}? This will remove it from active views.`)) {
                    void deleteInvoice.mutateAsync(invoice.id).then(() => navigate('/invoices', { state: { notice: 'Invoice deleted.' } }));
                  }
                }}
              >
                {deleteInvoice.isPending ? 'Deleting...' : 'Delete'}
              </Button>
              <Badge variant={statusTone[invoice.status]}>{invoice.status}</Badge>
              <Button
                data-testid="send-invoice"
                type="button"
                variant="secondary"
                disabled={sendInvoice.isPending || invoice.status !== 'DRAFT'}
                onClick={() => void sendInvoice.mutateAsync().then(() => setNotice('Invoice marked as sent.'))}
              >
                {sendInvoice.isPending ? 'Sending...' : 'Mark sent'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  const response = await fetch(`${api.defaults.baseURL}/invoices/${invoice.id}/pdf`, {
                    headers: getAuthHeaders(token),
                  });
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                Open PDF
              </Button>
            </div>
          ) : null
        }
      />
      {notice ? <FeedbackBanner tone="success" message={notice} /> : null}

      {invoiceQuery.isLoading ? <LoadingCard label="Loading invoice details..." /> : null}
      {!invoiceQuery.isLoading && !invoice ? (
        <EmptyState
          title="Invoice not found"
          description="That invoice may have been deleted or the link is out of date."
          actions={
            <>
              <ButtonLink to="/invoices">Back to invoices</ButtonLink>
              <ButtonLink to="/invoices/new" tone="secondary">
                Create invoice
              </ButtonLink>
            </>
          }
        />
      ) : null}
      {invoice ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
            <Card>
              <CardContent className="p-5">
                <strong className="text-lg text-slate-900">Line items</strong>
                <div className="mt-1 text-sm text-slate-500">Client: {invoice.clientName ?? 'Unknown client'}</div>
                <div className="mt-4 grid gap-3">
                  {invoice.lineItems.map((item) => (
                    <div key={item.id} className="grid items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
                      <span className="font-medium text-slate-900">{item.description}</span>
                      <span className="text-sm text-slate-600">{item.quantity}</span>
                      <span className="text-sm text-slate-600">${item.unitPrice}</span>
                      <strong className="text-right text-slate-900">${item.total}</strong>
                    </div>
                  ))}
                </div>
                {invoice.notes ? <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-600">{invoice.notes}</div> : null}
              </CardContent>
            </Card>

            <Card className="border-slate-900 bg-slate-950 text-white">
              <CardContent className="grid gap-2 p-5">
                <strong className="text-lg">Totals</strong>
                <div className="text-sm text-slate-300">Subtotal: ${invoice.subtotal}</div>
                <div className="text-sm text-slate-300">Tax: ${invoice.taxAmount}</div>
                <div className="text-sm text-slate-300">Total: ${invoice.total}</div>
                <div className="text-sm text-slate-300">Paid: ${invoice.amountPaid}</div>
                <div className="mt-1 text-xl font-semibold">Remaining: ${remainingBalance}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <Card>
              <CardContent className="p-5">
                <strong className="text-lg text-slate-900">Payment log</strong>
                <div className="mt-4 grid gap-3">
                  {invoice.payments.length ? (
                    invoice.payments.map((payment) => (
                      <div key={payment.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                        <div className="flex justify-between gap-4">
                          <strong className="text-slate-900">${payment.amount}</strong>
                          <span className="text-sm text-slate-500">{new Date(payment.paidAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-1 text-sm text-slate-500">{payment.method ?? 'Payment recorded'}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500">No payments recorded yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid gap-4 p-5">
                <strong className="text-lg text-slate-900">Record payment</strong>
                {invoice.status === 'CANCELLED' ? <FeedbackBanner tone="error" message="Payments are disabled for cancelled invoices." /> : null}
                <Label>
                  <span>Amount</span>
                  <Input disabled={invoice.status === 'CANCELLED'} {...paymentForm.register('amount')} />
                </Label>
                <Label>
                  <span>Paid at</span>
                  <Input disabled={invoice.status === 'CANCELLED'} {...paymentForm.register('paidAt')} />
                </Label>
                <Label>
                  <span>Method</span>
                  <Input disabled={invoice.status === 'CANCELLED'} {...paymentForm.register('method')} />
                </Label>
                <Label>
                  <span>Notes</span>
                  <Textarea disabled={invoice.status === 'CANCELLED'} {...paymentForm.register('notes')} rows={3} />
                </Label>
                {recordPayment.isError ? <FeedbackBanner tone="error" message="Could not record payment." /> : null}
                {cancelInvoice.isError ? <FeedbackBanner tone="error" message="Could not cancel invoice." /> : null}
                {deleteInvoice.isError ? <FeedbackBanner tone="error" message="Could not delete invoice." /> : null}
                <Button
                  data-testid="record-payment-submit"
                  disabled={invoice.status === 'CANCELLED'}
                  type="button"
                  onClick={paymentForm.handleSubmit(async (values) => {
                    await recordPayment.mutateAsync({
                      amount: values.amount,
                      paidAt: values.paidAt,
                      method: values.method || undefined,
                      notes: values.notes || undefined,
                    });
                    setNotice('Payment recorded successfully.');
                    paymentForm.reset({
                      amount: remainingBalance,
                      paidAt: new Date().toISOString(),
                      method: 'ACH',
                      notes: '',
                    });
                  })}
                >
                  {recordPayment.isPending ? 'Saving payment...' : 'Record payment'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
