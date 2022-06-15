import yid from '@src/library'

const prefix = 'api-chain/positionlevel'
export function list(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function listByPscode(params) {
  return yid.http.get(`${prefix}/list/listByPscode`, { params })
}

export default {
  /** 职务列表 */
  list,
  listByPscode
}
