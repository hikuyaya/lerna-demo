import yid from '@src/library'

const prefix = 'api-chain/dictregion';

export function treeAll(params) {
    return yid.http.get(`${prefix}/tree/all`, {params})
}

export function treeTwo(params) {
    return yid.http.get(`${prefix}/tree/two`, {params})
}

export function saveRegion(params) {
    const url = `${prefix}/saveRegion`
    return yid.http.post(url, params)
}

export function getRegionByid(id) {
    const url = `${prefix}/${id}`
    return yid.http.get(url)
}


export default {
    /**查询区域树结构**/
    treeAll,
    /**查询区域树结构(二级)**/
    treeTwo,
    /**保存或修改区域**/
    saveRegion,
    /**通过id查询区域**/
    getRegionByid,
}