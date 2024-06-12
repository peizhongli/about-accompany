import { app, Menu, MenuItem } from 'electron'
import { IS_MAC } from './utils'

export const createMenu = () => {
  const menu = new Menu()
  menu.append(
    new MenuItem({
      label: '关闭',
      submenu: [
        {
          role: 'quit',
          accelerator: IS_MAC ? 'Alt+Cmd+P' : 'Alt+Shift+P',
          click: () => app.quit()
        }
      ]
    })
  )
  Menu.setApplicationMenu(menu)
  return menu
}
