/*
 * @Author: wqy
 * @Date: 2022-07-11 14:03:08
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-12 09:04:04
 * @FilePath: \personnelweb\src\service\modules\staff\workingage.js
 * @Description: 工龄维护
 */
import yid from '@src/library'

const prefix = 'api-pers/employeeworkyearmaintenance'

// 列表
export function list(params) {
  return yid.http.get(`${prefix}/billList`, { params })
}
// 保存
export function save(params) {
  return yid.http.post(`${prefix}/saveBills`, params)
}
// 根据批次号删除
export function deleteBill(params) {
  return yid.http.post(`${prefix}/deleteBill`, params)
}
// 根据批次号审核
export function censorBill(params) {
  return yid.http.post(`${prefix}/censorBill`, params)
}

export default {
  list,
  save,
  deleteBill,
  censorBill
}
