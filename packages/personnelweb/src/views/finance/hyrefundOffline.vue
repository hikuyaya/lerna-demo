<template>
    <div class="hyrefundOffline">
        <el-collapse-transition>
            <div v-if="showList">
                <el-button @click="importBill" type="primary">导出</el-button>

                <el-form inline style="margin-top: 20px" ref="searchForm" :model="searchForm">
                    <el-form-item label="制单人：">
                        <el-input clearable v-model.trim="searchForm.createdBy" placeholder=""  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="制单时间：">
                        <el-date-picker style="width: 240px;"
                                        v-model="searchForm.createdateRange"
                                        value-format="yyyy-MM-dd"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="单据状态：">
                        <el-select clearable filterable placeholder="请选择" style="width: 180px;" v-model.trim="searchForm.status">
                            <el-option
                                    v-for="item in statusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="处理人：">
                        <el-input clearable v-model.trim="searchForm.updatedBy" placeholder=""  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="变更时间：">
                        <el-date-picker style="width: 240px;"
                                        v-model="searchForm.updateRange"
                                        value-format="yyyy-MM-dd"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="单据编码：">
                        <el-input clearable v-model.trim="searchForm.billcode" placeholder=""  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="会员：">
                        <el-select clearable filterable placeholder="请选择" style="width: 110px;" v-model.trim="searchForm.memType">
                            <el-option
                                    v-for="item in memtypelist"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input clearable v-model.trim="searchForm.memTel" placeholder="会员电话"  style="width: 150px;"></el-input>
                        <el-input clearable v-model.trim="searchForm.cmcode" placeholder="卡号"  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="项目分类：">
                        <el-select clearable filterable placeholder="请选择" style="width: 160px;" @change="clearFormShop1" v-model.trim="searchForm.serveType">
                            <el-option
                                    v-for="item in servetypelist"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="退款方式：">
                        <el-select clearable filterable placeholder="请选择" style="width: 160px;" v-model.trim="searchForm.tkType">
                            <el-option
                                    v-for="item in tktypelist"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务类型：">
                        <el-select clearable v-model="searchForm.shopType" @change="changeShop" style="width: 100px">
                            <el-option label="美发" value="1"></el-option>
                            <el-option label="美容" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="门店：" prop="shopid" label-width="80px">
                        <el-select clearable v-model.trim="searchForm.shopid" @clear="clearFormShop" @blur="clearFormShop" filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号码：">
                        <el-input clearable v-model.trim="searchForm.tkMobile" placeholder="退卡人电话"  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="有无备注：">
                        <el-select clearable filterable placeholder="请选择" style="width:100px;" v-model.trim="searchForm.isMemo">
                            <el-option
                                    v-for="item in isMemolist"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="queryYyBilllist()" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="table"  style="width: 100%;">
                    <yid-table-column label="单据编码" min-width="150" prop="billcode"></yid-table-column>
                    <yid-table-column label="店号" min-width="80" prop="shopcode"></yid-table-column>
                    <yid-table-column label="联系人姓名" min-width="120" prop="tkName"></yid-table-column>
                    <yid-table-column label="手机号码" min-width="110" prop="tkMobile"></yid-table-column>
                    <yid-table-column label="实退金额" min-width="80" prop="tkMoney"></yid-table-column>
                    <yid-table-column label="制单人" min-width="80" prop="createdBy"></yid-table-column>
                    <yid-table-column label="制单时间" min-width="150" prop="createdTime">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.createdTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="最近处理人" min-width="80" prop="updatedBy"></yid-table-column>
                    <yid-table-column label="最近处理时间" min-width="150" prop="updatedTime">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.updatedTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="单据状态" min-width="120" prop="status">
                        <template slot-scope="scope">
                            <span v-if='scope.row.status==1'>未提交</span>
                            <span v-if='scope.row.status==2'>已提交</span>
                            <span v-if='scope.row.status==3'>已审批</span>
                            <span v-if='scope.row.status==4'>已复核</span>
                            <span v-if='scope.row.status==0'>已驳回</span>
                            <span v-if='scope.row.status==9'>已作废</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="审核备注" min-width="150" prop="memo"></yid-table-column>
                    <yid-table-column label="驳回原因" min-width="150" prop="rejectMemo"></yid-table-column>
                    <yid-table-column label="驳回时间" min-width="150" prop="rejectTime"></yid-table-column>
                    <yid-table-column label="驳回人" min-width="80" prop="rejectBy"></yid-table-column>
                    <yid-table-column label="操作" min-width="140" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 5px" @click="showDetail(scope.row)">详情</el-link>
                            <el-link type="primary" style="margin: 5px" @click="changeLog(scope.row.billcode)">变更记录</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-if="!showList">
                <hyrefundOlineDetail ref="detailPage" @onClose="closeDetailPage"></hyrefundOlineDetail>
            </div>
        </el-collapse-transition>
        <!--变更记录-->
        <billlogs ref="billlogs"></billlogs>
    </div>
