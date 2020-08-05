import yid from '@src/library'

const prefix = 'api-base';

export function newcode() {
    return yid.http.get(`${prefix}/servicePackage/newcode`)
}

export function servinfo(params) {
    return yid.http.get(`${prefix}/servicePackage/servinfo`,{params})
}

export function product(params) {
    return yid.http.get(`${prefix}/servicePackage/product`,{params})
}

export function findServPackList(params) {
    return yid.http.get(`${prefix}/servicePackage/list`,{params})
}

export function findAll(params) {
    return yid.http.get(`${prefix}/servicePackage/list/all`,{params})
}

export function findServPack(id) {
    return yid.http.get(`${prefix}/servicePackage/findById/${id}`)
}

export function saveServPack(params) {
    return yid.http.post(`${prefix}/servicePackage/save`,params)
}

export function saveServDuoPack(params) {
    return yid.http.post(`${prefix}/servicePackage/saveDuo`,params)
}

export function editStatus(params) {
    return yid.http.post(`${prefix}/servicePackage/editStatus`,params)
}

export function delServPack(params) {
    return yid.http.post(`${prefix}/servicePackage/delete`,params)
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
    
}