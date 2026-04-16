import { categorizeExpenseSchema, createExpenseSchema, expenseQuerySchema, updateExpenseSchema } from '@financeos/shared';
import { Router } from 'express';


import * as expenseController from '../controllers/expense.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', validateQuery(expenseQuerySchema), expenseController.listExpenses);
router.post('/', validateBody(createExpenseSchema), expenseController.createExpense);
router.post('/categorize', validateBody(categorizeExpenseSchema), expenseController.categorizeExpense);
router.get('/:id', expenseController.getExpense);
router.patch('/:id', validateBody(updateExpenseSchema), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;
