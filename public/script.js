async function loadTodos() {
  const res = await fetch("/todos");
  const todos = await res.json();
  const list = document.getElementById("todoList");
  const stats = document.getElementById("stats");
  list.innerHTML = "";

  const total = todos.length;
  const doneCount = todos.filter(t => t.done).length;
  stats.textContent = `Всього: ${total} | Виконано: ${doneCount} | Залишилось: ${total - doneCount}`;

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = todo.done ? "done" : "";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = todo.title;

    const desc = document.createElement("div");
    desc.className = "desc";
    desc.textContent = todo.description || "";

    const btns = document.createElement("div");
    if (!todo.done) {
      const doneBtn = document.createElement("button");
      doneBtn.textContent = "✔ Виконано";
      doneBtn.style.background = "#007bff";
      doneBtn.style.color = "white";
      doneBtn.onclick = () => markDone(todo.id);
      btns.appendChild(doneBtn);
    } else {
      const undoBtn = document.createElement("button");
      undoBtn.textContent = "↩ Відновити";
      undoBtn.style.background = "#ffc107";
      undoBtn.style.color = "black";
      undoBtn.onclick = () => undoTask(todo.id);
      btns.appendChild(undoBtn);
    }

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑 Видалити";
    delBtn.style.background = "#dc3545";
    delBtn.style.color = "white";
    delBtn.onclick = () => deleteTask(todo.id);
    btns.appendChild(delBtn);

    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(btns);
    list.appendChild(li);
  });
}

async function addTask() {
  const title = document.getElementById("titleInput").value.trim();
  const description = document.getElementById("descInput").value.trim();
  if (!title) return;
  await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description })
  });
  document.getElementById("titleInput").value = "";
  document.getElementById("descInput").value = "";
  loadTodos();
}

async function markDone(id) {
  await fetch("/done", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  loadTodos();
}

async function undoTask(id) {
  await fetch("/undo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  loadTodos();
}

async function deleteTask(id) {
  await fetch("/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  loadTodos();
}

async function clearAll() {
  if (!confirm("Очистити всі завдання?")) return;
  await fetch("/clear", { method: "POST" });
  loadTodos();
}

loadTodos();
