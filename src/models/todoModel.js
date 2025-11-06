export default class Todo {
  constructor() {
    this._id = 0;
    this.tasks = [];
  }

  getAll() {
    return [...this.tasks];
  }

  addTask(titre) {
    this._id += 1;
    const task = { id: this._id, titre, fait: false };
    this.tasks.push(task);
    return task;
  }

  completeTask(id) {
    const t = this.tasks.find(x => x.id === id);
    if (!t) return false;
    t.fait = true;
    return true;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(x => x.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }
}
