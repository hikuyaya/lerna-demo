import yid from '@src/library'

const prefix = 'api-finance'

export function jobList(params) {
  const url = `${prefix}/shopext/list`
  return yid.http.get(url, { params })
}

export function saveJob(params) {
  const url = `${prefix}/shopext`
  return yid.http.post(url, params)
}

export function listAll(params) {
  const url = `${prefix}/shopext/list/all`
  return yid.http.get(url, { params })
}
export function getShopExtShow(params) {
  return yid.http.post(`${prefix}/shopext/getShopExtShow`, params)
}
export default {
  /** 列表 */
  jobList,
  /**保存或更新**/
  saveJob,
  listAll,
  getShopExtShow
}
