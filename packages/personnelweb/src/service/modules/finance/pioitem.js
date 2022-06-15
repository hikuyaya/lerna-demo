import yid from '@src/library'

const prefix = 'api-finance';

export function page(params) {
    const url = `${prefix}/dicpioitem`
    return yid.http.get(url, { params })
}

export function listAll(params) {
    const url = `${prefix}/dicpioitem/list/all`
    return yid.http.get(url, { params })
}

export function save(params) {
    const url = `${prefix}/dicpioitem`
    return yid.http.post(url, params )
}

export function nextCode(params) {
    const url = `${prefix}/dicpioitem/getNextCode`
    return yid.http.get(url, { params })
}

export default {
    page,
    listAll,
    save,
    nextCode,
}

