import yid from '@src/library'

const prefix = 'api-finance'

export function getJobMaxId() {
  const url = `${prefix}/dicioitem/getMaxId`
  return yid.http.get(url)
}

export function ioitemAll(params) {
  const url = `${prefix}/dicioitem/list/pcode`
  return yid.http.get(url, { params })
}

export function jobList(params) {
  const url = `${prefix}/dicioitem/list`
  return yid.http.get(url, { params })
}

export function jobAll(params) {
  const url = `${prefix}/dicioitem/list/all`
  return yid.http.get(url, { params })
}

export function saveJob(params) {
  const url = `${prefix}/dicioitem`
  return yid.http.post(url, params)
}

export default {
  saveJob,
  getJobMaxId,
  jobAll,
  jobList,
  ioitemAll
}
