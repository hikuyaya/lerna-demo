import yid from '@src/library'

const prefix = 'api-chain/paythead'

export function saveOrUpdate(params) {
  return yid.http.post(`${prefix}`, params)
}

//带分页的
export function list(params) {
  return yid.http.get(`${prefix}`, { params })
}

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export default {
  saveOrUpdate,
  list,
  listAll
}
