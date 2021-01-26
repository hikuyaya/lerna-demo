<template>
    <div class="dept">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!--<el-tab-pane label="部门设置" name="dept">
                    <el-button @click="alertDept(false,'')" type="primary">添加</el-button>
                    <el-button @click="lookup()">查看{{status=='2'?'禁用':'正常'}}的部门</el-button>
                <yid-table pagination ref="depttable" :data="deptData" style="margin-top: 15px;" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="部门编码" min-width="100" prop="bcode"></yid-table-column>
                    <yid-table-column label="部门名称" min-width="150" prop="bname"></yid-table-column>
                    <yid-table-column label="操作" min-width="250" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="alertDept(true, scope.row)">编辑</el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteDept(scope.row)">{{scope.row.status=='1'?'禁用':'恢复'}}</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>-->
            <el-tab-pane label="员工职位类型" name="position">
                <el-button @click="jobAlert(false,'')" type="primary">添加</el-button>
                <el-button @click="lookup1()">查看{{status1=='2'?'禁用':'正常'}}的职位</el-button>
                <yid-table pagination ref="jobtable" :data="jobData" style="margin-top: 15px;" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="类型编号" min-width="100" prop="pscode"></yid-table-column>
                    <yid-table-column label="职位类型" min-width="150" prop="psname"></yid-table-column>
                    <yid-table-column label="同步业务组" min-width="150" prop="bbnames"></yid-table-column>
                    <yid-table-column label="操作" min-width="250" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="jobAlert(true,scope.row)">编辑</el-link>
                            <el-link type="primary" @click="jobDelete(scope.row)" style="margin: 0 10px 0 10px;">{{scope.row.status=='1'?'禁用':'恢复'}}</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="员工级别" name="level">
                <el-button @click="levelAlert(false,'')" type="primary">添加</el-button>
                <el-button @click="lookup2()">查看{{status2=='2'?'禁用':'正常'}}的职位级别</el-button>
                <yid-table pagination ref="leveltable" style="margin-top: 15px;" :data="levelData" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="级别编号" min-width="100" prop="pslcode"></yid-table-column>
                    <yid-table-column label="级别名称" min-width="150" prop="pslname"></yid-table-column>
                    <yid-table-column label="职位" min-width="150" prop="psname"></yid-table-column>
                    <yid-table-column label="操作" min-width="250" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="levelAlert(true,scope.row)">编辑</el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="levelDelete(scope.$index, scope.row)">{{scope.row.status=='1'?'禁用':'恢复'}}</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>
        <!--<yid-dialog :title="deptDialog.title" :visible.sync="deptDialog.visible" width="450px">
            <el-form ref="branchForm" :model="branchForm"  label-width="140px" >
                <el-form-item label="部门编号：" prop="bcode" :rules="[{ required: true, message: '部门编号为空'}]">
                    {{branchForm.bcode}}
                </el-form-item>
                <el-form-item label="部门名称：" prop="bname" :rules="[{ required: true, message: '部门名称为空'}]">
                    <el-input v-model="branchForm.bname"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="saveDept" type="primary">保存</el-button>
                    <el-button @click="cancleDept">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>-->
        <yid-dialog :title="jobDialog.title" :visible.sync="jobDialog.visible" width="450px">
            <el-form ref="positionForm" :model="positionForm"  label-width="140px">
                <el-form-item label="职位类型编号：" prop="pscode" :rules="[{ required: true, message: '职位类型编号为空'}]">
                    {{positionForm.pscode}}
                </el-form-item>
                <el-form-item label="职位名称：" prop="psname"  :rules="[{ required: true, message: '职位名称为空'}]">
                    <el-input v-model="positionForm.psname"></el-input>
                </el-form-item>
                <el-form-item label="同步业务组：" prop="deptObj" :rules="[{ required: true, message: '请选择所属部门'}]">
                    <el-select value-key="id" placeholder="请选择同步业务组" v-model.trim="positionForm.deptObj" multiple>
                        <el-option :key="item.id" :value="item" :label="item.bname" v-for="item in deptDataAll"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="saveJob" type="primary">保存</el-button>
                    <el-button @click="jobCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="levelDialog.title" :visible.sync="levelDialog.visible" width="450px">
            <el-form ref="levelForm" :model="levelForm"  label-width="140px">
                <el-form-item label="员工级别编号：" prop="pslcode" :rules="[{ required: true, message: '员工级别编号为空'}]">
                    {{levelForm.pslcode}}
                </el-form-item>
                <el-form-item label="级别名称：" prop="pslname" :rules="[{ required: true, message: '级别名称为空'}]">
                    <el-input v-model="levelForm.pslname"></el-input>
                </el-form-item>
                <el-form-item label="所属职位类型：" prop="jobObj" :rules="[{ required: true, message: '所属职位类型为空'}]">
                    <el-select value-key="id" placeholder="请选择所属职位类型" v-model.trim="levelForm.jobObj">
                        <el-option v-for="val in jobDataAll" :key="val.id" :value="val.id" :label="val.psname"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="saveLevel" type="primary">保存</el-button>
                    <el-button @click="levelCancel">取消</el-button>
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
                status: '2',
                status1: '2',
                status2: '2',
                branchForm:{
                    bcode : '',
                    bname :'',
                    isDel : '0',
                    status : '1',
                },
                positionForm:{
                    pscode : '',
                    psname :'',
                    deptObj : [],
                    isDel : '0',
                    status : '1',
                    bbids : '',
                    bbnames : '',
                },
                levelForm:{
                    pslcode:'',
                    pslname :'',
                    jobObj : '',
                    isDel : '0',
                    status : '1',
                },
                pageInfo:{page:1,limit:10},
                maxCode:0,
                deptData: [

                ],
                deptDataAll: [

                ],
                jobData: [

                ],
                jobDataAll: [

                ],
                levelData: [

                ],
                deptDialog: {
                    title: '',
                    visible: false,
                },
                jobDialog: {
                    title: '',
                    visible: false,
                },
                levelDialog: {
                    title: '',
                    visible: false,
                }
            }
        },
        created() {

        },

        mounted() {
            /**获取部门列表**/
            //this.getdeptList("1");
            /**获取职务列表**/
            this.getjobList("1");
        },
        methods: {
            /*lookup(){
                this.getdeptList(this.status);
                if(this.status=='1'){
                    this.status='2'
                }else{
                    this.status='1'
                }
            },*/
            lookup1(){
                this.getjobList(this.status1);
                if(this.status1=='1'){
                    this.status1='2'
                }else{
                    this.status1='1'
                }
            },
            lookup2(){
                this.getlevelList(this.status2);
                if(this.status2=='1'){
                    this.status2='2'
                }else{
                    this.status2='1'
                }
            },
            /*getdeptList(status){
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
            },*/
            getdeptListAll(){
                service.dept.deptAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.deptDataAll = res.data;
                    }
                })
            },
            getjobList(status1){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.jobtable.Pagination.internalPageSize;
                const fetch = service.dept.jobList
                const params = this.pageInfo
                params.status = status1
                params.isDel = '0'
                this.$refs.jobtable.reloadData({
                    fetch,
                    params
                });
            },
            getjobListAll(){
                service.dept.jobAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.jobDataAll = res.data;
                    }
                })
            },
            getlevelList(status2){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.leveltable.Pagination.internalPageSize;
                const fetch = service.dept.levelList
                const params = this.pageInfo
                params.status = status2
                params.isDel = '0'
                this.$refs.leveltable.reloadData({
                    fetch,
                    params
                });
            },
           /* getDeptMaxId(){
                service.dept.getDeptMaxId().then(res=> {
                    this.branchForm.bcode = res.data;
                })
            },*/
            getJobMaxId(){
                service.dept.getJobMaxId().then(res=> {
                    this.positionForm.pscode = res.data;
                })
            },
            getLevelMaxId(){
                service.dept.getLevelMaxId().then(res=> {
                    this.levelForm.pslcode = res.data;
                })
            },
            handleClick(tab, event) {
                console.log(tab, event);
                /*if(tab.name == 'dept'){
                    // 触发‘部门设置’事件
                    this.status = "2";
                    this.getdeptList("1");
                }else */
                if(tab.name == 'position'){
                    // 触发‘职务设置’事件
                    this.status1 = "2";
                    this.getjobList("1");
                }else if(tab.name == 'level'){
                    this.status2 = "2";
                    this.getlevelList("1");
                }
            },
            /*alertDept(tag = false,row) {
                this.deptDialog.visible = true;
                this.deptDialog.title = tag? '编辑部门职位' : '添加部门职位';
                if(tag == false){
                    this.branchForm.id = ''
                    //获取最大部门id+1
                    this.getDeptMaxId();
                    this.$refs['branchForm'].resetFields();
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
                        yid.util.info("部门["+row.bname+"]状态异常")
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
            },*/
            jobAlert(tag = false,row) {
                this.jobDialog.visible = true;
                this.jobDialog.title = tag? '编辑员工职位类型' : '添加员工职位类型';
                this.getdeptListAll();

                if(tag == false){
                    this.positionForm.id = ''
                    /**获取最大职务id+1**/
                    this.getJobMaxId();
                    //this.$refs['positionForm'].resetFields();
                    this.positionForm.pscode = ''
                    this.positionForm.psname = ''
                    this.positionForm.status = '1'
                    this.positionForm.deptObj = []
                    this.positionForm.isDel = '0'
                    this.positionForm.status='1'
                    this.positionForm.bbids = ''
                    this.positionForm.bbnames = ''
                }else{
                    this.positionForm.id = row.id;
                    this.positionForm.pscode = row.pscode;
                    this.positionForm.psname= row.psname;
                    this.positionForm.status = row.status;
                    this.positionForm.bbids = row.bbids;
                    this.positionForm.bbnames = row.bbnames;
                    let bbids = row.bbids;
                    this.positionForm.deptObj = [];
                    this.deptDataAll.forEach(res=>{
                        if(bbids.length > 0){
                            bbids.split(",").forEach(bb=>{
                                if(String(bb) == String(res.id)){
                                    this.positionForm.deptObj.push(res);
                                }
                            })
                        }
                    })
                    this.positionForm.isDel = row.isDel
                    this.positionForm.status = row.status
                }
            },
            saveJob(){
                this.$refs['positionForm'].validate((valid) => {
                    if(valid){
                        //获取同步业务组信息
                        let bbids = "";
                        let bbnames = "";
                        if(this.positionForm.deptObj.length > 0){
                            this.positionForm.deptObj.forEach(res=>{
                                bbids = bbids + res.id + ",";
                                bbnames = bbnames + res.bname + ",";
                            })
                        }
                        if(bbids != ""){
                            this.positionForm.bbids = bbids.substring(0,bbids.length-1);
                        }
                        if(bbnames != ""){
                            this.positionForm.bbnames = bbnames.substring(0,bbnames.length-1);
                        }
                        service.dept.saveJob(this.positionForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            if(this.positionForm.id == '' || this.positionForm.id.length == 0){
                                this.status1 = "2";
                                this.getjobList("1");
                            }else{
                                if(this.status1 == '2'){
                                    this.status1 = "2";
                                    this.getjobList("1");
                                }else{
                                    this.status1 = "1";
                                    this.getjobList("2");
                                }
                            }
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
                if(row.status === '1'){
                    tip = '禁用'
                }else(
                    tip = '恢复'
                )
                yid.util.confirm('你确定要'+tip+row.psname+'职位吗？', '','', ()=> {
                    const job = {};
                    job.id = row.id;
                    job.psname = row.psname;
                    job.bbids = row.bbids;
                    if(row.status == '1'){//如果是正常-禁用
                        job.status = '2';
                    }else if(row.status == '2'){//如果是禁用-恢复
                        job.status = '1';
                    }else{
                        yid.util.info("职位["+row.bname+"]状态异常")
                        return;
                    }
                    service.dept.updateStatusJob(job).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功!");
                        }else{
                            yid.util.error(res.resp_msg)
                            return
                        }
                        this.status1 = "2";
                        this.getjobList("1");
                    });
                })
            },
            levelAlert(tag = false,row) {
                this.levelDialog.visible = true;
                this.levelDialog.title = tag? '编辑员工级别' : '添加员工级别';
                this.getjobListAll();
                if(tag == false){
                    this.levelForm.id = ''
                    /**获取最大职务id+1**/
                    this.getLevelMaxId();
                    //this.$refs['levelForm'].resetFields();
                    this.levelForm.pslcode = ''
                    this.levelForm.pslname = ''
                    this.levelForm.status = '1'
                    this.levelForm.jobObj = ''
                    this.levelForm.bbids = ''
                    this.levelForm.bbnames = ''
                    this.levelForm.psid = ''
                    this.levelForm.isDel = '0'
                    this.levelForm.status='1';
                }else{
                    this.levelForm.id = row.id;
                    this.levelForm.pslcode = row.pslcode;
                    this.levelForm.pslname= row.pslname;
                    this.levelForm.jobObj = String(row.psid);
                    this.levelForm.isDel = row.isDel
                    this.levelForm.status=row.status
                }
            },
            saveLevel(){
                this.$refs['levelForm'].validate((valid) => {
                    if(valid){
                        //获取部门id
                        this.levelForm.psid = this.levelForm.jobObj;
                        this.levelForm.clevel = this.levelForm.pslcode;
                        //通过psid 查询bbids
                        service.dept.getJobByid(this.levelForm.psid).then(res=> {
                            if(res.resp_code == 200) {
                                //部门id
                                this.levelForm.bbids = res.data.bbids
                                this.levelForm.bbnames = res.data.bbnames
                                service.dept.saveLevel(this.levelForm).then(res=> {
                                    if(res.resp_code == 200) {
                                        yid.util.success(res.resp_msg)
                                    }else{
                                        yid.util.error(res.resp_msg)
                                    }
                                    if(this.levelForm.id == '' || this.levelForm.id.length == 0){
                                        this.status2 = "2";
                                        this.getlevelList("1");
                                    }else{
                                        if(this.status2 == '2'){
                                            this.status2 = "2";
                                            this.getlevelList("1");
                                        }else{
                                            this.status2 = "1";
                                            this.getlevelList("2");
                                        }
                                    }
                                });
                                this.levelCancel();
                            }else{
                                yid.util.error("未找到id为"+this.jobs+"职未对应的部门信息!");
                            }
                        })
                    }
                })

            },
            levelCancel() {
                this.levelDialog.visible = false;
            },
            levelDelete(index,row) {
                let tip = '';
                if(row.status === '1'){
                    tip = '禁用'
                }else(
                    tip = '恢复'
                )
                yid.util.confirm('你确定要'+tip+row.pslname+'级别吗？', '','', ()=> {
                    const level = {};
                    level.id = row.id;
                    level.pslname = row.pslname;
                    level.psid = row.psid;
                    if(row.status == '1'){//如果是正常-禁用
                        level.status = '2';
                    }else if(row.status == '2'){//如果是禁用-恢复
                        level.status = '1';
                    }else{
                        yid.util.info("级别["+row.pslname+"]状态异常")
                        return;
                    }
                    service.dept.updateStatusLevel(level).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功!");
                        }else{
                            yid.util.error(res.resp_msg);
                            return
                        }
                        this.status2 = "2";
                        this.getlevelList("1");
                    });
                })
            }
        }
    }
</script>

<style scoped>

</style>
