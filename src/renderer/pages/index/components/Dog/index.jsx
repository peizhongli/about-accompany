import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import './index.css'
import { getSetting } from '../../../../utils'
import { CAT_TYPE } from '../../../../utils/constant'

const local_setting = getSetting()
const { type } = local_setting
const Dog = forwardRef((props, ref) => {
  const { onContext } = props
  const mainRef = useRef(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const [isLaughing, setIsLaughing] = useState(false)

  // 监听拖拽
  const onDrag = ({ screenX, screenY, button }) => {
    if (button !== 0) {
      return
    }
    // 如果平移距离超过10像素才算作拖拽
    if (Math.abs(startX.current - screenX) > 10 || Math.abs(startY.current - screenY) > 10) {
      startX.current = screenX
      startY.current = screenY
      window.electron.ipcRenderer.send('move', screenX, screenY)
    }
  }

  const getClass = () => {
    const classList = [type === CAT_TYPE ? 'cat-wrap' : 'dog-wrap']
    if (isLaughing) {
      classList.push('laughing')
    }
    return classList.join(' ')
  }

  const laugh = (delay = 3000) => {
    setIsLaughing(true)
    window.setTimeout(() => {
      setIsLaughing(false)
    }, delay)
  }

  useEffect(() => {
    // 鼠标按下监听拖拽
    const mousedownListener = ({ screenX, screenY, button }) => {
      if (button === 2) {
        onContext()
      }
      if (button !== 0) {
        return
      }
      startX.current = screenX
      startY.current = screenY
      mainRef.current.addEventListener('mousemove', onDrag)
    }
    // 鼠标抬起解除拖拽监听
    const mouseupListener = ({ button }) => {
      if (button !== 0) {
        return
      }
      mainRef.current.removeEventListener('mousemove', onDrag)
    }

    mainRef.current.addEventListener('mousedown', mousedownListener)
    mainRef.current.addEventListener('mouseup', mouseupListener)
    mainRef.current.addEventListener('mouseleave', mouseupListener)
    return () => {
      mainRef.current.removeEventListener('mousedown', mousedownListener)
      mainRef.current.removeEventListener('mouseup', mouseupListener)
      mainRef.current.removeEventListener('mouseleave', mouseupListener)
    }
  }, [])

  useImperativeHandle(ref, () => {
    return {
      laugh
    }
  })

  return (
    <div className={getClass()} ref={mainRef}>
      <div className="head"></div>
    </div>
  )
})

Dog.displayName = 'Dog'

export default Dog
