import yid from '@src/library'
const prefix = 'api-stock/dictinout';

//查询配置列表
export function dictinoutList(params) {
    const url = `${prefix}`
    return yid.http.get(url, { params })
}

//新增或更新配置列表
export function saveDictinout(params) {
    const url = `${prefix}`
    return yid.http.post(url, params )
}

export default {
    dictinoutList,
    saveDictinout
}