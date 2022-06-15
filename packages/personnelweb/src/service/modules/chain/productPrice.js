/**
 * 产品价格体系
 */

import yid from '@src/library'

const prefix = 'api-chain'

export function findProductPricetemps(params) {
  return yid.http.get(`${prefix}/productpricetemp/list/all`, { params })
}

export function findProductPricetempsBypage(params) {
  return yid.http.get(`${prefix}/productpricetemp/list/listByPage`, { params })
}

export function saveShopPrice(params) {
  return yid.http.post(`${prefix}/productpricetemp/saveShopPrice`, params)
}

export function saveShop(params) {
  return yid.http.post(`${prefix}/productpricetemp/saveShop`, params)
}

export function stopPrice(params) {
  return yid.http.post(`${prefix}/productpricetemp/stopPrice`, params)
}

export function saveOrUpdatePrice(params) {
  return yid.http.post(`${prefix}/productprice`, params)
}

export function batchSave(params) {
  return yid.http.post(`${prefix}/productprice/batchSave`, params)
}

export function productPriceList(params) {
  return yid.http.get(`${prefix}/productprice/productPriceList`, { params })
}

export function productPriceListByPage(params) {
  return yid.http.get(`${prefix}/productprice/productPriceListByPage`, {
    params
  })
}

export function deleteproductPrice(id) {
  const url = `${prefix}/productprice/${id}`
  return yid.http.delete(url)
}

//  获取提成方案关联门店list
export function unableSelectShopList(params) {
  return yid.http.get(`${prefix}/productpricetemp/unableSelectShopList`, {
    params
  })
}

export function getProductShopStatus(params) {
  return yid.http.post(`${prefix}/productprice/getProductShopStatus`, params)
}

export function saveProductShopStatus(params) {
  return yid.http.post(`${prefix}/productprice/saveProductShopStatus`, params)
}

export function checkProductShopStatus(params) {
  return yid.http.post(`${prefix}/productprice/checkProductShopStatus`, params)
}

export function saveSystem(params) {
  return yid.http.post(`${prefix}/productpricetemp/saveSystem`, params)
}

export default {
  /** 所有价格体系 */
  findProductPricetemps,
  /**保存门店产品价格体系**/
  saveShopPrice,
  saveShop,
  stopPrice,
  /**批量门店产品价格设置**/
  batchSave,
  /**门店产品价格列表**/
  productPriceList,
  /**删除产品价格**/
  deleteproductPrice,
  /**修改单个价格**/
  saveOrUpdatePrice,
  //获取不能已经有提成方案的门店  如果传入提成方案id 只获取的是除这个方案关联门店之外的已有提成方案的门店
  unableSelectShopList,
  getProductShopStatus,
  saveProductShopStatus,
  checkProductShopStatus,
  saveSystem, //通过大系统excel转体系数据
  findProductPricetempsBypage,
  productPriceListByPage
}
