import yid from '@src/library'

const prefix = 'api-member/tkhead';

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

export function saveRefund(params) {
    return yid.http.post(`${prefix}/saveRefund`,params)
}

export default {
    pageList,
    getBill,
    getMember,
    saveRefund,
    cardzkLogs,
}
