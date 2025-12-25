const http = require("http");
const { URL } = require("url");

// Estado en memoria (lo que ya venías usando)
let botConectado = false;
let msgToday = 0;

// Render te entrega el puerto en process.env.PORT
const PORT = process.env.PORT || 3000;

// Token de verificación del webhook (lo pondremos en Render después)
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "cambia-esto";

// Helper: leer body JSON
function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  // CORS (para el panel web)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // --- PANEL: estado ---
  if (url.pathname === "/api/status" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        bot: botConectado ? "conectado ✅" : "desconectado",
        msgToday,
      })
    );
  }

  // --- PANEL: conectar (simulado por ahora) ---
  if (url.pathname === "/api/connect" && req.method === "POST") {
    botConectado = true;
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, bot: "conectado ✅" }));
  }

  // --- WHATSAPP WEBHOOK: verificación (GET) ---
  // Meta llama con: hub.mode, hub.verify_token, hub.challenge
  if (url.pathname === "/webhook" && req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end(challenge || "");
    }

    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden");
  }

  // --- WHATSAPP WEBHOOK: eventos (POST) ---
  // Meta enviará aquí los mensajes entrantes
  if (url.pathname === "/webhook" && req.method === "POST") {
    try {
      const body = await readJson(req);

      // Cada vez que llegue un evento, lo contamos como "mensaje hoy" (simple)
      // Luego lo refinamos para contar solo mensajes reales.
      msgToday += 1;

      // Log para depurar en Render:
      console.log("Webhook event recibido:", JSON.stringify(body));

      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("EVENT_RECEIVED");
    } catch (e) {
      console.error("Error leyendo webhook:", e);
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("Bad Request");
    }
  }

  // Default 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Ruta no encontrada" }));
});

server.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});

