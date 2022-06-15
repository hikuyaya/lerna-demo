import yid from '@src/library'

const prefix = 'api-user/roletype'
export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export default {
  /** 角色列表 */
  list
}
