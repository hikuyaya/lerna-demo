/*
 * @Author: wqy
 * @Date: 2022-08-12 10:03:57
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-12 10:04:26
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\payApprove.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/paysalarybill'

// 薪酬打款审核查询
export function list(params) {
  return yid.http.get(`${prefix}/billListForChain`, { params })
}

export default {
  list
}
