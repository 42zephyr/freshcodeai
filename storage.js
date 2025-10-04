const fs = require("fs");
const DATA_FILE = "tasks.json";

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

function getTodos() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8").trim();
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

module.exports = { getTodos, saveTodos };
