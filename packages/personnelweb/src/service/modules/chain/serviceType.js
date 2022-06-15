import yid from '@src/library'

const prefix = 'api-chain/servicetype'

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function getServiceType(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export default {
  //不带分页
  listAll
}
