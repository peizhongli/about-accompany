import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

// const multiPage = {}
// const pageEntry = {}
// const getEntryInput = () => {
//   const allEntry = glob.sync('./**.html')
//   allEntry.forEach((entry) => {
//     const pathArr = entry.split('/')
//     const name = pathArr[pathArr.length - 2]
//     multiPage[name] = {
//       name,
//       rootPage: `/pages/${name}/index.html`
//     }
//     pageEntry[name] = resolve(__dirname, `pages/${name}/index.html`)
//   })
// }

// getEntryInput()

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          index: 'src/renderer/index.html',
          setting: 'src/renderer/setting.html'
        }
      }
    },
    plugins: [react()]
  }
})
