import yid from '@src/library'

const prefix = 'api-finance/dicreserveioitem'

export function list(params) {
  return yid.http.get(`${prefix}/listBypage`, { params })
}

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function save(params) {
  const url = `${prefix}`
  return yid.http.post(url, params)
}

export function getReserveByriid(params) {
  return yid.http.get(`${prefix}/getReserveByriid`, { params })
}

export default {
  list,
  listAll,
  save,
  getReserveByriid
}
