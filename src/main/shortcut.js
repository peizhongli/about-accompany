import { globalShortcut } from 'electron'

export const createGlobalShortcut = () => {
  globalShortcut.register('CommandOrControl+Q', () => {
    console.log('CommandOrControl+X is pressed')
  })
  console.log(globalShortcut.isRegistered('CommandOrControl+X'))
}
