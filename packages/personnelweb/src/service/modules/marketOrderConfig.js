import yid from '@src/library'

const prefix = 'api-chain/makeorderconfig'

//获取门店收银单设置数据
export function orderConfig() {
  return yid.http.get(`${prefix}/sysuser`)
}

//更新:是否自动发放号牌
export function updateIsAutoNo(param) {
  return yid.http.post(`${prefix}/isAutoNo`, param)
}

//更新:是否输卡号查卡
export function updateIsAllowMobile(param) {
  return yid.http.post(`${prefix}/isAllowMobile`, param)
}

export function save(param) {
  return yid.http.post(`${prefix}`, param)
}

export function saveNo(param) {
  return yid.http.post(`${prefix}/saveNo`, param)
}

export default {
  /** 获取门店收银单设置数据 */
  orderConfig,
  /** 更新:是否自动发放号牌 */
  updateIsAutoNo,
  /** 更新:是否输卡号查卡 */
  updateIsAllowMobile,
  save,
  saveNo
}
