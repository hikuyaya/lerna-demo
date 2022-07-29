/*
 * @Author: wqy
 * @Date: 2022-07-29 09:44:11
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-29 09:47:51
 * @FilePath: \personnelweb\src\service\modules\salarySetting\specialTime.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/shopspecsalarydate'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function update(params) {
  return yid.http.post(`${prefix}`, params)
}

export function batchUpdateShop(params) {
  return yid.http.post(`${prefix}/batchUpdateShop`, params)
}

export default {
  list,
  update,
  batchUpdateShop
}
