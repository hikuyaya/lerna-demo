import yid from '@src/library'

const prefix = 'api-chain/smsorder';

export function create(params) {
    return yid.http.post(`${prefix}/create`, params)
}

export function pageList(params) {
    return yid.http.get(`${prefix}`, {params})
}


export default {
    create,
    pageList
}