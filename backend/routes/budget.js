const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);
router.route('/')
    .get(budgetController.getBudgets)
    .post(budgetController.createBudget);
router.route('/:id')
    .put(budgetController.updateBudget)
    .delete(budgetController.deleteBudget);

module.exports = router;