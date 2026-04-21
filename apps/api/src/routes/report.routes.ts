import { dateRangeQuerySchema } from '@financeos/shared';
import { Router } from 'express';

import * as reportController from '../controllers/report.controller.js';
import { asyncHandler } from '../lib/async-handler.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateQuery } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/pnl', validateQuery(dateRangeQuerySchema), asyncHandler(reportController.getProfitAndLoss));
router.get('/cashflow', validateQuery(dateRangeQuerySchema), asyncHandler(reportController.getCashFlow));
router.get('/ar-aging', asyncHandler(reportController.getAccountsReceivableAging));
router.get('/monthly/:year/:month', asyncHandler(reportController.getMonthlySummary));

export default router;
