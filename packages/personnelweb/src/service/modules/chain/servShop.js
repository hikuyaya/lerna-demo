/**
 * 项目价格体系
 */

import yid from '@src/library'

const prefix = 'api-chain'

export function findServicePrices(params) {
  return yid.http.get(`${prefix}/servicepricetemp/list/all`, { params })
}

export function findServicePricesPage(params) {
  return yid.http.get(`${prefix}/servicepricetemp/listPage`, { params })
}

export function findbrands(params) {
  return yid.http.get(`${prefix}/brand/list/all?isDel=0`, { params })
}

export function findbranchs(params) {
  return yid.http.get(`${prefix}/branch/list/all`, { params })
}

export function findregions(params) {
  return yid.http.get(`${prefix}/dictregion/list/all`, { params })
}

export function queryShop(params) {
  return yid.http.get(`${prefix}/shop`, { params })
}

export function newCode() {
  return yid.http.post(`${prefix}/servicepricetemp/newCode`)
}

export function stopPrice(params) {
  return yid.http.post(`${prefix}/servicepricetemp/stopPrice`, params)
}

export function saveShopPrice(params) {
  return yid.http.post(`${prefix}/servicepricetemp/saveShopPrice`, params)
}

export function saveShop(params) {
  return yid.http.post(`${prefix}/servicepricetemp/saveShop`, params)
}

export function saveSystemMf(params) {
  return yid.http.post(`${prefix}/servicepricetemp/saveSystemMf`, params)
}

export function saveSystemMr(params) {
  return yid.http.post(`${prefix}/servicepricetemp/saveSystemMr`, params)
}

export function copyShopPrice(params) {
  return yid.http.post(`${prefix}/servicepricetemp/copyShopPrice`, params)
}

export function findlistPage(params) {
  return yid.http.post(`${prefix}/shopPriceControl/findlistPage`, params)
}

export function saveOrUpdate(params) {
  return yid.http.post(`${prefix}/shopPriceControl/saveOrUpdate`, params)
}

export function deleteData(params) {
  return yid.http.post(`${prefix}/shopPriceControl/deleteData`, params)
}

export default {
  /** 所有价格体系 */
  findServicePrices,
  findServicePricesPage,
  findbrands,
  findbranchs,
  findregions,
  queryShop,
  newCode,
  stopPrice,
  saveShopPrice,
  saveShop,
  saveSystemMf, //通过大系统excel转体系数据 MF
  saveSystemMr, //通过大系统excel转体系数据 MR
  copyShopPrice,
  findlistPage,
  saveOrUpdate,
  deleteData
}
