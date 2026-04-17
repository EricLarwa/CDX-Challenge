import { analyzeExpenseSchema, categorizeExpenseSchema, createExpenseSchema, expenseQuerySchema, updateExpenseSchema } from '@financeos/shared';
import { Router } from 'express';

import * as expenseController from '../controllers/expense.controller';
import { asyncHandler } from '../lib/async-handler';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', validateQuery(expenseQuerySchema), asyncHandler(expenseController.listExpenses));
router.post('/', validateBody(createExpenseSchema), asyncHandler(expenseController.createExpense));
router.post('/categorize', validateBody(categorizeExpenseSchema), asyncHandler(expenseController.categorizeExpense));
router.post('/analyze', validateBody(analyzeExpenseSchema), asyncHandler(expenseController.analyzeExpense));
router.get('/:id', asyncHandler(expenseController.getExpense));
router.patch('/:id', validateBody(updateExpenseSchema), asyncHandler(expenseController.updateExpense));
router.delete('/:id', asyncHandler(expenseController.deleteExpense));

export default router;
