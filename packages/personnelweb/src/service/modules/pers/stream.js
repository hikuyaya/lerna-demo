import yid from '@src/library'

const prefix = 'api-pers/employeestream'

export function streamList(params) {
  return yid.http.get(`${prefix}/chain/streamList`, { params })
}

export function streamListExport(params) {
  return yid.http.get(`${prefix}/chain/streamListExport`, { params })
}

export function getDescById(params) {
  return yid.http.get(`${prefix}/getDescById`, { params })
}

export default {
  /**员工提成明细**/
  streamList,
  /**员工提成明细导出**/
  streamListExport,
  getDescById
}
