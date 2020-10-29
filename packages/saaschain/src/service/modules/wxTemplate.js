import yid from '@src/library'

const prefix = 'api-push';
export function saveTemplate(params) {
    return yid.http.post(`${prefix}/smstemplate`, params)
}
export function getTemplateList(params) {
    return yid.http.get(`${prefix}/smstemplate`, {params})
}

export function getTemplateByid(id) {
    const url = `${prefix}/smstemplate/id/${id}`
    return yid.http.get(url)

}
export function deleteTemplateByID(id) {
    const url = `${prefix}/smstemplate/${id}`
    return yid.http.delete(url)

}

export function getTemplateListForChain(params) {
    return yid.http.get(`${prefix}/smstemplate/getTemplateListForChain`, {params})
}

export default {
    /** 类别 */
    saveTemplate,
    getTemplateList,
    getTemplateByid,
    deleteTemplateByID,
    getTemplateListForChain,
}