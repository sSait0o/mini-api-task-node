export default class TodoPgModel {
  constructor(client) {
    this.client = client;
  }

  async getAll() {
    const res = await this.client.query('SELECT id, titre, fait FROM todos ORDER BY created_at');
    return res.rows;
  }

  async addTask(titre) {
    const res = await this.client.query('INSERT INTO todos (titre) VALUES ($1) RETURNING id, titre, fait', [titre]);
    return res.rows[0];
  }

  async completeTask(id) {
    const res = await this.client.query('UPDATE todos SET fait = true WHERE id = $1 RETURNING id', [id]);
    return res.rowCount > 0;
  }

  async deleteTask(id) {
    const res = await this.client.query('DELETE FROM todos WHERE id = $1', [id]);
    return res.rowCount > 0;
  }
}
