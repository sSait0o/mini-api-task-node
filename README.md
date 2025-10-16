# Todolist Express MVC

Installation

```powershell
npm install
npm run dev
```

Exemples

Ajouter une tâche:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/todos -Method Post -ContentType 'application/json' -Body '{"titre":"Apprendre JavaScript"}' | ConvertTo-Json
```

Lister:

```powershell
Invoke-RestMethod http://localhost:3000/api/todos
```

Terminer:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/todos/1/complete -Method Put
```

Supprimer:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/todos/1 -Method Delete
```

UI
--
Un frontend minimal est fourni dans `public/`. Après démarrage du serveur, ouvre dans ton navigateur:

http://localhost:3000/ui

Tu peux ajouter, marquer comme terminé et supprimer depuis cette page.
