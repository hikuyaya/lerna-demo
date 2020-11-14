import yid from '@src/library'

const prefix = 'api-member/chainmember';
const cardfix = 'api-base/cardinfo';

export function querychainMembers(params) {
    return yid.http.get(`${prefix}/pageChainMembers`, {params})
}

export function queryAllMember(params) {
    return yid.http.get(`${prefix}/pageMembers`, {params})
}

export function queryAllMemberHj(params) {
    return yid.http.get(`${prefix}/queryAllMemberHj`, {params})
}

export function exportMember(params) {
    return yid.http.get(`${prefix}/queryAllMembers`, {params})
}

export function queryMember(params) {
    return yid.http.get(`${prefix}/queryMember`, {params})
}

export function queryShopcardmoney(params) {
    return yid.http.get(`${prefix}/queryShopcardmoney`, {params})
}

export function queryMemberStatis(params) {
    return yid.http.get(`${prefix}/queryMemberStatis`, {params})
}

export function queryCardList(params) {
    return yid.http.get(`${cardfix}/list/all`, {params})
}

export function saveMemberCard(params) {
    return yid.http.post(`${prefix}/saveMemberCard`, params)
}

export function updateCardmoney(params) {
    return yid.http.post(`${prefix}/updateCardmoney`, params)
}

export function queryCardRecords(params) {
    return yid.http.post(`${prefix}/queryCardRecords`, params)
}

export function queryCardzklogs(params) {
    return yid.http.post(`${prefix}/queryCardzklogs`,params)
}

export function queryPackageRecords(params) {
    return yid.http.post(`${prefix}/queryPackageRecords`, params)
}

export function queryMemberRecords(params) {
    return yid.http.post(`${prefix}/queryMemberRecords`, params)
}

export function queryMemberEditlogs(params) {
    return yid.http.post(`${prefix}/queryMemberEditlogs`, params)
}

export function queryMemberpagePackages(params) {
    return yid.http.post(`${prefix}/pagePackages`, params)
}

export function queryPackageHj(params) {
    return yid.http.post(`${prefix}/queryPackageHj`, params)
}

export function queryDelMembers(params) {
    return yid.http.post(`${prefix}/queryDelMembers`, params)
}

export function queryExpritMembers(params) {
    return yid.http.post(`${prefix}/queryExpritMembers`, params)
}

export function queryDirthdayMembers(params) {
    return yid.http.post(`${prefix}/queryDirthdayMembers`, params)
}

export function memberImport(params) {
    return yid.http.post(`${prefix}/memberImport`, params)
}

export function queryMemberImplogs(params) {
    return yid.http.get(`${prefix}/queryMemberImplogs`, {params})
}

export function queryMemberLog(params) {
    return yid.http.get(`api-member/impdesc/list/all`,{params})
}

export function selectPackages(params) {
    return yid.http.get(`api-base/servicePackage/list/all`,{params})
}

export function selectServices(params) {
    return yid.http.get(`api-base/serviceinfo/list/all`,{params})
}

export function selectProducts(params) {
    return yid.http.get(`api-base/product/list/all`,{params})
}

export function queryMemberStorelogs(params) {
    return yid.http.get(`api-stock/memdbatch/queryAllMemberStorelogs`, {params})
}

export function queryCouponLogs(params) {
    return yid.http.get(`${prefix}/queryCouponLogs`,{params})
}

export function queryRedenvelopeLogs(params) {
    return yid.http.get(`${prefix}/queryRedenvelopeLogs`, {params})
}

export default {
    //全部会员查询
    queryAllMember,
    queryAllMemberHj,
    exportMember,
    queryMember,
    queryMemberStatis,
    queryCardList,
    saveMemberCard,
    updateCardmoney,
    queryCardRecords,
    queryPackageRecords,
    queryMemberRecords,
    queryMemberEditlogs,
    queryMemberpagePackages,
    queryPackageHj,
    queryDelMembers,
    queryExpritMembers,
    queryDirthdayMembers,
    memberImport,
    queryMemberImplogs,
    queryMemberLog,
    selectPackages,
    selectServices,
    selectProducts,
    queryMemberStorelogs,
    querychainMembers,
    queryShopcardmoney,
    queryCardzklogs,
    queryCouponLogs,
    queryRedenvelopeLogs
}