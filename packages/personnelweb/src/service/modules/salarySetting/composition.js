/*
 * @Author: wqy
 * @Date: 2022-07-26 09:01:17
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-26 10:20:36
 * @FilePath: \personnelweb\src\service\modules\salarySetting\composition.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/salcomp'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function menuList() {
  return yid.http.get(`mock/menulist.json`, {})
}

export default {
  list,
  menuList
}
