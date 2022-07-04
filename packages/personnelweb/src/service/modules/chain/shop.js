import yid from '@src/library'

const prefix = 'api-chain/shop'

export function shopList(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function batchRegion(params) {
  return yid.http.post(`${prefix}/batchRegion`, params)
}

export function regionShopList(params) {
  return yid.http.get(`${prefix}/regionShopList`, { params })
}

export function regionShopListAll(params) {
  return yid.http.get(`${prefix}/regionShopListAll`, { params })
}

export function shopListWithPage(params) {
  return yid.http.get(`${prefix}`, { params })
}

export function getProCityArea() {
  return yid.http.get(`${prefix}/getProCityArea`)
}

export function getShopInfo(id) {
  return yid.http.get(`${prefix}/getShopInfo/${id}`)
}

export function getShopImages(id) {
  return yid.http.get(`api-chain/shopbanner/getShopImages/${id}`)
}

export function saveShop(params) {
  return yid.http.post(`${prefix}/saveShop`, params)
}

export function checkShopcode(params) {
  return yid.http.post(`${prefix}/checkShopcode`, params)
}

export function addShop(params) {
  return yid.http.post(`${prefix}/addShop`, params)
}

export function shopListWithRoyalty(params) {
  return yid.http.get(`${prefix}//list/withRoyalty`, { params })
}

export function getShopListByIds(params) {
  return yid.http.get(`${prefix}/getShopListByIds`, { params })
}
export function shopPageList(params) {
  return yid.http.get(`${prefix}/list/shop`, { params })
}

export function findShopByCode(params) {
  return yid.http.get(`${prefix}/findShopByCode`, { params })
}
export function getRegionAndShopTree() {
  return yid.http.get(`${prefix}/getRegionAndShopTree`, {})
}
export function getRegionAndShop() {
  return yid.http.get(`${prefix}/getRegionAndShop`, {})
}

export default {
  /** 门店列表 不带分页的*/
  shopList,
  /**批量设置门店区域**/
  batchRegion,
  /**查询节点及子节点的门店列表*/
  regionShopList,
  shopListWithPage,
  getProCityArea,
  getShopInfo,
  getShopImages,
  saveShop,
  /**检查门店编码唯一性**/
  checkShopcode,
  /**新增门店**/
  addShop,
  /** 门店列表 带提成方案的**/
  shopListWithRoyalty,
  regionShopListAll,
  getShopListByIds,
  shopPageList,
  findShopByCode,
  // 查询门店组织树
  getRegionAndShopTree,
  // 查询门店组织列表
  getRegionAndShop
}
