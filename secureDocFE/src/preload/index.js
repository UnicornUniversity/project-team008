import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  onLine: cb => {
    const w = (_, l) => cb(l)
    ipcRenderer.on('arduino-line', w)
    return () => ipcRenderer.removeListener('arduino-line', w)
  },
  write: txt => ipcRenderer.send('arduino-write', txt)
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
} else {
  window.electron = electronAPI
  window.api = api
}
