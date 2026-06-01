const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);
router.route('/')
    .get(entryController.getEntries)
    .post(entryController.createEntry);
router.route('/:id')
    .get(entryController.getEntryById)
    .put(entryController.updateEntry)
    .delete(entryController.deleteEntry);

module.exports = router;