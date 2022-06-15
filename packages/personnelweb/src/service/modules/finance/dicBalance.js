import yid from '@src/library'

const prefix = 'api-finance/dicbalance'

export function list(params) {
  return yid.http.get(`${prefix}`, { params })
}

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function listAllNoId(params) {
  return yid.http.get(`${prefix}/list/allNoid`, { params })
}

export function save(params) {
  const url = `${prefix}`
  return yid.http.post(url, params)
}

export function getMaxOrder(params) {
  return yid.http.get(`${prefix}/getMaxOrder`, { params })
}

export function deleteDicBalance(id) {
  const url = `${prefix}/${id}`
  return yid.http.delete(url)
}

export function saveSystem(params) {
  const url = `${prefix}/saveSystem`
  return yid.http.post(url, params)
}

export default {
  list,
  listAll,
  save,
  getMaxOrder,
  listAllNoId,
  deleteDicBalance,
  saveSystem
}
