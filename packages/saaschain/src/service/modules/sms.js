import yid from '@src/library'

const prefix = 'api-base';
const prefixPush = 'api-push';
const prefixUser = 'api-member';
export function list(params) {

    return yid.http.get(`${prefix}/list`, params)
}
export function getBranchByTenantId(params) {
    return yid.http.get(`${prefix}/branch/list/all`, { params })
}


export function getemployeeByBranhid(params) {
    return yid.http.get(`${prefix}/employee/list/all`, { params })
}

export function getServiceTypeeByBranhid(params) {
    return yid.http.get(`${prefix}/servicetype/list/all`, { params })
}


export function sendSmsMessage(params) {
    return yid.http.post(`${prefixPush}/smstask`, params )
}
export function getAllByIds(params) {
    return yid.http.post(`${prefix}/employee/list/getAllByIds`, params )
}

export function findConditionSms(params) {
    return yid.http.get(`${prefixUser}/userinfo/list/findConditionSms`, { params } )
}

export function savesmsreturn(params) {
    return yid.http.post(`${prefixPush}/servicesmsreturn`, params )
}

export function getSmsreturnPage(params) {
    return yid.http.get(`${prefixPush}/servicesmsreturn`, { params } )
}

export function saveBirthdaySms(params) {
    return yid.http.post(`${prefixPush}/birthdaysms`, params  )
}


export function getSmsRecordList(params) {
    return yid.http.get(`${prefixPush}/smstask`, {params}  )
}
export function getBirthdaySms(id) {
    const url = `${prefixPush}/birthdaysms/id/${id}`
    return yid.http.get(url)

}
export function deleteTaskByID(id) {
    const url = `${prefixPush}/smstask/${id}`
    return yid.http.delete(url)

}
export function updateTaskConnetById(params) {
    return yid.http.post(`${prefixPush}/smstask/updateTaskConnetById`, params  )

}

export function getCharging(params) {
    return yid.http.get(`${prefixPush}/smsconfig`, {params}  )

}

export function getstaskreply(params) {
    return yid.http.get(`${prefixPush}/staskreply`, {params}  )

}
export default {
    /** 用户菜单 */
    list,
    getBranchByTenantId,
    getemployeeByBranhid,
    getServiceTypeeByBranhid,
    sendSmsMessage,
    getAllByIds,
    findConditionSms,
    savesmsreturn,
    getSmsreturnPage,
    saveBirthdaySms,
    getBirthdaySms,
    getSmsRecordList,
    deleteTaskByID,
    updateTaskConnetById,
    getCharging,
    getstaskreply
}
