import yid from '@src/library'

const prefix = 'api-finance/dayshoppay'

const prefixtk = 'api-finance/cardtkhead'

export function shopRcjy(params) {
  const url = `${prefix}/funds/shop`
  return yid.http.get(url, { params })
}

export function tkheadList(params) {
  const url = `${prefixtk}/list/all`
  return yid.http.get(url, { params })
}

export default {
  shopRcjy,
  tkheadList
}
