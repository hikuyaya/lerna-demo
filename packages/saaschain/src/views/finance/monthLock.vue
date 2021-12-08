<template>
    <div class="salaryRewardDetail">

        <el-collapse-transition>
            <div v-show="showList">
                <el-row>
                <el-button @click="jobAlert(false,'')" type="primary">添加</el-button>
                </el-row>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="searchForm" inline :model="searchForm">

                    <el-form-item label="年月：" prop="yearmonth">
                        <el-date-picker
                                v-model="searchForm.yearmonth"
                                type="month"
                                value-format="yyyyMM"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="类型：" prop="type">
                        <el-select v-model="searchForm.type" clearable placeholder="请选择">
                            <el-option label="资金锁" value="1"></el-option>
                            <el-option label="预留申报锁" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                        <el-select v-model="searchForm.status" clearable placeholder="请选择">
                            <el-option label="未锁定" value="0"></el-option>
                            <el-option label="已锁定" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                    </el-form-item>

                </el-form>
                <yid-table pagination ref="jobtable" :data="jobData" style="margin-top: 15px;" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="年月" min-width="100" prop="yearmonth"></yid-table-column>
                    <yid-table-column label="类型" min-width="150" prop="type">
                        <template slot-scope="scope">
                            <span v-if='scope.row.type==1'>资金锁</span>
                            <span v-if='scope.row.type==2' >预留申报锁</span>
                        </template>
                    </yid-table-column>

                    <yid-table-column label="状态" min-width="150" prop="status">
                        <template slot-scope="scope">
                            <span v-if='scope.row.status==0'>未锁定</span>
                            <span v-if='scope.row.status==1' >已锁定</span>
                        </template>
                    </yid-table-column>

                    <yid-table-column label="操作" min-width="150" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="jobAlert(true,scope.row)">编辑</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
       <!-- <yid-dialog :title="jobDialog.title" :visible.sync="jobDialog.visible" width="450px">-->
        <el-collapse-transition>
            <div v-show="!showList">
                <el-button @click="back" type="primary">返回</el-button>
                <el-button @click="saveJob" type="primary">保存</el-button>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
            <el-form ref="monthLockForm" :model="monthLockForm"  label-width="140px">
                <el-form-item label="年月：" prop="yearmonth" :rules="[{ required: true, message: '年月为空'}]">
                    <el-date-picker
                            v-model="monthLockForm.yearmonth"
                            type="month"
                            value-format="yyyyMM"
                            placeholder="选择日期"
                            @change="getMonthlock">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="类型：" prop="type"  :rules="[{ required: true, message: '请选择类型'}]">
                    <el-select value-key="id" placeholder="请选择" v-model.trim="monthLockForm.type">
                        <el-option label="资金锁" value="1"></el-option>
                        <el-option label="预留申报锁" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态：" prop="status" :rules="[{ required: true, message: '请选择状态'}]">
                    <el-select value-key="id" placeholder="请选择" v-model.trim="monthLockForm.status">
                        <el-option label="未锁定" value="0"></el-option>
                        <el-option label="已锁定" value="1"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            </div>
        </el-collapse-transition>
       <!-- </yid-dialog>-->

    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    export default {
        name: "dept",
        data() {
            return {
                showList: true,
                type:'1',
                searchForm: {
                    type: "",
                    status: "",
                    yearmonth: "",
                },
                monthLockForm:{
                    id:'',
                    yearmonth :'',
                    type :'',
                    status : '',
                },
                pageInfo:{page:1,limit:10},
                maxCode:0,

                jobData: [

                ],
                monthlockData:[],


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
            search() {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.jobtable.Pagination.internalPageSize;
                this.getData(this.searchForm);

            },
            rest() {
                this.$refs["searchForm"].resetFields()
                this.searchForm.yearmonth = "";
                this.searchForm.type = "";
                this.searchForm.status = "";
                this.search()
            },

            getData(reqParams) {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.jobtable.Pagination.internalPageSize;
                const fetch =  service.finance.monthLock.jobList
                const params = {...this.pageInfo, ...reqParams}
                this.$refs.jobtable.reloadData({
                    fetch,
                    params,
                });
            },
            getMonthlock(){
                service.finance.monthLock.monthLockAll({yearmonth: this.monthLockForm.yearmonth}).then(res => {
                    if (res.resp_code == 200) {

                        if(res.data.length==0){
                           return false
                        }
                        this.monthlockData = res.data[0];
                        this.monthLockForm.id=  this.monthlockData.id;
                        this.monthLockForm.type=  this.monthlockData.type;
                        this.monthLockForm.status=  this.monthlockData.status;


                    }
                })
            },

            getjobList(type){

                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.jobtable.Pagination.internalPageSize;
                const fetch = service.finance.monthLock.jobList
                const params = this.pageInfo
                params.type = type

                this.$refs.jobtable.reloadData({
                    fetch,
                    params
                });
            },


            jobAlert(tag,row) {
                this.showList = false;
                debugger;
                if(tag == false){
                    this.monthLockForm.id = ''
                    this.monthLockForm.yearmonth= '';
                    this.monthLockForm.type= '';
                    this.monthLockForm.status = '';

                }else{
                    this.monthLockForm.id = row.id;
                    this.monthLockForm.yearmonth= row.yearmonth;
                    this.monthLockForm.type = row.type;
                    this.monthLockForm.status = row.status;
                }
            },
            saveJob(){
                this.$refs['monthLockForm'].validate((valid) => {
                    if(valid){
                        service.finance.monthLock.saveJob(this.monthLockForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            this.getjobList();
                        });
                        this.back();
                    }
                })

            },
            back() {
                this.$refs['monthLockForm'].resetFields()
                this.showList = true
            },

        }
    }
</script>

<style scoped>

</style>
