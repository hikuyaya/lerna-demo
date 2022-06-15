import yid from '@src/library'

const prefix = 'api-cashier';

export function getOnlineSaleList(params) {
    return yid.http.get(`${prefix}/servicerecords/xxwFindProductList`, {params})
}

export function xxwFindProductNum(params) {
    return yid.http.get(`${prefix}/servicerecords/xxwFindProductNum`, {params})
}

export default {
    //   营业记录 线上客装销售记录
    getOnlineSaleList,
    //合计金额,数量
    xxwFindProductNum
}