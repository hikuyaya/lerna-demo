import yid from '@src/library'

const prefix = 'api-finance/dormrate'

export function list(params) {
  return yid.http.get(`${prefix}`, { params })
}

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function save(params) {
  const url = `${prefix}`
  return yid.http.post(url, params)
}

export function saveRate(params) {
  const url = `${prefix}/saveRate`
  return yid.http.post(url, params)
}

export function saveSystem(params) {
  const url = `${prefix}/saveSystem`
  return yid.http.post(url, params)
}

export default {
  list,
  listAll,
  save,
  saveRate,
  saveSystem
}
