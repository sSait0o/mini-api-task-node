export default class TodoPgModel {
  constructor(client) {
    this.client = client;
  }
  async getAll(userId) {
    const res = await this.client.query('SELECT id, titre, fait FROM todos WHERE owner = $1 ORDER BY created_at', [userId]);
    return res.rows;
  }

  async addTask(titre, userId) {
    const res = await this.client.query('INSERT INTO todos (titre, owner) VALUES ($1, $2) RETURNING id, titre, fait', [titre, userId]);
    return res.rows[0];
  }

  async completeTask(id, userId) {
    const res = await this.client.query('UPDATE todos SET fait = true WHERE id = $1 AND owner = $2 RETURNING id', [id, userId]);
    return res.rowCount > 0;
  }

  async deleteTask(id, userId) {
    const res = await this.client.query('DELETE FROM todos WHERE id = $1 AND owner = $2', [id, userId]);
    return res.rowCount > 0;
  }
}
