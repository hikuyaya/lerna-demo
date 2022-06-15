import yid from '@src/library'

const prefix = 'api-cashier/prepaidorder'

export function orderList(params) {
  return yid.http.get(`${prefix}/chain/list/orderList`, { params })
}

export function refound(params) {
  const url = `${prefix}/payOrder/refound`
  return yid.http.post(url, params)
}

export function queryByno(params) {
  const url = `${prefix}/getAdjUnionpay`
  return yid.http.post(url, params)
}

export function dgzhzjb(params) {
  return yid.http.get(`${prefix}/report/dgzhzjb`, { params })
}

export function yltlstjb(params) {
  return yid.http.get(`${prefix}/report/yltlstjb`, { params })
}

export default {
  /**收款流水记录**/
  orderList,
  /**退款接口**/
  refound,
  /**银联通调整,根据订单号查记录**/
  queryByno,
  /**报表-对公账户资金表**/
  dgzhzjb,
  /**报表-银联通流水统计表**/
  yltlstjb
}
