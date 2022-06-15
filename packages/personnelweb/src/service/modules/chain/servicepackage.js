import yid from '@src/library'

const prefix = 'api-chain';

export function newcode() {
    return yid.http.get(`${prefix}/servicepackage/newcode`)
}

export function servinfo(params) {
    return yid.http.get(`${prefix}/servicepackage/servinfo`,{params})
}

export function product(params) {
    return yid.http.get(`${prefix}/servicepackage/productForPrice`,{params})
}

export function findServPackList(params) {
    return yid.http.get(`${prefix}/servicepackage/list`,{params})
}

export function findAll(params) {
    return yid.http.get(`${prefix}/servicepackage/list/all`,{params})
}

export function findServPack(id) {
    return yid.http.get(`${prefix}/servicepackage/findById/${id}`)
}

export function saveServPack(params) {
    return yid.http.post(`${prefix}/servicepackage/save`,params)
}

export function saveServDuoPack(params) {
    return yid.http.post(`${prefix}/servicepackage/saveDuo`,params)
}

export function editStatus(params) {
    return yid.http.post(`${prefix}/servicepackage/editStatus`,params)
}

export function delServPack(params) {
    return yid.http.post(`${prefix}/servicepackage/delete`,params)
}

export function productlist(params) {
    return yid.http.get(`${prefix}/servicepackage/product`,{params})
}

export default{
    newcode,
    servinfo,
    product,
    findServPackList,
    findServPack,
    saveServPack,
    editStatus,
    delServPack,
    saveServDuoPack,
    findAll,
    productlist
    
}