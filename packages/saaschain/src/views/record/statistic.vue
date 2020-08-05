<template>
    <div class="member-relation">
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="日期：">
                <el-date-picker
                        :clearable = false
                        v-model="searchForm.payTimeRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
                <el-button @click="search" type="primary">查询</el-button>
                <el-button @click="seniorSearch" type="primary">高级查询</el-button>
            </el-form-item>
        </el-form>
        <el-alert v-model="viewTotal" :title="viewTotal.title"
                  type="info">
        </el-alert>
        <yid-table pagination ref="table" style="margin-top: 15px;">
            <yid-table-column label="支付类型" min-width="100" prop="payname"></yid-table-column>
            <yid-table-column label="交易号" min-width="150" prop="paymentNo"></yid-table-column>
            <yid-table-column label="金额" min-width="150" prop="money"></yid-table-column>
            <yid-table-column label="支付时间" min-width="150" prop="payTime"></yid-table-column>
            <yid-table-column label="消费单号" min-width="150" prop="saleBillcode"></yid-table-column>
            <yid-table-column label="备注" min-width="150" prop="memo"></yid-table-column>
            <yid-table-column label="状态" min-width="150" prop="status">
                <template slot-scope="scope">
                    {{getStatusName(scope.row.status)}}
                </template>
            </yid-table-column>
        </yid-table>

    </div>
</template>

<script>
    import service from '@src/service'
    export default {
        name: "member-relation",
        components: {

        },
        data() {
            return {
                value1: '',
                activeName : 'analyze',
                searchForm  : {
                    payTimeRange : [],
                },
                pageInfo:{page:1,limit:10},
                viewTotal : {
                    title : '本次查询共  0 条记录   总金额：￥0.00     支付宝:￥0 微信：￥0'
                },
                statusList : [{
                    id : 0,
                    name : '未支付'
                },{
                    id : 1,
                    name : '未使用完毕'
                },{
                    id : 2,
                    name : '已使用'
                }],
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
            let date1 = year + "-" + month + "-" + day
            this.searchForm.payTimeRange.push(date1)
            this.searchForm.payTimeRange.unshift(date1)
            this.search();
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let saleTimeRange = this.searchForm.payTimeRange;
                if(saleTimeRange){
                    reqObj.payTimeStart = this.searchForm.payTimeRange[0];
                    reqObj.payTimeEnd = this.searchForm.payTimeRange[1];
                }
                return reqObj;
            }
        },
        methods: {
            getData(reqParams){
                const fetch = service.cashier.turnover.turnoverList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
                //显示总条数和金额
                service.cashier.turnover.turnoverList(params).then(res=>{
                    if(res.resp_code == 200) {
                        let totalNum = res.count;
                        let totalMoney = 0;
                        let zfbMoney = 0;
                        let wxMoney = 0;
                        let date = res.data;
                        date.forEach(item=>{
                            let money = Number(item.money);
                            let paycode = item.paycode;
                            if(paycode == '02'){//支付宝
                                zfbMoney = zfbMoney + money;
                            }
                            if(paycode == '03'){//微信
                                wxMoney = wxMoney + money;
                            }
                            totalMoney = totalMoney + money;
                        })
                        this.viewTotal.title = '本次查询共'+ totalNum +'条记录   总金额：￥'+totalMoney+'     支付宝:￥'+zfbMoney+' 微信：￥'+wxMoney;
                    }
                });
            },
            search(){
                console.log(this.searchFormReq);
                this.pageInfo.page=1
                this.getData(this.searchFormReq);
            },
            getStatusName(key){
                for(let i = 0; i < this.statusList.length; i++){
                    let statusObj  = this.statusList[i]
                    if(statusObj.id == key){
                        return statusObj.name;
                    }
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .member-relation {

    }
</style>
