import { join } from 'path'
import { BrowserWindow, screen } from 'electron'
import { is } from '@electron-toolkit/utils'

const width = 130
const height = 230
let mainWindow = null
let settingWindow = null
const createWindow = (options) => {
  const newWindow = new BrowserWindow({
    autoHideMenuBar: true, // 隐藏标题栏
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    title: 'about accompany',
    icon: join(__dirname, '../../resources/icon.png'),
    ...options
  })
  return newWindow
}

export const createMainWindow = () => {
  if (mainWindow) {
    mainWindow.show()
    return
  }
  // Create the browser window.
  mainWindow = createWindow({
    width,
    height,
    show: false,
    titleBarStyle: 'customButtonsOnHover', // 隐藏mac红绿灯
    transparent: true, // 设置透明窗口
    frame: false, // 无框窗口
    skipTaskbar: true
  })

  // 置顶
  mainWindow.setAlwaysOnTop(true, 'screen-saver')

  // 默认把内容放到右下角
  mainWindow.on('ready-to-show', () => {
    const currentScreen = screen.getPrimaryDisplay().workAreaSize
    const { width, height } = mainWindow.getBounds()
    mainWindow.setPosition(currentScreen.width - width, currentScreen.height - height)
    mainWindow.show()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  mainWindow.on('close', () => {
    mainWindow = null
  })
  return mainWindow
}

export const reloadMainWindow = () => {
  mainWindow.reload()
}

export const openSettingWindow = () => {
  if (settingWindow) {
    settingWindow.show()
    return
  }
  settingWindow = createWindow({
    width: 600,
    height: 600,
    center: true,
    title: '设置'
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/setting.html`)
  } else {
    settingWindow.loadFile(join(__dirname, '../renderer/setting.html'))
  }
  settingWindow.on('close', () => {
    settingWindow = null
  })
}

export const closeSettingWindow = () => {
  settingWindow.close()
}

export const moveMainWindow = (x, y) => {
  mainWindow.setPosition(parseInt(x - width / 2 + 10), parseInt(y - height / 2 - 50), true)
  mainWindow.setSize(width, height)
}
