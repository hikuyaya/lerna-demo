import yid from '@src/library'

const prefix = 'api-finance/fundbillhead';

export function billListForchain(params) {
    return yid.http.get(`${prefix}/billListForchain`, {params})
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

export function auditFhBill(params) {
    const url = `${prefix}/auditFhBill`
    return yid.http.post(url, params )
}

export function auditFhBilllBatch(params) {
    const url = `${prefix}/auditFhBilllBatch`
    return yid.http.post(url, params )
}

export function cancleFhBilllBatch(params) {
    const url = `${prefix}/cancleFhBilllBatch`
    return yid.http.post(url, params )
}


export function changeGathertype(params) {
    const url = `${prefix}/changeGathertype`
    return yid.http.post(url, params )
}

export function changeGathertypeBatch(params) {
    const url = `${prefix}/changeGathertypeBatch`
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

export function setLimitbill(params) {
    const url = `${prefix}/setLimitbill`
    return yid.http.post(url, params )
}

export function setLimitbillBatch(params) {
    const url = `${prefix}/setLimitbillBatch`
    return yid.http.post(url, params )
}



export function getIoAccount(params) {
    return yid.http.post(`api-finance/ioaccount//getIoAccount`, params)
}

export function getDormRentCont(params) {
    return yid.http.post(`api-finance/dormrentcont//getDormRentCont`, params)
}

export function listForfund(params) {
    return yid.http.get(`api-finance/fundlock/listForfund`, {params})
}
export function listfundlog(params) {
    return yid.http.get(`api-finance/fundlock/list`, {params})
}
export function listfundgtlog(params) {
    return yid.http.get(`api-finance/fundbillgtlog/list`, {params})
}

export function saveFundLock(params) {
    const url = `api-finance/fundlock/saveFundLock`
    return yid.http.post(url, params )
}

export default {
    billListForchain,
    listAll,
    saveBill,
    queryFundShop,
    deleteBill,
    auditFhBill,
    saveFundPhoto,
    getIoAccount,
    getDormRentCont,
    rejectBill,
    rejectBillBatch,
    auditFhBilllBatch,
    cancleFhBilllBatch,
    expRecordsList,
    changeGathertypeBatch,
    changeGathertype,
    setLimitbill,
    setLimitbillBatch,
    listForfund,
    saveFundLock,
    listfundlog,
    listfundgtlog,
}