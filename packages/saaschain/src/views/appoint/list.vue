<template>
    <div class="appoint-list">
        <el-form inline>
            <el-form-item label="会员：">
                <el-input clearable v-model.trim="model.member" placeholder="会员名称/手机号"  style="width: 180px;"></el-input>
            </el-form-item>
            <el-form-item label="预约员工：">
                <el-input clearable v-model.trim="model.ee" placeholder="员工姓名/员工编码"  style="width: 180px;"></el-input>
            </el-form-item>
            <el-form-item label="预约时间：">
                <el-date-picker style="width: 240px;"
                        v-model="model.date"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item> <br/>
            <el-form-item label="预约状态：">
                <el-select multiple clearable filterable placeholder="请选择" style="width: 240px;" v-model.trim="model.statuslist">
                    <el-option v-for="item in statusList" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预约渠道：">
                <el-select clearable filterable placeholder="请选择" style="width: 160px;" v-model.trim="model.yccode">
                    <el-option v-for="item in channel" :value="item.yccode" :label="item.ycname"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="门店：">

                <el-select clearable v-model.trim="model.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="queryYyBilllist()" type="primary">查询</el-button>
            </el-form-item>
        </el-form>

        <yid-table pagination ref="table"  :data="tableData">
            <yid-table-column label="单号" min-width="140" prop="billcode"></yid-table-column>
            <yid-table-column label="姓名" min-width="80" prop="custname"></yid-table-column>
            <yid-table-column label="手机号" min-width="120" prop="custmobile"></yid-table-column>
            <yid-table-column label="性别" min-width="60" prop="custsex">
                <template slot-scope="scope">
                    {{scope.row.custsex=="1"?"男":""}}
                    {{scope.row.custsex=="2"?"女":""}}
                </template>
            </yid-table-column>
            <yid-table-column label="预约时间" min-width="150" prop="yydate"></yid-table-column>
            <yid-table-column label="预约门店" min-width="80" prop="shopname"></yid-table-column>
            <yid-table-column label="预约员工" min-width="80" prop="eename"></yid-table-column>
            <yid-table-column label="预约项目" min-width="150" prop="sersnames"></yid-table-column>
            <yid-table-column label="人数" min-width="60" prop="perNum"></yid-table-column>
            <yid-table-column label="预约渠道" min-width="120" prop="ycname"></yid-table-column>
            <yid-table-column label="预约状态" min-width="80" prop="billstatus">
                <template slot-scope="scope">
                    {{scope.row.billstatus | formatStr(statusList)}}
                </template>
            </yid-table-column>
            <yid-table-column label="操作" min-width="60" prop="oper">
                <template slot-scope="scope">
                    <el-link type="primary" style="margin: 0 10px 0 10px;" @click="getYybill(scope.row)">查看</el-link>
                </template>
            </yid-table-column>
        </yid-table>

        <yid-dialog :title="searchDialog.title" :visible.sync="searchDialog.visible" width="850px">
            <el-form label-width="140px" ref="copyForm" :inline="true" class="demo-form-inline">
                <el-form-item label="预约单号：" prop="billcode" label-width="120px">
                    <div style="width: 160px;">{{yybillhead.billcode}}</div>
                </el-form-item>
                <el-form-item label="预约状态：" prop="billstatus" label-width="100px">
                    <div style="width: 160px;">
                        <el-select disabled   v-model="yybillhead.billstatus">
                            <el-option v-for="item in statusList" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </div>
                </el-form-item><br/>
                <el-form-item label="姓名：" prop="custsex" label-width="120px">
                    <div style="width: 160px;">{{yybillhead.custname}}</div>
                </el-form-item>
                <el-form-item label="预约员工：" prop="eename" label-width="100px">
                    {{yybillhead.eename}}
                </el-form-item><br/>
                <el-form-item label="手机号：" prop="custmobile" label-width="120px">
                    <div style="width: 160px;">{{yybillhead.custmobile}}</div>
                </el-form-item>
                <el-form-item label="预约时间：" prop="yydate" label-width="100px">
                    <div v-show="false">{{yybillhead.yydate}}</div>
                    <div>
                        <el-date-picker :disabled="editflag" style="width: 140px"
                                        v-model="yybillhead.yyday"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                        </el-date-picker>
                        <el-time-select :disabled="editflag" style="width: 100px"
                                v-model="yybillhead.yytime"
                                :picker-options="{start: '08:00',step: '00:30',end: '22:30'}"
                                placeholder="选择时间">
                        </el-time-select>
                         <el-button v-if="yybillhead.billstatus=='3' && editflag" @click="editflag=false" type="primary">修改</el-button>
                         <el-button v-if="yybillhead.billstatus=='3' && !editflag" @click="editYYdate()" type="primary">确定</el-button>
                    </div>
                </el-form-item> <br/>
                <el-form-item label="性别：" prop="custsex" label-width="120px">
                    <div style="width: 160px;">{{yybillhead.custsex=="1"?"男":"女"}}</div>
                </el-form-item>
                <el-form-item label="预约项目：" prop="servTotal" label-width="100px">
                    <div>{{yybillhead.sersnames}}</div>
                </el-form-item><br/>
                <el-form-item label="人数：" prop="exprite" label-width="120px">
                    <div style="width: 160px;">{{yybillhead.perNum}}</div>
                </el-form-item>
                <el-form-item label="预约渠道：" prop="channel" label-width="100px">
                    <div style="width: 160px;">{{yybillhead.ycname}}</div>
                </el-form-item><br/>
                <el-form-item label="备注：" prop="memo" label-width="120px">
                    <div>{{yybillhead.memo}}</div>
                </el-form-item><br/>
                <el-row >
                    <el-col :span="3" :offset="3" v-if="yybillhead.billstatus=='3'"><el-button @click="yycancel()">取消预约</el-button></el-col>
                    <el-col :span="6" :offset="4" v-if="yybillhead.billstatus=='3'"><el-button @click="yysure()" type="primary">到店</el-button></el-col>
                    <el-col :span="3"><el-button @click="lookupLog()" type="primary">预约状态日志</el-button></el-col>
                </el-row>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="logDialog.title" :visible.sync="logDialog.visible" width="600px">
            <yid-table ref="logtable"  :data="logTableData">
                <yid-table-column label="操作时间" min-width="120" prop="createdTime"></yid-table-column>
                <yid-table-column label="预约状态" min-width="80" prop="status">
                    <template slot-scope="scope">
                        {{scope.row.status | formatStr(statusList)}}
                    </template>
                </yid-table-column>
                <yid-table-column label="操作人" min-width="60" prop="createdBy"></yid-table-column>
                <yid-table-column label="操作类型" min-width="80" prop="ctype">
                    <template slot-scope="scope">
                        {{scope.row.ctype | formatctype(ctypeList) }}
                    </template>
                </yid-table-column>
            </yid-table>
        </yid-dialog>

    </div>
