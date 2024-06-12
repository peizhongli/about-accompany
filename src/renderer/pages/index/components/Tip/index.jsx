import { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { getSetting } from '../../../../utils'
import './index.css'

const local_setting = getSetting()
const { languages, name } = local_setting
const Tip = forwardRef((_, ref) => {
  const tipRef = useRef(null)
  const [tip, setTip] = useState(' ')

  // 显示提示语
  const showTip = (text, delay = 4000) => {
    if (!text) {
      const index = Math.floor(Math.random() * languages.length)
      text = languages[index]
    }
    setTip(text)
    tipRef.current.style.opacity = 1
    window.setTimeout(() => {
      hideTip()
    }, delay)
  }

  const laugh = (delay = 3000) => {
    hideTip()
    showTip(`${name}也爱你❤️`, delay)
  }

  const hideTip = () => {
    if (!tipRef.current) {
      return
    }
    tipRef.current.style.opacity = 0
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        show: showTip,
        hide: hideTip,
        laugh
      }
    },
    []
  )

  return (
    <div className="tip pop" ref={tipRef} style={{ opacity: 0 }}>
      {tip}
    </div>
  )
})

Tip.displayName = 'Tip'

export default Tip
