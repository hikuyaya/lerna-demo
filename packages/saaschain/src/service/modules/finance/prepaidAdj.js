import yid from '@src/library'

const prefix = 'api-cashier';

export function jobList(params) {
    const url = `${prefix}/prepaidadj/list`
    return yid.http.get(url, { params })
}

export function saveJob(params) {
    const url = `${prefix}/prepaidadj`
    return yid.http.post(url, params )
}

export function queryList(params) {
    return yid.http.get(`${prefix}/prepaidadj/queryList`, {params})
}

export default {
    /** 列表 */
    jobList,
    /**保存或更新**/
    saveJob,

    queryList,
}

