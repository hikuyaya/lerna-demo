import yid from '@src/library'

const prefix = 'api-finance/dicfunddescribe';


export function ioitemAll(params) {
    const url = `api-finance/dicioitem/list/all`
    return yid.http.get(url, { params })
}

export function jobList(params) {
    const url = `${prefix}/list`
    return yid.http.get(url, { params })
}

export function jobAll(params) {
    const url = `${prefix}/list/all`
    return yid.http.get(url, { params })
}

export function saveJob(params) {
    const url = `${prefix}`
    return yid.http.post(url, params )
}

export function saveSystem(params) {
    const url = `${prefix}/saveSystem`
    return yid.http.post(url, params )
}

export default {

    saveJob,
    jobAll,
    jobList,
    ioitemAll,
    saveSystem,
}

