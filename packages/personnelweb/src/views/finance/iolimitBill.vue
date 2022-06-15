<template>
    <div class="reserveBill">
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
                        <el-input clearable v-model="searchForm.auditBy" placeholder="审核人" style="width: 180px;"></el-input>
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
                    <br>
                    <el-form-item label="单据状态：" prop="status" label-width="100px">
                        <el-select style="width: 180px" v-model="searchForm.status" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in statusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
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
                    <el-form-item label="业务类型：" prop="type">
                        <el-select v-model="searchForm.type" clearable placeholder="请选择">
                            <el-option label="请选择" value=""></el-option>
                            <el-option label="期初设置" value="1"></el-option>
                            <el-option label="后期调整" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目名称：" label-width="100px">
                        <el-select @clear="clearFormReserve" clearable v-model.trim="searchForm.ioid" filterable
                                   :filter-method="filterReserve" placeholder="请选择" style="width: 220px;">
                            <el-option :key="item.id" :label="item.name" :value="item.id"
                                       v-for="item in ioitemDataAll">
                                <span style="float: left">{{ item.code }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年月：" prop="rq" label-width="100px">
                        <div class="block">
                            <el-date-picker
                                    :clearable = true
                                    style="width: 150px"
                                    v-model="searchForm.yearmonth"
                                    type="month"
                                    fromat = "yyyy-MM"
                                    value-format="yyyy-MM"
                                    placeholder="日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
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
                <el-button v-show="showButton" @click="showLoginShop" type="primary">选择门店</el-button>
                <el-button v-show="showButton"  @click="showImportDialog" style="background-color: red;color: white">导入</el-button>&nbsp;&nbsp;&nbsp;
                <el-button v-show="showButton" @click="saveBill" type="primary">保存</el-button>
                <el-button v-show="showButton" @click="saveBillBefore" type="primary">审核</el-button>
                <el-button v-show="showButton" @click="deleteBill" type="primary">删除</el-button>
                <el-form ref="billForm" :model="billForm" style="margin-top: 16px" :rules="rules" label-width="100px" label-position="right">
                    <div class="container">
                        <div style="width: 210px;display: inline-block;">单据编码：{{billForm.billcode}}</div>
                        <div style="width: 210px;display: inline-block;">创建人：{{billForm.createdBy}}</div>
                        <div style="width: 250px;display: inline-block;">创建时间：{{billForm.createdTime}}</div>
                        <div style="width: 250px;display: inline-block;">业务类型：
                            <el-select clearable v-model="billForm.type"  :disabled="!showButton"  style="width: 100px;">
                                <el-option label="期初设置" value="1"></el-option>
                                <el-option label="后期调整" value="2"></el-option>
                            </el-select>&nbsp;&nbsp;<font color="red">*</font>
                        </div>
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
                                    placeholder="年月">
                            </el-date-picker>&nbsp;&nbsp;<font color="red">*</font>
                        </div>
                    </div>
                </el-form>

                <yid-table v-show="showButton" ref="itemTable" style="margin-top: 15px;" :data="billForm.details">
                    <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column label="支出项目名称" min-width="150" prop="ioname"></yid-table-column>
                    <yid-table-column label="期初金额" min-width="80" prop="smoney"></yid-table-column>
                    <yid-table-column label="限制金额" min-width="100" prop="yrmoney"></yid-table-column>
                    <yid-table-column label="调整金额" min-width="120" prop="umoney">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.umoney" @blur="calcMoney(scope.row)"></el-input>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="修改后金额" min-width="100" prop="rmoney"></yid-table-column>
                    <yid-table-column label="备注" min-width="180" prop="memo">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.memo"></el-input>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteReserve(scope.$index,scope.row)" style="margin-left: 6px;color: red">删除</el-button>
                        </template>
                    </yid-table-column>
                </yid-table>

                <yid-table v-show="!showButton" ref="showTable" style="margin-top: 15px;" :data="billForm.details">
                    <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column label="支出项目名称" min-width="150" prop="ioname"></yid-table-column>
                    <yid-table-column label="期初金额" min-width="80" prop="smoney"></yid-table-column>
                    <yid-table-column label="限制金额" min-width="80" prop="yrmoney"></yid-table-column>
                    <yid-table-column label="调整金额" min-width="80" prop="umoney"></yid-table-column>
                    <yid-table-column label="修改后金额" min-width="100" prop="rmoney"></yid-table-column>
                    <yid-table-column label="备注" min-width="180" prop="memo"></yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>

        <yid-dialog :title="importDialog.title" :visible.sync="importDialog.visible" @close="importCancel" width="700px">
            <el-form :model="importDialog.model"  label-width="120px" ref="copyForm">
                <p><font color="red">*导入会覆盖掉原单的明细数据</font></p>
                <p>批量导入门店支出上限方法</p>
                <p>1、点击链接：下载门店支出上限设置模板；</p>
                <p>2、下载完成并保存文件，然后打开文件并输入门店支出上限设置信息；</p>
                <p>3、在下面导入修改完毕的模板文件。</p>
                <el-form-item label="下载导入模板：" align="left">
                    <el-link @click="downExcelTemplate" type="primary">门店支出上限设置模板</el-link>
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
                    <el-button @click="saveImportIolimit" type="primary">确定</el-button>
                    <el-button @click="importCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="shopDialog.title" :visible.sync="shopDialog.visible" @close="shopCancel"
                    width="1000px">
            <el-row type="flex" justify="space-between">
                <el-form inline>
                    <el-form-item label="门店：">
                        <el-input clearable v-model="shopDialog.shopcode" placeholder="门店编码"
                                  style="width: 100px;"></el-input>
                    </el-form-item>
                    <el-form-item label="支出项目名称：">
                        <el-select clearable v-model="shopDialog.iocode">
                            <el-option :key="item.id" :label="item.name" :value="item.code" v-for="item in ioitemDataAll"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务类型：">
                        <el-select clearable v-model="shopDialog.type"   style="width: 100px;">
                            <el-option label="美发" value="1"></el-option>
                            <el-option label="美容" value="2"></el-option>
                            <el-option label="综合" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="财务片区：">
                        <el-select clearable v-model="shopDialog.facode"  style="width: 100px;">
                            <el-option :key="item.id" :label="item.name" :value="item.code" v-for="item in financeAreaList"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="queryShop()">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <yid-table pagination ref="tableShop"
                               style="margin-top: 10px;"
                               @selection-change="handleSelectionChange"  class="store-table">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <yid-table-column label="支出项目编码" min-width="120" prop="iocode"></yid-table-column>
                        <yid-table-column label="支出项目名称" min-width="200" prop="ioname"></yid-table-column>
                        <yid-table-column label="门店编码" min-width="120" prop="shopcode"></yid-table-column>
                        <yid-table-column label="门店名称" min-width="200" prop="shopname"></yid-table-column>
                        <yid-table-column label="期初限制金额" min-width="120" prop="smoney"></yid-table-column>
                        <yid-table-column label="实际限制金额" min-width="120" prop="rmoney"></yid-table-column>
                    </yid-table>
                </el-col>
            </el-row>
            <el-row justify="space-between" style="margin-top: 10px;">
                <el-col>
                    <el-button type="primary" @click="selectShop()" style="margin-left: 300px;">确定</el-button>
                    <el-button @click="shopCancel">取消</el-button>
                </el-col>
            </el-row>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import ElButton from "../../library/components/button/button";
    import download from '@src/library/http/download'

    export default {
        components: {ElButton},
        name: "reserveBill",
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
                    ioid : "",
                    yearmonth:'',
                    type:'',
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
                    createdBy : '',
                    createdTime : '',
                    status : '',
                    type:'',
                    yearmonth:'',
                    auditBy : '',
                    auditTime : '',
                    details : [],
                },
                shopDialog: {
                    visible: false,
                    title: '选择门店',
                    type: "",
                    shopcode: '',
                    facode: '',
                    status: '1',
                    iocode:'',
                    page: 1,
                    limit: 10
                },
                ioitemDataAll:[],
                financeAreaList:[],
                multipleSelection: [],
                allShopList: [],
                filterShopList: [],
                showList: true,
                showButton : true,
                rules: {},
                importDialog: {
                    title: '门店支出上限设置导入',
                    visible: false,
                    iolimits: []
                },
            }
        },
        mounted() {
            this.excelConvertUrl = $yid.config.API.BASE + "api-finance/iolimitbillhead/convertSystem";
            this.getShopList();

            this.getIoitemListAll();
            this.getFinanceAreaList();
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                reqObj.billcode = this.searchForm.billcode;
                reqObj.auditBy = this.searchForm.auditBy;
                reqObj.status =  this.searchForm.status;
                let auditTimeRange = this.searchForm.auditTimeRange;
                if(auditTimeRange!=null && auditTimeRange.length>0){
                    reqObj.auditTimeStart = this.searchForm.auditTimeRange[0];
                    reqObj.auditTimeEnd = this.searchForm.auditTimeRange[1];
                    reqObj.sCreatedTimeStart =  this.getcreateDate(new Date(reqObj.auditTimeStart));
                }else{
                    reqObj.auditTimeStart = '';
                    reqObj.auditTimeEnd = '';
                    reqObj.sCreatedTimeStart =  this.getcreateDate(new Date);
                }
                reqObj.sCreatedTimeEnd = this.getnowDate();
                reqObj.shopid =  this.searchForm.shopid;
                reqObj.ioid =  this.searchForm.ioid;
                reqObj.type =  this.searchForm.type;
                reqObj.yearmonth =  this.searchForm.yearmonth;
                return reqObj;
            },
        },
        methods: {
            rest() {
                this.$refs["searchForm"].resetFields();
                this.searchForm.shopid='';
                this.searchForm.ioid='';
                this.searchForm.auditBy='';
                this.searchForm.auditTimeRange=[];
                this.searchForm.yearmonth='';
            },
            getData(reqParams) {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.finance.iolimitBill.billList
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
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
            getIoitemListAll(){
                service.finance.ioitem.jobAll({status:'1',type:'2'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.ioitemDataAll = res.data;
                    }
                })
            },
            getFinanceAreaList(){

                service.finance.dicFinancialArea.financeAreaAll({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.financeAreaList = res.data;

                    }
                })

            },
            getShopList() {
                service.chain.shop.shopList({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                    }
                })
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
            clearFormReserve(){
                this.searchForm.ioid = "";
            },
            filterReserve(v) {
                /*this.dicReservList = this.allReservList.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.name.indexOf(v) !== -1) return true
                    if (item.code.indexOf(v) !== -1) return true
                })*/
            },
            showImportDialog(){

                if(yid.util.isEmpty(this.billForm.yearmonth)){
                    yid.util.error("请先选年月!");
                    return
                }
                this.importDialog.visible = true;
                this.importDialog.iolimits = [];
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
                this.importDialog.iolimits = res.data;
            },
            beforeAvatarExcelUpload(file){
                const isJPG = (file.type.indexOf("sheet")!=-1 ||file.type.indexOf('excel')!=-1);
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isJPG) {
                    yid.util.error('上传excel只能是 xls/xlsx 格式!');
                    return false;
                }
                if (!isLt2M) {
                    yid.util.error('上传excel大小不能超过 10MB!');
                    return false;
                }

                return isJPG && isLt2M;
            },
            deleteReserve(index,row){
                this.billForm.details.splice(index, 1)//移除删除的项目
            },
            queryShop() {
                if(yid.util.isEmpty(this.shopDialog.iocode) && yid.util.isEmpty(this.shopDialog.shopcode)){
                    yid.util.error("查询条件【支出项目和门店】至少选中一个!");
                    return;
                }
                const fetch = service.finance.iolimitBill.getAllShopIolimitMoney
                let params = {};
                params = {
                    page: this.shopDialog.page,
                    limit: this.shopDialog.limit,
                    shopcode: this.shopDialog.shopcode,
                    type: this.shopDialog.type,
                    facode: this.shopDialog.facode,
                    iocode: this.shopDialog.iocode,
                    yearmonth:this.billForm.yearmonth,
                }
                this.$refs['tableShop'].reloadData({
                    fetch,
                    params,
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            shopCancel(){
                this.shopDialog.visible = false;
                this.shopDialog.type = "";
                this.shopDialog.shop = "";
                this.shopDialog.iocode = "";
                this.shopDialog.areacode = "";
                this.multipleSelection = [];
                this.$refs['tableShop'].clearData({});
            },
            showLoginShop() {
                if(yid.util.isEmpty(this.billForm.yearmonth)){
                    yid.util.error("请先选年月!");
                    return
                }
                this.shopDialog.visible = true;
                this.shopDialog.title = "选择门店支出上限";


            },
            selectShop(){
                if(this.multipleSelection.length <= 0){
                    yid.util.error("请选中门店后再确定!");
                    return
                }
                this.multipleSelection.forEach(res=>{
                    var detail = {};
                    detail.shopid = res.shopid;
                    detail.shopcode = res.shopcode;
                    detail.shopname = res.shopname;
                    detail.shopType = res.shopType;
                    detail.brandId = res.brandId;
                    detail.brandCode = res.brandCode
                    detail.ioid = res.ioid;
                    detail.iocode = res.iocode;
                    detail.ioname = res.ioname;
                    detail.smoney = res.smoney;
                    detail.umoney = '';
                    detail.rmoney = res.rmoney;
                    detail.yrmoney = res.rmoney;
                    detail.memo = '';
                    detail.times = res.times;
                    this.billForm.details.push(detail);

                })
                this.shopCancel();
            },
            back() {
                this.search();
                this.showList = true
            },
            addBill(){
                this.billForm.id = ''
                this.billForm.billcode = ''
                this.billForm.createdBy = ''
                this.billForm.createdTime = ''
                this.billForm.status = ''
                this.billForm.auditBy = ''
                this.billForm.auditTime = ''
                let yearmonth =this.getnowYearmonth();
                this.billForm.yearmonth = yearmonth;
                this.billForm.type = '2';
                this.billForm.details = []
                this.showList = false
                this.showButton = true
            },
            saveBill(){
                if(yid.util.isEmpty(this.billForm.type)){
                    yid.util.error("请选择业务类型!");
                    return false;
                }
                if(yid.util.isEmpty(this.billForm.yearmonth)){
                    yid.util.error("请选择年月!");
                    return false;
                }
                if(this.billForm.details.length == 0){
                    yid.util.error("单据明细为空");
                    return false;
                }
                var msg = "";
                for(var i=0 ; i<this.billForm.details.length ; i++){
                    if(yid.util.isEmpty(this.billForm.details[i].iocode)){
                        msg = "支出项目为必填项";
                    }
                    let umoney =this.billForm.details[i].umoney
                    if(yid.util.isEmpty(umoney)){
                        msg = "调整金额为必填项";
                    }

                 /*   if(Number(umoney)<=0){
                        msg = "调整金额要大于0";
                    }*/
                    let iocode = this.billForm.details[i].iocode;
                    let ioid = "";
                    let ioname = "";

                    //根据code查询项目id name
                   /* this.ioitemDataAll.forEach(res=>{
                        if(res.code == iocode){
                            ioid = res.id;
                            ioname = res.name;
                        }
                    })
                    this.billForm.details[i].ioid=ioid
                    this.billForm.details[i].ioname=ioname*/
                }

                if(!yid.util.isEmpty(msg)){
                    yid.util.error(msg);
                    return false;
                }

                service.finance.iolimitBill.saveBill(this.billForm).then(res=>{
                    if(res.resp_code=="200"){
                        this.billForm = res.data;
                        yid.util.success("保存成功");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
             saveBillBefore(){
                if(yid.util.isEmpty(this.billForm.type)){
                    yid.util.error("请选择业务类型!");
                    return false;
                }
                if(yid.util.isEmpty(this.billForm.yearmonth)){
                    yid.util.error("请选择年月!");
                    return false;
                }
                if(this.billForm.details.length == 0){
                    yid.util.error("单据明细为空");
                    return false;
                }
                var msg = "";
                for(var i=0 ; i<this.billForm.details.length ; i++){
                    if(yid.util.isEmpty(this.billForm.details[i].iocode)){
                        msg = "支出项目为必填项";
                    }
                    let umoney =this.billForm.details[i].umoney
                    if(yid.util.isEmpty(umoney)){
                        msg = "调整金额为必填项";
                    }

                  /*  if(Number(umoney)<=0){
                        msg = "调整金额要大于0";
                    }*/
                    let iocode = this.billForm.details[i].iocode;
                    let ioid = "";
                    let ioname = "";
                    //根据code查询项目id name
                    this.ioitemDataAll.forEach(res=>{
                        if(res.code == iocode){
                            ioid = res.id;
                            ioname = res.name;
                        }
                    })
                    this.billForm.details[i].ioid=ioid
                    this.billForm.details[i].ioname=ioname
                }

                if(!yid.util.isEmpty(msg)){
                    yid.util.error(msg);
                    return false;
                }

                service.finance.iolimitBill.saveBill(this.billForm).then(res=>{
                    if(res.resp_code=="200"){
                        this.billForm = res.data;
                        this.auditBill();
                    }else{
                        yid.util.error(res.resp_msg);
                        return
                    }
                })
            },
            editBill(row){
                this.billForm.id = row.id;
                this.billForm.billcode = row.billcode;
                this.billForm.createdBy = row.createdBy;
                this.billForm.createdTime = row.createdTime;
                this.billForm.status = row.status;
                this.billForm.auditBy = row.auditBy;
                this.billForm.auditTime = row.auditTime;
                this.billForm.yearmonth = row.yearmonth;
                this.billForm.type = row.type;
                this.billForm.details = row.details;
                this.showList = false;
                this.showButton = row.status=='1'
            },
            deleteBill(){
                if(!yid.util.isEmpty(this.billForm.billcode)){
                    yid.util.confirm("您确定要删除["+this.billForm.billcode+"]的单据?","","",()=>{
                        service.finance.iolimitBill.deleteBill(this.billForm).then(res =>{
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
                           service.finance.iolimitBill.auditBill({id:id,billcode:billcode}).then(res=>{
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
            },
            downExcelTemplate(){
                download(yid.config.API.BASE + 'api-finance/iolimitbillhead/downSysTemplate', {})
            },
            saveImportIolimit(){
                if(this.importDialog.iolimits.length == 0){
                    yid.util.error("无导入数据");
                }else{
                    service.finance.iolimitBill.saveSystem(this.importDialog.iolimits).then(res =>{
                        if(res.resp_code=="200"){
                            this.billForm.details =res.data;
                            yid.util.success("导入成功");
                            this.importDialog.visible = false
                        }else{
                            yid.util.error(res.resp_msg);
                        }
                    });
                }
            },
            isNumber(val) {
                var regPos = /^\d+(\.\d+)?$/; //非负浮点数
                var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
                if(regPos.test(val) || regNeg.test(val)) {
                    return true;
                } else {
                    return false;
                }
            },
            calcMoney(row){

                if(!yid.util.isEmpty(row.umoney)){
                    if(!this.isNumber(row.umoney)){
                        yid.util.error("请输入正数或负数!");
                        row.umoney = "";
                        row.rmoney = "";
                        return false;
                    }


                    var umoney = Number(row.umoney);
                    var yrmoney = Number(row.yrmoney);
                    if(yrmoney<0){
                        yrmoney=0;
                    }
                    var rmoney =yrmoney + umoney;

                    row.rmoney = rmoney;
                }else{
                   // row.rmoney = "";
                }
            },
            getnowDate(){
                let d = new Date
                let year = d.getFullYear()
                let month = d.getMonth()+1
                let day = d.getDate()
                if(Number(month) < 10){
                    month = "0" + month
                }
                if(Number(day) < 10){
                    day = "0" + day
                }
                let datenow = year + "-" + month + "-"+day;

                return datenow;
            },
            getcreateDate(d){
                d.setMonth(d.getMonth()-3)
                let year = d.getFullYear()
                let month = d.getMonth()+1
                let day = d.getDate()
                if(Number(month) < 10){
                    month = "0" + month
                }
                if(Number(day) < 10){
                    day = "0" + day
                }
                let datenow = year + "-" + month + "-"+day;

                return datenow;
            },
            getnowYearmonth(){
                let d = new Date
                let year = d.getFullYear()
                let month = d.getMonth()+1
                let day = d.getDate()
                if(Number(month) < 10){
                    month = "0" + month
                }
                if(Number(day) < 10){
                    day = "0" + day
                }
                let datenow = year + "-" + month;

                return datenow;
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
