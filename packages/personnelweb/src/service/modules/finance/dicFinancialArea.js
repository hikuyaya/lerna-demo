import yid from '@src/library'

const prefix = 'api-finance'

export function jobList(params) {
  const url = `${prefix}/dicfinancialarea/list`
  return yid.http.get(url, { params })
}

export function getJobMaxId() {
  const url = `${prefix}/dicfinancialarea/getMaxId`
  return yid.http.get(url)
}

export function saveJob(params) {
  const url = `${prefix}/dicfinancialarea`
  return yid.http.post(url, params)
}

export function updateStatusJob(params) {
  const url = `${prefix}/dicfinancialarea/updateStatus`
  return yid.http.post(url, params)
}
export function financeAreaAll(params) {
  const url = `${prefix}/dicfinancialarea/list/all`
  return yid.http.get(url, { params })
}

export default {
  /** 列表 */
  jobList,

  /**获取最大code+1**/
  getJobMaxId,

  /**保存或更新**/
  saveJob,

  updateStatusJob,

  financeAreaAll
}
