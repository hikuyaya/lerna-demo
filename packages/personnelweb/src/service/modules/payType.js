import yid from '@src/library'

const prefix = 'api-base';

//  获取提成方案管理分页
export function payTypeList(params) {
    return yid.http.get(`${prefix}/paytype/list/vo`,params)
}

//  获取卡类型
export function cardList() {
    return yid.http.get(`${prefix}/cardinfo/list/all`,)
}

//  获取套餐
export function serpacList() {
    return yid.http.get(`${prefix}/servicePackage/list/all`,)
}

export default {
    payTypeList,
    cardList,
    serpacList,
}