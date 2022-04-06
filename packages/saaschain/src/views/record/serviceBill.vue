<template>
    <div class="member-relation">
        <el-tabs v-model="activeName" @tab-click="handleClick" v-show="!detailShow">
            <el-tab-pane label="服务单记录" name="analyze">
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
                    <el-form-item label="门店：">
                        <el-select clearable v-model.trim="searchForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="seniorSearch" type="primary">高级查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="table">
                    <yid-table-column label="服务单号" min-width="150" prop="billcode"></yid-table-column>
                    <yid-table-column label="客户" min-width="180" prop="cardInfo" class="titlelabel">
                        <template slot-scope="scope">
                            <span>{{scope.row.memName}} {{getSexName(scope.row.sex)}} {{scope.row.mobile}}</span><br>
                            <span>{{scope.row.cardInfo}} {{scope.row.cmcode}}</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="计客数" min-width="70" prop="isCompute">
                        <template slot-scope="scope">
                            {{scope.row.isCompute == '1' ? "是" : "否"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="消费时间" min-width="160" prop="saleTime"></yid-table-column>
                    <yid-table-column label="消费金额" min-width="150" prop="totalMoney">
                        <template slot-scope="scope">
                            ￥{{scope.row.totalMoney}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="支付方式" min-width="150" prop="pays">
                        <template slot-scope="scope">
                            <span v-for="pays in scope.row.payList">￥{{pays.money}} {{pays.payname}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="项目/客装商品" min-width="200" prop="servs" align="left">
                        <template slot-scope="scope">
                            <span v-for="servs in scope.row.servVOList">￥{{servs.sname}}*{{servs.num}} [{{getServType(servs.stype)}}]<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="总业绩" min-width="150" prop="sumyj">
                        <template slot-scope="scope">
                            ￥{{scope.row.sumyj}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="员工" min-width="250" prop="members" align="left">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">第{{royaltys.postion}}工位：{{royaltys.eecode}} {{royaltys.eename}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="员工业绩" min-width="200" prop="yjs">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">业绩：￥{{royaltys.yj}} {{getisAppoint(royaltys.isApppoint)}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="提成" min-width="150" prop="royaltys">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">提成：￥{{royaltys.royalty}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作人" min-width="150" prop="updatedBy"></yid-table-column>
                    <yid-table-column label="操作" min-width="250" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="checkDetail(scope.row)">查看详情</el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;">打印小票</el-link>
                            <el-link type="primary">撤单</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="已过期" name="expired">
                <el-form ref="searchFormOver" inline :model="searchFormOver">
                    <el-form-item label="日期：">
                        <el-date-picker
                                v-model="searchFormOver.saleTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="门店：">
                        <el-select clearable v-model.trim="searchFormOver.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="searchOver" type="primary">查询</el-button>
                        <el-button @click="get" type="primary">高级查询</el-button>
                    </el-form-item>
                </el-form>
                <div style="margin-top: -20px;">
                    <el-divider/>
                </div>
                <yid-table pagination ref="tableOver" style="margin-top: 15px;">
                    <yid-table-column label="牌号" min-width="150" prop="billNo"></yid-table-column>
                    <yid-table-column label="顾客/手机号" min-width="200" prop="cardInfo">
                        <template slot-scope="scope">
                            <span>{{scope.row.memName}} {{scope.row.mobile}}</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="服务单号" min-width="200" prop="billcode"></yid-table-column>
                    <yid-table-column label="开单时间" min-width="150" prop="createdTime"></yid-table-column>
                    <yid-table-column label="项目" min-width="200" prop="servs">
                        <template slot-scope="scope">
                            <span v-for="servs in scope.row.servVOList">￥{{servs.sname}}*{{servs.num}} [{{getServType(servs.stype)}}]<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="总价" min-width="150" prop="totalMoney">
                        <template slot-scope="scope">
                            ￥{{scope.row.totalMoney}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="服务人员" min-width="200" prop="members">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">{{royaltys.eecode}} {{royaltys.eename}} {{getisAppoint(royaltys.isApppoint)}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="120" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="get">作废</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="已作废" name="invalid">
                <el-form ref="searchFormZf" inline :model="searchFormZf">
                    <el-form-item label="日期：">
                        <el-date-picker
                                v-model="searchFormZf.saleTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="门店：">
                        <el-select clearable v-model.trim="searchFormZf.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="searchZf" type="primary">查询</el-button>
                        <el-button @click="get" type="primary">高级查询</el-button>
                    </el-form-item>
                </el-form>
                <div style="margin-top: -20px;">
                    <el-divider/>
                </div>
                <yid-table pagination ref="tableZf" style="margin-top: 15px;">
                    <yid-table-column label="牌号" min-width="150" prop="billNo"></yid-table-column>
                    <yid-table-column label="顾客/手机号" min-width="200" prop="cardInfo">
                        <template slot-scope="scope">
                            <span>{{scope.row.memName}} {{scope.row.mobile}}</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="服务单号" min-width="200" prop="billcode"></yid-table-column>
                    <yid-table-column label="开单时间" min-width="150" prop="createdTime"></yid-table-column>
                    <yid-table-column label="项目" min-width="200" prop="servs">
                        <template slot-scope="scope">
                            <span v-for="servs in scope.row.servVOList">￥{{servs.sname}}*{{servs.num}} [{{getServType(servs.stype)}}]<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="总价" min-width="150" prop="totalMoney">
                        <template slot-scope="scope">
                            ￥{{scope.row.totalMoney}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="服务人员" min-width="200" prop="members">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">{{royaltys.eecode}} {{royaltys.eename}} {{getisAppoint(royaltys.isApppoint)}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="作废时间" min-width="150" prop="cancelTime"></yid-table-column>
                    <yid-table-column label="作废理由" min-width="150" prop="cancelReason"></yid-table-column>
                    <yid-table-column label="操作人" min-width="150" prop="cancelOper"></yid-table-column>
                    <yid-table-column label="操作" min-width="120" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="get">删除</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>

        <el-collapse-transition>
            <div v-show="detailShow">
                <billDetail ref="billDetailPage" @onClose="closeDetailPage"></billDetail>
            </div>
        </el-collapse-transition>

        <yid-dialog :title="searchDialog.title" :visible.sync="searchDialog.visible" width="450px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="服务单号：" prop="billcode">
                    <el-input  v-model="searchForm.billcode"  style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="电话号码：" prop="mobile">
                    <el-input  v-model="searchForm.mobile"  style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="支付方式：" prop="cardpay">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.cardpay">
                        <el-option :key="item.paycode" :label="item.payname" :value="item.paycode" v-for="item in cardpays"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顾客姓名：" prop="memName">
                    <el-input  v-model="searchForm.memName" style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="会员卡号：" prop="channel">
                    <el-input  v-model="searchForm.cmcode" style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="操作人：" prop="createdBy">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.createdBy">
                        <el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>
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
    import billDetail from './billDetail'
    import service from '@src/service'
    export default {
        name: "member-relation",
        components: {
            billDetail
        },
        data() {
            return {
                value1: '',
                detailShow: false,
                activeName : 'analyze',
                model : {
                    startTime : '',
                    endTime : ''
                },
                tableData: [],
                detailInitData:{}, // 传入明细组件的初始值
                searchForm  : {
                    saleTimeRange : [],
                    isDel : '0',
                    isHc : '0',
                    status : '',
                    billcode : '',
                    mobile : '',
                    cardpay : '',
                    memName : '',
                    cmcode : '',
                    createdBy : '',
                    eeid : '',
                    shopid:""

                },
                searchFormOver : {
                    saleTimeRange : [],
                    isDel : '0',
                    isHc : '0',
                    status : '2',
                    shopid:""
                },
                searchFormZf : {
                    saleTimeRange : [],
                    isDel : '0',
                    isHc : '0',
                    status : '3',
                    shopid:""
                },
                pageInfo:{page:1,limit:10},
                searchDialog: {
                    title: '高级查询',
                    visible: false,
                },
                employeeList : [],
                cardpays : [],
                allShopList:[],
                filterShopList:[],
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
            this.searchFormOver.saleTimeRange.push(date1)
            this.searchFormOver.saleTimeRange.unshift(date1)
            this.searchFormZf.saleTimeRange.push(date1)
            this.searchFormZf.saleTimeRange.unshift(date1)
            this.getCraftsmans();
            this.getCardpays();
            this.search();
            this.getShopList({status:"1"});
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let saleTimeRange = this.searchForm.saleTimeRange;
                if(saleTimeRange){
                    reqObj.saleTimeStart = this.searchForm.saleTimeRange[0];
                    reqObj.saleTimeEnd = this.searchForm.saleTimeRange[1];
                }
                reqObj.billcode = this.searchForm.billcode
                reqObj.mobile = this.searchForm.mobile
                reqObj.cardpay = this.searchForm.cardpay
                reqObj.memName = this.searchForm.memName
                reqObj.cmcode = this.searchForm.cmcode
                reqObj.createdBy = this.searchForm.createdBy
                reqObj.eeid = this.searchForm.eeid
                reqObj.isDel = this.searchForm.isDel
                reqObj.isHc = this.searchForm.isHc
                reqObj.status = this.searchForm.status
                reqObj.shopid = this.searchForm.shopid
                return reqObj;
            },
            searchFormReqOver : function () {
                let reqObj = {}
                let saleTimeRangeOver = this.searchFormOver.saleTimeRange;
                if(saleTimeRangeOver){
                    reqObj.updatedTimeStart = this.searchFormOver.saleTimeRange[0];
                    reqObj.updatedTimeEnd = this.searchFormOver.saleTimeRange[1];
                }
                reqObj.isDel = this.searchFormOver.isDel
                reqObj.isHc = this.searchFormOver.isHc
                reqObj.status = this.searchFormOver.status
                reqObj.shopid = this.searchFormOver.shopid
                return reqObj;
            },
            searchFormReqZf : function () {
                let reqObj = {}
                let saleTimeRangeZf = this.searchFormZf.saleTimeRange;
                if(saleTimeRangeZf){
                    reqObj.cancelTimeStart = this.searchFormZf.saleTimeRange[0];
                    reqObj.cancelTimeEnd = this.searchFormZf.saleTimeRange[1];
                }
                reqObj.isDel = this.searchFormZf.isDel
                reqObj.isHc = this.searchFormZf.isHc
                reqObj.status = this.searchFormZf.status
                reqObj.shopid = this.searchFormZf.shopid
                return reqObj;
            }
        },
        methods: {
            getData(reqParams){
                const fetch = service.cashier.serviceRecords.servicerecordList
                const params = {...this.pageInfo,...reqParams}
                params.status = "4"
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getDataOver(reqParams){
                const fetch = service.cashier.serviceRecords.servicerecordList
                const params = {...this.pageInfo,...reqParams}
                params.status = "2"
                this.$refs.tableOver.reloadData({
                    fetch,
                    params,
                });
            },
            getDataZf(reqParams){
                const fetch = service.cashier.serviceRecords.servicerecordList
                const params = {...this.pageInfo,...reqParams}
                params.status = "3"
                this.$refs.tableZf.reloadData({
                    fetch,
                    params,
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
            search(){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getData(this.searchFormReq);
                this.cleanSearch();
            },
            searchOver(){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.tableOver.Pagination.internalPageSize;
                console.log(this.searchFormReqOver);
                this.getDataOver(this.searchFormReqOver);
            },
            searchZf(){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.tableZf.Pagination.internalPageSize;
                console.log(this.searchFormReqZf);
                this.getDataZf(this.searchFormReqZf);
            },
            cleanSearch(){
                this.searchForm.billcode = '';
                this.searchForm.mobile = '';
                this.searchForm.cpname = '';
                this.searchForm.cardpay = '';
                this.searchForm.memName = '';
                this.searchForm.cmcode = '';
                this.searchForm.createdBy = '';
                this.searchForm.eeid = '';
            },
            checkDetail(row) {
                this.detailShow = true;
                this.detailInitData.billid = row.id;
                this.detailInitData.entryData = row;
                this.$refs.billDetailPage.initData(this.detailInitData);
            },
            closeDetailPage(){
                this.detailInitData = {};
                this.detailShow = false;
                this.search();
            },
            seniorSearch(){
                this.searchDialog.visible = true;
            },
            searchgj(){
                console.log(this.searchFormReq);
                this.search();
                this.searchDialog.visible = false;
            },
            cancel(){
                this.searchDialog.visible = false;
            },
            handleClick(tab){
                if(tab.name == 'analyze'){
                    this.search();
                }else if(tab.name == 'expired'){
                    this.searchOver();
                }else if(tab.name == 'invalid'){
                    this.searchZf();
                }
            },
            getSexName(sex){
                let res = '';
                if(sex === '1'){
                    res = '男';
                }else if(sex === '2'){
                    res = '女';
                }
                return res;
            },
            getisAppoint(isApppoint){
                let res = "";
                if(isApppoint === "0"){
                    res = "非指定"
                }else if(isApppoint === "1"){
                    res = "指定"
                }
                return res;
            },
            getServType(stype){
                let res = "";
                if(stype === "1"){
                    res = "项目"
                }else if(stype === "2"){
                    res = "产品"
                }
                return res;
            },
            getShopList(params){
                service.chain.shop.shopList(params).then(res=> {
                    if(res.resp_code == 200) {
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
            }
        }
    }
</script>

<style scoped lang="scss">
    .member-relation {

    }
</style>
