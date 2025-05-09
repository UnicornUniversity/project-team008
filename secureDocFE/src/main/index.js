import 'dotenv/config'
import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as net from 'net'
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

let mockSocket
let serialPort

function connectMock() {
  mockSocket = net.connect(8123, '127.0.0.1')
  mockSocket.once('connect', () => console.log('🟢 Mock Arduino connected'))

  mockSocket.on('data', (b) => {
    const line = b.toString().trim()
    if (!line) return
    BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('arduino-line', line))
  })

  const retryLater = () => {
    console.warn('🔁 Reconnecting to mock Arduino...')
    if (mockSocket) mockSocket.destroy()
    mockSocket = null
    setTimeout(connectMock, 2000)
  }

  mockSocket.once('error', retryLater)
  mockSocket.once('close', retryLater)
}

function connectRealSerial() {
  const portPath = process.env.ARDUINO_PORT || 'COM5'
  serialPort = new SerialPort({ path: portPath, baudRate: 9600 })
  const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }))

  serialPort.on('open', () => {
    console.log(`🟢 Serial port opened on ${portPath}`)
  })

  parser.on('data', (line) => {
    const trimmed = line.trim()
    if (trimmed)
      BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('arduino-line', trimmed))
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
    const data = `${d}\n`
    if (process.env.MOCK_ARDUINO && mockSocket?.writable) mockSocket.write(data)
    else if (serialPort?.writable) serialPort.write(data)
  })

  if (process.env.MOCK_ARDUINO) connectMock()
  else connectRealSerial()

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
