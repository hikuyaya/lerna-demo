/*
 * @Author: wqy
 * @Date: 2022-08-02 11:20:20
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-02 11:27:16
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\attendance.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/employeesalbill'

// 列表
export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export default {
  list
}
