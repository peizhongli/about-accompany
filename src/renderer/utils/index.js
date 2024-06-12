import { LOCAL_KEY, DEFAULT_DATA } from './constant'

const setData = (key, data) => {
  window.localStorage.setItem(key, JSON.stringify(data))
}

const getData = (key, defaultVal = null) => {
  const res = window.localStorage.getItem(key)
  return res ? JSON.parse(res) : defaultVal
}

export const saveSetting = (data) => {
  setData(LOCAL_KEY, data)
}

export const getSetting = () => {
  return getData(LOCAL_KEY, DEFAULT_DATA)
}

export const getDefaultSetting = () => {
  return DEFAULT_DATA
}
