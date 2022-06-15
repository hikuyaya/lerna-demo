<template>
    <div class="member-relation">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="单据列表" name="billhead">
                <el-form :model="searchForm" ref="searchForm" inline>
                    <el-form-item label="单据类型：" prop="btid" :rules="[{ required: true, message: '单据类型不能为空'}]">
                        <!-- 收银单 购买套餐 充值办卡 充值调整 收支管理 备用金回存 备用金审核拨款 代扣代缴维护单 合作方业绩扣减维护单 门店日常结存报表 门店预估表-->
                        <el-select clearable placeholder="请选择" v-model.trim="searchForm.btid" style="width: 150px;">
                            <el-option v-for="item in btnames" :value="item.code" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年月" prop="yearmonth" :rules="[{ required: true, message: '年月不能为空'}]">
                        <el-date-picker
                                style="width: 150px"
                                v-model="searchForm.yearmonth"
                                type="month"
                                fromat="yyyy-MM"
                                value-format="yyyy-MM"
                                placeholder="年月">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="店号：">
                        <el-input clearable placeholder="请输入" v-model.trim="searchForm.shopcode"
                                  style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="是否推送：" prop="isTs">
                        <el-select clearable placeholder="请选择" v-model.trim="searchForm.isTs" style="width: 150px;">
                            <el-option value="0" label="未推送"></el-option>
                            <el-option value="2" label="已推送"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否红冲：" prop="isTs">
                        <el-select clearable placeholder="请选择" v-model.trim="searchForm.isHc" style="width: 150px;">
                            <el-option value="0" label="未红冲"></el-option>
                            <el-option value="1" label="已红冲"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="querybillhead" type="primary">查询</el-button>
                        <el-button @click="sendBill" type="primary">推送</el-button>
                        <!--<el-button @click="sendAllBill" type="primary">全推</el-button>-->
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="billTable" @selection-change="handleSelectionChange"
                           style="margin-top: 15px;">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
                    <yid-table-column label="单号" min-width="100" prop="billcode"></yid-table-column>
                    <yid-table-column label="单据类型" min-width="100" prop="btname">
                        <template slot-scope="scope">
                            {{searchForm.btid | formatBtid(btnames)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="单据时间" min-width="100" prop="updatedTime"></yid-table-column>
                    <yid-table-column label="是否红冲" min-width="100" prop="isHc">
                        <template slot-scope="scope">
                            {{"1" == scope.row.isHc ? "是" : "否"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="是否推送" min-width="100" prop="isTs">
                        <template slot-scope="scope">
                            {{"2" == scope.row.isTs ? "是" : "否"}}
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="未结算单据" name="wjbill">
                <el-form :model="searchBill" ref="searchwjBill" inline>
                    <el-form-item label="单据类型：">
                        <!-- 收银单 购买套餐 充值办卡 充值调整 收支管理 备用金回存 备用金审核拨款 代扣代缴维护单 合作方业绩扣减维护单 门店日常结存报表 门店预估表-->
                        <el-select clearable placeholder="请选择" v-model.trim="searchBill.btid" style="width: 150px;">
                            <el-option v-for="item in btnames" :value="item.code" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店号：">
                        <el-input clearable placeholder="请输入" v-model.trim="searchBill.shopcode"
                                  style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="单号：">
                        <el-input clearable placeholder="请输入" v-model.trim="searchBill.billcode"
                                  style="width: 160px;"></el-input>
                    </el-form-item>
                    <el-form-item label="日期" prop="date">
                        <el-date-picker style="width:320px;"
                                        v-model="searchBill.date" value-format="yyyy-MM-dd"
                                        type="daterange"
                                        start-placeholder="开始日期" range-separator="至" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="queryWjBill" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="wjTable" style="margin-top: 15px;">
                    <yid-table-column label="单号" min-width="100" prop="billcode"></yid-table-column>
                    <yid-table-column label="单据类型" min-width="100" prop="btname"></yid-table-column>
                    <yid-table-column label="单据时间" min-width="100" prop="rqsj"></yid-table-column>
                    <yid-table-column label="是否红冲" min-width="100" prop="ishc">
                        <template slot-scope="scope">
                            {{"1" == scope.row.ishc ? "是" : "否"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
                    <yid-table-column label="结算次数" min-width="100" prop="jobcount"></yid-table-column>
                    <yid-table-column label="结算日志" min-width="180" prop="joblog"></yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="已结算单据" name="jjbill">
                <el-form :model="searchBill" ref="searchjjBill" inline>
                    <el-form-item label="单据类型：">
                        <!-- 收银单 购买套餐 充值办卡 充值调整 收支管理 备用金回存 备用金审核拨款 代扣代缴维护单 合作方业绩扣减维护单 门店日常结存报表 门店预估表-->
                        <el-select clearable placeholder="请选择" v-model.trim="searchBill.btid" style="width: 150px;">
                            <el-option v-for="item in btnames" :value="item.code" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店号：">
                        <el-input clearable placeholder="请输入" v-model.trim="searchBill.shopcode"
                                  style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="单号：">
                        <el-input clearable placeholder="请输入" v-model.trim="searchBill.billcode"
                                  style="width: 160px;"></el-input>
                    </el-form-item>
                    <el-form-item label="日期" prop="date">
                        <el-date-picker style="width:320px;"
                                        v-model="searchBill.date" value-format="yyyy-MM-dd"
                                        type="daterange"
                                        start-placeholder="开始日期" range-separator="至" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="queryJjBill" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="jjTable" style="margin-top: 15px;">
                    <yid-table-column label="单号" min-width="100" prop="billcode"></yid-table-column>
                    <yid-table-column label="单据类型" min-width="100" prop="btname"></yid-table-column>
                    <yid-table-column label="单据时间" min-width="100" prop="rqsj"></yid-table-column>
                    <yid-table-column label="是否红冲" min-width="100" prop="ishc">
                        <template slot-scope="scope">
                            {{"1" == scope.row.ishc ? "是" : "否"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import yid from '@src/library'
    import service from '@src/service'
    import {isEmpty} from "../../library/helper/validate";

    export default {
        name: "mac",
        components: {},
        data() {
            return {
                activeName: 'billhead',
                searchForm: {
                    btid: "",
                    btname: "",
                    shopcode: "",
                    yearmonth: "",
                    isTs: '0',
                    isHc: '0'
                },
                pageInfo: {
                    page: 0,
                    limit: 10
                },
                searchBill: {
                    btid: "",
                    shopcode: "",
                    billcode: "",
                    date: []
                },
                selectedRows: [],
                btnames: [
                    {code: '1', name: '收银单'}, {code: '2', name: '购买套餐'}, {code: '3', name: '充值办卡'},
                    {code: '4', name: '充值调整'}, {code: '5', name: '收支管理'}, {code: '6', name: '备用金回存'},
                    {code: '7', name: '备用金审核拨款'}, {code: '8', name: '代扣代缴维护单'}, {code: '9', name: '合作方业绩扣减维护单'}
//                    {code: '10', name: '门店日常结存报表'}, {code: '11', name: '门店预估表'}
                ]
            }
        },
        mounted() {

        },
        filters: {
            formatBtid(str, btnames) {
                let label = ""
                btnames.map(m => {
                    if (m.code == str) {
                        label = m.name
                    }
                })
                if (label) {
                    return label
                } else {
                    return str
                }
            }
        },
        methods: {
            querybillhead() {
                const that = this;
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        let param = {};
                        if (this.searchForm.yearmonth) {
                            param.updatedTimeStart = this.searchForm.yearmonth + "-01 00:00:00";
                            param.updatedTimeEnd = this.searchForm.yearmonth + "-31 00:00:00";
                        } else {
                            param.updatedTimeStart = "";
                            param.updatedTimeEnd = "";
                        }
                        param.shopcode = this.searchForm.shopcode;
                        param.status = '4';
                        param.isTs = this.searchForm.isTs;
                        param.isHc = this.searchForm.isHc;

                        let fetch;
                        if (that.searchForm.btid == "1") {
                            fetch = service.cashier.serviceRecords.list;
                            that.searchForm.btname = "收银单";
                        } else if (that.searchForm.btid == "2") {
                            fetch = service.cashier.packageRecords.list;
                            that.searchForm.btname = "购买套餐";
                        } else if (that.searchForm.btid == "3") {
                            param.status = '1';
                            fetch = service.cashier.cardRecords.list;
                            that.searchForm.btname = "充值办卡";
                        } else if (that.searchForm.btid == "4") {
                            param.status = '1';
                            fetch = service.cashier.csadjBill.list;
                            that.searchForm.btname = "充值调整";
                        } else if (that.searchForm.btid == "5") {
                            param.status = '2';
                            fetch = service.finance.ioaccount.billList;
                            that.searchForm.btname = "收支单";
                        } else if (that.searchForm.btid == "6") {
                            param.status = '3';
                            fetch = service.finance.fundhcSpBill.billList;
                            that.searchForm.btname = "备用金回存";
                        } else if (that.searchForm.btid == "7") {
                            param.status = '4';
                            fetch = service.finance.fundFhBill.billListForchain;
                            that.searchForm.btname = "备用金审核拨款";
                        } else if (that.searchForm.btid == "8") {
                            param.status = '2';
                            fetch = service.finance.djBill.billList;
                            that.searchForm.btname = "代扣代缴维护单";
                        } else if (that.searchForm.btid == "9") {
                            param.status = '2';
                            fetch = service.finance.coopBill.billList;
                            that.searchForm.btname = "合作方业绩扣减维护单";
                        }
//                        {code: '6', name: '备用金回存'},
//                        {code: '7', name: '备用金审核拨款'},
//                        {code: '8', name: '代扣代缴维护单'},
//                        {code: '9', name: '合作方业绩扣减维护单'},
//                        {code: '10', name: '门店日常结存报表'},
//                        {code: '11', name: '门店预估表'}
                        const params = {...that.pageInfo, ...param}
                        that.$refs.billTable.reloadData({
                            fetch,
                            params
                        });
                    }
                })
            },
            handleSelectionChange(row) {
                this.selectedRows = row;
            },
            sendBill() {
                if (this.selectedRows.length > 0) {
                    let params = {
                        btid: this.searchForm.btid,
                        bills: []
                    }
                    this.selectedRows.forEach(each => {
                        const bill = {
                            billcode: each.billcode,
                            btid: this.searchForm.btid,
                            btname: this.searchForm.btname,
                            rqsj: each.updatedTime,
                            shopid: each.shopid,
                            ishc: each.isHc,
                            shopcode: each.shopcode,
                            shopname: each.shopname,
                            jobcount: 0,
                            joblog: "手推"
                        }
                        params.bills.push(bill)
                    })
                    service.billheadsync.saveBatch(params).then(res => {
                        if (res.resp_code == "200") {
                            yid.util.success("推送成功！")
                        }
                    });
                } else {
                    yid.util.error("请至少勾选一项")
                }
            },
            queryJjBill() {
                if (this.searchBill.date && this.searchBill.date.length > 0) {
                    this.searchBill.sdate = this.searchBill.date[0];
                    this.searchBill.edate = this.searchBill.date[1] + " 23:59:59";
                } else {
                    this.searchBill.sdate = "";
                    this.searchBill.edate = "";
                }
                const fetch = service.billheadsync.logList;
                const params = {...this.pageInfo, ...this.searchBill}
                delete  params.date;
                this.$refs.jjTable.reloadData({
                    fetch,
                    params
                });
            },
            queryWjBill() {
                if (this.searchBill.date && this.searchBill.date.length > 0) {
                    this.searchBill.sdate = this.searchBill.date[0];
                    this.searchBill.edate = this.searchBill.date[1] + " 23:59:59";
                } else {
                    this.searchBill.sdate = "";
                    this.searchBill.edate = "";
                }
                const fetch = service.billheadsync.syncList;
                const params = {...this.pageInfo, ...this.searchBill}
                delete  params.date;
                this.$refs.wjTable.reloadData({
                    fetch,
                    params
                });
            },
        }
    }
</script>

<style scoped lang='scss'>

</style>
