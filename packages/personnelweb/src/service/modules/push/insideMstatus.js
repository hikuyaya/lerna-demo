import yid from '@src/library'

const prefix = 'api-push/adminmstatus/';
export function list(params) {
    return yid.http.get(`${prefix}list/account`, {params})
}

export function publish(params) {
    return yid.http.post(`${prefix}publish`, params)
}

export function batchSave(params) {
    return yid.http.post(`${prefix}batchSave`, params)
}

//系统公告
export default {
    list,
    publish,
    batchSave
}