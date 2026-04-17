import { dateRangeQuerySchema } from '@financeos/shared';
import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import * as reportController from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validate.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/pnl', validateQuery(dateRangeQuerySchema), asyncHandler(reportController.getProfitAndLoss));
router.get('/cashflow', validateQuery(dateRangeQuerySchema), asyncHandler(reportController.getCashFlow));
router.get('/ar-aging', asyncHandler(reportController.getAccountsReceivableAging));
router.get('/monthly/:year/:month', asyncHandler(reportController.getMonthlySummary));

export default router;
