import yid from '@src/library'

const prefix = 'api-stock/dictinout/'
const outType = '2'
const inType = '1'
export function list(params) {
  return yid.http.get(`${prefix}list/all`, { params })
}

//单据类型字典    字典类型：1入库 2出库
export default {
  /** 列表 */
  list,

  outType,
  inType
}
