/*
 * @Author: wqy
 * @Date: 2022-08-02 15:09:21
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-02 16:30:19
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\specialRequest.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/specsalarybill'

// 列表
export function list(params) {
  return yid.http.get(`${prefix}/billList`, { params })
}

export function enterHrspecemps(params) {
  return yid.http.get(`${prefix}/enterHrspecemps`, { params })
}

export default {
  list,
  enterHrspecemps
}
