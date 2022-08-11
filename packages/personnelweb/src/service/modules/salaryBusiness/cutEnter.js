/*
 * @Author: wqy
 * @Date: 2022-08-11 09:33:30
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-11 14:55:06
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\cutEnter.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/salaryinputbill'

// 扣款/奖金录入单查询
export function list(params) {
  return yid.http.get(`${prefix}/billList`, { params })
}

// 扣款/奖金录入单批次详情查询
export function billListBybatchNo(params) {
  return yid.http.get(`${prefix}/billListBybatchNo`, { params })
}

// 扣款/奖金录入单员工查询
export function queryMonthRptHreesalList(params) {
  return yid.http.get(`${prefix}/queryMonthRptHreesalList`, { params })
}

// 扣款/奖金录入批量保存
export function save(params) {
  return yid.http.post(`${prefix}/saveBills`, params)
}

// 扣款/奖金录入单批次号查询（数量）
export function getBillsByBatchNo(params) {
  return yid.http.get(`${prefix}/getBillsByBatchNo`, { params })
}

// 扣款/奖金录入单批次号删除
export function deleteBillByBatchNo(params) {
  return yid.http.get(`${prefix}/deleteBillByBatchNo`, { params })
}

// 扣款/奖金录入单批次号审核
export function censorBillByBatchNo(params) {
  return yid.http.get(`${prefix}/censorBillByBatchNo`, {
    params
  })
}

export default {
  list,
  queryMonthRptHreesalList,
  save,
  getBillsByBatchNo,
  deleteBillByBatchNo,
  censorBillByBatchNo,
  billListBybatchNo
}
