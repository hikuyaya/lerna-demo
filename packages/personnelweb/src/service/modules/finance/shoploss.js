import yid from '@src/library'

const prefix = 'api-finance/shopmonthloss'

export function list(params) {
  return yid.http.get(`${prefix}`, { params })
}

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function saveSystem(params) {
  const url = `${prefix}/saveSystem`
  return yid.http.post(url, params)
}

export default {
  list,
  listAll,
  saveSystem
}
