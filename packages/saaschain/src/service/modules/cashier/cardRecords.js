import yid from '@src/library'

const prefix = 'api-cashier/cardrecords';

export function cardRecordList(params) {
    return yid.http.get(`${prefix}/chain/admin/cardRecordsList`, {params})
}

export function cardRecordsListSum(params) {
    return yid.http.get(`${prefix}/chain/admin/cardRecordsListSum`, {params})
}

export default {
    /**管理端-开卡充值记录**/
    cardRecordList,
    cardRecordsListSum,
}