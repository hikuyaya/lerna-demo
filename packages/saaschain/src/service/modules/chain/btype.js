import yid from '@src/library'

const prefix = 'api-chain/btype';

export function btypeAllList(params) {
    return yid.http.get(`${prefix}/list/all`, {params})
}


export default {
    /** 业务类型列表 不带分页*/
    btypeAllList,
}