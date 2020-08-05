import yid from '@src/library'

const prefix = 'api-member/statisticsym';

export function statisticsYmList(params) {
    return yid.http.get(`${prefix}/statisticsYmList`, {params})
}

export function statisticsYmExport(params) {
    return yid.http.get(`${prefix}/statisticsYmExport`, {params})
}

export default {
    /**会员消费分析表**/
    statisticsYmList,
    /**导出**/
    statisticsYmExport,
}