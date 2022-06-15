import yid from '@src/library'

const prefix = 'api-finance/financialdaily'

export function importFd(params) {
  return yid.http.post(`${prefix}/importFd`, params)
}

export function getFd(params) {
  return yid.http.get(`${prefix}/getFd`, { params })
}

export function getUnbalance(params) {
  return yid.http.get(`${prefix}/getUnbalance`, { params })
}

export function deleteFd(params) {
  return yid.http.post(`${prefix}/deleteFd`, params)
}

export function autoLock(params) {
  return yid.http.post(`${prefix}/autoLock`, params)
}

export function doFree(params) {
  return yid.http.post(`${prefix}/doFree`, params)
}

export function doLock(params) {
  return yid.http.post(`${prefix}/doLock`, params)
}

export function saveMemo(params) {
  return yid.http.post(`${prefix}/saveMemo`, params)
}

export function doSplit(params) {
  return yid.http.post(`${prefix}/doSplit`, params)
}

export function getFundhcList(params) {
  return yid.http.get(`${prefix}/getFundhcList`, { params })
}

export function updateFundhc(params) {
  return yid.http.post(`${prefix}/updateFundhc`, params)
}

export default {
  importFd, //导入
  getFd, //获取日结对账资金相关数据
  getUnbalance, //获取未对账流水
  deleteFd, //删除流水数据
  autoLock, //自动匹配流水
  doLock, //手动匹配流水
  doFree, //解除匹配流水
  doSplit, //拆分流水数据
  saveMemo, //批量修改流水备注
  getFundhcList, //获取没有完成对账且已复核的备用金回存单列表
  updateFundhc //批量修改备用金回存单备注及对账状态
}
