import yid from '@src/library'

const prefix = 'api-cashier/thirdorder';

export function thirdorderList(params) {
    return yid.http.get(`${prefix}/chain/orderList`, {params})
}

export function tkBill(params) {
    const url = `${prefix}/mt/tkbill`
    return yid.http.post(url,params)
}

export default {
    thirdorderList,
    tkBill,
}