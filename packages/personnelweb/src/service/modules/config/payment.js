import yid from '@src/library'

const prefix = 'api-cashier';


export function getPayinfo(params) {
    return yid.http.get(`${prefix}/paytypeinfo/list/all`,{params})
}

export function getPayments(params) {
    return yid.http.get(`${prefix}/paytemplate/list/all`,{params})
}

export function savePayments(params) {
    return yid.http.post(`${prefix}/paytemplate/savePayTemplate`,params)
}


export function savePayTemplates(params) {
    return yid.http.post(`${prefix}/paytemplate/savePayTemplates`,params)
}

export default{
    getPayinfo,getPayments,savePayments,savePayTemplates
}