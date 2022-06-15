<template>
    <div class="dormRentCont">
        <el-collapse-transition>
            <div>
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="门店：" prop="shopid" label-width="100px">
                        <el-select clearable v-model.trim="searchForm.shopid" @clear="clearFormShop" @blur="clearFormShop" filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="房东名称：" prop="name" label-width="100px">
                        <el-input clearable v-model="searchForm.name" placeholder="房东名称" style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="合同状态：" prop="status" label-width="100px">
                        <el-select clearable style="width: 100px" v-model="searchForm.status">
                            <el-option
                                    v-for="item in statusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="合同时间：" prop="sTimeRange" label-width="100px">
                        <div class="block">
                            <el-date-picker
                                    :clearable = true
                                    v-model="searchForm.htTimeRange"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table ref="table" pagination style="width: 100%;margin-top: 10px;">
                    <yid-table-column prop="dlcode" label="合同编码" width="100"></yid-table-column>
                    <yid-table-column prop="status" label="合同状态" width="120">
                        <template slot-scope="scope">
                            <el-select style="width: 100px" v-model="scope.row.status" @change="changeStatus(scope.row)">
                                <el-option
                                        v-for="item in statusList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="shopcode" label="门店编码" width="90"></yid-table-column>
                    <yid-table-column prop="shopname" label="门店名称" width="100"></yid-table-column>
                    <yid-table-column prop="name" label="房东名称" width="100"></yid-table-column>
                    <yid-table-column prop="startdate" label="合同开始时间" width="120">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.startdate)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="enddate" label="合同结束时间" width="120">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.enddate)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="rent" label="租金" width="80"></yid-table-column>
                    <yid-table-column prop="deposit" label="押金" width="80"></yid-table-column>
                    <yid-table-column prop="type" label="支付方式" width="80">
                        <template slot-scope="scope">
                            <span v-if='scope.row.type==1'>月付</span>
                            <span v-if='scope.row.type==2'>季付</span>
                            <span v-if='scope.row.type==3'>半年付</span>
                            <span v-if='scope.row.type==4'>年付</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="payee" label="收款人" width="100"></yid-table-column>
                    <yid-table-column prop="bankno" label="收款账号" width="120"></yid-table-column>
                    <yid-table-column prop="bank" label="开户行" width="100"></yid-table-column>
                    <yid-table-column prop="updatedBy" label="更新人" width="100"></yid-table-column>
                    <yid-table-column prop="updatedTime" label="更新时间" width="140">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.updatedTime)}}
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import ElButton from "../../library/components/button/button";

    export default {
        components: {ElButton},
        name: "dormRentCont",
        data() {
            return {
                excelConvertUrl:"",
                myheaders:{},
                pageInfo: {page: 1, limit: 10},
                searchForm: {
                    htTimeRange : [],
                    shipid : "",
                    name : "",
                    status : "",
                },
                statusList:[{
                    value: '1',
                    label: '正常'
                }, {
                    value: '2',
                    label: '作废'
                }],
                allShopList: [],
                filterShopList: [],
            }
        },
        mounted() {
            this.getShopList();
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                reqObj.name =  this.searchForm.name;
                reqObj.shopid =  this.searchForm.shopid;
                reqObj.status = this.searchForm.status;
                let htTimeRange = this.searchForm.htTimeRange;
                if(htTimeRange){
                    reqObj.htdateStart = this.searchForm.htTimeRange[0];
                    reqObj.htdateEnd = this.searchForm.htTimeRange[1];
                }else{
                    reqObj.htdateStart = '';
                    reqObj.htdateEnd = '';
                }
                return reqObj;
            },
        },
        methods: {
            getShopList() {
                service.chain.shop.shopList({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                    }
                })
            },
            filterShop(v){
                this.filterShopList = this.allShopList.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            },
            getData(reqParams) {
                const fetch = service.finance.dormRentCont.billListForChain
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                params.billstatus = "3"
                if(yid.util.isEmpty(params.status)){
                    params.status = "Y"
                }
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            search() {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getData(this.searchFormReq);
            },
            getDataNoChangePage(reqParams) {
                const fetch = service.finance.dormRentCont.billListForChain
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                params.billstatus = "3"
                if(yid.util.isEmpty(params.status)){
                    params.status = "Y"
                }
                this.$refs.table.reloadDataNoChangePage({
                    fetch,
                    params,
                });
            },
            searchNoChangePage() {
                this.pageInfo.page = this.$refs.table.Pagination.internalCurrentPage;
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getDataNoChangePage(this.searchFormReq);
            },
            changeStatus(row){
                service.finance.dormRentCont.saveHt(row).then(res=>{
                    if (res.resp_code == 200) {
                        yid.util.success("合同状态修改成功");
                        this.searchNoChangePage();
                    }else{
                        yid.util.error(res.resp_msg);
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
        }
    }
</script>

<style scoped lang="scss">
    .container {
        width:100%;
        height: 30px;
        /*overflow: auto;*/
        white-space: nowrap;
    }
</style>
