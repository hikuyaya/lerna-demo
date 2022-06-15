import yid from '@src/library'
import { getByEmployee } from './royaltyGroup'

const prefix = 'api-chain/royaltymanage'

//  获取提成方案管理分页
export function page(params) {
  return yid.http.get(`${prefix}`, { params: params })
}

//  更新数据
export function saveOrUpdate(params) {
  return yid.http.post(`${prefix}`, params)
}

//  修改提成启用状态
export function status(params) {
  return yid.http.post(`${prefix}/status`, params)
}

export function search(params) {
  return yid.http.get(`${prefix}/search`, { params })
}

export function findShopManages(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

//  获取提成方案关联门店list
export function unableSelectShopList(params) {
  return yid.http.get(`${prefix}/unableSelectShopList`, { params })
}

//  复制
export function copy(params) {
  return yid.http.post(`${prefix}/copy`, params)
}

//  获取提成方案管理列表
export function getShopManages() {
  return yid.http.get(`${prefix}/list/all?status=1&type=1`)
}

//  保存员工方案
export function saveEmployee(params) {
  return yid.http.post(`${prefix}/employee`, params)
}

//  获取已经不能选的员工
export function unableSelectEmployeeList(params) {
  return yid.http.get(`${prefix}/unableSelectEmployeeList`, { params })
}

export default {
  /** 获取提成方案管理分页 */
  page,
  /** 更新提成方案 */
  saveOrUpdate,
  /** 修改提成方案状态*/
  status,
  search,
  //获取不能已经有提成方案的门店  如果传入提成方案id 只获取的是除这个方案关联门店之外的已有提成方案的门店
  unableSelectShopList,
  copy,
  getShopManages,
  getByEmployee,
  saveEmployee,
  unableSelectEmployeeList,
  findShopManages
}
