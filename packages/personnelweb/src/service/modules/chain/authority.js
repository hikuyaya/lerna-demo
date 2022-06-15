import yid from '@src/library'

const prefix = 'api-cashier/modelauthority';

export function listBypage(params) {
    return yid.http.get(`${prefix}`, {params})
}

export function saveAuthority(params) {
    return yid.http.post(`${prefix}`, params)
}

export function editAuthority(params) {
    return yid.http.post(`${prefix}/edit`, params)
}

export default {
    listBypage,
    saveAuthority,
    editAuthority,
}