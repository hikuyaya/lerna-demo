<template>
    <div class="dicReserveItem">
        <el-collapse-transition>
            <div v-show="showList">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="">
                    <el-button @click="addReserveItem" type="primary">新增</el-button>
                    </el-form-item>
                    <br/>
                    <el-form-item label="编码：" prop="code">
                        <el-input clearable v-model="searchForm.code" placeholder="项目编码" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="名称：" prop="code">
                        <el-input clearable v-model="searchForm.name" placeholder="项目名称" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table ref="table" pagination style="width: 100%;margin-top: 10px;">
                    <yid-table-column prop="code" label="项目编号" width="150"></yid-table-column>
                    <yid-table-column prop="name" label="项目名称" width="200"></yid-table-column>
                    <yid-table-column prop="reservenames" label="可使用的预留款科目" width="200"></yid-table-column>
                    <yid-table-column prop="path" label="可使用系统模块" width="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.path == 1">预留支出</div>
                            <div v-if="scope.row.path == 2">房租</div>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="status" label="状态" width="150">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.status" active-value="1" inactive-value="2" inactive-color="#DCDFE6"  @change="updateStatus(scope.row)">
                            </el-switch>
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
                <el-form ref="reserveitemForm" :model="reserveitemForm" style="margin-top: 16px" :rules="rules"
                         label-width="100px" label-position="right">
                    <el-form-item label="预留款支出项目编码：" prop="code" label-width="180px" :rules="[{ required: true, message: '编码不能为空'}]">
                        <el-input v-model="reserveitemForm.code" clearable placeholder="编码" :disabled="!editCode"
                                  @blur="checkCode" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="预留款支出项目名称：" prop="name" label-width="180px" :rules="[{ required: true, message: '项目名称不能为空'}]">
                        <el-input v-model="reserveitemForm.name" placeholder="名称"
                                  style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status" label-width="180px" :rules="[{ required: true, message: '状态不能为空'}]">
                        <el-select style="width: 200px" v-model="reserveitemForm.status" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in statusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="可使用的预留款科目：" prop="reservecodes" label-width="180px">
                        <el-select style="width: 300px" multiple v-model="reserveitemForm.reservecodes" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in dicReserveList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="可使用的系统模块：" prop="path" label-width="180px">
                        <el-select style="width: 200px" v-model="reserveitemForm.path" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in pathList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import ElButton from "../../library/components/button/button";

    export default {
        components: {ElButton},
        name: "dicReserveItem",
        data() {
            return {
                pageInfo: {page: 1, limit: 10, isDel: "0"},
                searchForm: {
                    code: "",
                    name: "",
                },
                reserveitemForm: {
                    id : "",
                    code: "",
                    name: "",
                    status : "1",
                    reservecodes :[],
                    path : "",
                },
                statusList:[{
                    value: '1',
                    label: '正常'
                }, {
                    value: '2',
                    label: '作废'
                }],
                showList: true,
                rules: {},
                editCode : true,
                dicReserveList : [],
                pathList:[{
                    value: '1',
                    label: '预留支出'
                }, {
                    value: '2',
                    label: '房租'
                }],
            }
        },
        mounted() {
            this.getDicReserveList();
            this.getData();
        },
        methods: {
            getData(reqParams) {
                const fetch = service.finance.dicReserveIotem.list
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getDataNoChangePage(reqParams) {
                const fetch = service.finance.dicReserveIotem.list
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                this.$refs.table.reloadDataNoChangePage({
                    fetch,
                    params,
                });
            },
            search() {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getData(this.searchForm);
            },
            searchNoChangePage() {
                this.pageInfo.page = this.$refs.table.Pagination.internalCurrentPage;
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getDataNoChangePage(this.searchForm);
            },
            getDicReserveList(){
                service.finance.dicReserve.listAll({isDel : "0",status : "1"}).then(res => {
                    if (res.resp_code == 200) {
                        this.dicReserveList = res.data;
                    }
                });
            },
            back() {
                this.$refs['reserveitemForm'].resetFields()
                this.reserveitemForm.id = "";
                this.showList = true
            },
            addReserveItem(){
                this.$refs['reserveitemForm'].resetFields()
                this.reserveitemForm.id = "";
                this.reserveitemForm.status = "1";
                this.reserveitemForm.reservecodes = [];
                this.reserveitemForm.path = "";
                this.showList = false
                this.editCode = true
            },
            checkCode(){
                let code = this.reserveitemForm.code;
                if(!yid.util.isEmpty(code)){
                    if(!yid.validate.isInputCode(code)){
                        this.reserveitemForm.code = '';
                        yid.util.error("编码只能输入数字和字母!");
                        return
                    }
                    //通过code查询是否存在项目，存在则清空code,提示已经存在
                    service.finance.dicReserveIotem.listAll({code:code,isDel:'0'}).then(res=>{
                        if (res.resp_code == 200) {
                            if(res.data.length > 0){
                                this.reserveitemForm.code = "";
                                yid.util.error("编码为:["+code+"]的项目已存在请重新输入!");
                            }
                        }else{
                            this.reserveitemForm.code = "";
                            yid.util.error(res.resp_msg);
                        }
                    })
                }
            },
            saveAction(){
                this.$refs['reserveitemForm'].validate((valid) => {
                    if (valid) {
                        const itemForm = Object.assign(this.reserveitemForm);
                        let codes = "";
                        if(this.reserveitemForm.reservecodes.length > 0){
                            if(this.reserveitemForm.reservecodes.length > 20){
                                yid.util.error("可使用的预留款科目最多选中20个!");
                                return
                            }
                            codes = this.reserveitemForm.reservecodes.join(",")
                        }
                        itemForm.reservecodes =codes;
                        service.finance.dicReserveIotem.save(this.reserveitemForm).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success("保存成功");
                                this.showList = true
                                if(yid.util.isEmpty(this.reserveitemForm.id)){
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
                var rcodes = [];
                if(!yid.util.isEmpty(row.reservecodes)){
                    rcodes = row.reservecodes.toString().split(",");
                }
                this.reserveitemForm.id = row.id;
                this.reserveitemForm.code = row.code;
                this.reserveitemForm.name = row.name;
                this.reserveitemForm.status = row.status;
                if(rcodes.length > 0){
                    this.reserveitemForm.reservecodes = rcodes;
                }else{
                    this.reserveitemForm.reservecodes = [];
                }
                this.reserveitemForm.path = row.path;
                this.showList = false;
                this.editCode = false;
            },
            deleteAction(row){
                yid.util.confirm("您确定要删除["+row.name+"]的预留款科目?","","",()=>{
                    row.isDel = '1';
                    service.finance.dicReserveIotem.save(row).then(res=>{
                        if (res.resp_code == 200) {
                            yid.util.success("更新成功");
                            this.search()
                        }else{
                            yid.util.error("更新失败");
                        }
                    })
                })
            },
            updateStatus(row){
                service.finance.dicReserveIotem.save(row).then(res=>{
                    if (res.resp_code == 200) {
                        this.searchNoChangePage();
                    }else{
                        yid.util.error("更新失败");
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
