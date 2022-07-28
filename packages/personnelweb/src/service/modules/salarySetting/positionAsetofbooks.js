/*
 * @Author: wqy
 * @Date: 2022-07-28 16:42:36
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-28 16:42:39
 * @FilePath: \personnelweb\src\service\modules\salarySetting\positionAsetofbooks.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/positionsal'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}/savePositionSal`, params)
}

export default {
  list,
  save
}
