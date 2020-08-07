import yid from '@src/library'

const prefix = 'api-push/systemmstatus/';
export function list(params) {
    return yid.http.get(`${prefix}list/account`, {params})
}

export function publish(params) {
    return yid.http.post(`${prefix}publish`, params)
}

export function batchSave(params) {
    return yid.http.post(`${prefix}batchSave`, params)
}

export function listchain(params) {
    return yid.http.get(`${prefix}list/accountchain`, {params})
}

//系统消息
export default {
    list,
    publish,
    batchSave,
    listchain
}