<template>
    <div class="djBill">
        <el-collapse-transition>
            <div v-show="showList">
                <el-button @click="addBill" type="primary">新建单据</el-button>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="单据编码：" prop="billcode" label-width="100px">
                        <el-input clearable v-model="searchForm.billcode" placeholder="单据编码" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="审核人：" prop="code" label-width="100px">
                        <el-input clearable v-model="searchForm.auditBy" placeholder="审核人" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="审核日期：" prop="sTimeRange" label-width="100px">
                        <div class="block">
                            <el-date-picker
                                    :clearable = true
                                    v-model="searchForm.auditTimeRange"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="单据状态：" prop="status">
                        <el-select style="width: 100px" v-model="searchForm.status" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in statusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item label="门店：" label-width="100px">
                        <el-select @clear="clearFormShop" @blur="clearFormShop" clearable v-model.trim="searchForm.shopid" filterable
                                   :filter-method="filterShop" placeholder="请选择" style="width: 180px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id"
                                       v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年月：" prop="yearmonth" label-width="100px">
                        <div class="block">
                            <el-date-picker
                                    :clearable = true
                                    style="width: 150px"
                                    v-model="searchForm.yearmonth"
                                    type="month"
                                    fromat = "yyyy-MM"
                                    value-format="yyyy-MM"
                                    placeholder="年月">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="项目：" label-width="100px">
                        <el-select @clear="clearFormDj" @blur="clearFormDj" clearable v-model.trim="searchForm.djid" filterable
                                   :filter-method="filterDj" placeholder="请选择" style="width: 220px;">
                            <el-option :key="item.id" :label="item.name" :value="item.id"
                                       v-for="item in dicDjitemList">
                                <span style="float: left">{{ item.code }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table ref="table" pagination style="width: 100%;margin-top: 10px;">
                    <yid-table-column prop="billcode" label="单据编码" width="180"></yid-table-column>
                    <yid-table-column prop="createdBy" label="制单人" width="120"></yid-table-column>
                    <yid-table-column prop="createdTime" label="制单日期" width="150">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.createdTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="updatedBy" label="修改人" width="120"></yid-table-column>
                    <yid-table-column prop="updatedTime" label="修改日期" width="150">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.updatedTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="status" label="审核状态" width="120">
                        <template slot-scope="scope">
                            <span v-if='scope.row.status==1'>未审核</span>
                            <span v-if='scope.row.status==2'>已审核</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="auditBy" label="审核人" width="120"></yid-table-column>
                    <yid-table-column prop="auditTime" label="审核日期" width="150">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.auditTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="totalmoney" label="合计金额" width="100"></yid-table-column>
                    <yid-table-column label="操作" min-width="150" fixed="right">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.status == '1'" type="primary" @click="editBill(scope.row)">编辑</el-link>
                            <el-link v-if="scope.row.status == '2'" type="primary" @click="editBill(scope.row)">查看</el-link>
                            <!--<el-link v-if="scope.row.status == '1'" type="primary" @click="deleteBill(scope.row)" style="margin-left: 15px">删除</el-link>-->
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-show="!showList">
                <el-button @click="back" type="primary">返回</el-button>
                <el-button v-show="showButton"  @click="showImportDialog" style="background-color: red;color: white">导入</el-button>&nbsp;&nbsp;&nbsp;
                <el-button v-show="showButton" @click="saveBill" type="primary">保存</el-button>
                <el-button v-show="showButtonS" @click="auditBill" type="primary">审核</el-button>
                <el-button v-show="showButtonS" @click="deleteBill" type="primary">删除</el-button>
                <el-form ref="billForm" :model="billForm" style="margin-top: 16px" :rules="rules" label-width="100px" label-position="right">
                    <div class="container">
                        <div style="width: 210px;display: inline-block;">单据编码：{{billForm.billcode}}</div>
                        <div style="width: 210px;display: inline-block;">创建人：{{billForm.createdBy}}</div>
                        <div style="width: 250px;display: inline-block;">创建时间：{{billForm.createdTime}}</div>
                        <div style="width: 250px;display: inline-block;">合计金额：{{billForm.totalmoney}}</div>
                    </div>
                    <div class="container">
                        <div style="width: 210px;display: inline-block;">审核状态：{{billForm.status=='2'?'已审核':'未审核'}}</div>
                        <div style="width: 210px;display: inline-block;">审核人：{{billForm.auditBy}}</div>
                        <div style="width: 250px;display: inline-block;">审核时间：{{billForm.auditTime}}</div>
                        <div style="width: 250px;display: inline-block;">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月：
                            <el-date-picker
                                    :disabled="!showButton"
                                    :clearable = true
                                    style="width: 150px"
                                    v-model="billForm.yearmonth"
                                    type="month"
                                    fromat = "yyyy-MM"
                                    value-format="yyyy-MM"
                                    placeholder="年月"
                            @change="clearDetail">
                            </el-date-picker>&nbsp;&nbsp;<font color="red">*</font>
                        </div>
                    </div>
                </el-form>

                <yid-table v-show="showButton" ref="itemTable" style="margin-top: 15px;" :data="billForm.details">
                    <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column label="项目名称" min-width="150" prop="djname"></yid-table-column>
                    <yid-table-column label="已录金额" min-width="80" prop="smoney"></yid-table-column>
                    <yid-table-column label="修改金额" min-width="120" prop="umoney">
                        <template slot-scope="scope">
                            <el-input @blur="calcMoney(scope.row)" v-model="scope.row.umoney"></el-input>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="修改后金额" min-width="80" prop="rmoney"></yid-table-column>
                    <yid-table-column label="备注" min-width="200" prop="memo">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.memo"></el-input>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteDj(scope.$index,scope.row)" style="margin-left: 6px;color: red">删除</el-button>
                        </template>
                    </yid-table-column>
                </yid-table>

                <yid-table v-show="!showButton" ref="showTable" style="margin-top: 15px;" :data="billForm.details">
                    <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column label="项目名称" min-width="150" prop="djname"></yid-table-column>
                    <yid-table-column label="已录金额" min-width="80" prop="smoney"></yid-table-column>
                    <yid-table-column label="修改金额" min-width="80" prop="umoney"></yid-table-column>
                    <yid-table-column label="修改后金额" min-width="80" prop="rmoney"></yid-table-column>
                    <yid-table-column label="备注" min-width="200" prop="memo"></yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>

        <yid-dialog :title="importDialog.title" :visible.sync="importDialog.visible" @close="importCancel" width="700px">
            <el-form :model="importDialog.model"  label-width="120px" ref="copyForm">
                <p>批量导入收支变动维护单方法</p>
                <p>1、点击链接：下载收支变动维护单模板；</p>
                <p>2、下载完成并保存文件，然后打开文件并输入收支变动维护单信息；</p>
                <p>3、在下面导入修改完毕的模板文件。</p>
                <el-form-item label="下载导入模板：" align="left">
                    <el-link @click="downExcelTemplate" type="primary">收支变动维护单模板</el-link>
                </el-form-item>
                <el-form-item label="选择导入文件:">
                    <el-upload
                            ref="uploadExcel"
                            class="avatar-uploader"
                            :headers="myheaders"
                            :action="excelConvertUrl"
                            :show-file-list="true"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :on-success="handleAvatarExcelSuccess"
                            :before-upload="beforeAvatarExcelUpload">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">支持上传 .xls .xlsx后缀文件，表格中一行为一条数据，一次最多可导入1000条数据。</div>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button @click="saveImportDjs" type="primary">确定</el-button>
                    <el-button @click="importCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import ElButton from "../../library/components/button/button";
    import download from '@src/library/http/download'
    import * as math from "mathjs"

    export default {
        components: {ElButton},
        name: "djBill",
        data() {
            return {
                excelConvertUrl:"",
                myheaders:{},
                pageInfo: {page: 1, limit: 10, isDel: "0"},
                searchForm: {
                    billcode: "",
                    auditBy: "",
                    status : "",
                    auditTimeRange : [],
                    shopid : "",
                    yearmonth : "",
                    djid : "",
                },
                statusList:[{
                    value: '1',
                    label: '未审核'
                }, {
                    value: '2',
                    label: '已审核'
                }],
                billForm : {
                    id : '',
                    billcode : '',
                    type : '2',
                    createdBy : '',
                    createdTime : '',
                    status : '',
                    auditBy : '',
                    auditTime : '',
                    totalmoney : '',
                    yearmonth : '',
                    details : [],
                },
                allShopList: [],
                filterShopList: [],
                allDjList :[],
                dicDjitemList:[],
                showList: true,
                showButton : true,
                rules: {},
                importDialog: {
                    title: '收支变动维护单导入',
                    visible: false,
                    djs: []
                },
                showButtonS : false,
            }
        },
        mounted() {
            this.excelConvertUrl = $yid.config.API.BASE + "api-finance/djbillhead/convertSystem";
            this.getShopList();
            this.getDicDjList();
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                reqObj.billcode = this.searchForm.billcode;
                reqObj.auditBy = this.searchForm.auditBy;
                reqObj.status =  this.searchForm.status;
                let auditTimeRange = this.searchForm.auditTimeRange;
                if(auditTimeRange){
                    reqObj.auditTimeStart = this.searchForm.auditTimeRange[0];
                    reqObj.auditTimeEnd = this.searchForm.auditTimeRange[1];
                }else{
                    reqObj.auditTimeStart = '';
                    reqObj.auditTimeEnd = '';
                }
                reqObj.shopid =  this.searchForm.shopid;
                reqObj.yearmonth =  this.searchForm.yearmonth;
                reqObj.djid =  this.searchForm.djid;
                return reqObj;
            },
        },
        methods: {
            getData(reqParams) {
                const fetch = service.finance.djBill.billList
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                params.type = '2'
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
                const fetch = service.finance.djBill.billList
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                params.type = '2'
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
            getShopList() {
                service.chain.shop.shopList({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                    }
                })
            },
            getDicDjList(){
                service.finance.dicDjitem.listAll({"isDel":"0","isBk":"0"}).then(res => {
                    if (res.resp_code == 200) {
                        this.dicDjitemList = res.data;
                        this.allDjList = Object.assign(this.dicDjitemList);//保留原数据
                    }
                });
            },
            clearFormShop() {
                setTimeout(() =>{
                    if(this.searchForm.shopid == ''){
                        this.searchForm.shopid = "";
                        this.filterShopList = Object.assign(this.allShopList);
                    }

                },300)
            },
            filterShop(v) {
                this.filterShopList = this.allShopList.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true
                })
            },
            clearFormDj(){
                setTimeout(() =>{
                    if(this.searchForm.djid == ''){
                        this.searchForm.djid = "";
                        this.dicDjitemList = Object.assign(this.allDjList);
                    }

                },300)
            },
            filterDj(v) {
                this.dicDjitemList = this.allDjList.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.name.indexOf(v) !== -1) return true
                    if (item.code.indexOf(v) !== -1) return true
                })
            },
            showImportDialog(){
                if(yid.util.isEmpty(this.billForm.yearmonth)){
                    yid.util.error("请选择年月再进行导入");
                    return
                }
                this.importDialog.visible = true;
                this.importDialog.djs = [];
                this.myheaders['authorization'] = 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN);
                this.$refs.uploadExcel.clearFiles()
            },
            importCancel(){
                this.importDialog.visible = false;
            },
            handleExceed(files, fileList){
                yid.util.error('只能导入一个文件，请先删除之前选择的文件');
                return;
            },
            handleAvatarExcelSuccess(res){
                this.importDialog.djs = res.data;
            },
            beforeAvatarExcelUpload(file){
                const isJPG = (file.type.indexOf("sheet")!=-1 ||file.type.indexOf('excel')!=-1);
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isJPG) {
                    yid.util.error('上传excel只能是 xls/xlsx 格式!');
                }
                if (!isLt2M) {
                    yid.util.error('上传excel大小不能超过 10MB!');
                }
                return isJPG && isLt2M;
            },
            deleteDj(index,row){
                this.billForm.details.splice(index, 1)//移除删除的项目
            },
            back() {
                this.searchNoChangePage();
                this.showList = true
            },
            addBill(){
                this.billForm.id = ''
                this.billForm.billcode = ''
                this.billForm.type='2'
                this.billForm.createdBy = ''
                this.billForm.createdTime = ''
                this.billForm.status = ''
                this.billForm.auditBy = ''
                this.billForm.auditTime = ''
                this.billForm.totalmoney = ''
                this.billForm.yearmonth = ''
                this.billForm.details = []
                this.showList = false
                this.showButton = true;
                this.showButtonS = false;
            },
            saveBill(){
                if(yid.util.isEmpty(this.billForm.yearmonth)){
                    yid.util.error("请选择年月再进行保存");
                    return
                }
                if(this.billForm.details.length == 0){
                    yid.util.error("单据明细为空");
                    return
                }
                let flag = true;
                this.billForm.details.forEach(d=>{
                    if(yid.util.isEmpty(d.umoney)){
                        flag = false;
                    }
                    /*if(Number(d.umoney) == 0){
                        flag = false;
                    }*/
                })
                if(!flag){
                    yid.util.error("修改金额不能为空");
                    return
                }
                service.finance.djBill.saveBill(this.billForm).then(res=>{
                    if(res.resp_code=="200"){
                        this.billForm = res.data;
                        this.showButtonS = true;
                        yid.util.success("保存成功");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            editBill(row){
                this.billForm.id = row.id;
                this.billForm.billcode = row.billcode;
                this.billForm.type = row.type;
                this.billForm.createdBy = row.createdBy;
                this.billForm.createdTime = row.createdTime;
                this.billForm.status = row.status;
                this.billForm.auditBy = row.auditBy;
                this.billForm.auditTime = row.auditTime;
                this.billForm.totalmoney = row.totalmoney;
                this.billForm.yearmonth = row.yearmonth;
                this.billForm.details = row.details;
                this.showList = false;
                this.showButton = row.status=='1'
                this.showButtonS = row.status=='1'
            },
            deleteBill(){
                if(!yid.util.isEmpty(this.billForm.billcode)){
                    yid.util.confirm("您确定要删除["+this.billForm.billcode+"]的单据?","","",()=>{
                        const newBillForm = {};
                        newBillForm.id = this.billForm.id;
                        service.finance.djBill.deleteBill(newBillForm).then(res =>{
                            if(res.resp_code=="200"){
                                yid.util.success("删除成功!");
                                this.showList = true;
                                this.search();
                            }else{
                                yid.util.error(res.resp_msg);
                            }
                        });
                    })
                }else{
                    yid.util.error("单据保存后再进行删除!");
                    return;
                }
            },
            auditBill(){
                if(yid.util.isEmpty(this.billForm.yearmonth)){
                    yid.util.error("请选择年月再进行保存");
                    return
                }
                if(this.billForm.details.length == 0){
                    yid.util.error("单据明细为空");
                    return
                }
                let flag = true;
                this.billForm.details.forEach(d=>{
                    if(yid.util.isEmpty(d.umoney)){
                        flag = false;
                    }
                    /*if(Number(d.umoney) == 0){
                        flag = false;
                    }*/
                })
                if(!flag){
                    yid.util.error("修改金额不能为空");
                    return
                }
                service.finance.djBill.saveBill(this.billForm).then(res=>{
                    if(res.resp_code=="200"){
                        this.billForm = res.data;

                        let id = this.billForm.id;
                        let billcode = this.billForm.billcode;
                        let status = this.billForm.status;
                        if(!yid.util.isEmpty(billcode)){
                            yid.util.confirm("您确定要审核["+billcode+"]的单据?","","",()=>{
                                if(status == '2'){
                                    yid.util.error("已审核的单据不能再次进行审核");
                                    return;
                                }else{
                                    //调用审核单据接口
                                    service.finance.djBill.auditBill({id:id,billcode:billcode}).then(res=>{
                                        if(res.resp_code=="200"){
                                            yid.util.success("审核成功");
                                            this.showList = true;
                                            this.search();
                                        }else{
                                            yid.util.error(res.resp_msg);
                                        }
                                    })
                                }
                            })
                        }else{
                            yid.util.error("单据保存后再进行审核!");
                            return;
                        }
                    }else{
                        yid.util.error(res.resp_msg);
                        return
                    }
                })

            },
            downExcelTemplate(){
                download(yid.config.API.BASE + 'api-finance/djbillhead/downSysTemplate', {})
            },
            saveImportDjs(){
                if(this.importDialog.djs.length == 0){
                    yid.util.info("无导入数据");
                }else{
                    service.finance.djBill.saveSystemdj(this.importDialog.djs).then(res =>{
                        if(res.resp_code=="200"){
                            this.billForm.details =res.data;
                            this.importDialog.visible = false
                        }else{
                            yid.util.error(res.resp_msg);
                        }
                    });
                }
            },
            clearDetail(){
                this.billForm.details = [];
            },
            isNumber(val) {
                if(yid.validate.pNumerical3(val)) {
                    return true;
                } else {
                    return false;
                }
            },
            calcMoney(row){
                let smoney = row.smoney;
                let umoney = row.umoney;
                if(!yid.util.isEmpty(umoney)){
                    if(!this.isNumber(umoney)){
                        yid.util.error("请输入小数点后两位以内的正数或负数!")
                        row.umoney = ""
                        row.rmoney = ""
                        return;
                    }
                    //计算修改后金额值
                    if(!yid.util.isEmpty(smoney)){
                        //查询计算类型
                        service.finance.dicDjitem.listAll({code:row.djcode}).then(res=>{
                            if(res.resp_code=="200"){
                                let type = res.data[0].type;
                                if(type == '2'){
                                    row.rmoney = math.round(math.chain(umoney).add(smoney).done(),2);
                                }else{
                                    row.rmoney = math.round(math.chain(umoney).done(),2);
                                }
                            }else{
                                yid.util.error(res.resp_msg);
                            }
                        })
                    }else{
                        //不进行计算
                        row.rmoney = "";
                    }
                    //计算合计金额
                    this.getTotalMoney();
                }
            },
            getTotalMoney(){
                let totalmoney = 0;
                if(this.billForm.details.length > 0){
                    this.billForm.details.forEach(d=>{
                        console.log(totalmoney);
                        console.log(d.umoney);
                        totalmoney = math.round(math.chain(totalmoney).add(Number(d.umoney)).done(),2);
                    })
                }
                this.billForm.totalmoney = totalmoney;
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
