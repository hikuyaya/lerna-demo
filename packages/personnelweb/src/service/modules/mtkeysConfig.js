import yid from '@src/library'

const prefix = 'api-third'

//  美团授权管理分页
export function listByPage(params) {
  return yid.http.get(`${prefix}/mtkeys/listByPage`, { params })
}

export function saveMtKeys(params) {
  const url = `${prefix}/mtkeys`
  return yid.http.post(url, params)
}

export function mtshopList(params) {
  return yid.http.get(`${prefix}/mtshops/list/all`, { params })
}

export function deleteMtshop(id) {
  const url = `${prefix}/mtshops/${id}`
  return yid.http.delete(url)
}

export function saveMtshop(params) {
  const url = `${prefix}/mtshops/saveMtshop`
  return yid.http.post(url, params)
}

export function saveMt(params) {
  const url = `${prefix}/mtkeys`
  return yid.http.post(url, params)
}

//  美团授权管理分页
export function douyinShopList(params) {
  return yid.http.get(`${prefix}/dyshops`, { params })
}

//  美团授权管理分页
export function douyinList(params) {
  return yid.http.get(`${prefix}/dyshops/dylist`, { params })
}

export function saveDy(params) {
  const url = `${prefix}/dyshops`
  return yid.http.post(url, params)
}

export function deleteDyshop(id) {
  const url = `${prefix}/dyshops/${id}`
  return yid.http.delete(url)
}

export default {
  listByPage,
  saveMtKeys,
  mtshopList,
  deleteMtshop,
  saveMtshop,
  saveMt,
  douyinShopList,
  douyinList,
  saveDy,
  deleteDyshop
}
