import yid from '@src/library'

const prefix = 'api-member/chainmember';
const cardfix = 'api-base/cardinfo';

export function querychainMembers(params) {
    return yid.http.get(`${prefix}/pageChainMembers`, {params})
}

export function chainPageMembers(params) {
    return yid.http.get(`${prefix}/chainPageMembers`, {params})
}

export function chainPageMembersNoPage(params) {
    return yid.http.get(`${prefix}/chainPageMembersNoPage`, {params})
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

export function queryShareCard(id) {
    return yid.http.get(`${prefix}/queryShareCard/${id}`)
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

export function selectServiceschain(params) {
    return yid.http.get(`api-chain/serviceinfo/list/all`,{params})
}

export function selectProductschain(params) {
    return yid.http.get(`api-chain/product/list/all`,{params})
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

export function queryMemberMobile(params) {
    return yid.http.get(`api-member/userinfo/queryMemberByMobile`, {params})
}

export function sendVercode(params) {
    return yid.http.post(`api-push/smsmsgctrl/sentAuthMsg`, params)
}

export function sureVercode(params) {
    return yid.http.post(`api-push/smsmsgctrl/authSmsCode`, params)
}

export function checkMember(params) {
    return yid.http.get(`api-member/userinfo/checkCardInfo`, {params})
}

export function sureChangeCard(params) {
    return yid.http.post(`api-member/userinfo/changeCardInfo`, params)
}

export function memInfoByCardno(params) {
    return yid.http.get(`${prefix}/memInfoByCardno`, {params})
}

export function queryCardMemo(params) {
    return yid.http.get(`${prefix}/queryCardMemo`, {params})
}
export function queryCardShopMemo(params) {
    return yid.http.get(`${prefix}/queryCardShopMemo`, {params})
}
export function getMemMoneyByMemid(params) {
    return yid.http.get(`api-xxw/memmoney/getMemMoneyByMemid`, {params})
}
export function getLogtypeList(params) {
    return yid.http.get(`api-xxw/memmoneylogs/getLogtypeList`, {params})
}
export function getMemMoneylogList(params) {
    return yid.http.get(`api-xxw/memmoneylogs/getMemMoneylogList`, {params})
}

export function getOrderPageList(params) {
    return yid.http.get(`api-xxw/sgbill/getOrderPageList`, {params})
}

export function memStorepack(params) {
    return yid.http.get(`api-stock/memdbatch/memStorepack`, {params})
}

export function cancellCard(params) {
    return yid.http.get(`${prefix}/cancellCard`,{params})
}

export function queryCardPackages(params) {
    return yid.http.get(`${prefix}/queryCardPackages`, {params})
}

export function cancellMember(params) {
    return yid.http.get(`${prefix}/cancellMember`,{params})
}

export function restoreMember(params) {
    return yid.http.get(`${prefix}/restoreMember`,{params})
}

export function pagecancellMembers(params) {
    return yid.http.get(`${prefix}/pagecancellMembers`, {params})
}

export function freezeMember(params) {
    return yid.http.get(`${prefix}/freezeMember`, {params})
}

export function cancelFreezeMember(params) {
    return yid.http.get(`${prefix}/cancelFreezeMember`, {params})
}

export function findRelevance(params) {
    return yid.http.get(`${prefix}/findRelevance`, {params})
}

export function findRelieveRelevance(params) {
    return yid.http.get(`${prefix}/findRelieveRelevance`, {params})
}

export function sureRelieve(params) {
    return yid.http.post(`${prefix}/sureRelieve`, params)
}

export function recoverRelieve(params) {
    return yid.http.post(`${prefix}/recoverRelieve`, params)
}

export function getMemberOrderList(params) {
    return yid.http.post(`api-xxw/shopping/getMemberOrderList`, params)
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
    selectServiceschain,
    selectProductschain,
    queryMemberStorelogs,
    querychainMembers,
    queryShopcardmoney,
    queryCardzklogs,
    queryCouponLogs,
    queryRedenvelopeLogs,
    queryMemberMobile,
    sendVercode,
    sureVercode,
    checkMember,
    sureChangeCard,
    memInfoByCardno,
    queryShareCard,
    queryCardMemo,
    queryCardShopMemo,
    getMemMoneyByMemid,
    getLogtypeList,
    getMemMoneylogList,
    memStorepack,
    cancellCard,
    queryCardPackages,
    cancellMember,
    getOrderPageList,
    getMemberOrderList,
    pagecancellMembers,
    restoreMember,
    chainPageMembers,
    freezeMember,
    cancelFreezeMember,
    chainPageMembersNoPage,
    findRelevance,
    findRelieveRelevance,
    sureRelieve,
    recoverRelieve
}
