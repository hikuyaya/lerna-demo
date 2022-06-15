import yid from '@src/library'

const prefix = 'api-chain/brand'

export function brandListBypage(params) {
  return yid.http.get(`${prefix}`, { params })
}

export function brandList(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function saveBrand(params) {
  const url = `${prefix}`
  return yid.http.post(url, params)
}

export function getBrandCode(params) {
  return yid.http.get(`${prefix}/getCode`, { params })
}

export default {
  /** 门店品牌列表 */
  brandList,
  /**门店品牌列表分页**/
  brandListBypage,
  /**保存门店品牌**/
  saveBrand,
  /**获取编码**/
  getBrandCode
}
