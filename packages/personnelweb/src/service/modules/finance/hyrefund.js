import yid from '@src/library'

const prefix = 'api-finance/cardtkhead';


export function savesp(params) {
    return yid.http.post(`${prefix}/savesp`, params)
}

export function list(params) {
    return yid.http.get(`${prefix}/findListWithProChain`, {params})
}

export function findstatuslovVOs(params) {
    return yid.http.get(`api-finance/cardtkstatuslog/list/all`, {params})
}

export function censor(params) {
    return yid.http.post( `${prefix}/auditSpBill`, params )
}

export function censorFh(params) {
    return yid.http.post( `${prefix}/auditFhBill`, params )
}

export function cancelFhBill(params) {
    return yid.http.post( `${prefix}/cancelFhBill`, params )
}


export function auditBillZeor(params) {
    return yid.http.post( `${prefix}/auditBillZeor`, params )
}
export function fhBillZeor(params) {
    return yid.http.post( `${prefix}/fhBillZeor`, params )
}

export function billListsp(params) {
    return yid.http.get(`${prefix}/billListsp`, {params})
}

export function rejectBill(params) {
    const url = `${prefix}/rejectBill`
    return yid.http.post(url, params )
}

export function rejectBillFh(params) {
    const url = `${prefix}/rejectBillFh`
    return yid.http.post(url, params )
}

export function queryMemPackageTk(params) {
    return yid.http.get(`api-member/financecardtk/queryMemPackageTk`,{params})
}
export function queryMemProductTk(params) {
    return yid.http.get(`api-member/financecardtk/queryMemProductTk`,{params})
}

export function queryCardRecords(params) {
    return yid.http.get(`api-member/financecardtk/queryCardRecords`, {params})
}

export default {
    queryMemPackageTk,
    queryMemProductTk,
    queryCardRecords,
    savesp,
    list,
    findstatuslovVOs,
    censor,
    auditBillZeor,
    billListsp,
    censorFh,
    rejectBill,
    rejectBillFh,
    cancelFhBill,
    fhBillZeor,
}
