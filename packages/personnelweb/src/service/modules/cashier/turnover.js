import yid from '@src/library'

const prefix = 'api-cashier/turnover';

export function turnoverList(params) {
    return yid.http.get(`${prefix}/chain/turnoverList`, {params})
}

export default {
    /**收款流水记录**/
    turnoverList,
}