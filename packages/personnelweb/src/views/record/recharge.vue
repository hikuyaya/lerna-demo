<template>
    <div class="member-relation">
        <el-collapse-transition>
            <div v-show="!detailShow">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="日期：">
                        <el-date-picker
                                :clearable = false
                                v-model="searchForm.updatedTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="业务类型：">
                        <el-select clearable v-model="searchForm.shoptype" @change="changeShop" style="width: 100px">
                            <el-option label="美发" value="1"></el-option>
                            <el-option label="美容" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="门店：" prop="shopid">
                        <el-select clearable v-model.trim="searchForm.shopid"   @clear="clearFormShop" @blur="clearFormShop" filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="seniorSearch" type="primary">高级查询</el-button>
                        <el-button @click="importBill" type="primary">导出记录</el-button>
                    </el-form-item>
                </el-form>
                <el-alert v-model="viewTotal" :title="viewTotal.title"
                          type="info">
                </el-alert>
                <yid-table pagination ref="table" style="margin-top: 15px;">
                    <yid-table-column label="单号" min-width="180" prop="billcode"></yid-table-column>
                    <yid-table-column label="店名" min-width="120" prop="shopname"></yid-table-column>
                    <yid-table-column label="消费时间" min-width="180" prop="createdTime"></yid-table-column>
                    <yid-table-column label="卡号" min-width="150" prop="cmcode">
                        <template slot-scope="scope">
                            <!--<span>{{scope.row.cardname == null ? '' : '【'+scope.row.cardname+' '+scope.row.cardno+'】'}}</span>-->
                            <span>{{scope.row.cardno}}<br>{{scope.row.isShare =="1"?'(共享卡)':''}}</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="顾客" min-width="180" prop="cardInfo">
                        <template slot-scope="scope">
                            <span>{{scope.row.memName}} {{getSexName(scope.row.sex)}}</span><br>
                            <span>{{scope.row.mobile}}</span><br>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="消费内容" min-width="180" prop="content"></yid-table-column>
                    <yid-table-column label="充值金额" min-width="150" prop="money">
                        <template slot-scope="scope">
                            ￥{{scope.row.money}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="赠送金额" min-width="150" prop="gmoney">
                        <template slot-scope="scope">
                             <span v-show="scope.row.gmoney && scope.row.isHcMkt != '1'">
                                ￥{{scope.row.gmoney}}
                            </span>
                            <span v-show="!scope.row.gmoney || scope.row.isHcMkt == '1'">
                                ￥0
                            </span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="营销活动" min-width="150" prop="mktname">
                        <template slot-scope="scope">
                            <span v-show="scope.row.mktname && scope.row.isHcMkt != '1'">
                                {{scope.row.mktname}}
                            </span>
                            <span v-show="!scope.row.mktname || scope.row.isHcMkt == '1'">
                                --
                            </span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="充值累计单据" min-width="180" prop="mktBillmemo"></yid-table-column>
                    <el-table-column
                            prop="eename" min-width="180"
                            label="服务人员">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.yjsList">{{royaltys.eename}}|{{royaltys.yjje}}<br></span>
                            <!--<span><el-link type="primary" :underline="false" @click="editBill(scope.row)">编辑</el-link></span>-->
                        </template>
                    </el-table-column>
                    <!--<yid-table-column label="合计折扣" min-width="150" prop="zkeTotal">
                        <template slot-scope="scope">
                            -￥{{scope.row.zkeTotal}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="消费金额" min-width="150" prop="ysje">
                        <template slot-scope="scope">
                            ￥{{scope.row.ysje}}
                        </template>
                    </yid-table-column>-->
                    <!-- <yid-table-column label="充值类型" min-width="120" prop="isOpen">
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
                     </yid-table-column>-->
                    <yid-table-column label="操作人" min-width="150" prop="updatedBy"></yid-table-column>
                    <yid-table-column label="操作" min-width="260" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="checkDetail(scope.row)">查看详情</el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;">打印小票</el-link>
                            <el-link v-if="scope.row.mktname != null && scope.row.isHcMkt !='1'" type="primary" @click="revokeMktBill(scope.row)" style="margin: 0 10px 0 0px;">撤销活动</el-link>
                            <el-link type="primary" @click="revokeBill(scope.row)">撤单</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>

        <el-collapse-transition>
            <div v-show="detailShow">
                <cardbillDetail ref="billDetailPage" @onClose="closeDetailPage"></cardbillDetail>
            </div>
        </el-collapse-transition>

        <yid-dialog :title="searchDialog.title" :visible.sync="searchDialog.visible" width="450px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="服务单号：" prop="billcode">
                    <el-input  v-model="searchForm.billcode"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="电话号码：" prop="mobile">
                    <el-input  v-model="searchForm.mobile"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="支付方式：" prop="paycode">
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.paycode">
                        <el-option :key="item.paycode" :label="item.payname" :value="item.paycode" v-for="item in cardpays"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顾客姓名：" prop="memName">
                    <el-input  v-model="searchForm.memName" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="会员卡号：" prop="channel">
                    <el-input  v-model="searchForm.cmcode" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="充值类型：" prop="isOpen">
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.isOpen">
                        <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in opens"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务员工：" prop="eeid">
                    <!--<el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.eeid">
                        <el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>
                    </el-select>-->
                    <el-input  v-model="searchForm.eename" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item label="开卡充值活动：" prop="ismkt">
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.ismkt" @change="clearMktBillcode">
                        <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in isMktList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="mktname" v-if="searchForm.ismkt != '0'">
                    <!--<el-input  v-model="searchForm.mktname" style="width: 180px;"></el-input>-->
                    <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.mktbillcode">
                        <el-option :key="item.billcode" :label="item.name" :value="item.billcode" v-for="item in mktInfos"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="充值金额：" prop="money">
                    <el-input  v-model="searchForm.minmoney" style="width: 80px;"></el-input>-
                    <el-input  v-model="searchForm.maxmoney" style="width: 80px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel">取消</el-button>
                    <el-button @click="searchgj" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="revokeDialog.title" :visible.sync="revokeDialog.visible" width="450px">
            <el-form label-width="140px" ref="revokeForm">
                <el-form-item label="请输入撤单备注：" prop="hcMemo">
                    <el-input v-model="revokeForm.hcMemo" type="textarea" :rows="4" style="width: 80%;" placeholder="请输入0-30个字符"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="revokeCancel">取消</el-button>
                    <el-button @click="revoke" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import cardbillDetail from './cardbillDetail'
    import download from '@src/library/http/download'
    export default {
        name: "member-relation",
        components: {
            cardbillDetail
        },
        data() {
            return {
                value1: '',
                detailShow : false,
                activeName : 'analyze',
                searchForm  : {
                    updatedTimeRange : [],
                    isDel : '0',
                    isHc : '0',
                    status : '1',
                    billcode : '',
                    mobile : '',
                    paycode : '',
                    memName : '',
                    mktbillcode : '',
                    cmcode : '',
                    isOpen : '',
                    eeid : '',
                    shopid:"",
                    eename:"",
                    mktname:"",
                    minmoney : "",
                    maxmoney : "",
                    ismkt : "",
                    shoptype : '',
                },
                revokeForm : {
                    id : '',
                    billcode : '',
                    hcMemo : '',
                },
                pageInfo:{page:1,limit:10},
                detailInitData:{}, // 传入明细组件的初始值
                searchDialog: {
                    title: '高级查询',
                    visible: false,
                },
                revokeDialog : {
                    title: '撤单',
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
                mktInfos:[],
                allShopList:[],
                filterShopList:[],
                isMktList : [{
                    id : '',
                    name : '全部'
                },{
                    id : '0',
                    name : '无活动内容'
                },{
                    id : '1',
                    name : '参加活动'
                }],
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
            //this.getCraftsmans();
            this.getCardpays();
            //this.search();
            this.getShopList({status:"1"});
            this.getMtkInfos();
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let updatedTimeRange = this.searchForm.updatedTimeRange;
                if(updatedTimeRange){
                    reqObj.updatedTimeStart = this.searchForm.updatedTimeRange[0];
                    reqObj.updatedTimeEnd = this.searchForm.updatedTimeRange[1];
                }else{
                    reqObj.updatedTimeStart = ''
                    reqObj.updatedTimeEnd = ''
                }
                reqObj.billcode = this.searchForm.billcode
                reqObj.mobile = this.searchForm.mobile
                reqObj.paycode = this.searchForm.paycode
                reqObj.memName = this.searchForm.memName
                reqObj.cmcode = this.searchForm.cmcode
                reqObj.isOpen = this.searchForm.isOpen
                reqObj.eeid = this.searchForm.eeid
                reqObj.isDel = this.searchForm.isDel
                reqObj.status = this.searchForm.status
                reqObj.isHc = this.searchForm.isHc
                reqObj.shopid = this.searchForm.shopid
                reqObj.eename = this.searchForm.eename
                reqObj.mktname = this.searchForm.mktname
                reqObj.mktbillcode = this.searchForm.mktbillcode
                reqObj.minmoney = this.searchForm.minmoney
                reqObj.maxmoney = this.searchForm.maxmoney
                reqObj.ismkt = this.searchForm.ismkt
                reqObj.shoptype = this.searchForm.shoptype;
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
            /*getCraftsmans(){
                service.employee.listAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.employeeList = res.data;
                    }
                })
            },*/
            getCardpays(){
                service.cashier.payType.listAll({}).then(res=> {
                    if(res.resp_code == 200) {
                        this.cardpays = res.data;
                    }
                })
            },
            getMtkInfos(){
                service.cashier.mktInfo.listAll({matype:"2",isDel:"0"}).then(res=>{
                    if(res.resp_code == 200) {
                        this.mktInfos = res.data;
                    }
                })
            },
            seniorSearch(){
                this.searchDialog.visible = true;
            },
            search(){
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        this.pageInfo.page=1
                        this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                        if($yid.util.isEmpty(this.searchFormReq.updatedTimeStart) || $yid.util.isEmpty(this.searchFormReq.updatedTimeEnd)){
                            $yid.util.alert("请选择日期再进行查询!");
                            return;
                        }
                        let arg = this.DateMinus(this.searchFormReq.updatedTimeStart, this.searchFormReq.updatedTimeEnd);
                        if(Number(arg) > 30){
                            $yid.util.error("时间间隔请选择30天之内!");
                            return;
                        }
                        this.cleanSearch();
                        this.getData(this.searchFormReq);
                    }
                })
            },
            gjsearch(){
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        this.pageInfo.page=1
                        this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                        if($yid.util.isEmpty(this.searchFormReq.updatedTimeStart) || $yid.util.isEmpty(this.searchFormReq.updatedTimeEnd)){
                            $yid.util.alert("请选择日期再进行查询!");
                            return;
                        }
                        let arg = this.DateMinus(this.searchFormReq.updatedTimeStart, this.searchFormReq.updatedTimeEnd);
                        if(Number(arg) > 30){
                            $yid.util.error("时间间隔请选择30天之内!");
                            return;
                        }
                        this.getData(this.searchFormReq);
                    }
                })
            },
            cleanSearch(){
                this.searchForm.billcode = '';
                this.searchForm.mobile = '';
                this.searchForm.paycode = '';
                this.searchForm.memName = '';
                this.searchForm.cmcode = '';
                this.searchForm.isOpen = '';
                this.searchForm.eeid = '';
                this.searchForm.minmoney = '';
                this.searchForm.maxmoney = '';
                this.searchForm.ismkt = '';
                this.searchForm.mktbillcode = '';
                this.searchForm.eename = '';
            },
            searchgj(){
                console.log(this.searchFormReq);
                this.gjsearch();
                this.searchDialog.visible = false;
            },
            cancel(){
                this.searchDialog.visible = false;
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
            revokeBill(row){
                this.revokeForm.id = row.id;
                this.revokeForm.billcode = row.billcode;
                this.revokeForm.hcMemo = '';
                this.revokeDialog.visible = true;
            },
            revokeCancel(){
                this.revokeDialog.visible = false;
            },
            revoke(){
                if(this.revokeForm.id == null || this.revokeForm.id.length == 0){
                    $yid.util.alert("单据id为空，不允许撤单");
                    return
                }
                if(this.revokeForm.hcMemo != null && this.revokeForm.hcMemo.length > 0){
                    if(this.revokeForm.hcMemo.length > 30){
                        $yid.util.alert("撤单备注不能超过30个字");
                        return
                    }
                }
                service.cashier.cardRecords.recall(this.revokeForm).then(res=>{
                    if(res.resp_code == 200) {
                        $yid.util.success("操作成功");
                        this.revokeDialog.visible = false;
                        this.search();
                    }else{
                        $yid.util.error(res.resp_msg)
                        return
                    }
                })
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
            },
            clearFormShop(){
                setTimeout(() =>{
                    if(this.searchForm.shopid == ''){
                        this.searchForm.shopid = "";
                        this.filterShopList = Object.assign(this.allShopList);
                    }

                },300)
            },
            importBill(){
                console.log(this.searchFormReq);
                let updatedTimeStart = this.searchFormReq.updatedTimeStart;
                let updatedTimeEnd = this.searchFormReq.updatedTimeEnd;
                /*let shopid = this.searchFormReq.shopid;
                if($yid.util.isEmpty(shopid)){
                    $yid.util.error("请选择门店");
                    return;
                }*/
                if($yid.util.isEmpty(updatedTimeStart) || $yid.util.isEmpty(updatedTimeEnd)){
                    $yid.util.error("请选择日期");
                    return;
                }
                let arg = this.DateMinus(updatedTimeStart, updatedTimeEnd);
                if(Number(arg) > 30){
                    $yid.util.error("时间间隔请选择30天之内!");
                    return;
                }
                download($yid.config.API.BASE + 'api-cashier/cardrecords/cardrecordsExportForChain', this.searchFormReq)
            },
            DateMinus(date1, date2) {
                //date1:小日期   date2:大日期
                var sdate = new Date(date1);
                var now = new Date(date2);
                var days = now.getTime() - sdate.getTime();
                var day = parseInt(days / (1000 * 60 * 60 * 24));
                return day;
            },
            clearMktBillcode(){
                this.searchForm.mktbillcode = '';
            },
            revokeMktBill(row){
                $yid.util.confirm("操作撤销活动后，系统将撤回活动赠送的内容，是否确定撤销?","","",()=>{
                    const hcmktForm = {};
                    hcmktForm.id = row.id;
                    hcmktForm.billcode = row.billcode;
                    service.cashier.cardRecords.revokeMktBill(hcmktForm).then(res=>{
                        if(res.resp_code == 200) {
                            $yid.util.success("操作成功");
                            this.search();
                        }else{
                            $yid.util.error(res.resp_msg)
                            return
                        }
                    })
                })
            },
            changeShop(){
                const param = {}
                let type = this.searchForm.shoptype;
                param.status = '1';
                param.type = type;
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

<style scoped lang="scss">
    .member-relation {

    }
</style>
