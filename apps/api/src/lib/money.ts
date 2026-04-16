import { Prisma } from '@prisma/client';

export const decimal = (value: string | number | Prisma.Decimal) => new Prisma.Decimal(value);

export const sumDecimals = (values: Prisma.Decimal[]) =>
  values.reduce((acc, value) => acc.plus(value), new Prisma.Decimal(0));
