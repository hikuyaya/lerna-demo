/*
 * @Author: wqy
 * @Date: 2022-08-16 11:09:47
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 11:12:03
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\pointToPoint.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/paysalarylogbill'

// 点对点打款查询
export function list(params) {
  return yid.http.get(`${prefix}/billList`, { params })
}

// 点对点打款查询打款单列表
export function getSalaryPayBills(params) {
  return yid.http.get(`${prefix}/getSalaryPayBills`, { params })
}

// 保存
export function save(params) {
  return yid.http.post(`${prefix}/saveBill`, params)
}

// 删除
export function remove(params) {
  return yid.http.post(`${prefix}/deleteBill`, params)
}

// 点对点打款审核
export function approve(params) {
  return yid.http.post(`${prefix}/censorBill`, params)
}

export default {
  list,
  getSalaryPayBills,
  save,
  remove,
  approve
}
