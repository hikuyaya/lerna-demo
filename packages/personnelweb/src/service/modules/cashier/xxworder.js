import yid from '@src/library'

const prefix = 'api-cashier/xxwbusinesslog';

export function xxworderList(params) {
    return yid.http.get(`${prefix}/orderListForChain`, {params})
}

export default {
    xxworderList
}