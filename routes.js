const { getTodos, saveTodos } = require("./storage");

function handleApi(req, res, parsedUrl, body) {
  if (req.method === "GET" && parsedUrl.pathname === "/todos") {
    const todos = getTodos();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(todos));
  }

  if (req.method === "POST" && parsedUrl.pathname === "/add") {
    const { title, description } = JSON.parse(body);
    const todos = getTodos();
    todos.push({ id: Date.now(), title, description, done: false });
    saveTodos(todos);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  }

  if (req.method === "POST" && parsedUrl.pathname === "/done") {
    const { id } = JSON.parse(body);
    const todos = getTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) todo.done = true;
    saveTodos(todos);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  }

  if (req.method === "POST" && parsedUrl.pathname === "/undo") {
    const { id } = JSON.parse(body);
    const todos = getTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) todo.done = false;
    saveTodos(todos);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  }

  if (req.method === "POST" && parsedUrl.pathname === "/delete") {
    const { id } = JSON.parse(body);
    let todos = getTodos();
    todos = todos.filter(t => t.id !== id);
    saveTodos(todos);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  }

  if (req.method === "POST" && parsedUrl.pathname === "/clear") {
    saveTodos([]);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  }

  return false;
}

module.exports = { handleApi };
