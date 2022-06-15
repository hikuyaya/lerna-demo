import yid from '@src/library'

const prefix = 'api-chain/servicetype'

export function getServicetypes(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function updateTypes(params) {
  const url = `${prefix}/updateTypes`
  return yid.http.post(url, params)
}

export default {
  /**项目分类列表**/
  getServicetypes,
  /**保存或更新**/
  updateTypes
}
