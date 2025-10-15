# Todolist Express MVC

Petite API Todolist en Express (architecture MVC) offrant les opérations:
- Ajouter une tâche (POST /tasks)
- Lister les tâches (GET /tasks)
- Marquer comme terminée (PUT /tasks/:id/complete)
- Supprimer une tâche (DELETE /tasks/:id)

Installation

```powershell
npm install
npm run dev
```

Exemples

Ajouter une tâche:

```powershell
curl -Method POST -ContentType 'application/json' -Body '{"titre":"Apprendre JavaScript"}' http://localhost:3000/tasks
```

Lister:

```powershell
curl http://localhost:3000/tasks
```

Terminer:

```powershell
curl -Method PUT http://localhost:3000/tasks/1/complete
```

Supprimer:

```powershell
curl -Method DELETE http://localhost:3000/tasks/1
```
