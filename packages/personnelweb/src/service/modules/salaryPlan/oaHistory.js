/*
 * @Author: wqy
 * @Date: 2022-08-01 14:31:02
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-01 15:39:41
 * @FilePath: \personnelweb\src\service\modules\salaryPlan\oaHistory.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/employee_sal_log'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export default {
  list
}
