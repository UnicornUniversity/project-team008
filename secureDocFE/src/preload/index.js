// preload.js
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  onLine: (cb) => {
    const listener = (_, line) => cb(line)
    ipcRenderer.on('arduino-line', listener)
    return () => ipcRenderer.removeListener('arduino-line', listener)
  },
  onConnect: (cb) => {
    const listener = () => cb()
    ipcRenderer.on('arduino-connected', listener)
    return () => ipcRenderer.removeListener('arduino-connected', listener)
  },
  write: (text) => ipcRenderer.send('arduino-write', text)
}

contextBridge.exposeInMainWorld('api', api)
contextBridge.exposeInMainWorld('electron', electronAPI)
