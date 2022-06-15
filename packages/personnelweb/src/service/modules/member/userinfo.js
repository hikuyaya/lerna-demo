import yid from '@src/library'

const prefix = 'api-member/userinfo'

export function relationList(params) {
  return yid.http.get(`${prefix}/relation/list`, { params })
}

export function editEmployee(params) {
  return yid.http.post(`${prefix}/editEmployee`, params)
}

export function removeUserinfo(params) {
  return yid.http.post(`${prefix}/removeUserinfo`, params)
}

export function batchEdit(params) {
  return yid.http.post(`${prefix}/batchEdit`, params)
}

export function relationExport(params) {
  return yid.http.get(`${prefix}/relation/export`, { params })
}

export function eelistApp(params) {
  return yid.http.get(`${prefix}/eelistApp`, { params })
}

export function relationListForChain(params) {
  return yid.http.get(`${prefix}/chain/relation/list`, { params })
}

export default {
  relationList,
  editEmployee,
  removeUserinfo,
  batchEdit,
  relationExport,
  /**获取未分配数量**/
  eelistApp,
  relationListForChain
}
