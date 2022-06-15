<template>
    <div class="branch">
        <el-button @click="alertDept(false,'')" type="primary">添加</el-button>
        <el-button @click="lookup()">查看{{status=='2'?'禁用':'正常'}}的组</el-button>
        <yid-table pagination ref="depttable" :data="deptData" style="margin-top: 15px;" :row-class-name="$yid.util.getTableClass">
            <yid-table-column label="组编码" min-width="100" prop="bcode"></yid-table-column>
            <yid-table-column label="组名称" min-width="150" prop="bname"></yid-table-column>
            <yid-table-column label="操作" min-width="250" prop="content">
                <template slot-scope="scope">
                    <el-link type="primary" @click="alertDept(true, scope.row)">编辑</el-link>
                    <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteDept(scope.row)">{{scope.row.status=='1'?'禁用':'恢复'}}</el-link>
                </template>
            </yid-table-column>
        </yid-table>

        <yid-dialog :title="deptDialog.title" :visible.sync="deptDialog.visible" width="450px">
            <el-form ref="branchForm" :model="branchForm"  label-width="140px" >
                <el-form-item label="组编号：" prop="bcode" :rules="[{ required: true, message: '组编号为空'}]">
                    {{branchForm.bcode}}
                </el-form-item>
                <el-form-item label="组名称：" prop="bname" :rules="[{ required: true, message: '组名称为空'}]">
                    <el-input v-model="branchForm.bname"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="saveDept" type="primary">保存</el-button>
                    <el-button @click="cancleDept">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    export default {
        name: "branch",
        data() {
            return {
                status: '2',
                branchForm:{
                    bcode : '',
                    bname :'',
                    isDel : '0',
                    status : '1',
                },
                pageInfo:{page:1,limit:10},
                maxCode:0,
                deptData: [

                ],
                deptDialog: {
                    title: '',
                    visible: false,
                },
            }
        },
        created() {

        },

        mounted() {
            /**获取组列表**/
            this.getdeptList("1");
        },

        methods: {
            lookup(){
                this.getdeptList(this.status);
                if(this.status=='1'){
                    this.status='2'
                }else{
                    this.status='1'
                }
            },
            getdeptList(status){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.depttable.Pagination.internalPageSize;
                const fetch = service.dept.deptList
                const params = this.pageInfo
                params.status = status
                params.isDel = '0'
                this.$refs.depttable.reloadData({
                    fetch,
                    params
                });
            },
            getdeptListAll(){
                service.dept.deptAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.deptDataAll = res.data;
                    }
                })
            },
            getDeptMaxId(){
                service.dept.getDeptMaxId().then(res=> {
                    this.branchForm.bcode = res.data;
                })
            },
            alertDept(tag = false,row) {
                this.deptDialog.visible = true;
                this.deptDialog.title = tag? '编辑业务组' : '添加业务组';
                if(tag == false){
                    this.branchForm.id = ''
                        //获取最大业务组id+1
                        this.getDeptMaxId();
                    //this.$refs['branchForm'].resetFields();
                    this.branchForm.bcode='';
                    this.branchForm.bname='';
                    this.branchForm.isDel='0';
                    this.branchForm.status='1';
                }else{
                    this.branchForm.id = row.id;
                    this.branchForm.bcode=row.bcode;
                    this.branchForm.bname= row.bname;
                    this.branchForm.isDel=row.isDel;
                    this.branchForm.status=row.status;
                }
                console.log(this.branchForm);
            },

            cancleDept() {
                this.deptDialog.visible = false;
            },
            saveDept(){
                this.$refs['branchForm'].validate((valid) => {
                    if(valid){
                        console.log(this.branchForm);
                        service.dept.saveDept(this.branchForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            if(this.branchForm.id == '' || this.branchForm.id.length == 0){
                                this.status = "2";
                                this.getdeptList("1");
                            }else{
                                if(this.status == '2'){
                                    this.status = "2";
                                    this.getdeptList("1");
                                }else{
                                    this.status = "1";
                                    this.getdeptList("2");
                                }
                            }

                        });
                        this.cancleDept();
                    }
                })
            },
            deleteDept(row) {
                let tip = '';
                if(row.status === '1'){
                    tip = '禁用'
                }else(
                    tip = '恢复'
                )
                yid.util.confirm('你确定要'+tip+row.bname+'吗？', '','', ()=> {
                    const dept = {};
                    dept.id = row.id;
                    dept.bname = row.bname;
                    if(row.status == '1'){//如果是正常-禁用
                        dept.status = '2';
                    }else if(row.status == '2'){//如果是禁用-恢复
                        dept.status = '1';
                    }else{
                        yid.util.info("业务组["+row.bname+"]状态异常")
                        return;
                    }
                    service.dept.updateStatusDept(dept).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功!");
                        }else{
                            yid.util.error(res.resp_msg);
                            return
                        }
                        this.status = "2";
                        this.getdeptList("1");
                    });
                })
            },
        }
    }
</script>

<style scoped>

</style>