</template>
<script>
    import service from '@src/service'
    import yid from '@src/library'
    import ElButton from "../../library/components/button/button";
    import type from '@src/type'
    import cache from "@src/library/helper/cache";
    import hyrefundOlineDetail from './hyrefundOlineDetail'
    import billlogs from './components/billlogs'
    import download from "@src/library/http/download";
    export default {
        name: "hyrefundOffline",
        components:{hyrefundOlineDetail,billlogs},
        data() {
            return {
                showList:true,
                pageInfo: {page: 1, limit: 10, isDel: "0"},
                searchForm:{
                    createdBy:'',
                    createdateRange:[],
                    status:'',
                    updatedBy:'',
                    updateRange:[],
                    billcode:'',
                    memType : '',
                    memTel:'',
                    tkType:'',
                    serveType : '',
                    shopid : '',
                    cmcode : '',
                    tkMobile : '',
                    ismemo:'',
                    shopType : '',
                },
                isMemolist:[{
                    value: '1',
                    label: '有'
                }, {
                    value: '0',
                    label: '无'
                }],
                statusList:[{
                    value: '1',
                    label: '未提交'
                }, {
                    value: '2',
                    label: '已提交'
                }, {
                    value: '3',
                    label: '客服已审批'
                }, {
                    value: '4',
                    label: '财务已复核'
                }, {
                    value: '0',
                    label: '已驳回'
                }, {
                    value: '9',
                    label: '已作废'
                }],
                memtypelist:[{
                    value: '1',
                    label: '会员'
                }, {
                    value: '2',
                    label: '散客'
                }],
                tktypelist:[{
                    value: '1',
                    label: '营业款'
                }, {
                    value: '2',
                    label: '预留款'
                }, {
                    value: '3',
                    label: '退卡保证金'
                }, {
                    value: '4',
                    label: '风险金'
                }, {
                    value: '5',
                    label: '关店退款'
                }],
                servetypelistmf:[{
                    value: '1',
                    label: '线上项目团单'
                }, {
                    value: '2',
                    label: '洗护产品'
                }, {
                    value: '3',
                    label: '跨店承担退卡'
                }, {
                    value: '4',
                    label: '跨月消费退'
                }, {
                    value: '5',
                    label: '其他'
                }, {
                    value: '6',
                    label: '老卡退卡'
                }],
                servetypelistmr:[{
                    value: '1',
                    label: '美容项目'
                }, {
                    value: '2',
                    label: '美容产品'
                }, {
                    value: '3',
                    label: '微慕'
                }, {
                    value: '4',
                    label: '跨店承担退卡'
                }, {
                    value: '5',
                    label: '其他'
                }],
                servetypelist :[
                    {
                        value: 'MF#1',
                        label: '美发线上项目团单'
                    },{
                        value: 'MR#1',
                        label: '美容项目'
                    }, {
                        value: 'MF#2',
                        label: '美发洗护产品'
                    }, {
                        value: 'MR#2',
                        label: '美容产品'
                    }, {
                        value: 'MF#3',
                        label: '美发跨店承担退卡'
                    }, {
                        value: 'MR#3',
                        label: '微慕'
                    }, {
                        value: 'MF#4',
                        label: '美发跨月消费退'
                    }, {
                        value: 'MR#4',
                        label: '美容跨店承担退卡'
                    }, {
                        value: 'MF#5',
                        label: '美发其他'
                    }, {
                        value: 'MR#5',
                        label: '美容其他'
                    }, {
                        value: 'MF#6',
                        label: '美发老卡退卡'
                    }, {
                        value: 'MR#6',
                        label: '美容老卡退卡'
                    }
                ],
                paytypelist:[{
                    value: '1',
                    label: '店内支出卡'
                }, {
                    value: '2',
                    label: '顾客银行卡'
                }, {
                    value: '3',
                    label: '退为卡金'
                }],
                tkattrlist : [{
                    value: '1',
                    label: '仅注销无退款'
                }, {
                    value: '2',
                    label: '员工离职'
                }, {
                    value: '3',
                    label: '个人原因'
                }, {
                    value: '4',
                    label: '技术原因'
                }, {
                    value: '5',
                    label: '消费原因'
                }, {
                    value: '6',
                    label: '服务及接待'
                }, {
                    value: '7',
                    label: '关店原因'
                }, {
                    value: '8',
                    label: '其它'
                }],
                detailInitData:{}, // 传入明细组件的初始值
                allShopList: [],
                filterShopList: [],
                bankList : [],
            }
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                reqObj.createdBy = this.searchForm.createdBy;
                reqObj.status = this.searchForm.status;
                reqObj.updatedBy =  this.searchForm.updatedBy;
                reqObj.billcode =  this.searchForm.billcode;
                reqObj.memType =  this.searchForm.memType;
                reqObj.memTel =  this.searchForm.memTel;
                reqObj.tkType =  this.searchForm.tkType;
                //reqObj.serveType =  this.searchForm.serveType;
                reqObj.shopid  = this.searchForm.shopid;
                reqObj.cmcode  = this.searchForm.cmcode;
                reqObj.tkMobile  = this.searchForm.tkMobile;
                reqObj.isMemo  = this.searchForm.isMemo;
                let createdateRange = this.searchForm.createdateRange;
                if(createdateRange){
                    reqObj.createtimeStart = this.searchForm.createdateRange[0];
                    reqObj.createtimeEnd = this.searchForm.createdateRange[1];
                }else{
                    reqObj.createtimeStart = '';
                    reqObj.createtimeEnd = '';
                }
                let updateRange = this.searchForm.updateRange;
                if(updateRange){
                    reqObj.updatetimeStart = this.searchForm.updateRange[0];
                    reqObj.updatetimeEnd = this.searchForm.updateRange[1];
                }else{
                    reqObj.updatetimeStart = '';
                    reqObj.updatetimeEnd = '';
                }
                if(!yid.util.isEmpty(this.searchForm.serveType)){
                    let serveType =  this.searchForm.serveType;
                    var types = serveType.split("#");
                    var bstype = types[0];
                    var serve = types[1];
                    if(bstype == 'MF'){
                        reqObj.shopType = '1';
                    }else if(bstype == 'MR'){
                        reqObj.shopType = '2';
                    }
                    reqObj.serveType = serve;
                }else{
                    reqObj.shopType = '';
                    reqObj.serveType = '';
                }
                if(yid.util.isEmpty(reqObj.shopType))
                reqObj.shopType = this.searchForm.shopType;
                return reqObj;
            },
        },
        mounted() {
            this.getShopList();
            //获取银行列表
            this.getBankList();
        },
        methods:{
            getData(reqParams) {
                const fetch = service.finance.xxtkRecords.billListsp
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getDataNoChangePage(reqParams) {
                const fetch = service.finance.xxtkRecords.billListsp
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                this.$refs.table.reloadDataNoChangePage({
                    fetch,
                    params,
                });
            },
            changeLog(billcode){
                this.$refs.billlogs.logDialog.visible = true
                this.$refs.billlogs.billlogs = [];
                service.finance.xxtkOperlog.listAll({billcode:billcode,isDel:'0'}).then(res=>{
                    this.$refs.billlogs.billlogs = res.data;
                })
            },
            showDetail(row){
                this.showList = false;
                this.detailInitData.billData = row;
                this.detailInitData.bankList = this.bankList;
                this.$nextTick(()=>{
                    this.$refs.detailPage.initData(this.detailInitData);
                })
            },
            queryYyBilllist() {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getData(this.searchFormReq);
            },
            queryYyBilllistNoChangePage() {
                this.pageInfo.page = this.$refs.table.Pagination.internalCurrentPage;
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getDataNoChangePage(this.searchFormReq);
            },
            getShopList() {
                service.chain.shop.shopList({ status: "1" }).then(res => {
                    if (res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList); //保留原数据
                    }
                });
            },
            filterShop(v) {
                this.filterShopList = this.allShopList.filter(item => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true;
                    if (item.shopcode.indexOf(v) !== -1) return true;
                });
            },
            closeDetailPage(){
                this.detailInitData = {};
                this.showList = true;
                this.$nextTick(()=>{
                    this.queryYyBilllistNoChangePage();
                })
            },
            importBill() {
                //查询是否有数据
                const params = { ...this.pageInfo, ...this.searchFormReq };
                service.finance.xxtkRecords.billListsp(params).then(res => {
                    if (res.resp_code == "200") {
                        if (res.data.length > 0) {
                            download(
                                $yid.config.API.BASE +
                                "api-finance/xxtkrecords/billExportForChainsp",
                                this.searchFormReq
                            );
                        } else {
                            yid.util.error("查询数据为空!");
                            return;
                        }
                    }
                });
            },
            getBankList(){
                service.finance.dicBank.listAll({status:'1',isDel:'0'}).then(res=>{
                    if (res.resp_code == 200) {
                        this.bankList = res.data;
                    }
                })
            },
            changeShop(){
                const param = {}
                this.searchForm.serveType = '';
                let type = this.searchForm.shopType;
                param.status = '1';
                param.type = type;
                service.chain.shop.shopList(param).then(res=> {
                    if(res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                    }
                })
            },
            clearFormShop(){
                setTimeout(() =>{
                    if(this.searchForm.shopid == ''){
                        this.searchForm.shopid = "";
                        this.filterShopList = Object.assign(this.allShopList);
                    }

                },300)
            },
            clearFormShop1(){
                const param = {}
                this.searchForm.shopType = "";
                param.status = '1';
                service.chain.shop.shopList(param).then(res=> {
                    if(res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .hyrefund{
        height: 100%;
    }
</style>