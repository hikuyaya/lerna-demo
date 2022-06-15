import yid from '@src/library'

const prefix = 'api-chain/paytypeinfo';


export function getPayInfoList(params) {
    return yid.http.get(`${prefix}/list/all`,{params})
}


export default{
    getPayInfoList,
}