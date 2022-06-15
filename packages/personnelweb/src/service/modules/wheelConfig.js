import yid from '@src/library'

const prefix = 'api-chain/wheelconfig'

export function deleteCwc(id) {
  return yid.http.delete(`${prefix}/` + id)
}

export function saveCwc(param) {
  return yid.http.post(`${prefix}/`, param)
}

export function getCwc() {
  return yid.http.get(`${prefix}/list/all`)
}

export function getWcPostions(params) {
  return yid.http.get(`api-chain/station/getWcPostions`, { params })
}

export default {
  /** 删除轮牌设置 */
  deleteCwc,
  /** 更新轮牌设置 */
  saveCwc,
  /** 获取门店轮牌设置列表 */
  getCwc,
  /** 获取员工轮牌 服务项目对应工位职务 */
  getWcPostions
}
