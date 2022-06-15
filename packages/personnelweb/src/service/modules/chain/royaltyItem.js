import yid from '@src/library'

const prefix = 'api-chain/royaltyitem';

//  结构体
export function structure() {
    return yid.http.get(`${prefix}/structure`)
}

//  获取提成管理项完整数据
export function getFullItem(id) {
    return yid.http.get(`${prefix}/vo/${id}`)
}

//  结构体
export function save(item) {
    return yid.http.post(`${prefix}/item`,item)
}

export default {
    structure,
    getFullItem,
    save
}