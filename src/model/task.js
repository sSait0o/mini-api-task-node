let _id = 0;

class Task {
  constructor(titre) {
    _id += 1;
    this.id = _id;
    this.titre = titre;
    this.fait = false;
  }

  toString() {
    const statut = this.fait ? "✓" : "○";
    return `[${this.id}] ${statut} ${this.titre}`;
  }
}

module.exports = Task;