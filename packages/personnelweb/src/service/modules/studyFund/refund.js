/*
 * @Author: wqy
 * @Date: 2022-08-05 14:50:49
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-05 14:55:56
 * @FilePath: \personnelweb\src\service\modules\studyFund\refund.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/eexxjadjbill'

// 学习金退费名单
export function list(params) {
  return yid.http.get(`${prefix}/queryEesaltk`, { params })
}

// 学习金退费记录
export function all(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

// 已缴纳学习金查询
export function expEesaltk() {
  return yid.http.get(`${prefix}/expEesaltk`)
}

export default {
  list,
  all,
  expEesaltk
}
