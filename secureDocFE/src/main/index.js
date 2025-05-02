import 'dotenv/config'
import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import * as net from 'net'

let arduinoPort
let mockSocket

async function startSerial() {
  try {
    const envPath = (process.env.ARDUINO_PORT || '').trim()
    let path = envPath || undefined
    if (!path) {
      const ports = await SerialPort.list()
      const cand = ports.find(
        (p) =>
          /arduino|usbmodem|usbserial/i.test(p.manufacturer ?? '') ||
          /ttyACM|ttyUSB|COM\d+/i.test(p.path)
      )
      path = cand?.path
    }
    if (!path) {
      console.log('[SERIAL] none')
      return
    }
    arduinoPort = new SerialPort({ path, baudRate: 9600 })
    const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }))
    parser.on('data', (l) => broadcast(l.toString().trim()))
    arduinoPort.on('error', (e) => console.error(e.message))
    console.log('[SERIAL]', path)
  } catch (e) {
    console.error(e.message)
  }
}

function startMock() {
  const reconnect = () => {
    mockSocket = net.connect(8123, '127.0.0.1')
    mockSocket.on('error', () => setTimeout(reconnect, 1000))
    mockSocket.on('close', () => setTimeout(reconnect, 1000))
    mockSocket.on('data', (b) => broadcast(b.toString().trim()))
  }
  reconnect()
  console.log('[MOCK] tcp 8123')
}

function broadcast(line) {
  if (!line) return
  console.log('[KEYPAD]', line)
  BrowserWindow.getAllWindows().forEach((w) => w.webContents.send('arduino-line', line))
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
    const msg = `${d}\n`
    if (arduinoPort?.writable) arduinoPort.write(msg)
    if (mockSocket?.writable) mockSocket.write(msg)
  })
  if (process.env.MOCK_ARDUINO) {
    startMock()
  } else {
    startSerial()
  }
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
