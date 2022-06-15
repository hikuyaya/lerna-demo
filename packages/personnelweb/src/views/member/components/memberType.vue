<template>
    <div>
        <span>注：顾客总数量不等于新客，潜在会员，储值卡会员，资格卡会员，套餐会员简单相加。统计的是截至当天00:00的数据。</span>
        <yid-table  ref="table" style="margin-top: 8px; width: 100%;">
            <yid-table-column label="新客数" min-width="100" prop="nnum"></yid-table-column>
            <yid-table-column label="潜在会员数" min-width="100" prop="pnum"></yid-table-column>
            <yid-table-column label="储值卡会员数" min-width="100" prop="cnum"></yid-table-column>
            <yid-table-column label="资格卡会员数" min-width="100" prop="mnum"></yid-table-column>
            <yid-table-column label="套餐会员数" min-width="100" prop="pnum"></yid-table-column>
            <yid-table-column label="顾客总数量" min-width="100" prop="total"></yid-table-column>
        </yid-table>
    </div>
</template>

<script>
    import service from '@src/service'
    export default {
        name: "memberType",
        data(){
            return {
                searchForm :{
                    nowTime :"",
                },
                pageInfo:{page:1,limit:10},
            }

        },
        mounted(){
            let d = new Date
            let year = d.getFullYear()
            let month = d.getMonth()+1
            if(Number(month) < 10){
                month = "0" + month
            }
            let day = d.getDate()
            if(Number(day) < 10){
                day = "0" + day
            }
            this.searchForm.nowTime = year + "-" + month + "-" + day;
            this.getData(this.searchForm)
        },
        methods:{
            getData(reqParams){
                const fetch = service.member.tenantstatistics.memberStatistics
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
        }
    }
</script>

<style scoped>

</style>