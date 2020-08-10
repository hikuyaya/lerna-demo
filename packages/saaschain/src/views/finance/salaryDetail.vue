<template>
    <div class="salaryRewardDetail">
        <el-form :model="ruleForm" ref="ruleForm" inline>
            <el-form-item label="选择月份：" prop="month">
                <el-date-picker
                        v-model="ruleForm.month"
                        type="month"
                        format="yyyy-MM"
                        placeholder="选择月">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="员工：" prop="eename">
                <el-input placeholder="姓名或工号" style="width: 130px;" v-model="ruleForm.codeName" clearable></el-input>
            </el-form-item>
            <el-form-item label="职务：" prop="psname">
                <el-select clearable filterable placeholder="请选择" v-model="ruleForm.psname">
                    <el-option
                            v-for="item in psList"
                            :key="item.id"
                            :label="item.psname"
                            :value="item.psname">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="门店：">
                <el-select clearable v-model.trim="ruleForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-button @click="submitForm" type="primary">查询</el-button>
                <el-button type="primary" @click="downExcel">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table style="width: 100%;" :data="tableData">
            <el-table-column
                    prop="eename"
                    align="center"
                    fixed
                    label="员工姓名"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="psname"
                    align="center"
                    fixed
                    label="职务"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="totalMoney"
                    align="center"
                    fixed
                    label="工资合计"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="total"
                    align="center"
                    fixed
                    label="提成总额"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="award"
                    align="center"
                    fixed
                    label="奖罚总额"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="base"
                    align="center"
                    fixed
                    label="基本工资"
                    width="80">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="提成">
                <el-table-column
                        align="center"
                        :label="type.prtname+'业绩'" v-for="(type,i) in rTypeList">
                    <template slot-scope="scope">
                        <span>{{ scope.row.penalties.find(e=>rTypeList[i].id==e.prtid)?scope.row.penalties.find(e=>rTypeList[i].id==e.prtid).achievement:0 }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        :label="type.prtname+'提成'" v-for="(type,i) in rTypeList">
                    <template slot-scope="scope">
                        <span>{{ scope.row.penalties.find(e=>rTypeList[i].id==e.prtid)?scope.row.penalties.find(e=>rTypeList[i].id==e.prtid).royalty:0 }}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="奖金">
                <el-table-column v-for="(item,i) in awardList"
                                 align="center"
                                 :label="item.padname">
                    <template slot-scope="scope">
                        <span>{{ scope.row.awards.find(e=>awardList[i].id==e.padid)?scope.row.awards.find(e=>awardList[i].id==e.padid).value:0 }}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="扣罚项">
                <el-table-column
                        align="center" v-for="(item,i) in penaltyList"
                        :label="item.padname">
                    <template slot-scope="scope">
                        <span>{{ scope.row.awards.find(e=>penaltyList[i].id==e.padid)?scope.row.awards.find(e=>penaltyList[i].id==e.padid).value:0 }}</span>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import service from '@src/service'
    import download from '@src/library/http/download'
    import {isEmpty} from "../../library/helper/validate";

    export default {
        name: "salaryDetail",
        data: function () {
            return {
                awardDictList: [],
                rTypeList: [],
                tableData: [],
                ruleForm: {
                    month: '',
                    codeName: '',
                    psname: '',
                    shopid:""
                },
                psList: [],
                allShopList:[],
                filterShopList:[]
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
            service.awardDict.getAll({'status': '1'}).then(res => {
                this.awardDictList = res.data
            })
            service.tc.tcConfigCon.rType().then(res => {
                this.rTypeList = res.data
            })
            service.position.list({status: '1', isDel: '0'}).then(res => {
                this.psList = res.data
            })
            this.getShopList({status:"0"})
        },
        methods: {
            submitForm() {
                if (isEmpty(this.ruleForm.month)) {
                    $yid.util.error("查询条件[年月]不能为空")
                    return;
                }
                if (this.ruleForm.month instanceof Date)
                    this.ruleForm.month = this.ruleForm.month.formatDate("yyyy-MM");
                service.royalty.getERList(this.ruleForm).then(res => {
                    this.tableData = res.data
                    $yid.util.success("完成查询")
                })
            },
            downExcel() {
                if (isEmpty(this.ruleForm.month)) {
                    $yid.util.error("查询条件[年月]不能为空")
                    return;
                }
                if (this.ruleForm.month instanceof Date)
                    this.ruleForm.month = this.ruleForm.month.formatDate("yyyy-MM");
                download($yid.config.API.BASE + '/api-pers/employeeroyalty/excel/export', this.ruleForm)
            },
            getShopList(params){
                service.chain.shop.shopList(params).then(res=> {
                    if(res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                    }
                })
            },
            filterShop(v){
                this.filterShopList = this.allShopList.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            }
        }
    }
</script>

<style scoped>

</style>