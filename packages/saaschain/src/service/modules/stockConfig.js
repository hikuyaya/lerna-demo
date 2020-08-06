import yid from '@src/library'
const prefix = 'api-chain/stockconfig';

//获取库存配置数据
export function orderConfig() {
    return yid.http.get(`${prefix}/sysuser`)
}

//更新库存配置数据
export function saveConfig(params) {
    const url = `${prefix}`
    return yid.http.post(url, params )
}
export default {
    /**根据门店获取库存配置**/
    orderConfig,
    /**保存或更新库存配置**/
    saveConfig
}