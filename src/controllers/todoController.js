import Todo from '../models/todoModel.js';
import * as pgConf from '../config/pg.js';
import TodoPgModel from '../models/todoPgModel.js';

const todoModel = new Todo();
let todoPg = null;
function getTodoPg() {
  try {
    const client = (pgConf && typeof pgConf.client === 'function') ? pgConf.client() : null;
    if (client) {
      if (!todoPg) todoPg = new TodoPgModel(client);
      return todoPg;
    }
  } catch (e) {}
  return null;
}

class TodoController {
  static async list(req, res) {
    try {
      const _pg = getTodoPg();
      const userId = req.user && req.user.userId;
      if (!_pg) return res.json(todoModel.getAll());
      if (!userId) return res.status(401).json({ error: 'Utilisateur non authentifié' });
      const rows = await _pg.getAll(userId);
      return res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  static async add(req, res) {
    try {
      const title = req.body.title || req.body.titre;
      if (!title) return res.status(400).json({ error: 'Le titre est requis' });
      const _pg = getTodoPg();
      const userId = req.user && req.user.userId;
      if (!_pg) {
        const newTask = todoModel.addTask(title);
        return res.status(201).json(newTask);
      }
      if (!userId) return res.status(401).json({ error: 'Utilisateur non authentifié' });
      const r = await _pg.addTask(title, userId);
      return res.status(201).json(r);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  static async complete(req, res) {
    try {
      const idParam = req.params.id;
      const _pg = getTodoPg();
      const userId = req.user && req.user.userId;
      if (!_pg) {
        const id = parseInt(idParam, 10);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
        const ok = todoModel.completeTask(id);
        if (!ok) return res.status(404).json({ error: 'Tâche introuvable' });
        return res.json({ message: 'Tâche marquée comme terminée' });
      }
      if (!userId) return res.status(401).json({ error: 'Utilisateur non authentifié' });
      const ok = await _pg.completeTask(idParam, userId);
      if (!ok) return res.status(404).json({ error: 'Tâche introuvable' });
      return res.json({ message: 'Tâche marquée comme terminée' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  static async delete(req, res) {
    try {
      const idParam = req.params.id;
      const _pg = getTodoPg();
      const userId = req.user && req.user.userId;
      if (!_pg) {
        const id = parseInt(idParam, 10);
        const deleted = todoModel.deleteTask(id);
        if (!deleted) return res.status(404).json({ error: 'Tâche introuvable' });
        return res.json({ message: 'Tâche supprimée avec succès' });
      }
      if (!userId) return res.status(401).json({ error: 'Utilisateur non authentifié' });
      const ok = await _pg.deleteTask(idParam, userId);
      if (!ok) return res.status(404).json({ error: 'Tâche introuvable' });
      return res.json({ message: 'Tâche supprimée avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

export default TodoController;
