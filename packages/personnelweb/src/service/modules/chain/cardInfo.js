import yid from '@src/library'

const prefix = 'api-chain/cardinfo'

export function searchListAll(params) {
  return yid.http.get(`${prefix}/search/all`, { params })
}

export function saveCardInfo(params) {
  return yid.http.post(`${prefix}`, params)
}

export function cardRules(params) {
  return yid.http.get(`${prefix}/cardRules`, { params })
}

export function saveCardRules(params) {
  return yid.http.post(`${prefix}/saveCardRules`, params)
}

export function delCardRule(id) {
  return yid.http.delete(`${prefix}/delCardRule/${id}`)
}

export function cardInfoByID(id) {
  return yid.http.get(`${prefix}/cardInfo/${id}`)
}

export function editCardStatus(params) {
  return yid.http.post(`${prefix}/status`, params)
}

//  获取卡类型
export function cardList() {
  return yid.http.get(`${prefix}/list/all`)
}

export default {
  searchListAll,
  saveCardInfo,
  cardRules,
  saveCardRules,
  delCardRule,
  cardInfoByID,
  editCardStatus,
  cardList
}
