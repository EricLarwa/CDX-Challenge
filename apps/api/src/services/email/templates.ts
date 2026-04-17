export const invoiceDeliveryTemplate = (input: {
  businessName: string;
  clientName: string;
  invoiceNumber: string;
  total: string;
}) => ({
  subject: `Invoice ${input.invoiceNumber} from ${input.businessName}`,
  html: `<p>Hi ${input.clientName},</p><p>Your invoice <strong>${input.invoiceNumber}</strong> for <strong>$${input.total}</strong> is ready.</p>`,
});

export const paymentReminderTemplate = (input: {
  clientName: string;
  invoiceNumber: string;
  dueDate: string;
  remaining: string;
}) => ({
  subject: `Reminder: ${input.invoiceNumber} is due soon`,
  html: `<p>Hi ${input.clientName},</p><p>This is a reminder that invoice <strong>${input.invoiceNumber}</strong> has <strong>$${input.remaining}</strong> outstanding and is due on ${input.dueDate}.</p>`,
});

export const paymentReceivedTemplate = (input: {
  clientName: string;
  invoiceNumber: string;
  amount: string;
}) => ({
  subject: `Payment received for ${input.invoiceNumber}`,
  html: `<p>Hi ${input.clientName},</p><p>We received your payment of <strong>$${input.amount}</strong> for invoice <strong>${input.invoiceNumber}</strong>.</p>`,
});
