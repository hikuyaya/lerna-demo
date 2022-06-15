import yid from '@src/library'

const prefix = 'api-yy';

export function queryChannels() {
    return yid.http.get(`${prefix}/channel/list/all`)
}

export function queryYyBilllist(params) {
    return yid.http.get(`${prefix}/billhead/chain/list`, {params})
}

export function getYybill(params) {
    return yid.http.get(`${prefix}/billhead/id/${params.id}`,{
       /* headers:{
            "x-shopid-header":params.shopid
        }*/
    })
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

export function suretyList(params) {
    return yid.http.get(`${prefix}/billhead/surety/list`, {params})
}

export default {
    queryYyBilllist,
    queryChannels,
    editYYdate,
    yycancel,
    getYybill,
    yysure,
    lookYyBillLogs,
    suretyList
}