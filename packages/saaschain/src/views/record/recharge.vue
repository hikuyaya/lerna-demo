<template>
    <div class="member-relation">
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="日期：">
                <el-date-picker
                        v-model="searchForm.updatedTimeRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
                <el-button @click="search" type="primary">查询</el-button>
                <el-button @click="seniorSearch" type="primary">高级查询</el-button>
            </el-form-item>
        </el-form>
        <el-alert v-model="viewTotal" :title="viewTotal.title"
                type="info">
        </el-alert>
        <yid-table pagination ref="table" style="margin-top: 15px;">
            <yid-table-column label="单号" min-width="180" prop="billcode"></yid-table-column>
            <yid-table-column label="充值时间" min-width="180" prop="updatedTime"></yid-table-column>
            <yid-table-column label="顾客信息" min-width="180" prop="cardInfo">
                <template slot-scope="scope">
                    <span>{{scope.row.memName}}</span><br>
                    <span>{{scope.row.mobile}}</span><br>
                    <span>{{scope.row.cardname}}</span>
                    <span>{{scope.row.cardno}}</span>
                </template>
            </yid-table-column>
            <yid-table-column label="金额" min-width="150" prop="payments">
                <template slot-scope="scope">
                    <span v-for="pays in scope.row.paysList">￥{{pays.payje}}({{pays.payname}})<br></span>
                </template>
            </yid-table-column>
            <yid-table-column label="充值类型" min-width="120" prop="isOpen">
                <template slot-scope="scope">
                    {{scope.row.isOpen == '1' ? "开卡" : "充值"}}
                </template>
            </yid-table-column>
            <yid-table-column label="员工" min-width="180" prop="members">
                <template slot-scope="scope">
                    <span v-for="yjs in scope.row.yjsList">{{yjs.eecode}} {{yjs.eename}}<br></span>
                    <span><el-link type="primary" :underline="false" @click="editBill">编辑</el-link></span>
                </template>
            </yid-table-column>
            <yid-table-column label="业绩" min-width="150" prop="eeyjs">
                <template slot-scope="scope">
                    <span v-for="yjs in scope.row.yjsList">￥{{yjs.yjje== null ? 0 :yjs.yjje}}<br></span>
                </template>
            </yid-table-column>
            <yid-table-column label="提成" min-width="150" prop="royaltys">
                <template slot-scope="scope">
                    <span v-for="yjs in scope.row.yjsList">￥{{yjs.royalty== null ? 0 :yjs.royalty}}<br></span>
                </template>
            </yid-table-column>
            <yid-table-column label="操作人" min-width="150" prop="updatedBy"></yid-table-column>
            <yid-table-column label="操作" min-width="150" prop="content" fixed="right">
                <el-link type="primary">撤单</el-link>
                <el-link type="primary" style="margin: 0 10px 0 10px;">打印小票</el-link>
            </yid-table-column>
        </yid-table>
        <yid-dialog :title="searchDialog.title" :visible.sync="searchDialog.visible" width="450px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="服务单号：" prop="billcode">
                    <el-input  v-model="searchForm.billcode"  style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="电话号码：" prop="mobile">
                    <el-input  v-model="searchForm.mobile"  style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="支付方式：" prop="paycode">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.paycode">
                        <el-option :key="item.paycode" :label="item.payname" :value="item.paycode" v-for="item in cardpays"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顾客姓名：" prop="memName">
                    <el-input  v-model="searchForm.memName" style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="会员卡号：" prop="channel">
                    <el-input  v-model="searchForm.cmcode" style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="充值类型：" prop="isOpen">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.isOpen">
                        <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in opens"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务员工：" prop="eeid">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.eeid">
                        <el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel">取消</el-button>
                    <el-button @click="searchgj" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
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
                activeName : 'analyze',
                searchForm  : {
                    updatedTimeRange : [],
                    isDel : '0',
                    isHc : '0',
                    billcode : '',
                    mobile : '',
                    paycode : '',
                    memName : '',
                    cmcode : '',
                    isOpen : '',
                    eeid : '',
                },
                pageInfo:{page:1,limit:10},
                searchDialog: {
                    title: '高级查询',
                    visible: false,
                },
                totalNum : '',
                totalMoney : '',
                viewTotal : {
                    title : '本次查询共  0 条记录    合计总金额：￥0'
                },
                opens : [{
                    id : '0',
                    name : '充值'
                },{
                    id : '1',
                    name : '开卡'
                }],
                employeeList : [],
                cardpays : [],
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
            this.searchForm.updatedTimeRange.push(date1)
            this.searchForm.updatedTimeRange.unshift(date1)
            this.getCraftsmans();
            this.getCardpays();
            this.search();
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let updatedTimeRange = this.searchForm.updatedTimeRange;
                if(updatedTimeRange){
                    reqObj.updatedTimeStart = this.searchForm.updatedTimeRange[0];
                    reqObj.updatedTimeEnd = this.searchForm.updatedTimeRange[1];
                }
                reqObj.billcode = this.searchForm.billcode
                reqObj.mobile = this.searchForm.mobile
                reqObj.paycode = this.searchForm.paycode
                reqObj.memName = this.searchForm.memName
                reqObj.cmcode = this.searchForm.cmcode
                reqObj.isOpen = this.searchForm.isOpen
                reqObj.eeid = this.searchForm.eeid
                reqObj.isDel = this.searchForm.isDel
                reqObj.isHc = this.searchForm.isHc
                return reqObj;
            }
        },
        methods: {
            getData(reqParams){
                const fetch = service.cashier.cardRecords.cardRecordList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
                //显示总条数和金额
                service.cashier.cardRecords.cardRecordsListSum(params).then(res=>{
                   if(res.resp_code == 200) {
                       let date = res.data;
                       if(date != null){
                           this.viewTotal.title = '本次查询共  '+date.totalNum+' 条记录    合计总金额：￥'+date.totalMoney;
                       }
                   }
                });
            },
            //获取服务人员列表
            getCraftsmans(){
                service.employee.listAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.employeeList = res.data;
                    }
                })
            },
            getCardpays(){
                service.cashier.payType.listAll({}).then(res=> {
                    if(res.resp_code == 200) {
                        this.cardpays = res.data;
                    }
                })
            },
            seniorSearch(){
                this.searchDialog.visible = true;
            },
            search(){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getData(this.searchFormReq);
                this.cleanSearch();
            },
            cleanSearch(){
                this.searchForm.billcode = '';
                this.searchForm.mobile = '';
                this.searchForm.paycode = '';
                this.searchForm.memName = '';
                this.searchForm.cmcode = '';
                this.searchForm.isOpen = '';
                this.searchForm.eeid = '';
            },
            searchgj(){
                console.log(this.searchFormReq);
                this.search();
                this.searchDialog.visible = false;
            },
            cancel(){
                this.searchDialog.visible = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .member-relation {

    }
</style>
