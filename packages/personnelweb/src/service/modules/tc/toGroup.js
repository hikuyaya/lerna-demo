import yid from '@src/library'

const prefix = 'api-pers/royaltygroup'

//  保存提成子集
export function save(params) {
  return yid.http.post(`${prefix}`, params)
}

//  复制提成子集
export function copy(param) {
  return yid.http.post(`${prefix}/copy`, param)
}

//  删除提成子集
export function deleteGroup(id) {
  return yid.http.delete(`${prefix}` + '/' + id)
}

//  查询完整的提成子集
export function getById(id) {
  return yid.http.get(`${prefix}` + '/vo/' + id)
}

//  查询指定方案的子集,仅包含适用人员信息
export function getList(prmid) {
  return yid.http.get(`${prefix}` + '/list/' + prmid)
}

//  获取员工的方案明细
export function getByEmployee(param) {
  return yid.http.post(`${prefix}` + '/employee', param)
}

export default {
  save,
  deleteGroup,
  getById,
  getList,
  copy,
  getByEmployee
}
