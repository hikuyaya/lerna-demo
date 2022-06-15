import yid from '@src/library'

const prefix = 'api-chain/paytype';


//  获取提成方案管理分页
export function payTypeList(params) {
    return yid.http.get(`${prefix}/list/vo`,params)
}


export default{
    payTypeList,
}