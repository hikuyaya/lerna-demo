import yid from '@src/library'

const prefixChain = 'api-chain'

export function findList(params) {
  return yid.http.get(`${prefixChain}/mktactivinfo`, { params })
}

export function newcode() {
  return yid.http.get(`${prefixChain}/mktactivinfo/newcode`)
}

export function saveMktactiv(params) {
  return yid.http.post(`${prefixChain}/mktactivinfo/saveMktactiv`, params)
}

export function updateStatus(params) {
  return yid.http.post(`${prefixChain}/mktactivinfo/updateStatus`, params)
}

export function listAll(params) {
  return yid.http.get(`${prefixChain}/mktactivinfo/list/all`, { params })
}

export default {
  findList,
  newcode,
  saveMktactiv,
  updateStatus,
  listAll
}
