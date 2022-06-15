import yid from '@src/library'

const prefix = 'api-chain/smsallowance'

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function getSmsAllowanceByTenement(params) {
  return yid.http.get(`${prefix}/getSmsAllowanceByTenement`, { params })
}

export default {
  listAll,
  getSmsAllowanceByTenement
}
