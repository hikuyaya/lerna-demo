/*
 * @Author: wqy
 * @Date: 2022-07-07 13:47:59
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-07 13:49:51
 * @FilePath: \personnelweb\src\service\modules\staff\profile.js
 * @Description: 员工资料维护
 */
import yid from '@src/library'

const prefix = 'api-pers/employeeotherinfo'

// 员工资料列表查询
export function list(params) {
  return yid.http.get(`${prefix}/listInfo`, { params })
}
// 修改
export function update(params) {
  return yid.http.post(`${prefix}/saveInfo`, params)
}

export default {
  list,
  update
}
