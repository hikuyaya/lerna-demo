import yid from '@src/library'

const prefix = 'api-pers/checkclass'

export function checkClassList(params) {
  return yid.http.get(`${prefix}/getCheckClassList`, { params })
}

export function checkClassAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function saveCheckClass(params) {
  const url = `${prefix}`
  return yid.http.post(url, params)
}

export function getMaxColor(params) {
  return yid.http.get(`${prefix}/getMaxColor`, { params })
}

export function getColorList(params) {
  return yid.http.get(`${prefix}/getColorList`, { params })
}

export default {
  /**班次列表**/
  checkClassList,
  /**保存班次**/
  saveCheckClass,
  /**获取最大color**/
  getMaxColor,
  /**判断颜色是否重复**/
  getColorList,
  /**列表不分页**/
  checkClassAll
}
