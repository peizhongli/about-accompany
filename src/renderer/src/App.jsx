import { useEffect, useRef } from 'react'
import top from './assets/top.png'
import bottom from './assets/bottom.png'
import face from './assets/face.png'

function App() {
  const timer = useRef(null)
  const startX = useRef(0)
  const startY = useRef(0)

  const onDrag = ({ screenX, screenY }) => {
    if (Math.abs(startX.current - screenX) > 10 || Math.abs(startY.current - screenY) > 10) {
      window.electron.ipcRenderer.send('move', screenX, screenY)
    }
  }

  useEffect(() => {
    const mousedownListener = ({ target, screenX, screenY }) => {
      startX.current = screenX
      startY.current = screenY
      // 长按触发
      timer.current = window.setTimeout(() => {
        // target.style.cursor = 'grabbing'
        console.log('11111 :>> ', 11111)
        window.addEventListener('mousemove', onDrag)
      }, 200)
    }
    const mouseupListener = ({ target }) => {
      // target.style.cursor = ''
      window.clearTimeout(timer.current)
      console.log('11111 :>> ', 2222)
      window.removeEventListener('mousemove', onDrag)
    }

    window.addEventListener('mousedown', mousedownListener)
    window.addEventListener('mouseup', mouseupListener)
    return () => {
      window.removeEventListener('mousedown', mousedownListener)
      window.removeEventListener('mouseup', mouseupListener)
    }
  })
  return (
    <div className="wrap">
      <img className="top" src={top} />
      <img className="face" src={face} />
      <img className="bottom" src={bottom} />
    </div>
  )
}

export default App
