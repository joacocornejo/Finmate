const botStatus = document.getElementById("bot-status");

setTimeout(() => {
  botStatus.textContent = "Bot: Conectado ✅";
}, 1500);
const msgToday = document.getElementById("msg-today");

let count = 0;
setInterval(() => {
  count += 1;
  msgToday.textContent = `Hoy: ${count}`;
}, 1000);
const connectBtn = document.getElementById("connect-btn");
const connectHint = document.getElementById("connect-hint");

connectBtn.addEventListener("click", () => {
  botStatus.textContent = "Bot: Conectado ✅";
  connectHint.textContent = "Conectado desde la web ✅";
});
