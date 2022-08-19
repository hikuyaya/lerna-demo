/*
 * @Author: wqy
 * @Date: 2022-08-19 09:17:40
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-19 09:27:36
 * @FilePath: \personnelweb\src\service\modules\salaryReport\shopSalaryDetail.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/salary/reportForm'
export function list(params) {
  return yid.http.get(`${prefix}/salaryListToShop`, { params })
}

export default {
  list
}
