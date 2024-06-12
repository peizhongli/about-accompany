import { useEffect, useRef, useState } from 'react'
import Dog from './components/Dog'
import Tip from './components/Tip'
import Menu from './components/Menu'

function App() {
  const tipRef = useRef(null)
  const dogRef = useRef(null)
  const menuRef = useRef(null)
  const intervalTimer = useRef(null)
  const timeoutTimer = useRef(null)
  const [menuIsShow, setMenuIsShow] = useState(false)

  const onContext = () => {
    setMenuIsShow(true)
  }

  const startSpeaking = (delay = 6000) => {
    timeoutTimer.current = window.setTimeout(() => {
      intervalTimer.current = window.setInterval(() => {
        tipRef.current.show()
      }, 6000)
    }, delay)
  }

  const clear = () => {
    window.clearInterval(intervalTimer.current)
    window.clearInterval(timeoutTimer.current)
    intervalTimer.current = null
    timeoutTimer.current = null
  }

  const onSelectMenu = (key) => {
    setMenuIsShow(false)
    window.setTimeout(() => {
      switch (key) {
        case 'touch':
          clear()
          dogRef.current.laugh(3000)
          tipRef.current.laugh(3000)
          startSpeaking()
          break
        case 'setting':
          window.electron.ipcRenderer.send('setting')
          break

        default:
          break
      }
    }, 0)
  }

  useEffect(() => {
    clear()
    if (menuIsShow) {
      intervalTimer.current = null
    } else {
      startSpeaking()
    }
    return () => {
      clear()
    }
  }, [menuIsShow])

  return (
    <main className="wrap">
      {!menuIsShow && <Tip ref={tipRef} />}
      {menuIsShow && <Menu ref={menuRef} onSelect={onSelectMenu} />}
      <Dog ref={dogRef} onContext={onContext} />
    </main>
  )
}

export default App
