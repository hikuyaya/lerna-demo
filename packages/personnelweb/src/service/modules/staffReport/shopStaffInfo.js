/*
 * @Author: wqy
 * @Date: 2022-08-12 11:33:33
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-12 11:35:25
 * @FilePath: \personnelweb\src\service\modules\staffReport\shopStaffInfo.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/employeeotherinfo'

// 门店员工信息
export function list(params) {
  return yid.http.get(`${prefix}/getHemployeeInfos`, { params })
}

export default {
  list
}
