import {
  app,
  globalShortcut,
  Tray,
  BrowserWindow,
  ipcMain,
  screen,
  Menu,
  MenuItem,
  nativeImage
} from 'electron'
import { join } from 'path'
import { optimizer, is } from '@electron-toolkit/utils'

const isMac = process.platform === 'darwin'
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 130,
    height: 150,
    x: -100,
    y: -100,
    show: false,
    autoHideMenuBar: true, // 隐藏标题栏
    titleBarStyle: 'customButtonsOnHover', // 隐藏mac红绿灯
    transparent: true, // 设置透明窗口
    frame: false, // 无框窗口
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    skipTaskbar: true,
    title: 'about accompany',
    icon: join(__dirname, '../../resources/icon.png')
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
  return mainWindow
}

function createTray() {
  const icon = nativeImage.createFromPath(join(__dirname, '../../resources/icon.png'))
  const tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '下次见👋',
      click: () => app.quit()
    }
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('💙About Accompany')
  tray.setTitle('💙About Accompany')
  return tray
}

// function createGlobalShortcut() {
//   globalShortcut.register('CommandOrControl+Q', () => {
//     console.log('CommandOrControl+X is pressed')
//   })
//   console.log(globalShortcut.isRegistered('CommandOrControl+X'))
// }

function createMenu() {
  const menu = new Menu()
  menu.append(
    new MenuItem({
      label: '关闭',
      submenu: [
        {
          role: 'quit',
          accelerator: isMac ? 'Alt+Cmd+P' : 'Alt+Shift+P',
          click: () => app.quit()
        }
      ]
    })
  )
  Menu.setApplicationMenu(menu)
  return menu
}

function startListen(mainWindow) {
  optimizer.watchWindowShortcuts(mainWindow)
  const { width, height } = mainWindow.getBounds()
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on('move', (event, x, y) => {
    mainWindow.setPosition(parseInt(x - width / 2), parseInt(y - height / 2), true)
    mainWindow.setSize(width, height)
  })
}

// app.setUserTasks([
//   {
//     program: process.execPath,
//     arguments: '--new-window',
//     iconPath: process.execPath,
//     iconIndex: 0,
//     title: 'New Window',
//     description: 'Create a new window'
//   }
// ])

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    startListen(window)
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  createWindow()
  createTray()
  createMenu()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
