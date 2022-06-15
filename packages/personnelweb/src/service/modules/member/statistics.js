import yid from '@src/library'

const prefix = 'api-member/statistics'

export function statisticsList(params) {
  return yid.http.get(`${prefix}/statisticsListForChain`, { params })
}

export default {
  /**会员数据汇总表**/
  statisticsList
}
