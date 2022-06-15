import yid from '@src/library'

const prefix = 'api-finance/xxtkoperlog'

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export default {
  /** 列表 */
  listAll
}
