import yid from '@src/library'

const prefix = 'api-chain/branch'

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export default {
  listAll
}
