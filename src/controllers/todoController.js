const Todo = require('../models/todoModel');

const todoModel = new Todo();

class TodoController {
  static list(req, res) {
    res.json(todoModel.getAll());
  }

  static add(req, res) {
 
    const title = req.body.title || req.body.titre;
    if (!title) return res.status(400).json({ error: 'Le titre est requis' });
    const newTask = todoModel.addTask(title);
    res.status(201).json(newTask);
  }

  static complete(req, res) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const ok = todoModel.completeTask(id);
    if (!ok) return res.status(404).json({ error: 'Tâche introuvable' });
    res.json({ message: 'Tâche marquée comme terminée' });
  }

  static delete(req, res) {
    const id = parseInt(req.params.id, 10);
    const deleted = todoModel.deleteTask(id);
    if (!deleted) return res.status(404).json({ error: 'Tâche introuvable' });
    res.json({ message: 'Tâche supprimée avec succès' });
  }
}

module.exports = TodoController;
