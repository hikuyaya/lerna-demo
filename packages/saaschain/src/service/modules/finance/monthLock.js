import yid from '@src/library'

const prefix = 'api-finance';



export function jobList(params) {
    const url = `${prefix}/monthlock/list`
    return yid.http.get(url, { params })
}



export function saveJob(params) {
    const url = `${prefix}/monthlock`
    return yid.http.post(url, params )
}

export function monthLockAll(params) {
    const url = `${prefix}/monthlock/list/all`
    return yid.http.get(url, { params })
}

export default {

    /** 列表 */
    jobList,

    /**保存或更新**/
    saveJob,

    monthLockAll,

}

