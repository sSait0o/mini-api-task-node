const express = require('express');
const router = express.Router();
const controller = require('../controllers/todoController');

router.get('/', controller.list);
router.post('/', controller.add);
router.put('/:id/complete', controller.complete);
router.delete('/:id', controller.delete);

module.exports = router;
