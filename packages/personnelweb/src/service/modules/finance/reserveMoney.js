import yid from '@src/library'

const prefix = 'api-finance/reservemoney'

export function getReseveJe(params) {
  return yid.http.get(`${prefix}/getReseveJe`, { params })
}

export function getShopReseveMoney(params) {
  return yid.http.get(`${prefix}/getShopReseveMoney`, { params })
}

export default {
  getReseveJe,
  getShopReseveMoney
}
