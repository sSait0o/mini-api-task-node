const Todo = require('../models/todoModel');
const TodoSchema = require('../models/todoSchema');
const db = require('../config/db');
const pgConf = require('../config/pg');
const TodoPgModel = require('../models/todoPgModel');

const todoModel = new Todo();
let todoPg = null;
function getTodoPg() {
  try {
    const client = (pgConf && typeof pgConf.client === 'function') ? pgConf.client() : null;
    if (client) {
      if (!todoPg) todoPg = new TodoPgModel(client);
      return todoPg;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

class TodoController {
  static async list(req, res) {
    try {
      // prefer Postgres if available
      const _pg = getTodoPg();
      if (_pg) {
        const rows = await _pg.getAll();
        return res.json(rows);
      }
      if (db.mongoose && db.mongoose.connection && db.mongoose.connection.readyState === 1) {
        const docs = await TodoSchema.find().sort({ createdAt: 1 }).lean();
        return res.json(docs.map(d => ({ id: d._id, titre: d.titre, fait: d.fait })));
      }
      return res.json(todoModel.getAll());
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  static async add(req, res) {
    try {
      const title = req.body.title || req.body.titre;
      if (!title) return res.status(400).json({ error: 'Le titre est requis' });
      const _pg2 = getTodoPg();
      if (_pg2) {
        const r = await _pg2.addTask(title);
        return res.status(201).json(r);
      }
      if (db.mongoose && db.mongoose.connection && db.mongoose.connection.readyState === 1) {
        const doc = await TodoSchema.create({ titre: title });
        return res.status(201).json({ id: doc._id, titre: doc.titre, fait: doc.fait });
      }
      const newTask = todoModel.addTask(title);
      res.status(201).json(newTask);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  static async complete(req, res) {
    try {
      const idParam = req.params.id;
      const _pg3 = getTodoPg();
      if (_pg3) {
        const ok = await _pg3.completeTask(idParam);
        if (!ok) return res.status(404).json({ error: 'Tâche introuvable' });
        return res.json({ message: 'Tâche marquée comme terminée' });
      }
      if (db.mongoose && db.mongoose.connection && db.mongoose.connection.readyState === 1) {
        const updated = await TodoSchema.findByIdAndUpdate(idParam, { fait: true });
        if (!updated) return res.status(404).json({ error: 'Tâche introuvable' });
        return res.json({ message: 'Tâche marquée comme terminée' });
      }
      const id = parseInt(idParam, 10);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
      const ok = todoModel.completeTask(id);
      if (!ok) return res.status(404).json({ error: 'Tâche introuvable' });
      res.json({ message: 'Tâche marquée comme terminée' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  static async delete(req, res) {
    try {
      const idParam = req.params.id;
      const _pg4 = getTodoPg();
      if (_pg4) {
        const ok = await _pg4.deleteTask(idParam);
        if (!ok) return res.status(404).json({ error: 'Tâche introuvable' });
        return res.json({ message: 'Tâche supprimée avec succès' });
      }
      if (db.mongoose && db.mongoose.connection && db.mongoose.connection.readyState === 1) {
        const removed = await TodoSchema.findByIdAndDelete(idParam);
        if (!removed) return res.status(404).json({ error: 'Tâche introuvable' });
        return res.json({ message: 'Tâche supprimée avec succès' });
      }
      const id = parseInt(idParam, 10);
      const deleted = todoModel.deleteTask(id);
      if (!deleted) return res.status(404).json({ error: 'Tâche introuvable' });
      res.json({ message: 'Tâche supprimée avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = TodoController;
