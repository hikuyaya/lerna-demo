<template>
    <div class="jfclevel">
        <el-form ref="jfQuery" :model="jfForm" label-width="140px" inline>
            <el-form-item label="员工：" prop="eename">
                <el-input clearable filterable v-model="jfForm.eename" placeholder="员工工号/姓名"
                          style="width: 150px;"></el-input>
            </el-form-item>
            <el-form-item label="接发级别：" prop="jfClevel">
                <el-select value-key="id" placeholder="请选择" v-model.trim="jfForm.jfClevel" clearable>
                    <el-option :key="item.jfClevel" :value="item.jfClevel" :label="item.jfClname" v-for="item in jfClevelList"/>
                </el-select>
            </el-form-item>
            <el-button @click="getEeJfList()" type="primary">查询</el-button>
        </el-form>
        <yid-table pagination ref="jftable" :data="jfData" style="margin-top: 15px;"
                   :row-class-name="$yid.util.getTableClass">
            <yid-table-column label="员工工号" min-width="100" prop="eecode"></yid-table-column>
            <yid-table-column label="员工姓名" min-width="150" prop="eename"></yid-table-column>
            <yid-table-column label="接发级别" min-width="150" prop="jfClname"></yid-table-column>
            <yid-table-column label="操作" min-width="250">
                <template slot-scope="scope">
                    <el-link type="primary" @click="editEeJfList(scope.row)">编辑</el-link>
                </template>
            </yid-table-column>
        </yid-table>
        <yid-dialog :title="jfDialog.title" :visible.sync="jfDialog.visible" width="450px">
            <el-form ref="jfDialogForm" :model="jfDialog" label-width="140px">
                <el-form-item label="工号：" prop="eecode">
                    {{jfDialog.eecode}}
                </el-form-item>
                <el-form-item label="姓名：" prop="eename">
                    {{jfDialog.eename}}
                </el-form-item>
                <el-form-item label="接发级别：" prop="deptObj">
                    <el-select value-key="jfClevel" placeholder="请选择同步业务组" v-model.trim="jfDialog.jfObj">
                        <el-option :key="item.jfClevel" :value="item" :label="item.jfClname"
                                   v-for="item in jfClevelList"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="savleEejf()" type="primary">保存</el-button>
                    <el-button @click="jfDialog.visible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'

    export default {
        name: "jfclevel",
        data() {
            return {
                jfForm: {
                    eename: '',
                    jfClevel: '',
                    page: 1,
                    limit: 10,
                },
                jfClevelList: [],
                jfData: [],
                jfDialog: {
                    title: '',
                    visible: false,
                    eecode: '',
                    eename: '',
                    jfObj: '',
                    jfClevel: '',
                    jfClname: '',
                }
            }
        },
        created() {
        },
        mounted() {
            /**获取部门列表**/
            //this.getdeptList("1");
            /**获取职务列表**/
            this.getjfClevelList();
        },
        methods: {
            getjfClevelList() {
                service.employee.getjfClevelList().then(res => {
                    if (res.resp_code == 200) {
                        this.jfClevelList = res.data;
                    }
                })
            },
            getEeJfList() {
                const fetch = service.employee.list
                const params = this.jfForm
                this.$refs.jftable.reloadData({
                    fetch,
                    params
                });
            },
            editEeJfList(row) {
                this.jfDialog.visible = true;
                this.jfDialog.eecode = row.eecode;
                this.jfDialog.eename = row.eename;
                this.jfDialog.jfClevel = row.jfClevel;
                this.jfDialog.jfClname = row.jfClname;
                if (row.jfClevel || row.jfClname) {
                    this.jfDialog.jfObj = {jfClevel: row.jfClevel, jfClname: row.jfClname}
                }
            },
            savleEejf() {
                if (this.jfDialog.jfObj) {
                    this.jfDialog.jfClevel = this.jfDialog.jfObj.jfClevel;
                    this.jfDialog.jfClname = this.jfDialog.jfObj.jfClname;
                }
                service.employee.saveJfclevel(this.jfDialog).then(res => {
                    if (res.resp_code == 200) {
                        yid.util.success(res.resp_msg)
                        this.jfDialog.visible = false;
                        this.getEeJfList();
                    } else {
                        yid.util.error(res.resp_msg)
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
