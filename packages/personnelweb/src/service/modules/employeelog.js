import yid from '@src/library'

const prefixChain = 'api-chain/employeelog';

export function list(params) {
    return yid.http.get(`${prefixChain}/list/allWithParam`, {params})
}

export default {
    /** 员工列表 */
    list,

}