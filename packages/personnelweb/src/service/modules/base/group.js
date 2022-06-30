/*
 * @Author: wqy
 * @Date: 2022-06-30 09:23:01
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-30 11:24:33
 * @FilePath: \personnelweb\src\service\modules\base\group.js
 * @Description: 组织设置相关接口
 */
import yid from '@src/library'

const prefix = 'api-chain/'
// 组织列表
export function list(params) {
  return yid.http.get(`${prefix}/dictregion/list`, { params })
}

export default {
  list
}
