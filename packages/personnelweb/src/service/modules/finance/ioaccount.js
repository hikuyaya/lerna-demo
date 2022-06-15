import yid from '@src/library'

const prefix = 'api-finance/ioaccount/'
export function list(params) {
  return yid.http.get(`${prefix}list`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}`, params)
}

export function getIoAccount(params) {
  return yid.http.post(`${prefix}/getIoAccount`, params)
}

export function ioAccountList(params) {
  return yid.http.get(`api-finance/ioaccountbillhead/ioAccountList`, { params })
}

export function saveSystem(params) {
  const url = `${prefix}/saveSystem`
  return yid.http.post(url, params)
}

export function billList(params) {
  return yid.http.get(`api-finance/ioaccountbillhead/billListChain`, { params })
}

export default {
  /** 列表 */
  list,
  save,
  getIoAccount,
  ioAccountList,
  saveSystem,
  billList
}
