/*
 * @Author: wqy
 * @Date: 2022-08-12 15:21:11
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-12 15:21:43
 * @FilePath: \personnelweb\src\service\modules\salaryReport\preApproveSalary.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/salaryApplyBillEmployee'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export default {
  list
}
