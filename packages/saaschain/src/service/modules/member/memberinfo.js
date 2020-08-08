import yid from '@src/library'

const prefix = 'api-member/memberinfo';
const cardfix = 'api-base/cardinfo';
const servpackfix = 'api-base/servicePackage';

export function queryAllMember(params) {
    return yid.http.get(`${prefix}/chain/pageMembers`, {params})
}

export function queryAllMemberHj(params) {
    return yid.http.get(`${prefix}/chain/queryAllMemberHj`, {params})
}

export function exportMember(params) {
    return yid.http.get(`${prefix}/queryAllMembers`, {params})
}

export function queryMember(params) {
    return yid.http.get(`${prefix}/queryMember`, {params})
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
    return yid.http.post(`${prefix}/chain/pagePackages`, params)
}

export function queryPackageHj(params) {
    return yid.http.post(`${prefix}/chain/queryPackageHj`, params)
}

export function queryDelMembers(params) {
    return yid.http.post(`${prefix}/chain/queryDelMembers`, params)
}

export function queryExpritMembers(params) {
    return yid.http.post(`${prefix}/chain/queryExpritMembers`, params)
}

export function queryDirthdayMembers(params) {
    return yid.http.post(`${prefix}/chain/queryDirthdayMembers`, params)
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
    return yid.http.get(`api-stock/memdbatch/queryMemberStorelogs`, {params})
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
    queryMemberStorelogs
}