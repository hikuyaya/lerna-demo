import yid from '@src/library'

const prefix = 'api-member/tenantstatistics'

export function memberStatistics(params) {
  return yid.http.get(`${prefix}/memberStatistics`, { params })
}

export default {
  //会员类型统计结算List
  memberStatistics
}
