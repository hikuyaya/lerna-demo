import yid from '@src/library'

const prefix = 'api-pers/awarddict';
const prefixChain = 'api-chain/awarddict';

export function perAwardDictList(params) {
    return yid.http.get(`${prefixChain}`, {params})
}


export function saveAward(params) {
    return yid.http.post(`${prefixChain}`, params)
}

export function getAll(params) {
    return yid.http.get(`${prefix}/list/all`, params)
}

export default {
    /** 工资奖罚列表 */
    perAwardDictList,
    /** 保存 or 新增 工资奖罚 */
    saveAward,
    /** 查询所有列表 **/
    getAll
}
