import { forwardRef, useImperativeHandle, useRef } from 'react'
import touch from '../../../../assets/touch.png'
import setting from '../../../../assets/setting.png'
import './index.css'

const MENU_LIST = [
  { key: 'touch', img: touch, title: '摸摸' },
  { key: 'setting', img: setting, title: '设置' }
]
const Menu = forwardRef((props, ref) => {
  const { onSelect } = props
  const menuRef = useRef(null)

  const handleClick = (key) => {
    onSelect(key)
  }

  useImperativeHandle(ref, () => {
    return {}
  })
  return (
    <ul className="menu-wrap" ref={menuRef}>
      {MENU_LIST.map((i) => (
        <li key={i.key} onClick={() => handleClick(i.key)} className="menu-item pop">
          <img src={i.img} alt="" />
          <p>{i.title}</p>
        </li>
      ))}
    </ul>
  )
})

Menu.displayName = 'Menu'

export default Menu
