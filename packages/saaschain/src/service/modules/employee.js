import yid from '@src/library'

const prefix = 'api-base/employee';
const prefixChain = 'api-chain/employee';

export function list(params) {
    return yid.http.get(`${prefixChain}`, {params})
}

export function save(params) {
    return yid.http.post(`${prefixChain}`, params)
}

export function saveTransfer(params) {
    return yid.http.post(`${prefixChain}/saveTransfer`, params)
}

export function editYystatus(params) {
    return yid.http.post(`${prefix}/editYystatus`, params)
}

export function saveOrderids(params) {
    return yid.http.post(`${prefix}/saveOrderids`, params)
}

export function listAll(params) {
    return yid.http.get(`${prefix}/chain/list/all`, {params})
}

export function chainListAll(params) {
    return yid.http.get(`${prefixChain}/listAll`, {params})
}

export function stuffTree(params) {
    return yid.http.get(`${prefix}/list/tree`, {params})
}

export function geteeNum(params) {
    return yid.http.get(`${prefix}/geteeNums`, {params})
}

export function checkEecode(params) {
    return yid.http.post(`${prefix}/checkEecode`,params)
}

export function excelTemplate(params) {
    return yid.http.post(`${prefix}/excelTemplate`,params)
}

export function batchImport(params){
    return yid.http.post(`${prefix}/batchImport`,params)
}

export function updateStatusEmployee(params) {
    return yid.http.post(`${prefix}/updateStatus`, params)
}

export default {
    /** 员工列表 */
    list,
    /** 更新or新增员工列 */
    save,
    /** 所有员工列表 */
    listAll,
    /** 获取 部门-职务-级别-员工 树 */
    stuffTree,
    /**获取员工分配数量**/
    geteeNum,
    /**
     * 修改预约状态
     */
    editYystatus,
    /**
     * 修改员工预约序号
     */
    saveOrderids,
    /**检查工号是否重复**/
    checkEecode,
    excelTemplate,
    batchImport,
    updateStatusEmployee,
    saveTransfer,
    chainListAll
}