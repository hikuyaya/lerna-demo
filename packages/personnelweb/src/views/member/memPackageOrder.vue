<template>
    <div class="memPackageOrder">
        <el-collapse-transition>
            <div v-show="showList">
                <el-button @click="addBill" type="primary">新增</el-button>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="单据编码：" prop="billcode">
                        <el-input v-model="searchForm.billcode" clearable  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间：" prop="createTimeRange">
                        <div class="block">
                            <el-date-picker
                                    :clearable = true

                                    v-model="searchForm.createTimeRange"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="审核时间：" prop="sTimeRange">
                        <div class="block">
                            <el-date-picker
                                    :clearable = true
                                    v-model="searchForm.sTimeRange"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                        <el-select style="width: 100px" v-model="searchForm.status" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in statusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="卡号：" prop="cardmobile">
                        <el-input v-model="searchForm.cardmobile" placeholder="卡号/电话" clearable  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table  ref="table" pagination style="width: 100%;margin-top: 20px;">
                    <yid-table-column prop="billcode" label="单据编码" width="150"></yid-table-column>
                    <yid-table-column prop="createdBy" label="创建人" width="120"></yid-table-column>
                    <yid-table-column prop="createdTime" label="创建时间" width="150">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.createdTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="updatedBy" label="修改人" width="120"></yid-table-column>
                    <yid-table-column prop="updatedTime" label="修改时间" width="150">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.updatedTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="auditedBy" label="审核人" width="120"></yid-table-column>
                    <yid-table-column prop="auditedTime" label="审核时间" width="150">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.auditedTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="status" label="状态" width="120">
                        <template slot-scope="scope">
                            <span v-if='scope.row.status==1'>未审核</span>
                            <span v-if='scope.row.status==2'>已审核</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="memname" label="会员" width="120"></yid-table-column>
                    <yid-table-column prop="cardno" label="卡号" width="120"></yid-table-column>
                    <yid-table-column
                            label="操作" min-width="150" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.status == '1'" type="text" @click="editBill(scope.row)" style="margin-left: 6px">编辑</el-button>
                            <el-button v-if="scope.row.status == '1'" type="text" @click="deleteBill(scope.row)" style="margin-left: 6px;color: red">删除</el-button>
                            <el-button v-if="scope.row.status != '1'" type="text" @click="showBill(scope.row)" style="margin-left: 6px">详情</el-button>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-show="!showList">
                <el-button  @click="back">返回</el-button>
                <el-button v-show="showButton" @click="saveBill" type="primary">保存</el-button>
                <el-button v-show="showButton" @click="auditBill" type="primary">审核</el-button>
                <el-form ref="billForm" :model="billForm" style="margin-top: 20px" label-width="100px" label-position="right">
                    <div id="container">
                        <div style="width: 210px;display: inline-block;">单据编码：{{billForm.billcode}}</div>
                        <div style="width: 220px;display: inline-block;">创建时间：{{billForm.createdTime}}</div>
                        <div style="width: 150px;display: inline-block;">创建人：{{billForm.createdBy}}</div>
                        <div style="width: 220px;display: inline-block;">审核时间：{{billForm.auditedTime}}</div>
                        <div style="width: 150px;display: inline-block;">审核人：{{billForm.auditedBy}}</div>
                    </div>
                </el-form>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>

                会员卡号： <el-input v-model="billForm.cardno" placeholder="请输入卡号"
                              style="width: 150px;"></el-input> &nbsp;&nbsp;
                <el-link type="primary" @click="queryMemInfo" v-show="showButton">查询</el-link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                会员姓名：{{billForm.memname}}<br><br>
                套餐项目信息：<el-button v-show="showButton" @click="alertPackageDialog" type="primary">选择项目</el-button>

                <yid-table v-show="showButton" ref="itemTable" style="margin-top: 15px;" :data="orderitemData" @selection-change="handleSelectionChange">
                    <yid-table-column label="项目编码" min-width="120" prop="scode"></yid-table-column>
                    <yid-table-column label="项目名称" min-width="200" prop="servname"></yid-table-column>
                    <yid-table-column label="原到期日期" min-width="100" prop="expiryTime"></yid-table-column>
                    <yid-table-column label="现到期日期" min-width="150" prop="nexpiryTime">
                        <template slot-scope="scope">
                          <el-date-picker
                                    :clearable = true
                                    v-model="scope.row.nexpiryTime"
                                    type="date"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="60" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteServ(scope.$index,scope.row)" style="margin-left: 6px;color: red">删除</el-button>
                        </template>
                    </yid-table-column>
                </yid-table>

                <yid-table v-show="!showButton" ref="showTable" style="margin-top: 15px;" :data="orderitemData" @selection-change="handleSelectionChange">
                    <yid-table-column label="项目编码" min-width="120" prop="scode"></yid-table-column>
                    <yid-table-column label="项目名称" min-width="200" prop="servname"></yid-table-column>
                    <yid-table-column label="原到期日期" min-width="100" prop="expiryTime"></yid-table-column>
                    <yid-table-column label="现到期日期" min-width="150" prop="nexpiryTime"></yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>

        <el-dialog :title="packageDialog.title" :visible.sync="packageDialog.visible" width="850px" >
            <div style="display: flex;">
                <el-form ref="searchpackageForm" inline :model="searchpackageForm">
                    <el-form-item label="项目：" prop="scodename">
                        <el-input v-model="searchpackageForm.scodename" clearable  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="searchPackages" type="primary">查询</el-button>
                        <el-button type="primary" @click="addPackages">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div style="display: flex;">
                <yid-table ref="packageTable" :data="packageData" style="width: 100%;" @selection-change="handleSelectionChange">
                    <yid-table-column type="selection" width="55"></yid-table-column>
                    <yid-table-column label="套餐名称" min-width="120" prop="mpname"></yid-table-column>
                    <yid-table-column label="项目编码" min-width="80" prop="scode"></yid-table-column>
                    <yid-table-column label="项目名称" min-width="120" prop="servname">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isGift == 0">{{scope.row.servname}}</span>
                            <span v-if="scope.row.isGift == 1"><font color="red">(赠)</font>{{scope.row.servname}}</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="剩余次数" min-width="60" prop="snum"></yid-table-column>
                    <yid-table-column label="到期日期" min-width="120" prop="expiryTime"></yid-table-column>
                </yid-table>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'

    export default {
        components: {
            //checkProducts
        },
        name: "memPackageOrder",
        data(){
            return {
                categoryData: [],
                packageData : [],
                showList : true,
                showButton : true,
                searchForm : {
                    billcode :'',
                    status : '',
                    cardmobile : '',
                    createTimeRange : [],
                    sTimeRange : [],
                },
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                billForm:{
                    id : '',
                    billcode: '',
                    createdTime : '',
                    createdBy : '',
                    auditedTime : '',
                    auditedBy : '',
                    cardno : '',
                    memid : '',
                    memcode : '',
                    memname : '',
                    mobile : '',
                },
                searchpackageForm : {
                    scodename:'',
                },
                pageInfo:{page:0,limit:10},
                orderitemData:[],
                statusList : [{
                    value: '1',
                    label: '未审核'
                }, {
                    value: '2',
                    label: '已审核'
                }],
                packageDialog : {
                    title:'选择项目',
                    visible: false,
                },
                selectProducts : [],
            }
        },
        mounted(){
            this.getData();
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                reqObj.billcode = this.searchForm.billcode;
                reqObj.status =  this.searchForm.status;
                reqObj.cardmobile =  this.searchForm.cardmobile;
                let createTimeRange = this.searchForm.createTimeRange;
                if(createTimeRange){
                    reqObj.sCreatedTimeStart = this.searchForm.createTimeRange[0];
                    reqObj.sCreatedTimeEnd = this.searchForm.createTimeRange[1];
                }else{
                    reqObj.sCreatedTimeStart = '';
                    reqObj.sCreatedTimeEnd = '';
                }
                let sTimeRange = this.searchForm.sTimeRange;
                if(sTimeRange){
                    reqObj.sSTimeStart = this.searchForm.sTimeRange[0];
                    reqObj.sSTimeEnd = this.searchForm.sTimeRange[1];
                }else{
                    reqObj.sSTimeStart = '';
                    reqObj.sSTimeEnd = '';
                }
                return reqObj;
            },
        },
        methods:{
            queryMemInfo(){
                let cardno = this.billForm.cardno;
                if(yid.util.isEmpty(cardno)){
                    yid.util.error("请输入卡号进行查询");
                    return;
                }
                service.member.memberinfo.memInfoByCardno({cardno:cardno}).then(res=>{
                    if(res.resp_code == 200) {
                        if(res.data == null){
                            yid.util.error("未查到对应的会员信息,请检查卡号输入是否正确!");
                            return;
                        }
                        const data = res.data;
                        this.billForm.memid = data.id;
                        this.billForm.memcode = data.memcode;
                        this.billForm.memname = data.memname;
                        this.billForm.mobile = data.mobile;
                    }
                })
            },
            handleSelectionChange(rows) {
                this.selectProducts = rows
            },
            getData(reqParams){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.chain.memPackageOrder.orderList;
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            toggleSelection(rows){
                if (rows) {
                    rows.forEach(row => {
                        this.$refs['packageTable'].toggleRowSelection(row);
                    });
                } else {
                    this.$refs['packageTable'].clearSelection();
                }
            },
            addBill(){
                //清空列表和form
                this.orderitemData = [];
                this.billForm.id = '';
                this.billForm.billcode = '';
                this.billForm.createdTime = '';
                this.billForm.createdBy = '';
                this.billForm.auditedTime = '';
                this.billForm.auditedBy = '';
                this.billForm.cardno = '';
                this.billForm.memid = '';
                this.billForm.memcode = '';
                this.billForm.memname = '';
                this.billForm.mobile = '';

                this.packageDialog.visible = false;
                this.packageData = [];
                this.showList = false;
                this.showButton = true;
            },
            back(){
                this.showList = true;
                this.search();
            },
            searchPackages(){
                const memid = this.billForm.memid;
                const scodename = this.searchpackageForm.scodename;
                if(yid.util.isEmpty(memid)){
                    yid.util.error("请先查询会员!");
                    return;
                }
                service.member.packagedesc.memPackagedescList({memid : memid,scodename: scodename}).then(res=>{
                    this.packageData = res.data;
                    //选中已选中的项目
                    const rows = [];
                    for(let i=0 ; i<this.orderitemData.length ;i++){
                        for(let n=0 ; n<this.packageData.length;n++){
                            if(this.orderitemData[i].scode == this.packageData[n].scode && this.orderitemData[i].batchno == this.packageData[n].batchno){
                                rows.push(this.packageData[n]);
                            }
                        }
                    }
                    this.$nextTick(()=> {
                        this.toggleSelection(rows)
                    });
                })
            },
            addPackages(){
                if(this.selectProducts.length == 0){
                    yid.util.error("请选择至少一行!");
                    return;
                }
                this.orderitemData = [];
                this.orderitemData = this.orderitemData.concat(this.selectProducts);
                this.packageDialog.visible = false;
            },
            search(){
                this.getData(this.searchFormReq);
            },
            alertPackageDialog(){
                let memid = this.billForm.memid;
                if(yid.util.isEmpty(memid)){
                    yid.util.error("请先查询会员!");
                    return;
                }
                this.packageDialog.visible = true;
                this.searchpackageForm.scodename = '';
                this.packageData = [];
                this.searchPackages();
            },
            saveBill(){
                if(this.orderitemData.length == 0){
                    yid.util.error("明细不能为空");
                    return false;
                }
                for(let n=0 ; n<this.orderitemData.length; n++){
                    let nexpiryTime = this.orderitemData[n].nexpiryTime;
                    if(nexpiryTime == null || nexpiryTime == ''){
                        yid.util.error("请填写新到期日期");
                        return false;
                    }
                }
                //调用接口进行新增单据
                let order = {}
                order.id = this.billForm.id;
                order.billcode = this.billForm.billcode;
                order.createdTime = this.billForm.createdTime;
                order.createdBy = this.billForm.createdBy;
                order.cardno = this.billForm.cardno;
                order.memid = this.billForm.memid;
                order.memcode = this.billForm.memcode;
                order.memname = this.billForm.memname;
                order.mobile = this.billForm.mobile;
                order.isDel = '0';
                order.status = '1';

                const details = [];
                for(let i = 0;i<this.orderitemData.length;i++){
                    let item = this.orderitemData[i];
                    let detail = {};
                    detail.id = '';
                    detail.memid = this.billForm.cardno;
                    detail.memcode = this.billForm.memcode;
                    detail.memname = this.billForm.memname;
                    detail.mobile = this.billForm.mobile;
                    detail.scode = item.scode;
                    detail.servname = item.servname;
                    detail.expiryTime = item.expiryTime;
                    detail.nexpiryTime = item.nexpiryTime + " 00:00:00";
                    detail.isGift = item.isGift;
                    detail.batchno = item.batchno;
                    detail.mpname = item.mpname;
                    details.push(detail);
                }
                order.items = details;
                service.chain.memPackageOrder.saveBill(order).then(res=>{
                    if(res.resp_code == 200) {
                        yid.util.success("保存成功!");
                        this.billForm.id = res.data.id;
                        this.billForm.billcode = res.data.billcode;
                        this.billForm.createdTime = res.data.createdTime;
                        this.billForm.createdBy = res.data.createdBy;
                        this.search();
                    }
                })
            },
            auditBill(){
                if(this.billForm.id == '' || this.billForm.id.length == 0){
                    yid.util.error("请先保存单据再提交!")
                    return false;
                }
                const billrow = {}
                billrow.id = this.billForm.id;
                billrow.billcode = this.billForm.billcode;
                service.chain.memPackageOrder.auditBill(billrow).then(res=>{
                    if(res.resp_code == 200) {
                        this.search();
                        yid.util.success("审核成功!")
                        this.showList = true;
                        this.showButton = false;
                    }
                })
            },
            editBill(row){
                if(row.status != '1'){
                    yid.util.error("未审核的单据才可以编辑");
                    return false
                }
                //给from和列表设置值
                this.orderitemData = row.items;
                this.billForm.id = row.id;
                this.billForm.billcode = row.billcode;
                this.billForm.createdTime = row.createdTime;
                this.billForm.createdBy = row.createdBy;
                this.billForm.auditedTime = row.auditedTime;
                this.billForm.auditedBy = row.auditedBy;
                this.billForm.cardno = row.cardno;
                this.billForm.memid = row.memid;
                this.billForm.memcode = row.memcode;
                this.billForm.memname = row.memname;
                this.billForm.mobile = row.mobile;
                this.packageDialog.visible = false;
                this.packageData = [];
                this.showList = false;
                this.showButton = true;
            },
            deleteBill(row){
                if(row.status != '1'){
                    yid.util.error("未审核的单据才可以删除");
                    return false
                }
                yid.util.confirm('确定删除单据'+row.billcode+'?', '','', ()=> {
                    const billrow = {}
                    billrow.id = row.id;
                    billrow.isDel = '1';
                    service.chain.memPackageOrder.saveOrUpdate(billrow).then(res=>{
                        if(res.resp_code == 200) {
                            this.search();
                        }
                    })
                });
            },
            showBill(row){
                if(row.status == '1'){
                    yid.util.error("未审核的单据不能查看明细");
                    return false
                }
                //给from和列表设置值
                this.orderitemData = row.items;
                this.billForm.id = row.id;
                this.billForm.billcode = row.billcode;
                this.billForm.createdTime = row.createdTime;
                this.billForm.createdBy = row.createdBy;
                this.billForm.auditedTime = row.auditedTime;
                this.billForm.auditedBy = row.auditedBy;
                this.billForm.cardno = row.cardno;
                this.billForm.memid = row.memid;
                this.billForm.memcode = row.memcode;
                this.billForm.memname = row.memname;
                this.billForm.mobile = row.mobile;
                this.packageDialog.visible = false;
                this.packageData = [];
                this.showList = false;
                this.showButton = false;
            },
            deleteServ(index,row){
                this.orderitemData.splice(index, 1)//移除删除的产品
            },
        }
    }
</script>

<style scoped>

</style>