import yid from '@src/library'

const prefix = 'api-user/menus'

const rptfix = 'api-config/report/item'

export function treeList(params) {
  return yid.http.get(`${prefix}/treeList`, { params })
}

export function saveOrUpdate(params) {
  const url = `${prefix}/saveOrUpdate`
  return yid.http.post(url, params)
}

export function deleteMenu(id) {
  const url = `${prefix}/${id}`
  return yid.http.delete(url)
}

export function getRoleMenus(id) {
  const url = `${prefix}/getRoleMenus/${id}`
  return yid.http.get(url)
}

export function getAllMenus(params) {
  const url = `${prefix}/getAllMenus`
  return yid.http.get(url, { params })
}

export function getRptItem(params) {
  const url = `${rptfix}/list`
  return yid.http.get(url, { params })
}

export function saveRptItem(params) {
  const url = `${rptfix}/edit`
  return yid.http.put(url, params)
}

export default {
  treeList,
  saveOrUpdate,
  deleteMenu,
  getRoleMenus,
  getAllMenus,
  getRptItem,
  saveRptItem
}
