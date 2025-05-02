const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  sendKey: (k) => ipcRenderer.send("key", k),
});
