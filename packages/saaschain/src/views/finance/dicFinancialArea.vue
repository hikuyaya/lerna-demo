<template>
    <div class="dept">
        <el-tabs v-model="activeName" @tab-click="handleClick">

            <el-tab-pane label="财务片区字典维护" name="position">
                <el-button @click="jobAlert(false,'')" type="primary">添加</el-button>

                <yid-table pagination ref="jobtable" :data="jobData" style="margin-top: 15px;" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="财务片区编码" min-width="100" prop="code"></yid-table-column>
                    <yid-table-column label="财务片区名称" min-width="150" prop="name"></yid-table-column>

                    <yid-table-column label="状态" min-width="50" prop="status">
                        <template slot-scope="scope">
                            <span v-if='scope.row.status==1'>正常</span>
                            <span v-if='scope.row.status==2' style="color: red">停用</span>
                        </template>
                    </yid-table-column>

                    <yid-table-column label="操作" min-width="150" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="jobAlert(true,scope.row)">编辑</el-link>
                            <el-link type="primary" @click="jobDelete(scope.row)" style="margin: 0 10px 0 10px;">{{scope.row.status=='1'?'停用':'恢复'}}</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>

        </el-tabs>

        <yid-dialog :title="jobDialog.title" :visible.sync="jobDialog.visible" width="450px">
            <el-form ref="financialAreaForm" :model="financialAreaForm"  label-width="140px">
                <el-form-item label="财务片区编码：" prop="code" :rules="[{ required: true, message: '财务片区编码为空'}]">
                    {{financialAreaForm.code}}
                </el-form-item>

                <el-form-item label="财务片区名称：" prop="name"  :rules="[{ required: true, message: '财务片区名称为空'}]">
                    <el-input v-model="financialAreaForm.name"></el-input>
                </el-form-item>

                <el-form-item label="状态：" prop="status" :rules="[{ required: true, message: '请选择状态'}]">
                    <el-select value-key="id" placeholder="请选择" v-model.trim="financialAreaForm.status">
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="停用" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button @click="saveJob" type="primary">保存</el-button>
                    <el-button @click="jobCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    export default {
        name: "dept",
        data() {
            return {
                activeName: 'position',

                type:'1',

                financialAreaForm:{
                    code :'',
                    name :'',
                    status : '',
                },
                pageInfo:{page:1,limit:10},
                maxCode:0,

                jobData: [

                ],



                jobDialog: {
                    title: '',
                    visible: false,
                },

            }
        },
        created() {
            this.getjobList();
        },

        mounted() {

            this.getjobList();

        },
        methods: {


            getjobList(type){

                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.jobtable.Pagination.internalPageSize;
                const fetch = service.finance.dicFinancialArea.jobList
                const params = this.pageInfo
                params.type = type

                this.$refs.jobtable.reloadData({
                    fetch,
                    params
                });
            },



            getJobMaxId(){
                service.finance.dicFinancialArea.getJobMaxId().then(res=> {
                    this.financialAreaForm.code = res.data;
                })
            },

            handleClick(tab, event) {
                this.getjobList();
            },

            jobAlert(tag = false,row) {
                this.jobDialog.visible = true;
                this.jobDialog.title = tag? '编辑财务片区字典' : '添加财务片区字典';


                if(tag == false){
                    this.financialAreaForm.id = ''
                    /**获取最大code+1**/
                    this.getJobMaxId();

                    this.financialAreaForm.name= '';
                    this.financialAreaForm.status = '';

                }else{
                    this.financialAreaForm.id = row.id;
                    this.financialAreaForm.code = row.code;
                    this.financialAreaForm.name= row.name;
                    this.financialAreaForm.status = row.status;
                }
            },
            saveJob(){
                this.$refs['financialAreaForm'].validate((valid) => {
                    if(valid){

                        service.finance.dicFinancialArea.saveJob(this.financialAreaForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            this.getjobList();
                        });
                        this.jobCancel();
                    }
                })

            },
            jobCancel() {
                this.jobDialog.visible = false;
            },
            jobDelete(row) {
                let tip = '';
                if(row.status === '2'){
                    tip = '停用'
                }else(
                    tip = '恢复'
                )
                yid.util.confirm('你确定要'+tip+row.name+'吗？', '','', ()=> {
                    const job = {};
                    job.id = row.id;
                    if(row.status == '1'){//如果是正常-禁用
                        job.status = '2';
                    }else if(row.status == '2'){//如果是禁用-恢复
                        job.status = '1';
                    }else{
                        yid.util.info("财务片区字典["+row.bname+"]状态异常")
                        return;
                    }
                    service.finance.dicFinancialArea.updateStatusJob(job).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功!");
                        }else{
                            yid.util.error(res.resp_msg)
                            return
                        }
                        this.getjobList("");
                    });
                })
            }
        }
    }
</script>

<style scoped>

</style>
