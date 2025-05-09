import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  onLine: (callback) => {
    const listener = (_, line) => callback(line)
    ipcRenderer.on('arduino-line', listener)
    return () => ipcRenderer.removeListener('arduino-line', listener)
  },
  write: (text) => ipcRenderer.send('arduino-write', text)
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
} else {
  window.electron = electronAPI
  window.api = api
}
