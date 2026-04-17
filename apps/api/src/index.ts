import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import { startJobs } from './jobs';
import { checkDatabaseConnection } from './lib/prisma';
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import routes from './routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 250 }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.get('/api/v1/ready', async (_req, res, next) => {
  try {
    await checkDatabaseConnection();
    res.json({ success: true, data: { status: 'ready' } });
  } catch (error) {
    next(error);
  }
});

app.use('/api/v1', routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

if (!process.env.VERCEL) {
  app.listen(port, () => {
    startJobs();
    console.log(`FinanceOS API listening on http://localhost:${port}`);
  });
}

export default app;
