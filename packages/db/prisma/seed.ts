import { PrismaClient, ExpenseCategory, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

const decimal = (value: number) => new Decimal(value).toDecimalPlaces(2);
const demoEmail = 'demo@financeos.app';
const demoPassword = 'demo12345';

const makeLineItem = (description: string, quantity: number, unitPrice: number, sortOrder: number) => {
  const qty = decimal(quantity);
  const price = decimal(unitPrice);
  return {
    description,
    quantity: qty,
    unitPrice: price,
    total: qty.mul(price),
    sortOrder,
  };
};

async function main() {
  const existingDemoUser = await prisma.user.findUnique({
    where: { email: demoEmail },
    select: { id: true },
  });

  if (existingDemoUser) {
    const demoInvoices = await prisma.invoice.findMany({
      where: { userId: existingDemoUser.id },
      select: { id: true },
    });
    const demoInvoiceIds = demoInvoices.map((invoice) => invoice.id);

    await prisma.payment.deleteMany({ where: { invoiceId: { in: demoInvoiceIds } } });
    await prisma.lineItem.deleteMany({ where: { invoiceId: { in: demoInvoiceIds } } });
    await prisma.invoice.deleteMany({ where: { userId: existingDemoUser.id } });
    await prisma.expense.deleteMany({ where: { userId: existingDemoUser.id } });
    await prisma.client.deleteMany({ where: { userId: existingDemoUser.id } });
    await prisma.vendor.deleteMany({ where: { userId: existingDemoUser.id } });
  }

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      passwordHash,
      businessName: 'Northstar Studio',
      currency: 'USD',
      deletedAt: null,
    },
    create: {
      email: demoEmail,
      passwordHash,
      businessName: 'Northstar Studio',
      currency: 'USD',
    },
  });

  const clients = await Promise.all([
    prisma.client.create({
      data: {
        userId: user.id,
        name: 'Atlas Creative',
        email: 'finance@atlascreative.co',
        paymentTerms: 15,
        notes: 'Prefers ACH payments.',
      },
    }),
    prisma.client.create({
      data: {
        userId: user.id,
        name: 'Pine & Peak Builders',
        email: 'ops@pinepeakbuild.com',
        paymentTerms: 30,
      },
    }),
    prisma.client.create({
      data: {
        userId: user.id,
        name: 'Riverlane Health',
        email: 'accounting@riverlane.health',
        paymentTerms: 45,
      },
    }),
  ]);

  const vendors = await Promise.all([
    prisma.vendor.create({ data: { userId: user.id, name: 'Linear', category: 'Software', email: 'billing@linear.app' } }),
    prisma.vendor.create({ data: { userId: user.id, name: 'Delta Airlines', category: 'Travel' } }),
    prisma.vendor.create({ data: { userId: user.id, name: 'Figma', category: 'Software', email: 'accounts@figma.com' } }),
    prisma.vendor.create({ data: { userId: user.id, name: 'WeWork', category: 'Utilities' } }),
    prisma.vendor.create({ data: { userId: user.id, name: 'BrightTax CPAs', category: 'Taxes' } }),
  ]);

  const invoiceBlueprints = [
    {
      client: clients[0],
      invoiceNumber: 'INV-2026-0001',
      status: InvoiceStatus.PAID,
      issueDate: new Date('2026-01-03T00:00:00.000Z'),
      dueDate: new Date('2026-01-18T00:00:00.000Z'),
      taxRate: decimal(8.25),
      notes: 'Brand strategy retainer.',
      lineItems: [
        makeLineItem('Brand strategy workshop', 1, 1800, 0),
        makeLineItem('Messaging framework', 1, 1200, 1),
      ],
      payments: [{ amount: decimal(3247.5), paidAt: new Date('2026-01-12T00:00:00.000Z'), method: 'ACH' }],
    },
    {
      client: clients[1],
      invoiceNumber: 'INV-2026-0002',
      status: InvoiceStatus.SENT,
      issueDate: new Date('2026-01-15T00:00:00.000Z'),
      dueDate: new Date('2026-02-14T00:00:00.000Z'),
      taxRate: decimal(0),
      notes: 'Website sprint 1.',
      lineItems: [makeLineItem('Design system implementation', 12, 150, 0)],
      payments: [],
    },
    {
      client: clients[2],
      invoiceNumber: 'INV-2026-0003',
      status: InvoiceStatus.OVERDUE,
      issueDate: new Date('2026-02-01T00:00:00.000Z'),
      dueDate: new Date('2026-02-16T00:00:00.000Z'),
      taxRate: decimal(0),
      notes: 'Analytics dashboard milestone.',
      lineItems: [makeLineItem('Dashboard delivery', 1, 4200, 0)],
      payments: [],
    },
    {
      client: clients[0],
      invoiceNumber: 'INV-2026-0004',
      status: InvoiceStatus.PARTIALLY_PAID,
      issueDate: new Date('2026-02-10T00:00:00.000Z'),
      dueDate: new Date('2026-02-25T00:00:00.000Z'),
      taxRate: decimal(8.25),
      notes: 'Quarterly advisory retainer.',
      lineItems: [makeLineItem('Advisory retainer', 1, 2500, 0)],
      payments: [{ amount: decimal(1000), paidAt: new Date('2026-02-20T00:00:00.000Z'), method: 'Card' }],
    },
    {
      client: clients[1],
      invoiceNumber: 'INV-2026-0005',
      status: InvoiceStatus.VIEWED,
      issueDate: new Date('2026-03-05T00:00:00.000Z'),
      dueDate: new Date('2026-04-04T00:00:00.000Z'),
      taxRate: decimal(0),
      notes: 'Mobile UX revisions.',
      lineItems: [makeLineItem('UX revision sprint', 8, 175, 0)],
      payments: [],
    },
    {
      client: clients[2],
      invoiceNumber: 'INV-2026-0006',
      status: InvoiceStatus.DRAFT,
      issueDate: new Date('2026-03-14T00:00:00.000Z'),
      dueDate: new Date('2026-04-13T00:00:00.000Z'),
      taxRate: decimal(0),
      notes: 'Pending client approval.',
      lineItems: [makeLineItem('Discovery interviews', 5, 220, 0)],
      payments: [],
    },
    {
      client: clients[0],
      invoiceNumber: 'INV-2026-0007',
      status: InvoiceStatus.PAID,
      issueDate: new Date('2026-03-20T00:00:00.000Z'),
      dueDate: new Date('2026-04-04T00:00:00.000Z'),
      taxRate: decimal(8.25),
      notes: 'Campaign planning.',
      lineItems: [makeLineItem('Campaign planning', 1, 1600, 0)],
      payments: [{ amount: decimal(1732), paidAt: new Date('2026-03-28T00:00:00.000Z'), method: 'ACH' }],
    },
    {
      client: clients[1],
      invoiceNumber: 'INV-2026-0008',
      status: InvoiceStatus.CANCELLED,
      issueDate: new Date('2026-03-29T00:00:00.000Z'),
      dueDate: new Date('2026-04-28T00:00:00.000Z'),
      taxRate: decimal(0),
      notes: 'Scope cancelled before kickoff.',
      lineItems: [makeLineItem('Prototype sprint', 1, 950, 0)],
      payments: [],
    },
    {
      client: clients[2],
      invoiceNumber: 'INV-2026-0009',
      status: InvoiceStatus.SENT,
      issueDate: new Date('2026-04-01T00:00:00.000Z'),
      dueDate: new Date('2026-05-01T00:00:00.000Z'),
      taxRate: decimal(0),
      notes: 'Research synthesis package.',
      lineItems: [
        makeLineItem('Stakeholder interviews', 4, 300, 0),
        makeLineItem('Research summary', 1, 900, 1),
      ],
      payments: [],
    },
    {
      client: clients[0],
      invoiceNumber: 'INV-2026-0010',
      status: InvoiceStatus.DRAFT,
      issueDate: new Date('2026-04-10T00:00:00.000Z'),
      dueDate: new Date('2026-04-25T00:00:00.000Z'),
      taxRate: decimal(8.25),
      notes: 'April strategy retainer.',
      lineItems: [makeLineItem('Monthly strategy retainer', 1, 2500, 0)],
      payments: [],
    },
  ];

  for (const blueprint of invoiceBlueprints) {
    const subtotal = blueprint.lineItems.reduce((sum, item) => sum.plus(item.total), decimal(0));
    const taxAmount = subtotal.mul(blueprint.taxRate).div(100).toDecimalPlaces(2);
    const total = subtotal.plus(taxAmount);
    const amountPaid = blueprint.payments.reduce((sum, payment) => sum.plus(payment.amount), decimal(0));

    await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: blueprint.client.id,
        invoiceNumber: blueprint.invoiceNumber,
        status: blueprint.status,
        issueDate: blueprint.issueDate,
        dueDate: blueprint.dueDate,
        subtotal,
        taxRate: blueprint.taxRate,
        taxAmount,
        total,
        amountPaid,
        notes: blueprint.notes,
        lineItems: {
          create: blueprint.lineItems,
        },
        payments: {
          create: blueprint.payments,
        },
      },
    });
  }

  const expenses = [
    ['2026-01-04', 39, ExpenseCategory.SOFTWARE, 'Linear workspace subscription', vendors[0].id, true],
    ['2026-01-08', 124, ExpenseCategory.TRAVEL, 'Client site visit flight', vendors[1].id, false],
    ['2026-01-11', 89, ExpenseCategory.SOFTWARE, 'Figma professional plan', vendors[2].id, true],
    ['2026-01-19', 420, ExpenseCategory.UTILITIES, 'Coworking membership', vendors[3].id, true],
    ['2026-01-24', 650, ExpenseCategory.TAXES, 'Quarterly tax planning', vendors[4].id, false],
    ['2026-02-03', 39, ExpenseCategory.SOFTWARE, 'Linear workspace subscription', vendors[0].id, true],
    ['2026-02-07', 58, ExpenseCategory.MEALS, 'Client lunch', null, false],
    ['2026-02-11', 420, ExpenseCategory.UTILITIES, 'Coworking membership', vendors[3].id, true],
    ['2026-02-13', 250, ExpenseCategory.MARKETING, 'Portfolio ad campaign', null, false],
    ['2026-02-18', 89, ExpenseCategory.SOFTWARE, 'Figma professional plan', vendors[2].id, true],
    ['2026-02-22', 1800, ExpenseCategory.CONTRACTORS, 'Copywriter support', null, false],
    ['2026-03-01', 39, ExpenseCategory.SOFTWARE, 'Linear workspace subscription', vendors[0].id, true],
    ['2026-03-06', 420, ExpenseCategory.UTILITIES, 'Coworking membership', vendors[3].id, true],
    ['2026-03-10', 89, ExpenseCategory.SOFTWARE, 'Figma professional plan', vendors[2].id, true],
    ['2026-03-14', 320, ExpenseCategory.EQUIPMENT, 'Portable monitor', null, false],
    ['2026-03-18', 124, ExpenseCategory.TRAVEL, 'Train to client workshop', null, false],
    ['2026-03-21', 95, ExpenseCategory.MEALS, 'Team dinner', null, false],
    ['2026-03-29', 39, ExpenseCategory.SOFTWARE, 'Linear workspace subscription', vendors[0].id, true],
    ['2026-04-02', 420, ExpenseCategory.UTILITIES, 'Coworking membership', vendors[3].id, true],
    ['2026-04-04', 89, ExpenseCategory.SOFTWARE, 'Figma professional plan', vendors[2].id, true],
    ['2026-04-05', 240, ExpenseCategory.INSURANCE, 'Business liability premium', null, true],
    ['2026-04-07', 510, ExpenseCategory.MARKETING, 'Conference sponsorship booth', null, false],
    ['2026-04-08', 650, ExpenseCategory.TAXES, 'Tax filing support', vendors[4].id, false],
    ['2026-04-11', 124, ExpenseCategory.TRAVEL, 'Return flight for workshop', vendors[1].id, false],
    ['2026-04-13', 39, ExpenseCategory.SOFTWARE, 'Linear workspace subscription', vendors[0].id, true],
  ] as const;

  for (const [date, amount, category, description, vendorId, recurring] of expenses) {
    await prisma.expense.create({
      data: {
        userId: user.id,
        vendorId: vendorId ?? undefined,
        amount: decimal(amount),
        category,
        description,
        date: new Date(`${date}T00:00:00.000Z`),
        isRecurring: recurring,
        aiCategorized: category === ExpenseCategory.MEALS || category === ExpenseCategory.MARKETING,
      },
    });
  }

  console.log(`Seed complete for ${demoEmail} / ${demoPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
