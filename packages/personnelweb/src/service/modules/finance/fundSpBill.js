import yid from '@src/library'

const prefix = 'api-finance/fundbillhead';

export function billListForchain(params) {
    return yid.http.get(`${prefix}/billListForchain`, {params})
}
export function billListForchainSp(params) {
    return yid.http.get(`${prefix}/billListForchainSp`, {params})
}

export function listAll(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}

export function expRecordsList(params) {
    return yid.http.get(`${prefix}/expRecordsList`, {params})
}


export function saveBill(params) {
    const url = `${prefix}/saveBill`
    return yid.http.post(url, params )
}



export function deleteBill(params) {
    const url = `${prefix}/deleteBill`
    return yid.http.post(url,params)
}

export function auditSpBill(params) {
    const url = `${prefix}/auditSpBill`
    return yid.http.post(url, params )
}

export function auditSpBilllBatch(params) {
    const url = `${prefix}/auditSpBilllBatch`
    return yid.http.post(url, params )
}



export function queryFundShop(params) {
    return yid.http.post(`api-finance/fundshop/queryFundShop`, params)
}

export function saveFundPhoto(params) {
    return yid.http.post(`${prefix}/saveFundPhoto`,params)
}

export function rejectBill(params) {
    const url = `${prefix}/rejectBill`
    return yid.http.post(url, params )
}
export function rejectBillBatch(params) {
    const url = `${prefix}/rejectBillBatch`
    return yid.http.post(url, params )
}



export function getIoAccount(params) {
    return yid.http.post(`api-finance/ioaccount//getIoAccount`, params)
}

export function getDormRentCont(params) {
    return yid.http.post(`api-finance/dormrentcont//getDormRentCont`, params)
}


export default {
    billListForchain,
    billListForchainSp,
    listAll,
    saveBill,
    queryFundShop,
    deleteBill,
    auditSpBill,
    saveFundPhoto,
    getIoAccount,
    getDormRentCont,
    rejectBill,
    rejectBillBatch,
    auditSpBilllBatch,
    expRecordsList,
}