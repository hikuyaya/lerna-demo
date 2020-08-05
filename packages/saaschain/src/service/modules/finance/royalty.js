import yid from '@src/library'

const prefix = 'api-pers';

export function getERList(params) {
    return yid.http.post(`${prefix}/employeeroyalty/list`, params)
}

export default {
    /** 获取员工工资明细 **/
    getERList
}