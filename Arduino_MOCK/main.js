const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const net = require("net");

let client;
const server = net.createServer((sock) => {
  client = sock;
  client.on("close", () => {
    client = undefined;
  });
});
server.listen(8123, "127.0.0.1");

function createWindow() {
  const win = new BrowserWindow({
    width: 240,
    height: 320,
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
  if (client && !client.destroyed) client.write(`${k}\n`);
});

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
