import { Router } from 'express';

import authRoutes from './auth.routes.js';
import clientRoutes from './client.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import expenseRoutes from './expense.routes.js';
import invoiceRoutes from './invoice.routes.js';
import reportRoutes from './report.routes.js';
import vendorRoutes from './vendor.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/expenses', expenseRoutes);
router.use('/clients', clientRoutes);
router.use('/vendors', vendorRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

export default router;
