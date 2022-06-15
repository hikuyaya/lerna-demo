<template>
    <div class="storeRentCont">
        <el-collapse-transition>
            <div v-show="showList">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="">
                        <el-button @click="addstoreRentCont" type="primary">新增</el-button>
                    </el-form-item>
                    <br>
                    <el-form-item label="房东编码：" prop="dlcode">
                        <el-input clearable v-model="searchForm.dlcode" placeholder="房东编码" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="房东姓名：" prop="clname">
                        <el-input clearable v-model="searchForm.dlname" placeholder="房东姓名" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="门店：" prop="shopid" label-width="100px">
                        <el-select clearable v-model.trim="searchForm.shopid" @clear="clearFormShop" @blur="clearFormShop" filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table ref="table" pagination style="width: 100%;margin-top: 10px;">
                    <yid-table-column prop="code" label="合同编码" width="100"></yid-table-column>
                    <yid-table-column prop="shopcode" label="门店编码" width="100"></yid-table-column>
                    <yid-table-column prop="shopname" label="门店名称" width="150"></yid-table-column>
                    <yid-table-column prop="dlcode" label="房东编号" width="100"></yid-table-column>
                    <yid-table-column prop="dlname" label="房东名称" width="150"></yid-table-column>
                    <yid-table-column prop="startdate" label="开始年月日" width="150">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.startdate)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="enddate" label="结束年月日" width="150">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.enddate)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="pldate" label="最新缴款日期" width="150">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.pldate)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="status" label="状态" width="80">
                        <template slot-scope="scope">
                            <span v-if='scope.row.status==1'>正常</span>
                            <span v-if='scope.row.status==2'>作废</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="type" label="类型" width="80">
                        <template slot-scope="scope">
                            <span v-if='scope.row.type==1'>正常</span>
                            <span v-if='scope.row.type==2'>临时</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="150" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="editAction(scope.row)">编辑</el-link>
                            <!--<el-link type="primary" @click="deleteAction(scope.row)" style="margin-left: 15px">删除</el-link>-->
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-show="!showList">
                <el-button @click="back" type="primary">返回</el-button>
                <el-button @click="saveAction" type="primary">保存</el-button>
                <el-form ref="storeRentContForm" :model="storeRentContForm" style="margin-top: 16px" :rules="rules"
                         label-width="100px" label-position="right">
                    <el-form-item label="合同编码：" prop="code" label-width="150px">
                        <el-input v-model="storeRentContForm.code"  placeholder="自动生成" disabled="disabled"
                                  style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="门店编码：" prop="shopcode" label-width="150px" :rules="[{ required: true, message: '请输入门店编码'}]">
                        <el-input v-model="storeRentContForm.shopcode" clearable placeholder="门店编码" :disabled="!editCode"
                                  @blur="checkShopcode" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="门店名称：" prop="shopname" label-width="150px" :rules="[{ required: true, message: '门店名称不能为空'}]">
                        <el-input v-model="storeRentContForm.shopname" placeholder="门店名称" disabled="disabled"
                                  style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="房东编码：" prop="dlcode" label-width="150px" :rules="[{ required: true, message: '房东编码不能为空'}]">
                        <el-input v-model="storeRentContForm.dlcode" clearable placeholder="编码" disabled="disabled"
                                  style="width: 200px;"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;<el-button @click="showDlDialog" :disabled="!editCode" type="primary">选择房东</el-button>
                    </el-form-item>
                    <el-form-item label="房东姓名：" prop="dlname" label-width="150px" :rules="[{ required: true, message: '房东姓名不能为空'}]">
                        <el-input v-model="storeRentContForm.dlname" placeholder="名称" disabled="disabled"
                                  style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="开始年月日：" prop="startdateStr" label-width="150px" :rules="[{ required: true, message: '开始年月日不能为空'}]">
                        <el-date-picker clearable style="width: 200px;" v-model="storeRentContForm.startdateStr"
                                        value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束年月日：" prop="enddateStr" label-width="150px" :rules="[{ required: true, message: '结束年月日不能为空'}]">
                        <el-date-picker clearable style="width: 200px;" v-model="storeRentContForm.enddateStr"
                                        value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status" label-width="150px">
                        <el-select style="width: 100px" v-model="storeRentContForm.status">
                            <el-option
                                    v-for="item in statusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型：" prop="type" label-width="150px">
                        <el-select style="width: 100px" v-model="storeRentContForm.type">
                            <el-option
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注：" prop="name" label-width="150px">
                        <el-input v-model="storeRentContForm.memo"  type="textarea" :rows="2" style="width: 300px;resize: none"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-collapse-transition>

        <yid-dialog :title="dlDialog.title" :visible.sync="dlDialog.visible" @close="dlCancel"
                    width="900px">
            <el-row type="flex" justify="space-between">
                <el-form inline>
                    <el-form-item label="房东编码：">
                        <el-input clearable v-model="dlDialog.code" placeholder="房东编码"
                                  style="width: 160px;"></el-input>
                    </el-form-item>
                    <el-form-item label="房东姓名：">
                        <el-input clearable v-model="dlDialog.name" placeholder="房东名称"
                                  style="width: 160px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="queryDl()">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <yid-table pagination ref="tableDl"
                               style="margin-top: 10px;"
                               @select="handleSelectionChange" class="store-table">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <yid-table-column label="房东编码" min-width="120" prop="code"></yid-table-column>
                        <yid-table-column label="房东名称" min-width="200" prop="name"></yid-table-column>
                    </yid-table>
                </el-col>
            </el-row>
            <el-row justify="space-between" style="margin-top: 10px;">
                <el-col>
                    <el-button type="primary" @click="selectDl()" style="margin-left: 300px;">确定</el-button>
                    <el-button @click="dlCancel">取消</el-button>
                </el-col>
            </el-row>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import ElButton from "../../library/components/button/button";

    export default {
        components: {ElButton},
        name: "storeRentCont",
        data() {
            return {
                pageInfo: {page: 1, limit: 10, isDel: "0"},
                searchForm: {
                    dlcode: "",
                    dlname: "",
                },
                storeRentContForm: {
                    id : "",
                    code: "",
                    dlid: "",
                    dlcode : "",
                    dlname : "",
                    shopid : "",
                    shopcode : "",
                    shopname: "",
                    shopType : "",
                    brandId : "",
                    brandCode : "",
                    startdate : "",
                    enddate : "",
                    startdateStr : "",
                    enddateStr : "",
                    status : "1",
                    type : "1",
                    memo : "",
                },
                statusList:[{
                    value: '1',
                    label: '正常'
                }, {
                    value: '2',
                    label: '作废'
                }],
                typeList : [{
                    value: '1',
                    label: '正常'
                }, {
                    value: '2',
                    label: '临时'
                }],
                dlDialog :{
                    visible: false,
                    title: '选择房东',
                    code: "",
                    name: '',
                    status: '1',
                    page: 1,
                    limit: 10
                },
                showList: true,
                rules: {},
                editCode : true,
                allShopList: [],
                filterShopList: [],
                multipleSelection: [],
            }
        },
        mounted() {
            this.getShopList();
            this.search();
        },
        methods: {
            getData(reqParams) {
                const fetch = service.finance.storeRentCont.list
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
                this.getData(this.searchForm);
            },
            getDataNoChangePage(reqParams) {
                const fetch = service.finance.storeRentCont.list
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                this.$refs.table.reloadDataNoChangePage({
                    fetch,
                    params,
                });
            },
            searchNoChangePage() {
                this.pageInfo.page = this.$refs.table.Pagination.internalCurrentPage;
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getDataNoChangePage(this.searchForm);
            },
            getShopList() {
                service.chain.shop.shopList({ status: "1" }).then(res => {
                    if (res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList); //保留原数据
                    }
                });
            },
            filterShop(v) {
                this.filterShopList = this.allShopList.filter(item => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true;
                    if (item.shopcode.indexOf(v) !== -1) return true;
                });
            },
            handleSelectionChange(selection, row) {
                console.log(row);
                this.multipleSelection = row;
                this.$refs['tableDl'].clearSelection();
                this.$refs['tableDl'].toggleRowSelection(row);
            },
            dlCancel(){
                this.dlDialog.visible = false;
                this.dlDialog.code = "";
                this.dlDialog.name = "";
                this.multipleSelection = [];
                this.$refs['tableDl'].clearData({});
            },
            showDlDialog(){
                this.dlDialog.visible = true;
                this.dlDialog.title = "选择房东";
            },
            queryDl(){
                /*if(yid.util.isEmpty(this.dlDialog.code) && yid.util.isEmpty(this.dlDialog.name)){
                    yid.util.error("至少选中一个条件进行查询!");
                    return;
                }*/
                const fetch = service.finance.landlordInfo.list
                let params = {};
                params = {
                    page: this.dlDialog.page,
                    limit: this.dlDialog.limit,
                    name: this.dlDialog.name,
                    code: this.dlDialog.code,
                    isDel : "0",
                    status : "1",
                }
                this.$refs['tableDl'].reloadData({
                    fetch,
                    params,
                });
            },
            selectDl(){
                if(yid.util.isEmpty(this.multipleSelection)){
                    yid.util.error("请选中房东后再确定!");
                    return
                }
                this.storeRentContForm.dlid = this.multipleSelection.id;
                this.storeRentContForm.dlcode = this.multipleSelection.code;
                this.storeRentContForm.dlname = this.multipleSelection.name;
                this.dlCancel();
            },
            back() {
                this.showList = true
            },
            addstoreRentCont(){
                this.$refs['storeRentContForm'].resetFields()
                this.storeRentContForm.id = "";
                this.storeRentContForm.memo = "";
                this.storeRentContForm.status = "1";
                this.storeRentContForm.type = "1";
                this.showList = false
                this.editCode = true
            },
            checkShopcode(){
                let shopcode = this.storeRentContForm.shopcode;
                if(!yid.util.isEmpty(shopcode)){
                    //通过code查询是否存在项目，存在则清空code,提示已经存在
                    service.chain.shop.shopList({shopcode:shopcode,isDel:"0"}).then(res=>{
                        if (res.resp_code == 200) {
                            if(res.data.length > 0){
                                const shop = res.data[0];
                                this.storeRentContForm.shopid = shop.id;
                                this.storeRentContForm.shopname = shop.shopname;
                                this.storeRentContForm.shopType = shop.type;
                                this.storeRentContForm.brandId = shop.brandId;
                                this.storeRentContForm.brandCode = shop.brandCode;
                            }else{
                                this.storeRentContForm.shopcode = "";
                                yid.util.error("未找到编码为:["+shopcode+"]的门店信息请重新输入!");
                            }
                        }else{
                            this.storeRentContForm.shopcode = "";
                            yid.util.error(res.resp_msg);
                        }
                    })
                }
            },
            saveAction(){
                this.$refs['storeRentContForm'].validate((valid) => {
                    if (valid) {
                        let startdate = this.storeRentContForm.startdateStr;
                        let enddate = this.storeRentContForm.enddateStr;
                        if(startdate > enddate){
                            yid.util.error("开始时间不能大于结束时间");
                            return
                        }
                        service.finance.storeRentCont.saveAction(this.storeRentContForm).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success("保存成功");
                                this.showList = true
                                if(yid.util.isEmpty(this.storeRentContForm.id)){
                                    this.search()
                                }else{
                                    this.searchNoChangePage()
                                }
                            }else{
                                yid.util.error("保存失败");
                            }
                        });
                    }
                })
            },
            editAction(row){
                this.storeRentContForm.id = row.id;
                this.storeRentContForm.code = row.code;
                this.storeRentContForm.dlid = row.dlid;
                this.storeRentContForm.dlcode = row.dlcode;
                this.storeRentContForm.dlname = row.dlname;
                this.storeRentContForm.shopid = row.shopid;
                this.storeRentContForm.shopcode = row.shopcode;
                this.storeRentContForm.shopname = row.shopname;
                this.storeRentContForm.shopType = row.shopType;
                this.storeRentContForm.brandId = row.brandId;
                this.storeRentContForm.brandCode= row.brandCode;
                this.storeRentContForm.startdate= row.startdate;
                this.storeRentContForm.enddate= row.enddate;
                this.storeRentContForm.startdateStr= row.startdateStr;
                this.storeRentContForm.enddateStr= row.enddateStr;
                this.storeRentContForm.status = row.status;
                this.storeRentContForm.type = row.type;
                this.storeRentContForm.memo= row.memo;
                this.showList = false;
                this.editCode = false;
            },
            deleteAction(row){
                yid.util.confirm("您确定要删除编码为["+row.code+"]的合同吗?","","",()=>{
                    row.isDel = '1';
                    service.finance.landlordInfo.save(row).then(res=>{
                        if (res.resp_code == 200) {
                            yid.util.success("更新成功");
                            this.search();
                        }else{
                            yid.util.error("更新失败");
                        }
                    })
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
    .store-table {
        /deep/ .el-table__header-wrapper .el-table-column--selection .cell {
            display: none;
        }
    }
</style>
