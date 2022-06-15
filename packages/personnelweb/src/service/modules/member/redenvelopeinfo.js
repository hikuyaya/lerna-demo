import yid from '@src/library'

const prefix = 'api-member/redenvelopeinfo'

export function getRedEnvelopeRecordForChain(params) {
  return yid.http.get(`${prefix}/chain/list/records`, { params })
}

export default {
  getRedEnvelopeRecordForChain
}
