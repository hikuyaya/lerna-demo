<template>
    <div class="member-statistics">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="会员数据汇总表" name="total">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="会员查询：">
                        <el-input clearable v-model="searchForm.memcodename" placeholder="姓名/手机号"  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="总卡金余额：">
                        <el-input type="number" v-model="searchForm.minMoney" style="width: 150px;" ></el-input> -
                        <el-input type="number" v-model="searchForm.maxMoney" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="getMemCard" type="primary">查询</el-button>
                        <el-button @click="get">给查询会员发送短信</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="table">
                    <yid-table-column label="姓名" min-width="100" prop="memname"></yid-table-column>
                    <yid-table-column label="手机号" min-width="150" prop="mobile"></yid-table-column>
                    <yid-table-column label="性别" min-width="70" prop="sex">
                        <template slot-scope="scope">
                            {{scope.row.sex == '1' ? "男" : "女"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="总卡金余额" min-width="150" prop="money"></yid-table-column>
                    <yid-table-column label="总赠送金余额" min-width="150" prop="moneyGift"></yid-table-column>
                    <yid-table-column label="总储值总额" min-width="150" prop="moneyAll"></yid-table-column>
                    <yid-table-column label="总消费总额" min-width="150" prop="servTotal"></yid-table-column>
                    <yid-table-column label="门店" min-width="150" prop="shopname"></yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="会员消费分析" name="consume">
                <el-form ref="searchservForm" inline :model="searchservForm">
                    <el-form-item  label="消费日期：">
                        <el-date-picker
                                v-model="searchservForm.minYearMonth"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                type="month"
                                placeholder="开始日期">
                        </el-date-picker>-<el-date-picker
                                v-model="searchservForm.maxYearMonth"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                type="month"
                                placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item  label="累计最少消费额度：">
                        <el-input clearable v-model="searchservForm.minservTotal" placeholder=""  style="width: 80px;"></el-input>
                    </el-form-item>
                    <el-form-item label="起止日期最少消费额度：">
                        <el-input clearable v-model="searchservForm.mincmMoney" placeholder=""  style="width: 80px;"></el-input>
                    </el-form-item>
                    <el-form-item label="累计最少消费次数：">
                        <el-input clearable v-model="searchservForm.minservNum" placeholder=""  style="width: 80px;"></el-input>
                    </el-form-item>
                    <el-form-item label="起止日期最少消费次数：">
                        <el-input clearable v-model="searchservForm.mincmNum" placeholder=""  style="width: 80px;"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="getMemServ" type="primary">查询</el-button>
                        <el-button @click="exportMemServ" type="primary">导出</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="servtable">
                    <yid-table-column label="姓名" min-width="100" prop="memname"></yid-table-column>
                    <yid-table-column label="手机号" min-width="150" prop="mobile"></yid-table-column>
                    <yid-table-column label="性别" min-width="70" prop="sex">
                        <template slot-scope="scope">
                            {{scope.row.sex == '1' ? "男" : "女"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="消费金额" min-width="150" prop="cmMoney"></yid-table-column>
                    <yid-table-column label="消费次数" min-width="150" prop="cmNum"></yid-table-column>
                    <yid-table-column label="消费客单价" min-width="150" prop="cmUnivalent"></yid-table-column>
                    <yid-table-column label="累计消费总额" min-width="150" prop="servTotal"></yid-table-column>
                    <yid-table-column label="累计消费总次数" min-width="150" prop="servNum"></yid-table-column>
                    <yid-table-column label="累计消费客单价" min-width="150" prop="univalent"></yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import {exportExecl} from "../../library/helper/execl";
    export default {
        name: "statistics",
        data() {
            return {
                activeName : 'total',
                searchForm : {
                    memcodename : '',
                    minMoney : '',
                    maxMoney : '',
                },
                searchservForm : {
                    minYearMonth : '',
                    maxYearMonth : '',
                    minservTotal : '',
                    mincmMoney : '',
                    minservNum : '',
                    mincmNum : '',
                },
                pageInfo:{page:1,limit:30},
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            getData(reqParams){
                const fetch = service.member.statistics.statisticsList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getServData(reqParams){
                const fetch = service.member.statisticsYm.statisticsYmList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.servtable.reloadData({
                    fetch,
                    params,
                });
            },
            getMemCard(){
                this.pageInfo.page=1
                this.getData(this.searchForm);
            },
            getMemServ(){
                this.pageInfo.page=1
                this.getServData(this.searchservForm);
            },
            exportMemServ(){
                const head = {
                    memname: '姓名',
                    mobile: '手机号',
                    sex: '性别',
                    cmMoney: '消费金额',
                    cmNum: '消费次数',
                    cmUnivalent: '消费客单价',
                    servTotal: '累计消费总额',
                    servNum: '累计消费总次数',
                    univalent: '累计消费客单价',
                }
                service.member.statisticsYm.statisticsYmExport({...this.searchservForm}).then(res => {
                    if(res.resp_code=="200"){
                        res.data.forEach(item =>{
                            if(item.sex == '1'){
                                item.sex = '男'
                            }else if(item.sex == '2'){
                                item.sex = '女'
                            }
                        });
                        exportExecl(head,res.data,"会员消费分析");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            handleClick(row){
                if(row.name == 'total'){
                    this.getMemCard(this.searchForm);
                }else if(row.name == 'consume'){
                    this.getMemServ(this.searchservForm);
                }
            },
        }
    }
</script>

<style scoped>

</style>
