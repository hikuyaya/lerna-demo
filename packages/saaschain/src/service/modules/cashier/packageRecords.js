import yid from '@src/library'

const prefix = 'api-cashier/packagerecords';

export function packagerecordList(params) {
    return yid.http.get(`${prefix}/admin/packageRecordList`, {params})
}

export default {
    /**套餐购买记录**/
    packagerecordList,
}