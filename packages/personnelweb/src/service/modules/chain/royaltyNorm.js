import yid from '@src/library'

const prefix = 'api-chain/royaltynorm'

//  获取提成分类字典数据
export function normList(params) {
  return yid.http.get(`${prefix}/royaltynorm/list/vo`, { params: params })
}
