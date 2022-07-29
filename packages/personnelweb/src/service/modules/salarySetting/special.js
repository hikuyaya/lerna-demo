/*
 * @Author: wqy
 * @Date: 2022-07-29 09:09:37
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-29 09:11:59
 * @FilePath: \personnelweb\src\service\modules\salarySetting\special.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/salcompspec'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}/saveSalcompspec`, params)
}

export default {
  list,
  save
}
