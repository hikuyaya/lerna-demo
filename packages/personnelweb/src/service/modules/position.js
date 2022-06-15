import yid from '@src/library'

const prefixChain = 'api-chain/position';

export function list(params) {
    return yid.http.get(`${prefixChain}/list/all`, {params})
}

export function listForChain(params) {
    return yid.http.get(`${prefixChain}/list/all`, {params})
}

export function stationdesc(params) {
    return yid.http.get(`api-chain/stationdesc/desc`, {params})
}

export default {
    /** 职务列表 */
    list,
    listForChain,
    stationdesc
}
