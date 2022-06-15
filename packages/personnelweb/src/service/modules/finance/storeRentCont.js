import yid from '@src/library'

const prefix = 'api-finance/storerentcont'

export function list(params) {
  return yid.http.get(`${prefix}`, { params })
}

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function saveAction(params) {
  const url = `${prefix}/saveAction`
  return yid.http.post(url, params)
}

export function checkBankno(params) {
  const url = `${prefix}/checkBankno`
  return yid.http.post(url, params)
}

export default {
  list,
  listAll,
  saveAction,
  checkBankno
}
