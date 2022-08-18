/*
 * @Author: wqy
 * @Date: 2022-08-07 11:19:16
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-18 10:40:58
 * @FilePath: \personnelweb\src\service\modules\studyFund\tag.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/inductionway'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}`, params)
}

export function all() {
  return yid.http.get(`${prefix}/list/all`, {})
}

export default {
  list,
  save,
  all
}
