import yid from '@src/library'

// const prefix = 'api-cashier/wheelrest';

//工位
export function getByCode(code) {
    return yid.http.get(`api-cashier/station/getByCode/${code}`)
}
//支付方式
export function getpaytemplateListAll(params) {
    return yid.http.get(`api-cashier/paytemplate/list/all`,{params})
}

//保存结账
export function saveRecord(params) {
    return yid.http.post(`api-cashier/cardrecords/saveRecord`,params)
}


//查询卡是否分拨
export function findCardDispatch(params) {
    return yid.http.get(`api-member/chainmember/findCardDispatch`,{params})
}

//关联实体卡
export function cardRelevance(params) {
    return yid.http.post(`api-member/chainmember/cardRelevance`,params)
}

//关联实体卡后，把卡号传给后端
export function updateMemberCardCmcode(params) {
    return yid.http.get(`api-cashier/cardrecords/updateMemberCardCmcode`,{params})
}

export default {
    getpaytemplateListAll,
    getByCode,
    saveRecord,
    findCardDispatch,
    cardRelevance,
    updateMemberCardCmcode,
}

