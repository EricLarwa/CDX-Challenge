import { Router } from 'express';

import { dateRangeQuerySchema } from '@financeos/shared';

import * as reportController from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validate.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/pnl', validateQuery(dateRangeQuerySchema), reportController.getProfitAndLoss);
router.get('/cashflow', validateQuery(dateRangeQuerySchema), reportController.getCashFlow);
router.get('/ar-aging', reportController.getAccountsReceivableAging);
router.get('/monthly/:year/:month', reportController.getMonthlySummary);

export default router;
