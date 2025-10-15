const Task = require('../model/task');

class TaskController {
  constructor() {
    this.taches = [];
  }

  ajouter(titre) {
    const task = new Task(titre);
    this.taches.push(task);
    return task;
  }

  lister() {
    return [...this.taches];
  }

  terminer(id) {
    const t = this.taches.find((x) => x.id === id);
    if (t) {
      t.fait = true;
      return true;
    }
    return false;
  }

  supprimer(id) {
    const index = this.taches.findIndex((x) => x.id === id);
    if (index !== -1) {
      this.taches.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = new TaskController();