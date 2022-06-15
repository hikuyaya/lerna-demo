<template>
    <div class="dicReserve">
        <el-collapse-transition>
            <div v-show="showList">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="">
                        <el-button @click="addReserve" type="primary">新增</el-button>
                    </el-form-item>
                    <br>
                    <el-form-item label="编码：" prop="code">
                        <el-input clearable v-model="searchForm.code" placeholder="项目编码" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="名称：" prop="name">
                        <el-input clearable v-model="searchForm.name" placeholder="项目名称" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table ref="table" pagination style="width: 100%;margin-top: 10px;">
                    <yid-table-column prop="code" label="预留款项目编号" width="300"></yid-table-column>
                    <yid-table-column prop="name" label="预留款项目名称" width="400"></yid-table-column>
                    <yid-table-column prop="status" label="状态" width="200">
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
                <el-form ref="reserveForm" :model="reserveForm" style="margin-top: 16px" :rules="rules"
                         label-width="100px" label-position="right">
                    <el-form-item label="预留款项目编码：" prop="code" label-width="150px" :rules="[{ required: true, message: '编码不能为空'}]">
                        <el-input v-model="reserveForm.code" clearable placeholder="编码" :disabled="!editCode"
                                  @blur="checkCode" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="预留款项目名称：" prop="name" label-width="150px" :rules="[{ required: true, message: '项目名称不能为空'}]">
                        <el-input v-model="reserveForm.name" placeholder="名称"
                                  style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status" label-width="150px" :rules="[{ required: true, message: '状态不能为空'}]">
                        <el-select style="width: 200px" v-model="reserveForm.status" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in statusList"
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
        name: "dicReserve",
        data() {
            return {
                pageInfo: {page: 1, limit: 10, isDel: "0"},
                searchForm: {
                    code: "",
                    name: "",
                },
                reserveForm: {
                    id : "",
                    code: "",
                    name: "",
                    status : "1",
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
            }
        },
        mounted() {
            this.search();
        },
        methods: {
            getData(reqParams) {
                const fetch = service.finance.dicReserve.list
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getDataNoChangePage(reqParams) {
                const fetch = service.finance.dicReserve.list
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
            back() {
                this.$refs['reserveForm'].resetFields()
                this.reserveForm.id = "";
                this.showList = true
            },
            addReserve(){
                this.$refs['reserveForm'].resetFields()
                this.reserveForm.id = "";
                this.reserveForm.status = "1";
                this.showList = false
                this.editCode = true
            },
            checkCode(){
                let code = this.reserveForm.code;
                if(!yid.util.isEmpty(code)){
                    if(!yid.validate.isInputCode(code)){
                        this.reserveForm.code = '';
                        yid.util.error("编码只能输入数字和字母!");
                        return
                    }
                    //通过code查询是否存在项目，存在则清空code,提示已经存在
                    service.finance.dicReserve.listAll({code:code,isDel:"0"}).then(res=>{
                        if (res.resp_code == 200) {
                            if(res.data.length > 0){
                                this.reserveForm.code = "";
                                yid.util.error("编码为:["+code+"]的项目已存在请重新输入!");
                            }
                        }else{
                            this.reserveForm.code = "";
                            yid.util.error(res.resp_msg);
                        }
                    })
                }
            },
            saveAction(){
                this.$refs['reserveForm'].validate((valid) => {
                    if (valid) {
                        service.finance.dicReserve.save(this.reserveForm).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success("保存成功");
                                this.showList = true
                                if(yid.util.isEmpty(this.reserveForm.id)){
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
                this.reserveForm.id = row.id;
                this.reserveForm.code = row.code;
                this.reserveForm.name = row.name;
                this.reserveForm.status = row.status;
                this.showList = false;
                this.editCode = false;
            },
            deleteAction(row){
                yid.util.confirm("您确定要删除["+row.name+"]的预留款项目?","","",()=>{
                    row.isDel = '1';
                    service.finance.dicReserve.save(row).then(res=>{
                        if (res.resp_code == 200) {
                            yid.util.success("更新成功");
                            this.search();
                        }else{
                            yid.util.error("更新失败");
                        }
                    })
                })
            },
            updateStatus(row){
                service.finance.dicReserve.save(row).then(res=>{
                    if (res.resp_code == 200) {
                        this.searchNoChangePage()
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
