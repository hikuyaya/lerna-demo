import yid from '@src/library'

const prefix = 'api-yy/config';

export function getYYconfig(params) {
    return yid.http.get(`${prefix}/getYYconfig`, {params})
}

export function setYYconfig(params) {
    return yid.http.post(`${prefix}/setYYconfig`, params)
}


export default {
    /**
     * 获取规则设置
     */
    getYYconfig,
    /**
     * 更新规则设置
     */
    setYYconfig,
}