import { useState } from 'react'
import { getSetting, saveSetting, getDefaultSetting } from '../../utils'
import { CAT_TYPE, DOG_TYPE } from '../../utils/constant'

const local_setting = getSetting()

const label_map = {
  [DOG_TYPE]: '🐶',
  [CAT_TYPE]: '🐱'
}
const Setting = () => {
  const [settingData, setSettingData] = useState(local_setting)

  const handleClickAdd = () => {
    setSettingData((v) => ({
      ...v,
      languages: [...v.languages, '']
    }))
  }

  const handleClickConfirm = () => {
    saveSetting({ ...settingData, languages: settingData.languages.filter((i) => i) })
    window.electron.ipcRenderer.send('save')
  }

  const handleClickReset = () => {
    setSettingData(getDefaultSetting())
  }

  const handleChange = (keyPath, val) => {
    const [field, index] = keyPath.split('.')
    setSettingData((v) => {
      if (index !== undefined) {
        v[field][index] = val
        return {
          ...v,
          [field]: v[field]
        }
      }
      return {
        ...v,
        [field]: val
      }
    })
  }

  const handleClickRemove = (index) => {
    setSettingData((v) => {
      // v.languages.splice(index, 1)
      return {
        ...v,
        languages: v.languages.filter((i, idx) => idx !== index)
      }
    })
  }

  const getClass = () => {
    const classList = ['preview', settingData.type === CAT_TYPE ? 'cat' : 'dog']
    return classList.join(' ')
  }

  console.log('settingData.languages :>> ', settingData.languages)
  return (
    <div className="setting-wrap">
      <form id="dogMessage" className="form-wrap">
        <div className="form-item vertical">
          <label htmlFor="name">我的属性：</label>
          <div className="radio-wrap">
            {[DOG_TYPE, CAT_TYPE].map((i) => (
              <span key={i}>
                <input
                  type="radio"
                  id={`type-${i}`}
                  name="type"
                  value={i}
                  checked={settingData.type === i}
                  onChange={({ target }) => handleChange('type', target.value)}
                />
                <label htmlFor={`type-${i}`}>{label_map[i]}</label>
              </span>
            ))}
          </div>
        </div>
        <div className="form-item vertical">
          <label htmlFor="name">我的名字：</label>
          <input
            type="text"
            name="name"
            maxLength={8}
            value={settingData.name}
            onChange={({ target }) => handleChange('name', target.value)}
          />
        </div>
        <div className="form-item">
          <label>
            我的语录：
            {settingData.languages.length < 6 && (
              <button type="button" onClick={handleClickAdd}>
                添加
              </button>
            )}
          </label>

          {settingData.languages.map((i, index) => (
            <div key={index} className="input-wrap">
              <input
                type="text"
                name="name"
                value={i}
                maxLength={25}
                onChange={({ target }) => handleChange(`languages.${index}`, target.value)}
              />
              {settingData.languages.length > 1 && (
                <button type="button" onClick={() => handleClickRemove(index)}>
                  移除
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" className="primary" onClick={handleClickConfirm}>
          提交
        </button>
        <button type="button" onClick={handleClickReset}>
          恢复默认设置
        </button>
      </form>
      <div className={getClass()}></div>
    </div>
  )
}

export default Setting
