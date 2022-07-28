/*
 * @Author: wqy
 * @Date: 2022-06-15 14:05:18
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-28 09:18:01
 * @FilePath: \personnelweb\src\service\modules\chain\employee.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-chain/employee'
const prefixManageData = 'api-chain/datamanager'

export function list(params) {
  return yid.http.get(`${prefix}`, { params })
}

export function getManageData(params) {
  return yid.http.get(`${prefixManageData}/getManageData`, { params })
}

export function manageData(params) {
  return yid.http.post(`${prefixManageData}/saveManageData`, params)
}
// 获取咨询公司员工
export function getCompanyEmployeeList(params) {
  return yid.http.get(`${prefix}/getCompanyEmployeeList`, { params })
}

export default {
  list,
  getManageData,
  manageData,
  getCompanyEmployeeList
}
