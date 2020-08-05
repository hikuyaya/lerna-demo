<template>
    <div class="member-relation">
        <el-tabs v-model="activeName" @tab-click="handleClick" v-show="!detailShow">
            <el-tab-pane label="服务单" name="analyze">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="日期：">
                        <el-date-picker
                                v-model="searchForm.saleTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="get" type="primary">高级查询</el-button>
                    </el-form-item>
                </el-form>

                <yid-table pagination ref="table" >
                    <yid-table-column label="服务单号" min-width="100" prop="billcode"></yid-table-column>
                    <yid-table-column label="客户" min-width="150" prop="cardInfo"></yid-table-column>
                    <yid-table-column label="计客数" min-width="70" prop="isCompute">
                        <template slot-scope="scope">
                            {{scope.row.isCompute == '1' ? "是" : "否"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="消费时间" min-width="150" prop="saleTime"></yid-table-column>
                    <yid-table-column label="消费金额" min-width="150" prop="totalMoney"></yid-table-column>
                    <yid-table-column label="支付方式" min-width="150" prop="pays"></yid-table-column>
                    <yid-table-column label="项目/客装商品" min-width="150" prop="servs"></yid-table-column>
                    <yid-table-column label="总业绩" min-width="150" prop="sumyj"></yid-table-column>
                    <yid-table-column label="员工" min-width="150" prop="members"></yid-table-column>
                    <yid-table-column label="员工业绩" min-width="150" prop="yjs"></yid-table-column>
                    <yid-table-column label="提成" min-width="150" prop="royaltys"></yid-table-column>
                    <yid-table-column label="操作人" min-width="150" prop="hcBy"></yid-table-column>
                    <yid-table-column label="撤单时间" min-width="150" prop="hcTime"></yid-table-column>
                    <yid-table-column label="撤单备注" min-width="150" prop="hcMemo"></yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="开卡充值" name="assignment">
                <el-form ref="czSearchForm" inline :model="czSearchForm">
                    <el-form-item label="日期：">
                        <el-date-picker
                                v-model="czSearchForm.saleTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="searchCz" type="primary">查询</el-button>
                        <el-button @click="get" type="primary">高级查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="tableCz">
                    <yid-table-column label="服务单号" min-width="100" prop="billcode"></yid-table-column>
                    <yid-table-column label="充值时间" min-width="150" prop="updatedTime"></yid-table-column>
                    <yid-table-column label="顾客信息" min-width="180" prop="cardInfo"></yid-table-column>
                    <yid-table-column label="金额" min-width="150" prop="payments"></yid-table-column>
                    <yid-table-column label="充值类型" min-width="120" prop="isOpen">
                        <template slot-scope="scope">
                            {{scope.row.isOpen == '1' ? "开卡" : "充值"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="员工" min-width="180" prop="members"></yid-table-column>
                    <yid-table-column label="业绩" min-width="150" prop="eeyjs"></yid-table-column>
                    <yid-table-column label="提成" min-width="150" prop="royaltys"></yid-table-column>
                    <yid-table-column label="操作人" min-width="150" prop="hcBy"></yid-table-column>
                    <yid-table-column label="撤单时间" min-width="150" prop="hcTime"></yid-table-column>
                    <yid-table-column label="撤单备注" min-width="150" prop="hcMemo"></yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="套餐购买" name="logs">
                <el-form ref="packSearchForm" inline :model="packSearchForm">
                    <el-form-item label="日期：">
                        <el-date-picker
                                v-model="packSearchForm.saleTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="searchPack" type="primary">查询</el-button>
                        <el-button @click="get" type="primary">高级查询</el-button>
                    </el-form-item>
                </el-form>

                <yid-table pagination ref="tablePack">
                    <yid-table-column label="单号" min-width="100" prop="billcode"></yid-table-column>
                    <yid-table-column label="销售时间" min-width="150" prop="saleTime"></yid-table-column>
                    <yid-table-column label="顾客信息" min-width="150" prop="cardInfo"></yid-table-column>
                    <yid-table-column label="金额" min-width="150" prop="payments"></yid-table-column>
                    <yid-table-column label="套餐内容" min-width="150" prop="snames"></yid-table-column>
                    <yid-table-column label="员工" min-width="150" prop="members"></yid-table-column>
                    <yid-table-column label="业绩" min-width="150" prop="eeyjs"></yid-table-column>
                    <yid-table-column label="提成" min-width="150" prop="royaltys"></yid-table-column>
                    <yid-table-column label="操作人" min-width="150" prop="hcBy"></yid-table-column>
                    <yid-table-column label="撤单时间" min-width="150" prop="hcTime"></yid-table-column>
                    <yid-table-column label="撤单备注" min-width="150" prop="hcMemo"></yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import service from '@src/service'
    export default {
        name: "member-relation",
        components: {

        },
        data() {
            return {
                value1: '',
                detailShow: false,
                activeName : 'analyze',
                searchForm  : {
                    saleTimeRange : [],
                    isDel : '0',
                    isHc : '1',
                },
                czSearchForm : {
                    saleTimeRange : [],
                    isDel : '0',
                    isHc : '1',
                },
                packSearchForm : {
                    saleTimeRange : [],
                    isDel : '0',
                    isHc : '1',
                },
                pageInfo:{page:1,limit:10},
            }
        },
        mounted(){
            let d = new Date
            let year = d.getFullYear()
            let month = d.getMonth()+1
            if(Number(month) < 10){
                month = "0" + month
            }
            let day = d.getDate()
            if(Number(day) < 10){
                day = "0" + day
            }
            let date1 = year + "-" + month + "-" + day
            this.searchForm.saleTimeRange.push(date1)
            this.searchForm.saleTimeRange.unshift(date1)
            this.czSearchForm.saleTimeRange.push(date1)
            this.czSearchForm.saleTimeRange.unshift(date1)
            this.packSearchForm.saleTimeRange.push(date1)
            this.packSearchForm.saleTimeRange.unshift(date1)
            this.search();
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let saleTimeRange = this.searchForm.saleTimeRange;
                if(saleTimeRange){
                    reqObj.saleTimeStart = this.searchForm.saleTimeRange[0];
                    reqObj.saleTimeEnd = this.searchForm.saleTimeRange[1];
                }
                reqObj.isDel = this.searchForm.isDel;
                reqObj.isHc = this.searchForm.isHc;
                return reqObj;
            },
            searchFormReqCz : function () {
                let reqObj = {}
                let saleTimeRangeOver = this.czSearchForm.saleTimeRange;
                if(saleTimeRangeOver){
                    reqObj.updatedTimeStart = this.czSearchForm.saleTimeRange[0];
                    reqObj.updatedTimeEnd = this.czSearchForm.saleTimeRange[1];
                }
                reqObj.isDel = this.czSearchForm.isDel;
                reqObj.isHc = this.czSearchForm.isHc;
                return reqObj;
            },
            searchFormReqPack : function () {
                let reqObj = {}
                let saleTimeRangeZf = this.packSearchForm.saleTimeRange;
                if(saleTimeRangeZf){
                    reqObj.saleTimeStart = this.packSearchForm.saleTimeRange[0];
                    reqObj.saleTimeEnd = this.packSearchForm.saleTimeRange[1];
                }
                reqObj.isDel = this.packSearchForm.isDel;
                reqObj.isHc = this.packSearchForm.isHc;
                return reqObj;
            }
        },
        methods: {
            getData(reqParams){
                const fetch = service.cashier.serviceRecords.servicerecordList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getDateCz(reqParams){
                const fetch = service.cashier.cardRecords.cardRecordList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.tableCz.reloadData({
                    fetch,
                    params,
                });
            },
            getDatePack(reqParams){
                const fetch = service.cashier.packageRecords.packagerecordList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.tablePack.reloadData({
                    fetch,
                    params,
                });
            },
            search(){
                this.pageInfo.page=1
                this.getData(this.searchFormReq);
            },
            searchCz(){
                this.pageInfo.page=1
                this.getDateCz(this.searchFormReqCz);
            },
            searchPack(){
                this.pageInfo.page=1
                this.getDatePack(this.searchFormReqPack);
            },
            handleClick(tab){
                if(tab.name == 'analyze'){
                    this.search();
                }else if(tab.name == 'assignment'){
                    this.searchCz();
                }else if(tab.name == 'logs'){
                    this.searchPack();
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .member-relation {

    }
</style>
