import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import type { ApiResponse } from '@financeos/shared';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/v1/health', (_req, res) => {
  const response: ApiResponse<{ status: string }> = {
    success: true,
    data: { status: 'ok' },
  };

  res.json(response);
});

app.listen(port, () => {
  console.log(`FinanceOS API listening on http://localhost:${port}`);
});
