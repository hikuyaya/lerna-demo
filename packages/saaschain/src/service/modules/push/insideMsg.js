import yid from '@src/library'

const prefix = 'api-push/insidemsg/';
export function list(params) {
    return yid.http.get(`${prefix}list/shop`, {params})
}

export function publish(params) {
    return yid.http.post(`${prefix}publish`, params)
}

export function batchSave(params) {
    return yid.http.post(`${prefix}batchSave`, params)
}

//内部消息
export default {
    list,
    publish,
    batchSave
}