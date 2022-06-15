import yid from '@src/library'

const prefix = 'api-chain/royaltyshop'

//  获取提成方案关联门店list
export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export default {
  listAll
}
