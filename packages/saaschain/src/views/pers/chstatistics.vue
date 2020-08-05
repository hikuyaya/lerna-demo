<template>
    <div class="check_chstatistics">
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="选择日期：">
                <el-date-picker
                        v-model="searchForm.cmonth"
                        value-format="yyyy-MM"
                        format="yyyy-MM"
                        type="month"
                        placeholder="选择月份">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
                <el-button @click="seachTc" type="primary">查询</el-button>
                <el-button @click="exportTc" type="primary">导出</el-button>
            </el-form-item>
        </el-form>
        <yid-table pagination ref="table">
            <yid-table-column label="工号" min-width="100" prop="eecode"></yid-table-column>
            <yid-table-column label="员工姓名" min-width="120" prop="eename"></yid-table-column>
            <yid-table-column label="级别" min-width="120" prop="pslname"></yid-table-column>
            <yid-table-column label="出勤天数" min-width="80" prop="days"></yid-table-column>
            <yid-table-column label="迟到次数" min-width="80" prop="delayDays"></yid-table-column>
            <yid-table-column label="早退次数" min-width="80" prop="earlyDay"></yid-table-column>
            <yid-table-column label="迟到/早退总时长(分钟)" min-width="100" prop="totalTime"></yid-table-column>
            <yid-table-column label="未打卡次数" min-width="100" prop="uncheck"></yid-table-column>
            <yid-table-column label="休息(天)" min-width="80" prop="rest"></yid-table-column>
            <yid-table-column label="学习(天)" min-width="80" prop="study"></yid-table-column>
            <yid-table-column label="旷工(天)" min-width="80" prop="absenteeism"></yid-table-column>
        </yid-table>
    </div>
</template>

<script>
    import service from '@src/service'
    import download from '@src/library/http/download'
    export default {
        name: "reviews",
        data() {
            return {
                searchForm : {
                    cmonth : '',
                },
                pageInfo:{page:1,limit:50},
            }
        },
        mounted(){
            let d = new Date
            let year = d.getFullYear()
            let month = d.getMonth()+1
            if(Number(month) < 10){
                month = "0" + month
            }
            let date1 = year + "-" + month
            this.searchForm.cmonth = date1
            this.getData(this.searchForm);
        },
        methods:{
            getData(reqParams){
                console.log(reqParams);
                const fetch = service.pers.checkChstatistics.chstatisticsList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            seachTc(){
                this.getData(this.searchForm);
            },
            exportTc(){
                let params = this.searchForm;
                download($yid.config.API.BASE + '/api-pers/checkchstatistics/list/excel', params)
            },
        }
    }
</script>

<style scoped>

</style>
