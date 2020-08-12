import yid from '@src/library'

const prefix = 'api-cashier/servicerecords';

export function servicerecordList(params) {
    return yid.http.get(`${prefix}/chain/admin/servicerecordList`, {params})
}

export function servicerecordListOver(params) {
    return yid.http.get(`${prefix}/admin/servicerecordListOver`, {params})
}

export function servicrecordyj(params) {
    return yid.http.get(`${prefix}/chain/servicrecordyj`, {params})
}

export default {
    /**服务单记录**/
    servicerecordList,
    /**服务单记录（过期和作废）**/
    servicerecordListOver,
    /**服务单业绩明细**/
    servicrecordyj,
}