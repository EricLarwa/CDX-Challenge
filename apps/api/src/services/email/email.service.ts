import { Resend } from 'resend';

import { env } from '../../lib/env';

import { invoiceDeliveryTemplate, paymentReceivedTemplate, paymentReminderTemplate } from './templates';

let resendClient: Resend | null = null;

const getResendClient = () => {
  if (!env.resendApiKey) {
    return null;
  }

  resendClient ??= new Resend(env.resendApiKey);
  return resendClient;
};

const sendEmail = async (input: { to: string; subject: string; html: string }) => {
  const client = getResendClient();

  if (!client) {
    console.warn(`Email skipped for ${input.to}: Resend not configured.`);
    return { delivered: false as const };
  }

  try {
    await client.emails.send({
      from: env.emailFrom,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    return { delivered: true as const };
  } catch (error) {
    console.error('Email delivery failed.', error);
    return { delivered: false as const };
  }
};

export const sendInvoiceDeliveryEmail = async (input: {
  to: string;
  businessName: string;
  clientName: string;
  invoiceNumber: string;
  total: string;
}) => sendEmail({ to: input.to, ...invoiceDeliveryTemplate(input) });

export const sendPaymentReminderEmail = async (input: {
  to: string;
  clientName: string;
  invoiceNumber: string;
  dueDate: string;
  remaining: string;
}) => sendEmail({ to: input.to, ...paymentReminderTemplate(input) });

export const sendPaymentReceivedEmail = async (input: {
  to: string;
  clientName: string;
  invoiceNumber: string;
  amount: string;
}) => sendEmail({ to: input.to, ...paymentReceivedTemplate(input) });
