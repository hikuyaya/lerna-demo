/*
 * @Author: wqy
 * @Date: 2022-08-02 15:09:21
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-07 17:07:13
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\specialRequest.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/specsalarybill'

// 特殊工资申请查询（门店
export function list(params) {
  return yid.http.get(`${prefix}/billList`, { params })
}

// 特殊工资项列表获取
export function getSalcompSpecList(params) {
  return yid.http.get(`${prefix}/getSalcompSpecList`, { params })
}

// 特殊工资申请进入员工选择
export function enterHrspecemps(params) {
  return yid.http.get(`${prefix}/enterHrspecemps`, { params })
}

// 特殊工资申请员工查询
export function getHrspecemps(params) {
  return yid.http.get(`${prefix}/getHrspecemps`, { params })
}

// 查询员工保底差额信息
export function getEmpBdInfo(params) {
  return yid.http.get(`api-pers/workattendancedaybilldetail/getEmpBdInfo`, {
    params
  })
}

// 保存
export function save(params) {
  return yid.http.post(`${prefix}/saveBill`, params)
}

// 删除
export function remove(params) {
  return yid.http.post(`${prefix}/deletebill`, params)
}

// 撤回
export function revoke(params) {
  return yid.http.post(`${prefix}/undoBill`, params)
}

// 提交
export function submit(params) {
  return yid.http.post(`${prefix}/submitBill`, params)
}

export default {
  list,
  getSalcompSpecList,
  enterHrspecemps,
  getHrspecemps,
  getEmpBdInfo,
  save,
  remove,
  revoke,
  submit
}
