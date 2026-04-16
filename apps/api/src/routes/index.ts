import { Router } from 'express';

import authRoutes from './auth.routes';
import clientRoutes from './client.routes';
import dashboardRoutes from './dashboard.routes';
import expenseRoutes from './expense.routes';
import invoiceRoutes from './invoice.routes';
import reportRoutes from './report.routes';
import vendorRoutes from './vendor.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/expenses', expenseRoutes);
router.use('/clients', clientRoutes);
router.use('/vendors', vendorRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

export default router;
