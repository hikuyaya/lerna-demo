import yid from '@src/library'

const prefix = 'api-chain';

/**
 * 查询套餐列表
 * @param params
 */
export function findServPackList(params) {
    return yid.http.get(`${prefix}/servicepackage/list`,{params})
}

export function newcode() {
    return yid.http.get(`${prefix}/servicepackage/newcode`)
}

export function servinfo(params) {
    return yid.http.get(`${prefix}/servicepackage/servinfo`,{params})
}

export function product(params) {
    return yid.http.get(`${prefix}/servicepackage/product`,{params})
}

export function findAll(params) {
    return yid.http.get(`${prefix}/servicepackage/list/all`,{params})
}

export function saveServPack(params) {
    return yid.http.post(`${prefix}/servicepackage/save`,params)
}

export function saveServDuoPack(params) {
    return yid.http.post(`${prefix}/servicepackage/saveDuo`,params)
}

export function saveShop(params) {
    return yid.http.post(`${prefix}/servicepackage/saveShop`,params)
}

export function editStatus(params) {
    return yid.http.post(`${prefix}/servicepackage/editStatus`,params)
}

export function delServPack(params) {
    return yid.http.post(`${prefix}/servicepackage/delete`,params)
}

export function saveSystem(params) {
    return yid.http.post(`${prefix}/servicepackage/saveSystem`,params)
}

export default {
    findServPackList,
    newcode,
    servinfo,
    product,
    saveServPack,
    editStatus,
    delServPack,
    saveServDuoPack,
    findAll,
    saveShop,
    saveSystem
}