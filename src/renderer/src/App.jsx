import { useEffect, useRef, useState } from 'react'
import top from './assets/top.png'
import bottom from './assets/bottom.png'
import face from './assets/face.png'

const tips = ['PPDOG😍', '爱你呦🥰', '辛苦啦😘', '你最可爱😗', '在想你😎', '喝杯水吧☕']
function App() {
  const timer = useRef(null)
  const tipRef = useRef(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const intervalTimer = useRef(null)
  const [tip, setTip] = useState(' ')

  const onDrag = ({ screenX, screenY }) => {
    if (Math.abs(startX.current - screenX) > 10 || Math.abs(startY.current - screenY) > 10) {
      window.electron.ipcRenderer.send('move', screenX, screenY)
    }
  }

  useEffect(() => {
    const mousedownListener = ({ screenX, screenY }) => {
      startX.current = screenX
      startY.current = screenY
      // 长按触发
      timer.current = window.setTimeout(() => {
        // target.style.cursor = 'grabbing'
        window.addEventListener('mousemove', onDrag)
      }, 200)
    }
    const mouseupListener = () => {
      // target.style.cursor = ''
      window.clearTimeout(timer.current)
      window.removeEventListener('mousemove', onDrag)
    }

    window.addEventListener('mousedown', mousedownListener)
    window.addEventListener('mouseup', mouseupListener)
    return () => {
      window.removeEventListener('mousedown', mousedownListener)
      window.removeEventListener('mouseup', mouseupListener)
    }
  })

  useEffect(() => {
    intervalTimer.current = window.setInterval(() => {
      const index = Math.floor(Math.random() * 6)
      setTip(tips[index])
      tipRef.current.style.opacity = 1
      window.setTimeout(() => {
        tipRef.current.style.opacity = 0
      }, 4000)
    }, 1000 * 6)
    return () => {
      window.clearInterval(intervalTimer)
    }
  }, [])

  return (
    <div className="wrap">
      <div className="tip" ref={tipRef} style={{ opacity: 0 }}>
        {tip}
      </div>
      <div className="main">
        <img className="top" src={top} />
        <img className="face" src={face} />
        <img className="bottom" src={bottom} />
      </div>
    </div>
  )
}

export default App
