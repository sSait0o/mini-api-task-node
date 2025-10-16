async function api(path, method = 'GET', body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? null : res.json();
}

async function render() {
  const list = document.getElementById('list');
  list.innerHTML = '';
  try {
    const tasks = await api('/tasks');
    tasks.forEach(t => {
      const li = document.createElement('li');
      li.textContent = `${t.id} - ${t.titre}`;
      if (t.fait) li.classList.add('done');
      const done = document.createElement('button');
      done.textContent = '✓';
      done.onclick = async () => { await api(`/tasks/${t.id}/complete`, 'PUT'); render(); };
      const del = document.createElement('button');
      del.textContent = '✖';
      del.onclick = async () => { await api(`/tasks/${t.id}`, 'DELETE'); render(); };
      li.appendChild(done);
      li.appendChild(del);
      list.appendChild(li);
    });
  } catch (e) {
    list.innerHTML = '<li>Erreur: ' + e.message + '</li>';
  }
}

document.getElementById('form').onsubmit = async (e) => {
  e.preventDefault();
  const titre = document.getElementById('titre').value.trim();
  if (!titre) return;
  await api('/tasks', 'POST', { titre });
  document.getElementById('titre').value = '';
  render();
};

render();
