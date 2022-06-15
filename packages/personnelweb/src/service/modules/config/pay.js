import yid from '@src/library'

const prefix = 'api-chain';

export function queryPaysMolds() {
    return yid.http.get(`${prefix}/paymold/list/all`)
}

export function queryPays(params) {
    return yid.http.get(`${prefix}/paytypeinfo/list/all`,{params})
}

export function getPayinfo(params) {
    return yid.http.get(`${prefix}/paytypeinfo/list/all`,{params})
}

export function stopPay(params) {
    return yid.http.post(`${prefix}/paytypeinfo/EditStatus`,params)
}

export function savePay(params) {
    return yid.http.post(`${prefix}/paytypeinfo/savePay`,params)
}

export default{
    queryPaysMolds,queryPays,getPayinfo,stopPay,savePay
}
