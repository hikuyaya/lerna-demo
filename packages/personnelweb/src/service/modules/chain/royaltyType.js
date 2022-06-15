import yid from '@src/library'

const prefix = 'api-chain/royaltytype'

//  获取提成分类字典数据
export function listAll() {
  return yid.http.get(`${prefix}/list/all`)
}

export default {
  listAll
}
