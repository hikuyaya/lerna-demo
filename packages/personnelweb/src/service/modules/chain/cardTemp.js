import yid from '@src/library'

const prefix = 'api-chain/cardtemp';

export function saveOrUpdate(params) {
    return yid.http.post(`${prefix}`,params)
}

export function searchList(params) {
    return yid.http.get(`${prefix}/search`,{params})
}

export function findCardtemps(params) {
    return yid.http.get(`${prefix}/list/all`,{params})
}


export default {
    /** 业务类型列表 不带分页*/
    saveOrUpdate,
    searchList,
    findCardtemps,
}