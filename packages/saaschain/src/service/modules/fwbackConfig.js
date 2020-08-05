import yid from '@src/library'

const prefix = 'api-base';
const prefixPush = 'api-push';
export function getServiceType(params) {
    return yid.http.get(`${prefix}/servicetype/list/all`, {params})
}

export function getServiceInfoByTypeId(params) {
    return yid.http.get(`${prefix}/serviceinfo/list/all`, {params})
}

export function saveServiceWxReturn(params) {
    return yid.http.post(`${prefixPush}/servicewxreturn/`, params)
}
export function getServiceWxReturn(params) {
    return yid.http.get(`${prefixPush}/servicewxreturn/`, {params})
}

export function addWxtask(params) {
    return yid.http.post(`${prefixPush}/servicewxtask/`, params)
}
export function getWxtaskBywrIdAndtype(params) {
    return yid.http.post(`${prefixPush}/servicewxtask/findByIdAndType/`, params)
}

export function deletWxTaskById(id) {
    const url = `${prefixPush}/servicewxtask/${id}`
    return yid.http.delete(url)
}

export function getServiceWxReturnById(id) {
    const url = `${prefixPush}/servicewxreturn/id/${id}`
    return yid.http.get(url)
}
export default {
    /** 类别 */
    getServiceType,
    getServiceInfoByTypeId,
    saveServiceWxReturn,
    getServiceWxReturn,
    getServiceWxReturnById,
    addWxtask,
    getWxtaskBywrIdAndtype,
    deletWxTaskById
}