const http = require("http");

// estado en memoria
let botConectado = false;
let msgToday = 0;
// Simular mensajes entrantes cuando el bot está conectado
setInterval(() => {
  if (botConectado) {
    msgToday += 1;
  }
}, 2000);


const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // API: estado del bot
  if (req.url === "/api/status" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        bot: botConectado ? "conectado ✅" : "desconectado",
        msgToday: msgToday,
      })
    );
  }

  // API: conectar bot
  if (req.url === "/api/connect" && req.method === "POST") {
    botConectado = true;

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, bot: "conectado ✅" }));
  }

  // 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Ruta no encontrada" }));
});

server.listen(3000, () => {
  console.log("Servidor backend escuchando en http://localhost:3000");
  console.log("API status: http://localhost:3000/api/status");
});
