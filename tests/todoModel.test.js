const Todo = require('../src/models/todoModel');

describe('Todo in-memory model', () => {
  let model;
  beforeEach(() => { model = new Todo(); });

  test('addTask and getAll', () => {
    const a = model.addTask('T1');
    const b = model.addTask('T2');
    const all = model.getAll();
    expect(all.length).toBe(2);
    expect(all[0].titre).toBe('T1');
  });

  test('completeTask', () => {
    const a = model.addTask('T1');
    const ok = model.completeTask(a.id);
    expect(ok).toBe(true);
    const all = model.getAll();
    expect(all[0].fait).toBe(true);
  });

  test('deleteTask', () => {
    const a = model.addTask('T1');
    const deleted = model.deleteTask(a.id);
    expect(deleted).toBe(true);
    expect(model.getAll().length).toBe(0);
  });
});