</template>

<script>

    import service from '@src/service'
    import yid from '@src/library'
    import YidTable from "../../library/components/table/src/table";

    var moment = require('moment');

    export default {
        components: {YidTable},
        name: "list",
        data() {
            return {
                editflag:true,
                statusList:[
                    {value:"-1", label:"顾客取消"},
                    {value:"-2", label:"商家取消预约"},
                    {value:"-3", label:"未到店"},
                    {value:"-4", label:"交易关闭"},
                    {value:"1", label:"待支付"},
                    {value:"2", label:"待确认"},
                    {value:"3", label:"预约中"},
                    {value:"4", label:"已核销"},
                    {value:"5", label:"已评价"}
                ],
                ctypeList:[
                    {value:"1", label:"顾客"},
                    {value:"2", label:"设计师"},
                    {value:"3", label:"门店"},
                    {value:"4", label:"后端"}
                ],
                pageInfo:{page:1,limit:10},
                model : {
                    member:'',
                    shop:'',
                    ee:'',
                    date: [],
                    statuslist: [],
                    yccode:'',
                    shopid:""
                },
                channel: [],
                tableData: [],
                searchDialog: {
                    title:"预约信息",
                    visible:false
                },
                yybillhead: {
                    billcode:'',
                    billstatus:'',
                    custname:'',
                    eename:'',
                    yydate:'',
                    custsex:'',
                    sersnames:'',
                    perNum:'',
                    ycname:'',
                    memo:'',
                },
                logDialog: {
                    title:"预约状态日志表",
                    visible:false
                },
                logTableData:[],
                allShopList:[],
                filterShopList:[],
            }
        },
        mounted(){
            this.model.date=[moment().format("YYYY-MM-DD"),moment().format("YYYY-MM-DD")];
            this.queryChannel();
            this.queryYyBilllist();
            this.getShopList({status:"1"});
        },
        filters:{
            formatStr(str,stsList){
                let label=""
                stsList.map(m =>{
                    if(m.value == str){
                        label=m.label
                    }
                })
                return label
            },
            formatctype(str,stsList){
                let label=""
                stsList.map(m =>{
                    if(m.value == str){
                        label=m.label
                    }
                })
                return label
            }
        },
        methods:{
            queryChannel(){
                service.yy.yylist.queryChannels().then(res =>{
                    this.channel=res.data;
                })
            },
            queryYyBilllist(){
                let params = {...this.pageInfo, ...this.model}
                if(this.model.member){
                    if($yid.validate.mobile(this.model.member)){
                        params.custmobile=this.model.member;
                        params.custname = null;
                    }else{
                        params.custname=this.model.member;
                        params.custmobile = null;
                    }
                }else {
                    params.custmobile = null;
                    params.custname = null;
                }
                if(this.model.ee){
                    if($yid.validate.eecode(this.model.ee)){
                        params.eecode=this.model.ee;
                        params.eename=null;
                    }else{
                        params.eecode=null;
                        params.eename=this.model.ee;
                    }
                }else{
                    params.eecode=null;
                    params.eename=null;
                }
                if(this.model.statuslist && this.model.statuslist.length>0){
                    params.status=this.model.statuslist.toString();
                    delete params.statuslist;
                }else{
                    params.status=null;
                }
                if(this.model.date && this.model.date.length>1){
                    params.sdate=this.model.date[0];
                    params.edate=this.model.date[1];
                    delete params.date;
                }else{
                    params.sdate=null
                    params.edate=null
                }
                const fetch = service.yy.yylist.queryYyBilllist;
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
                this.pageInfo.page=params.page;
            },
            getYybill(row){
                service.yy.yylist.getYybill(row.id).then(res =>{
                    this.searchDialog.visible=true;
                    this.editflag=true;
                    res.data.yyday=moment(res.data.yydate).format("YYYY-MM-DD");
                    res.data.yytime=moment(res.data.yydate).format("HH:mm");
                    this.yybillhead=res.data;
                })
            },
            editYYdate(){
                const params={
                    id:this.yybillhead.id,
                    yydate:this.yybillhead.yyday+" "+this.yybillhead.yytime+":00",
                    revision:this.yybillhead.revision
                }
                service.yy.yylist.editYYdate(params).then(res =>{
                    this.editflag=true;
                    $yid.util.alert(res.resp_msg);
                })
            },
            yycancel(){
                service.yy.yylist.yycancel({id:this.yybillhead.id,revision:this.yybillhead.revision}).then(res =>{
                    if(res.resp_code=="200"){
                        this.searchDialog.visible=false;
                        this.queryYyBilllist();
                    }
                    $yid.util.alert(res.resp_msg);
                })
            },
            yysure(){
                service.yy.yylist.yysure({id:this.yybillhead.id,revision:this.yybillhead.revision}).then(res =>{
                    if(res.resp_code=="200"){
                        this.searchDialog.visible=false;
                        this.queryYyBilllist();
                    }
                    $yid.util.alert(res.resp_msg);
                })
            },
            lookupLog(){
                service.yy.yylist.lookYyBillLogs({billid:this.yybillhead.id}).then(res =>{
                    this.logDialog.visible=true;
                    this.logTableData=res.data;
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
            }
        }
    }

</script>

<style scoped>

</style>