import type { CreateInvoiceInput } from '@financeos/shared';
import { createInvoiceSchema } from '@financeos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useClients } from '../../hooks/useClients';

export type InvoiceFormValues = z.input<typeof createInvoiceSchema>;

type InvoiceFormProps = {
  defaultValues: InvoiceFormValues;
  errorMessage?: string;
  isPending: boolean;
  submitLabel: string;
  onSubmit: (payload: CreateInvoiceInput) => Promise<void>;
};

export function InvoiceForm(props: InvoiceFormProps) {
  const clientsQuery = useClients();
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: props.defaultValues,
  });
  const lineItems = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const watchedLineItems = form.watch('lineItems');
  const taxRate = Number(form.watch('taxRate') || 0);
  const subtotal = watchedLineItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0,
  );
  const total = subtotal + subtotal * (taxRate / 100);

  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        await props.onSubmit({
          clientId: values.clientId,
          issueDate: values.issueDate,
          dueDate: values.dueDate,
          taxRate: values.taxRate ?? '0',
          notes: values.notes || undefined,
          lineItems: values.lineItems.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            sortOrder: item.sortOrder ?? index,
          })),
        });
      })}
      data-testid="invoice-form"
      style={{ display: 'grid', gap: '1rem' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span>Client</span>
          <select data-testid="invoice-client" {...form.register('clientId')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}>
            <option value="">Select client</option>
            {(clientsQuery.data ?? []).map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span>Issue date</span>
          <input {...form.register('issueDate')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span>Due date</span>
          <input {...form.register('dueDate')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
        </label>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span>Tax rate</span>
          <input {...form.register('taxRate')} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
        </label>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1rem', display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>Line items</strong>
          <button
            type="button"
            data-testid="invoice-add-line-item"
            onClick={() =>
              lineItems.append({
                description: '',
                quantity: '1',
                unitPrice: '0',
                sortOrder: lineItems.fields.length,
              })
            }
            style={{ padding: '0.65rem 0.9rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', background: 'white' }}
          >
            Add line item
          </button>
        </div>
        {lineItems.fields.map((field, index) => (
          <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem' }}>
            <input data-testid={`invoice-line-description-${index}`} placeholder="Description" {...form.register(`lineItems.${index}.description`)} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
            <input data-testid={`invoice-line-quantity-${index}`} placeholder="Qty" {...form.register(`lineItems.${index}.quantity`)} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
            <input data-testid={`invoice-line-unit-price-${index}`} placeholder="Unit price" {...form.register(`lineItems.${index}.unitPrice`)} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
            <button
              type="button"
              onClick={() => lineItems.remove(index)}
              disabled={lineItems.fields.length === 1}
              style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #fecaca', background: '#fff1f2', color: '#b91c1c' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <label style={{ display: 'grid', gap: '0.35rem' }}>
        <span>Notes</span>
        <textarea {...form.register('notes')} rows={4} style={{ padding: '0.8rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
      </label>

      <div style={{ background: '#0f172a', color: 'white', borderRadius: '1rem', padding: '1rem' }}>
        <div>Subtotal: ${subtotal.toFixed(2)}</div>
        <div>Tax: ${(subtotal * (taxRate / 100)).toFixed(2)}</div>
        <div style={{ marginTop: '0.35rem', fontSize: '1.1rem', fontWeight: 700 }}>Total: ${total.toFixed(2)}</div>
      </div>

      {form.formState.errors.clientId ? <p style={{ color: '#b91c1c', margin: 0 }}>{form.formState.errors.clientId.message}</p> : null}
      {props.errorMessage ? <p style={{ color: '#b91c1c', margin: 0 }}>{props.errorMessage}</p> : null}

      <button data-testid="invoice-submit" type="submit" style={{ padding: '0.95rem 1rem', borderRadius: '0.85rem', border: 0, background: '#4f46e5', color: 'white', fontWeight: 700 }}>
        {props.isPending ? `${props.submitLabel}...` : props.submitLabel}
      </button>
    </form>
  );
}
