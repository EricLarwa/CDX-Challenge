import type { CreateInvoiceInput } from '@financeos/shared';
import { createInvoiceSchema } from '@financeos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useClients } from '../../hooks/useClients';
import { toIsoDateString } from '../../lib/dates';
import { ButtonLink } from '../shared/ButtonLink';
import { FeedbackBanner } from '../shared/FeedbackBanner';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';

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
          issueDate: toIsoDateString(values.issueDate),
          dueDate: toIsoDateString(values.dueDate),
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
      className="grid gap-4"
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <Label>
          <span>Client</span>
          <Select data-testid="invoice-client" {...form.register('clientId')}>
            <option value="">Select client</option>
            {(clientsQuery.data ?? []).map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            <ButtonLink to="/clients/new" tone="secondary">
              Add client
            </ButtonLink>
            {(clientsQuery.data ?? []).length === 0 && !clientsQuery.isLoading ? (
              <span className="text-slate-500">No clients yet. Add one first so this invoice has somewhere to go.</span>
            ) : null}
          </div>
        </Label>
        <Label>
          <span>Issue date</span>
          <Input type="date" {...form.register('issueDate')} />
        </Label>
        <Label>
          <span>Due date</span>
          <Input type="date" {...form.register('dueDate')} />
        </Label>
        <Label>
          <span>Tax rate</span>
          <Input {...form.register('taxRate')} />
        </Label>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-5">
          <div className="flex items-center justify-between gap-4">
            <strong className="text-lg text-slate-900">Line items</strong>
            <Button
            type="button"
            variant="secondary"
            data-testid="invoice-add-line-item"
            onClick={() =>
              lineItems.append({
                description: '',
                quantity: '1',
                unitPrice: '0',
                sortOrder: lineItems.fields.length,
              })
            }
          >
            Add line item
            </Button>
          </div>
        {lineItems.fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 lg:grid-cols-[2fr_1fr_1fr_auto]">
            <Input data-testid={`invoice-line-description-${index}`} placeholder="Description" {...form.register(`lineItems.${index}.description`)} />
            <Input data-testid={`invoice-line-quantity-${index}`} placeholder="Qty" {...form.register(`lineItems.${index}.quantity`)} />
            <Input data-testid={`invoice-line-unit-price-${index}`} placeholder="Unit price" {...form.register(`lineItems.${index}.unitPrice`)} />
            <Button
              type="button"
              variant="destructive"
              onClick={() => lineItems.remove(index)}
              disabled={lineItems.fields.length === 1}
            >
              Remove
            </Button>
          </div>
        ))}
        </CardContent>
      </Card>

      <Label>
        <span>Notes</span>
        <Textarea {...form.register('notes')} rows={4} />
      </Label>

      <Card className="border-slate-900 bg-slate-950 text-white">
        <CardContent className="grid gap-2 p-5">
          <div className="text-sm text-slate-300">Subtotal: ${subtotal.toFixed(2)}</div>
          <div className="text-sm text-slate-300">Tax: ${(subtotal * (taxRate / 100)).toFixed(2)}</div>
          <div className="mt-1 text-xl font-semibold">Total: ${total.toFixed(2)}</div>
        </CardContent>
      </Card>

      {form.formState.errors.clientId ? <FeedbackBanner tone="error" message={String(form.formState.errors.clientId.message)} /> : null}
      {props.errorMessage ? <FeedbackBanner tone="error" message={props.errorMessage} /> : null}

      <Button data-testid="invoice-submit" type="submit">
        {props.isPending ? `${props.submitLabel}...` : props.submitLabel}
      </Button>
    </form>
  );
}
