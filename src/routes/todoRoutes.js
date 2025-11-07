import express from 'express';
import controller from '../controllers/todoController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', controller.list);
router.post('/', controller.add);
router.put('/:id/complete', controller.complete);
router.delete('/:id', controller.delete);

export default router;
