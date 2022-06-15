import yid from '@src/library'

const prefix = 'api-push/smsshop/'

export function listAllForChain(params) {
  return yid.http.get(`${prefix}chain/list/all`, { params })
}

export function batchAssignForChain(params) {
  return yid.http.post(`${prefix}chain/batchAssign`, params)
}

export function assignListForChain(params) {
  return yid.http.get(`${prefix}chain/assignList`, { params })
}

export default {
  listAllForChain,
  batchAssignForChain,
  assignListForChain
}
