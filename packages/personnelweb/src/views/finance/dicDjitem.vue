<template>
    <div class="dicDjitem">
        <el-collapse-transition>
            <div v-show="showList">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="">
                        <el-button @click="addDjitem" type="primary">新增</el-button>
                    </el-form-item>
                    <br>
                    <el-form-item label="编码：" prop="code">
                        <el-input clearable v-model="searchForm.code" placeholder="编码" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="名称：" prop="code">
                        <el-input clearable v-model="searchForm.name" placeholder="名称" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table ref="table" pagination style="width: 100%;margin-top: 10px;">
                    <yid-table-column prop="code" label="编号" width="60"></yid-table-column>
                    <yid-table-column prop="name" label="名称" width="150"></yid-table-column>
                    <yid-table-column prop="colname" label="报表列名" width="120"></yid-table-column>
                    <yid-table-column prop="isBk" label="类型" width="150">
                        <template slot-scope="scope">
                            <span v-if='scope.row.isBk==0'>代扣代缴</span>
                            <span v-if='scope.row.isBk==1'>财务拨款</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="direction" label="方向" width="60"></yid-table-column>
                    <yid-table-column prop="isDkdj" label="是否代扣代缴合计项目" width="180">
                        <template slot-scope="scope">
                            <span v-if='scope.row.isDkdj==0'>否</span>
                            <span v-if='scope.row.isDkdj==1'>是</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="type" label="计算类型" width="80">
                        <template slot-scope="scope">
                            <span v-if='scope.row.type==1'>覆盖录入</span>
                            <span v-if='scope.row.type==2'>累加录入</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="memo" label="备注" width="200">
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
                <el-form ref="djitemForm" :model="djitemForm" style="margin-top: 16px" :rules="rules"
                         label-width="100px" label-position="right">
                    <el-form-item label="编码：" prop="code" label-width="180px" :rules="[{ required: true, message: '编码不能为空'}]">
                        <el-input v-model="djitemForm.code" clearable placeholder="编码" :disabled="!editCode"
                                  @blur="checkCode" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="名称：" prop="name" label-width="180px" :rules="[{ required: true, message: '项目名称不能为空'}]">
                        <el-input v-model="djitemForm.name" placeholder="名称"
                                  style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="报表列名：" prop="colnamenum" label-width="180px" :rules="[{ required: true, message: '报表列名不能为空'}]">
                        NUMCOL<el-input type="number" v-model="djitemForm.colnamenum" oninput="value=value.replace(/[^\d]/g,'')" @blur="checkColname"
                                  style="width: 140px;"></el-input>
                    </el-form-item>
                    <el-form-item label="类型：" prop="type" label-width="180px">
                        <el-select style="width: 200px" v-model="djitemForm.isBk" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in isBkList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="方向：" prop="direction" label-width="180px" :rules="[{ required: true, message: '方向不能为空'}]">
                        <el-select style="width: 200px" v-model="djitemForm.direction" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in directionList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="计算类型：" prop="type" label-width="180px" :rules="[{ required: true, message: '计算类型不能为空'}]">
                        <el-select style="width: 200px" v-model="djitemForm.type" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否代扣代缴合计项目：" prop="isDkdj" label-width="180px" :rules="[{ required: true, message: '是否代扣代缴不能为空'}]">
                        <el-select style="width: 200px" v-model="djitemForm.isDkdj" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in isDkdjList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注：" prop="name" label-width="180px">
                        <el-input v-model="djitemForm.memo"  type="textarea" :rows="2" style="width: 300px;resize: none"></el-input>
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
        name: "dicDjitem",
        data() {
            return {
                pageInfo: {page: 1, limit: 10, isDel: "0"},
                searchForm: {
                    code: "",
                    name: "",
                },
                djitemForm: {
                    id : "",
                    code: "",
                    name: "",
                    colname : "",
                    memo: "",
                    isDkdj : "1",
                    direction : "",
                    type : "",
                    isBk : "",
                    colnamenum : "",
                },
                isDkdjList:[{
                    value: '0',
                    label: '否'
                }, {
                    value: '1',
                    label: '是'
                }],
                directionList:[{
                    value: '1',
                    label: '1'
                }, {
                    value: '-1',
                    label: '-1'
                }],
                typeList:[{
                    value: '1',
                    label: '覆盖录入'
                }, {
                    value: '2',
                    label: '累加录入'
                }],
                isBkList:[{
                    value: '0',
                    label: '代扣代缴'
                }, {
                    value: '1',
                    label: '财务拨款'
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
                const fetch = service.finance.dicDjitem.list
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
                const fetch = service.finance.dicDjitem.list
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
            back() {
                this.$refs['djitemForm'].resetFields()
                this.djitemForm.id = "";
                this.djitemForm.memo = "";
                this.showList = true
            },
            addDjitem(){
                this.$refs['djitemForm'].resetFields()
                this.djitemForm.id = "";
                this.djitemForm.memo = "";
                this.showList = false
                this.editCode = true
            },
            checkCode(){
                let code = this.djitemForm.code;
                if(!yid.util.isEmpty(code)){
                    if(!yid.validate.isInputCode(code)){
                        this.djitemForm.code = '';
                        yid.util.error("编码只能输入数字和字母!");
                        return
                    }
                    //通过code查询是否存在项目，存在则清空code,提示已经存在
                    service.finance.dicDjitem.listAll({code:code}).then(res=>{
                        if (res.resp_code == 200) {
                            if(res.data.length > 0){
                                this.djitemForm.code = "";
                                yid.util.error("编码为:["+code+"]的项目已存在请重新输入!");
                            }
                        }else{
                            this.djitemForm.code = "";
                            yid.util.error(res.resp_msg);
                        }
                    })
                }
            },
            saveAction(){
                this.$refs['djitemForm'].validate((valid) => {
                    if (valid) {
                        this.djitemForm.colname = "NUMCOL" +this.djitemForm.colnamenum;
                        service.finance.dicDjitem.save(this.djitemForm).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success("保存成功");
                                this.showList = true
                                if(yid.util.isEmpty(this.djitemForm.id)){
                                    this.search()
                                }else {
                                    this.searchNoChangePage();
                                }
                            }else{
                                yid.util.error("保存失败");
                            }
                        });
                    }
                })
            },
            editAction(row){
                let colnamenum = "";
                this.djitemForm.id = row.id;
                this.djitemForm.code = row.code;
                this.djitemForm.name = row.name;
                if(!yid.util.isEmpty(row.colname)){
                    colnamenum = row.colname.substr(6);
                }
                this.djitemForm.colname = row.colname;
                this.djitemForm.colnamenum = colnamenum;
                this.djitemForm.memo = row.memo;
                this.djitemForm.isDkdj = row.isDkdj;
                this.djitemForm.direction = row.direction;
                this.djitemForm.type = row.type;
                this.djitemForm.isBk = row.isBk;
                this.showList = false;
                this.editCode = false;
            },
            deleteAction(row){
                yid.util.confirm("您确定要删除["+row.name+"]的代扣代缴项目?","","",()=>{
                    row.isDel = '1';
                    service.finance.dicDjitem.save(row).then(res=>{
                        if (res.resp_code == 200) {
                            yid.util.success("更新成功");
                            this.search();
                        }else{
                            yid.util.error("更新失败");
                        }
                    })
                })
            },
            checkColname(){
               if(!yid.util.isEmpty(this.djitemForm.colnamenum)){
                    var colname = "NUMCOL"+this.djitemForm.colnamenum;
                    service.finance.dicDjitem.checkColname({id:this.djitemForm.id,colname:colname}).then(res=>{
                        if (res.resp_code == 200) {
                            if(res.data.length > 0){
                                yid.util.error(colname+"的报表列名已存在,请重新输入");
                                this.djitemForm.colnamenum = "";
                                return
                            }
                        }else{
                            yid.util.error(res.resp_msg);
                        }
                    });
               }
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
