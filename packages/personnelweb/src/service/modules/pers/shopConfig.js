import yid from '@src/library'

const prefix = 'api-pers/shopconfig'

export function shopconfigList(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function saveShopconfig(params) {
  const url = `${prefix}`
  return yid.http.post(url, params)
}

export default {
  /**考勤配置列表**/
  shopconfigList,
  /**考勤配置保存**/
  saveShopconfig
}
