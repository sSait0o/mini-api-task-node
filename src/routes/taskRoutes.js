const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');

// List tasks
router.get('/', (req, res) => {
  res.json(controller.lister());
});

// Add task
router.post('/', (req, res) => {
  const { titre } = req.body;
  if (!titre) {
    return res.status(400).json({ error: 'titre is required' });
  }
  const t = controller.ajouter(titre);
  res.status(201).json(t);
});

// Complete task
router.put('/:id/complete', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const ok = controller.terminer(id);
  if (ok) return res.json({ success: true });
  return res.status(404).json({ error: 'Task not found' });
});

// Delete task
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const ok = controller.supprimer(id);
  if (ok) return res.json({ success: true });
  return res.status(404).json({ error: 'Task not found' });
});

module.exports = router;