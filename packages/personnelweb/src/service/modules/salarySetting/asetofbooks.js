/*
 * @Author: wqy
 * @Date: 2022-07-28 14:28:32
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-28 16:04:45
 * @FilePath: \personnelweb\src\service\modules\salarySetting\asetofbooks.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/salset'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}/saveSalset`, params)
}

export default {
  list,
  save
}
