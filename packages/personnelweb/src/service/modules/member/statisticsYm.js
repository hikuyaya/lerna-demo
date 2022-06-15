import yid from '@src/library'

const prefix = 'api-member/statisticsym'

export function statisticsYmList(params) {
  return yid.http.get(`${prefix}/statisticsYmListForChain`, { params })
}

export function statisticsYmExport(params) {
  return yid.http.get(`${prefix}/statisticsYmExportForChain`, { params })
}

export default {
  /**会员消费分析表**/
  statisticsYmList,
  /**导出**/
  statisticsYmExport
}
