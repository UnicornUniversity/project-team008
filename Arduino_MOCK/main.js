const log = require("electron-log");

// main.js (Arduino MOCK)
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const net = require("net");

console.log = (...args) => log.info(...args);
console.warn = (...args) => log.warn(...args);
console.error = (...args) => log.error(...args);

// your same secret key as on Arduino
const XOR_KEY = "mock_arduino";
const ARDUINO_ID = "2";

let clientSock;
let inputBuffer = "";

// simple XOR + Base64 helper
function xorEncryptBase64(message, key) {
  const msgBuf = Buffer.from(message, "utf8");
  const keyBuf = Buffer.from(key, "utf8");
  const out = Buffer.alloc(msgBuf.length);

  for (let i = 0; i < msgBuf.length; i++) {
    out[i] = msgBuf[i] ^ keyBuf[i % keyBuf.length];
  }
  return out.toString("base64");
}

// create a TCP server to simulate the Serial port
const server = net.createServer((sock) => {
  clientSock = sock;
  sock.setEncoding("utf8");

  sock.on("data", (chunk) => {
    // handle potentially multiple lines in one chunk
    for (let line of chunk.split("\n")) {
      line = line.trim();
      if (!line) continue;

      if (line === "START") {
        // emulate your Arduino START handler
        clientSock.write(`{"event":"start_equal"}\n`);
        inputBuffer = "";
      }
    }
  });

  sock.on("close", () => {
    clientSock = undefined;
    inputBuffer = "";
  });
});
server.listen(8123, "127.0.0.1");

function createWindow() {
  const win = new BrowserWindow({
    width: 260,
    height: 360,
    resizable: false,
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  win.loadFile(path.join(__dirname, "index.html"));
  const menu = Menu.buildFromTemplate([
    { role: "reload" },
    { role: "toggledevtools" },
  ]);
  win.webContents.on("context-menu", () => menu.popup());
}

ipcMain.on("key", (_, k) => {
  // k should be a single character, e.g. "1", "2", "*", "#", or "START"
  if (clientSock && !clientSock.destroyed) {
    if (k === "#") {
      // PIN complete
      const enc = xorEncryptBase64(inputBuffer, XOR_KEY);
      clientSock.write(
        `{"event":"pin","value":"${enc}","arduinoId":"${ARDUINO_ID}"}\n`
      );
      inputBuffer = "";
    } else {
      clientSock.write(`{"event":"key","value":"*"}\n`);
      inputBuffer += k;
    }
  }
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
