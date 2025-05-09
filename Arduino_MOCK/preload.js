// preload.js
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  /**
   * k must be:
   *   • a single digit or '*' or '#'
   *   • or the string "START" when the server tells you to reset
   */
  sendKey: (k) => {
    ipcRenderer.send("key", k);
  },
});
