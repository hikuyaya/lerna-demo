import yid from '@src/library'

const prefix = 'api-user';

export function saveLoginShops(uid, params) {
    return yid.http.post(`${prefix}/loginshop/${uid}/saveLoginShops`, params)
}

export function saveMangerShops(uid, params) {
    return yid.http.post(`${prefix}/mangershop/${uid}/saveMangerShops`, params)
}

export default {
    saveLoginShops,
    saveMangerShops
}