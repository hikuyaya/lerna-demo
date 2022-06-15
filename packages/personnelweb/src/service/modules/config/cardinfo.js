import yid from '@src/library'
 
const prefix = 'api-base';

export function cardinfo(params) {
    return yid.http.get(`${prefix}/cardinfo/list/all`,{params})
}

export function newcode() {
    return yid.http.get(`${prefix}/cardinfo/newcode`)
}

export function cardInfoByID(id) {
    return yid.http.get(`${prefix}/cardinfo/cardInfo/${id}`)
}

export function saveCardInfo(params) {
    return yid.http.post(`${prefix}/cardinfo/save`,params)
}

export function editCardStatus(params) {
    return yid.http.post(`${prefix}/cardinfo/status`,params)
}

export function cardRules(params) {
    return yid.http.get(`${prefix}/cardinfo/cardRules`,{params})
}

export function saveCardRules(params) {
    return yid.http.post(`${prefix}/cardinfo/saveCardRules`,params)
}

export function delCardRule(id) {
    return yid.http.delete(`${prefix}/cardinfo/delCardRule/${id}`)
}


export default{

    cardinfo,cardInfoByID,newcode,editCardStatus,saveCardInfo,cardRules,saveCardRules,delCardRule

}