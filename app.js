const API_BASE = "https://finmate-b6qg.onrender.com";


const botStatus = document.getElementById("bot-status");
const msgToday = document.getElementById("msg-today");
const connectBtn = document.getElementById("connect-btn");
const connectHint = document.getElementById("connect-hint");

async function cargarEstado() {
  const res = await fetch(`${API_BASE}/api/status`);
  const data = await res.json();

  botStatus.textContent = `Bot: ${data.bot}`;
  msgToday.textContent = `Hoy: ${data.msgToday}`;
}

connectBtn.addEventListener("click", async () => {
  connectHint.textContent = "Conectando...";

  const res = await fetch(`${API_BASE}/api/connect`, {
    method: "POST",
  });
  const data = await res.json();

  botStatus.textContent = `Bot: ${data.bot}`;
  connectHint.textContent = "Conectado desde el backend ✅";
});

cargarEstado();
setInterval(cargarEstado, 1000);
