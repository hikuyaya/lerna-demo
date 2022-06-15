<template>
    <div class="check_chstatistics">
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="门店：" prop="shopid"  :rules="[{ required: true, message: '请选择一个门店'}]">
                <el-select @clear="clearFormShopList" clearable v-model.trim="searchForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
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
                    shopid:'',
                    cmonth : '',
                },
                pageInfo:{page:1,limit:50},
                allShopList:[],
                filterShopList:[]
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
        created()
        {
            this.getShopList({status:"1"});
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
                this.getShopList({status:"1"});
            },
            seachTc(){
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        this.getData(this.searchForm);
                    }
                })

            },
            clearFormShopList(){
                this.searchForm.shopid = null
                this.filterShopList =  this.allShopList
            },
            exportTc(){
                let params = this.searchForm;
                download($yid.config.API.BASE + 'api-pers/checkchstatistics/list/excel', params)
            },
            getShopList(params){
                service.chain.shop.shopList(params).then(res=> {
                    if(res.resp_code == 200) {
                        console.log("xxxxxxxxxxxxx", res.data)
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
