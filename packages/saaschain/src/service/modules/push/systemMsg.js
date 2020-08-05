import yid from '@src/library'

const prefix = 'api-push/systemmsg/';
export function list(params) {
    return yid.http.get(`${prefix}list/shop`, {params})
}

export function batchSave(params) {
    return yid.http.post(`${prefix}batchSave`, params)
}

////系统消息
export default {
    list,
    batchSave
}