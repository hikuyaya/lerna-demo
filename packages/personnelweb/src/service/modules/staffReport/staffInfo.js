/*
 * @Author: wqy
 * @Date: 2022-08-12 11:33:43
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-12 11:36:30
 * @FilePath: \personnelweb\src\service\modules\staffReport\staffInfo.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/employeeotherinfo'

// 员工信息表
export function list(params) {
  return yid.http.get(`${prefix}/getHemployeeInfos`, { params })
}

export default {
  list
}
