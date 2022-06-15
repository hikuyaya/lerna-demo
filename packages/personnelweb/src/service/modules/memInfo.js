import yid from '@src/library'
const prefix = 'api-chain';

export function distchannelList(params) {
    const url = `${prefix}/distchannel`
    return yid.http.get(url, { params })
}

export function distchannelListAll(params) {
    const url = `${prefix}/distchannel/list/all`
    return yid.http.get(url, { params })
}

export function statuslList(params) {
    const url = `${prefix}/dictstatus`
    return yid.http.get(url, { params })
}

export function statuslListAll(params) {
    const url = `${prefix}/dictstatus/list/all`
    return yid.http.get(url, { params })
}

export function dictgradelList(params) {
    const url = `${prefix}/dictgrade`
    return yid.http.get(url, { params })
}

export function dictgradelListAll(params) {
    const url = `${prefix}/dictgrade/list/all`
    return yid.http.get(url, { params })
}

export function getDistchannelMaxId(){
    const url = `${prefix}/distchannel/getMaxId`
    return yid.http.get(url)
}

export function getStatusMaxId(){
    const url = `${prefix}/dictstatus/getMaxId`
    return yid.http.get(url)
}

export function getDictgradelMaxId(){
    const url = `${prefix}/dictgrade/getMaxId`
    return yid.http.get(url)
}

export function saveDistchannel(params) {
    const url = `${prefix}/distchannel`
    return yid.http.post(url, params )
}

export function saveStatus(params) {
    const url = `${prefix}/dictstatus`
    return yid.http.post(url, params )
}

export function saveDictgradel(params) {
    const url = `${prefix}/dictgrade`
    return yid.http.post(url, params )
}

export function deleteDistchannel(id) {
    const url = `${prefix}/distchannel/${id}`
    return yid.http.delete(url)
}

export function deleteStatus(id) {
    const url = `${prefix}/dictstatus/${id}`
    return yid.http.delete(url)
}

export function deleteDictgradel(id) {
    const url = `${prefix}/dictgrade/${id}`
    return yid.http.delete(url)
}

export function updateStatusDistchannel(params) {
    const url = `${prefix}/distchannel/updateStatus`
    return yid.http.post(url, params )
}

export default {
    /**会员来源列表**/
    distchannelList,
    distchannelListAll,
    /**会员状态列表**/
    statuslList,
    statuslListAll,
    /**会员等级列表**/
    dictgradelList,
    dictgradelListAll,
    getDistchannelMaxId,
    getStatusMaxId,
    getDictgradelMaxId,
    saveDistchannel,
    saveStatus,
    saveDictgradel,
    deleteDistchannel,
    deleteStatus,
    deleteDictgradel,
    updateStatusDistchannel,
}