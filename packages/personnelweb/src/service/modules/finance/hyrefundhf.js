import yid from '@src/library'

const prefix = 'api-finance/cardtkhfhead'

export function list(params) {
  return yid.http.get(`${prefix}/findListWithProChain`, { params })
}
export function censorforM(params) {
  const url = `${prefix}/censorforM`
  return yid.http.post(url, params)
}

export function save(params) {
  return yid.http.post(`${prefix}`, params)
}
export function censor(params) {
  return yid.http.post(`${prefix}/auditBill`, params)
}

export function listtj(params) {
  return yid.http.get(`${prefix}/findListWithProtj`, { params })
}

export default {
  list,
  censorforM,
  save,
  censor,
  listtj
}
