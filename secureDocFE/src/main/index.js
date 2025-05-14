import 'dotenv/config'
import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as net from 'net'
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import log from 'electron-log'

console.log = (...args) => log.info(...args)
console.warn = (...args) => log.warn(...args)
console.error = (...args) => log.error(...args)

let mockSocket
let serialPort

const MAX_RETRIES = 50
let retries = 0
let reconnectTimer

function connectMock() {
  mockSocket = net.connect(8123, '127.0.0.1')

  mockSocket.once('connect', () => {
    console.log('+ Mock Arduino connected')
    retries = 0
    BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('arduino-connected'))
  })

  mockSocket.on('data', (b) => {
    const line = b.toString().trim()
    if (line) {
      BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('arduino-line', line))
    }
  })

  const retryLater = () => {
    if (reconnectTimer) return

    if (retries >= MAX_RETRIES) {
      console.warn(`${MAX_RETRIES} tries - giving up. Restart the app.`)
      mockSocket?.destroy()
      mockSocket = null
      BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('arduino-disconnected'))
      return
    }
    BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('arduino-disconnected'))

    console.warn(`🔁 Reconnecting… (${++retries}/${MAX_RETRIES})`)

    mockSocket?.removeAllListeners()
    mockSocket?.destroy()
    mockSocket = null

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      connectMock()
    }, 2000)
  }

  mockSocket.once('error', retryLater)
  mockSocket.once('close', retryLater)
}

function connectRealSerial() {
  const portPath = import.meta.env.VITE_ARDUINO_PORT || 'COM5'
  serialPort = new SerialPort({ path: portPath, baudRate: 9600 })
  const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }))

  serialPort.on('open', () => {
    console.log(`🟢 Serial port opened on ${portPath}`)
    BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('arduino-connected'))
  })

  parser.on('data', (line) => {
    const trimmed = line.trim()
    if (trimmed) {
      BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('arduino-line', trimmed))
    }
  })

  serialPort.on('error', (err) => {
    console.error('❌ Serial port error:', err.message)
  })
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
  mainWindow.webContents.on('context-menu', () => {
    contextMenu.popup()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
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
    const data = `${d}\n`
    if (import.meta.env.VITE_MOCK_ARDUINO && mockSocket?.writable) mockSocket.write(data)
    else if (serialPort?.writable) serialPort.write(data)
  })

  if (import.meta.env.VITE_MOCK_ARDUINO) connectMock()
  else connectRealSerial()

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
