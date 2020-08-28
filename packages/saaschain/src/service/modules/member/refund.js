import yid from '@src/library'

const prefix = 'api-member/tkhead';

export function shoppageList(params) {
    return yid.http.get(`${prefix}`, {params})
}

export function pageList(params) {
    return yid.http.get(`${prefix}/chain/list`, {params})
}

export  function  getBill(id) {
    return yid.http.get(`${prefix}/chain/getBill/${id}`)
}

export  function cardzkLogs(params) {
    return yid.http.get(`api-member/zkcardlog/list/all/`,{params})
}

export function getMember(params) {
    return yid.http.get(`${prefix}/getMember/`,{params})
}

export function getDiffMember(params) {
    return yid.http.get(`${prefix}/getDiffMember/`,{params})
}


export function saveRefund(params) {
    return yid.http.post(`${prefix}/saveRefund`,params)
}

export default {
    shoppageList,
    pageList,
    getBill,
    getMember,
    getDiffMember,
    saveRefund,
    cardzkLogs,
}
