import yid from '@src/library'

const prefix = 'api-pers/checkrule'

export function checkruleList(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function saveCheckrule(params) {
  const url = `${prefix}`
  return yid.http.post(url, params)
}

export default {
  /**迟到早退规则列表**/
  checkruleList,
  /**迟到早退规则保存**/
  saveCheckrule
}
