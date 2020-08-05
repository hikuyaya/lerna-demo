import yid from '@src/library'

const prefix = 'api-yy';

export function queryChannels() {
    return yid.http.get(`${prefix}/channel/list/all`)
}

export function queryYyBilllist(params) {
    return yid.http.get(`${prefix}/billhead`, {params})
}

export function getYybill(id) {
    return yid.http.get(`${prefix}/billhead/id/${id}`)
}


export function editYYdate(params) {
    return yid.http.post(`${prefix}/billhead/editYYdate`, params)
}

export function yysure(params) {
    return yid.http.post(`${prefix}/billhead/yysure`, params)
}

export function yycancel(params) {
    return yid.http.post(`${prefix}/billhead/cancel`, params)
}

export function lookYyBillLogs(params) {
    return yid.http.get(`${prefix}/billlog/list/all`, {params})
}

export default {
    queryYyBilllist,
    queryChannels,
    editYYdate,
    yycancel,
    getYybill,
    yysure,
    lookYyBillLogs
}