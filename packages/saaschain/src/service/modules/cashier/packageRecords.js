import yid from '@src/library'

const prefix = 'api-cashier/packagerecords';

export function packagerecordList(params) {
    return yid.http.get(`${prefix}/chain/admin/packageRecordList`, {params})
}

export function packagerecordListSum(params) {
    return yid.http.get(`${prefix}/chain/admin/packageRecordListSum`, {params})
}

export default {
    /**套餐购买记录**/
    packagerecordList,
    packagerecordListSum
}