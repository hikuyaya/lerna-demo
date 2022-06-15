import yid from '@src/library'

const prefix = 'api-chain/serviceprice'

export function searchList(params) {
  return yid.http.get(`${prefix}/list/search`, { params })
}

export function saveServShopStatus(params) {
  return yid.http.post(`${prefix}/saveServShopStatus`, params)
}

export function getServShopStatus(params) {
  return yid.http.post(`${prefix}/getServShopStatus`, params)
}

export function checkServShopStatus(params) {
  return yid.http.post(`${prefix}/checkServShopStatus`, params)
}

export default {
  searchList,
  saveServShopStatus,
  getServShopStatus,
  checkServShopStatus
}
