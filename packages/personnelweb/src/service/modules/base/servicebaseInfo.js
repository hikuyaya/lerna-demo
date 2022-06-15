import yid from '@src/library'

const prefix = 'api-base'

export function listAll(params) {
  return yid.http.get(`${prefix}/serviceinfo/listAll`, { params })
}

export function findChainList(params) {
  return yid.http.get(`${prefix}/serviceinfo/list/chain`, { params })
}

export function saveServPrice(params) {
  return yid.http.post(`${prefix}/serviceprice/saveServPrice`, params)
}

export function saveServcards(params) {
  return yid.http.post(
    `${prefix}/serviceprice/saveServcards?shopid=` + params.shopid,
    params
  )
}

export function savespecials(params) {
  return yid.http.post(
    `${prefix}/serviceprice/savespecials?shopid=` + params.shopid,
    params
  )
}

export function findEmployees(params) {
  return yid.http.get(
    `${prefix}/serviceinfo/employees?shopid=` + params.shopid,
    { params }
  )
}

export function findPositions(params) {
  return yid.http.get(
    `${prefix}/serviceinfo/positions?shopid=` + params.shopid,
    { params }
  )
}

export function findCardinfos(params) {
  return yid.http.get(
    `${prefix}/serviceinfo/cardinfos?shopid=` + params.shopid,
    { params }
  )
}

export function saveServShopStatus(params) {
  return yid.http.post(`${prefix}/serviceinfo/saveServShopStatus`, params)
}

export function updateServStatus(params) {
  return yid.http.post(`${prefix}/serviceinfo/updateServStatus`, params)
}

export default {
  findChainList,
  saveServPrice,
  saveServcards,
  savespecials,
  findEmployees,
  findPositions,
  findCardinfos,
  listAll,
  saveServShopStatus,
  updateServStatus
}
