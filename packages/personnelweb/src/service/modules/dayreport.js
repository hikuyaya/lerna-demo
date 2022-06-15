import yid from '@src/library'

export function servicerecordList(params) {
    return yid.http.get(`api-cashier/servicerecords/chain/admin/servicerecordList`, {params})
}

export function packagerecordList(params) {
    return yid.http.get(`api-cashier/packagerecords/chain/admin/packageRecordList`, {params})
}

export function cardRecordList(params) {
    return yid.http.get(`api-cashier/cardrecords/chain/admin/cardRecordsList`, {params})
}

export function ioAccountList(params) {
    return yid.http.get(`api-finance/ioaccountbillhead/ioAccountList`, {params})
}

export function jditemList(params) {
    return yid.http.get(`api-finance/djbillhead/list/all`, {params})
}

export function tkheadList(params) {
    return yid.http.get(`api-finance/cardtkhead/list/all`, {params})
}

export default {
    servicerecordList,
    packagerecordList,
    cardRecordList,
    ioAccountList,
    jditemList,
    tkheadList
}