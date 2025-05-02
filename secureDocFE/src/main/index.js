import 'dotenv/config'
import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as net from 'net'

let mockSocket
let retry = 1000

function connectMock() {
  mockSocket = net.connect(8123, '127.0.0.1')
  mockSocket.once('connect', () => {
    retry = 1000
  })
  mockSocket.on('data', (b) => {
    const line = b.toString().trim()
    if (!line) return
    BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('arduino-line', line))
  })
  const retryLater = () => {
    if (mockSocket) mockSocket.destroy()
    mockSocket = null
    retry = Math.min(retry * 2, 30000)
    setTimeout(connectMock, retry)
  }
  mockSocket.once('error', retryLater)
  mockSocket.once('close', retryLater)
}

function startMock() {
  connectMock()
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open DevTools',
      click: () => mainWindow.webContents.openDevTools({ mode: 'detach' })
    }
  ])
  mainWindow.webContents.on('context-menu', () => contextMenu.popup())
  mainWindow.on('ready-to-show', () => mainWindow.show())
  mainWindow.webContents.setWindowOpenHandler((d) => {
    shell.openExternal(d.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, w) => optimizer.watchWindowShortcuts(w))
  ipcMain.on('arduino-write', (_, d) => {
    if (mockSocket?.writable) mockSocket.write(`${d}\n`)
  })
  if (process.env.MOCK_ARDUINO) startMock()
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
