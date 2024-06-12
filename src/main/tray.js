import { join } from 'path'
import { app, Tray, Menu, nativeImage } from 'electron'

export const createTray = () => {
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
