import { app, BrowserWindow, ipcMain } from 'electron'
import { optimizer } from '@electron-toolkit/utils'
import {
  createMainWindow,
  openSettingWindow,
  closeSettingWindow,
  reloadMainWindow,
  moveMainWindow
} from './window'
import { createTray } from './tray'
import { IS_MAC } from './utils'

function startListen() {
  ipcMain.on('ping', () => console.log('pong'))
  // 监听拖拽
  ipcMain.on('move', (event, x, y) => {
    moveMainWindow(x, y)
  })
  // 退出
  ipcMain.on('quit', () => {
    app.quit()
  })
  // 打开设置
  ipcMain.on('setting', () => {
    openSettingWindow()
  })
  // 保存设置
  ipcMain.on('save', () => {
    closeSettingWindow()
    reloadMainWindow()
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
    optimizer.watchWindowShortcuts(window)
    // 只监听主窗口
    if (BrowserWindow.getAllWindows().length === 1) {
      startListen(window)
    }
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })

  createMainWindow()
  createTray()
  // createMenu()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!IS_MAC) {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
