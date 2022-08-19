/*
 * @Author: wqy
 * @Date: 2022-08-19 14:40:58
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-19 14:42:16
 * @FilePath: \personnelweb\src\service\modules\salaryReport\shopPaymentDetail.js
 * @Description:
 */
import yid from '@src/library'

// 门店打款明细查询
export function list(params) {
  return yid.http.get(`api-pers/paysalarylogbilldetail/queryPaySalaryReport`, {
    params
  })
}

// 查询点对点打款次数
export function getPayCountByBillCode(params) {
  return yid.http.get(`api-pers/paysalarylogbill/getPayCountByBillCode`, {
    params
  })
}

export default {
  list,
  getPayCountByBillCode
}
