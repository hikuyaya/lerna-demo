<template>
    <div class="salaryRewardDetail">
        <el-form :model="ruleForm" ref="ruleForm" inline>
            <el-form-item label="选择月份：" prop="month">
                <el-date-picker
                        :clearable="false"
                        v-model="ruleForm.month"
                        type="month"
                        value-format="yyyy-MM"
                        format="yyyy-MM"
                        placeholder="选择月">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="姓名：" prop="month">
                <el-input clearable v-model="ruleForm.eecodename" placeholder="姓名/工号" style="width: 150px;"></el-input>
            </el-form-item>
            <el-form-item label="职务：" prop="psid">
                <el-select clearable  filterable placeholder="请选择" v-model.trim="ruleForm.psid">
                    <el-option :key="item.id" :label="item.psname" :value="item.id" v-for="item in searchFormPositionList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-button @click="getAwardDescList" type="primary">查询</el-button>
                <el-button @click="downExcel" type="primary">导出</el-button>
            </el-form-item>
        </el-form>
        <yid-table style="width: 100%;" :data="tableData">
            <el-table-column
                    prop="eename"
                    align="center"
                    fixed
                    label="员工姓名"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="psname"
                    align="center"
                    fixed
                    label="职务"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="totalMoney"
                    align="center"
                    fixed
                    label="合计"
                    width="80">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="奖项">
                <el-table-column v-for="(item,i) in awardList"
                                 align="center"
                                 :label="item.padname">
                    <template slot-scope="scope">
                        <span>{{ scope.row.awards.find(e=>awardList[i].id==e.padid)?scope.row.awards.find(e=>awardList[i].id==e.padid).value:0 }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="zmoney"
                        align="center"
                        label="合计"
                        width="80">
                </el-table-column>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="扣罚项">
                <el-table-column
                        align="center" v-for="(item,i) in penaltyList"
                        :label="item.padname">
                    <template slot-scope="scope">
                        <span>{{ scope.row.penaltys.find(e=>penaltyList[i].id==e.padid)?scope.row.penaltys.find(e=>penaltyList[i].id==e.padid).value:0 }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="fmoney"
                        align="center"
                        label="合计"
                        width="80">
                </el-table-column>
            </el-table-column>
        </yid-table>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import download from '@src/library/http/download'
    import {isEmpty} from "../../library/helper/validate";
    export default {
        name: "salaryRewardDetail",
        data: function () {
            return {
                awardDictList: [],
                tableData : [],
                ruleForm: {
                    month: '',
                    eecodename : '',
                    psid : '',
                },
                searchFormPositionList : [],
            }
        },
        computed: {
            awardList: function () {
                return this.awardDictList.filter(e => e.padtype == "1")
            },
            penaltyList: function () {
                return this.awardDictList.filter(e => e.padtype == "2")
            },
        },
        mounted() {
            let d = new Date
            let year = d.getFullYear()
            let month = d.getMonth()+1
            if(Number(month) < 10){
                month = "0" + month
            }
            let date1 = year + "-" + month
            this.ruleForm.month = date1
            service.awardDict.getAll({'status': '1'}).then(res => {
                this.awardDictList = res.data
            });
            this.getSearchFormPositionList();
            //this.getAwardDescList();
        },
        methods:{
            getSearchFormPositionList(){
                service.position.list({status:"1",isDel:"0"}).then(res=> {
                    if(res.resp_code == 200) {
                        this.searchFormPositionList = res.data;
                    }
                })

            },
            getAwardDescList(){
                if (isEmpty(this.ruleForm.month)) {
                    yid.util.error("查询条件[年月]不能为空")
                    return;
                }
                this.tableData = [];
                if (this.ruleForm.month instanceof Date)
                    this.ruleForm.month = this.ruleForm.month.formatDate("yyyy-MM");
                service.pers.awardDesc.awarddescList(this.ruleForm).then(res => {
                    if(res.resp_code == 200) {
                        this.tableData = res.data
                    }
                })
            },
            downExcel() {
                if (isEmpty(this.ruleForm.month)) {
                    yid.util.error("查询条件[年月]不能为空")
                    return;
                }
                if (this.ruleForm.month instanceof Date)
                    this.ruleForm.month = this.ruleForm.month.formatDate("yyyy-MM");
                download(yid.config.API.BASE + '/api-pers/awarddesc/excel/export', this.ruleForm)
            },
        }
    }
</script>

<style scoped>

</style>