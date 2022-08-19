/*
 * @Author: wqy
 * @Date: 2022-08-19 10:49:09
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-19 11:10:34
 * @FilePath: \personnelweb\src\service\modules\salaryReport\salaryDetailCollection.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/salary/reportForm'

export function list(params) {
  return yid.http.get(`${prefix}/salaryListToManage`, { params })
}

export default {
  list
}
