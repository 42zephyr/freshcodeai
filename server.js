const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { handleApi } = require("./routes");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let body = "";

  req.on("data", chunk => (body += chunk.toString()));
  req.on("end", () => {
    // API
    if (handleApi(req, res, parsedUrl, body) !== false) return;

    // Статика
    let filePath = path.join(__dirname, "public", parsedUrl.pathname === "/" ? "index.html" : parsedUrl.pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not Found");
      } else {
        const ext = path.extname(filePath);
        const types = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript" };
        res.writeHead(200, { "Content-Type": types[ext] || "text/plain" });
        res.end(data);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Сервер запущено: http://localhost:${PORT}`);
});
