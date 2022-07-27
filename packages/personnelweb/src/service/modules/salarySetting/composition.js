/*
 * @Author: wqy
 * @Date: 2022-07-26 09:01:17
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-27 15:49:53
 * @FilePath: \personnelweb\src\service\modules\salarySetting\composition.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/salcomp'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}/saveSalcomp`, params)
}

export function salcompGroup() {
  return yid.http.get(`${prefix}/salcompGroup`, {})
}

export function menuList(params) {
  return yid.http.get(`api-user/menus/getsalcompMenus`, { params })
}

export default {
  list,
  save,
  salcompGroup,
  menuList
}
