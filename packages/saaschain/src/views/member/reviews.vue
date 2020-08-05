<template>
    <div class="member-review">
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="会员查询：">
                <el-input clearable v-model="searchForm.memcodename" placeholder="姓名/手机号"  style="width: 180px;"></el-input>
            </el-form-item>
            <el-form-item label="评价时间：">
                <el-date-picker
                        v-model="searchForm.saleTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="整体评价：">
                <el-select clearable  v-model="searchForm.rate" filterable placeholder="请选择">
                    <el-option
                            v-for="item in rateList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
                <el-button @click="seach" type="primary">查询</el-button>
                <el-button @click="exportComment" type="primary">导出</el-button>
            </el-form-item>
        </el-form>
        <yid-table pagination ref="table">
            <yid-table-column label="单号" min-width="100" prop="billcode"></yid-table-column>
            <yid-table-column label="消费时间" min-width="150" prop="saleTime"></yid-table-column>
            <yid-table-column label="姓名" min-width="70" prop="memname"></yid-table-column>
            <yid-table-column label="手机号" min-width="150" prop="mobile"></yid-table-column>
            <yid-table-column label="门店" min-width="150" prop="shopname"></yid-table-column>
            <yid-table-column label="消费项目" min-width="150" prop="sers"></yid-table-column>
            <yid-table-column label="服务员工" min-width="150" prop="craftsman"></yid-table-column>
            <yid-table-column label="点评对象" min-width="150" prop="eecode"></yid-table-column>
            <yid-table-column label="整体评价" min-width="150" prop="rate">
                <template slot-scope="scope">
                    {{getRateName(scope.row)}}
                </template>
            </yid-table-column>
            <yid-table-column label="评论内容" min-width="150" prop="comment"></yid-table-column>
            <yid-table-column label="评价时间" min-width="150" prop="commentTime"></yid-table-column>
            <yid-table-column label="是否已回复" min-width="150" prop="isReply">
                <template slot-scope="scope">
                    {{scope.row.sex == '1' ? "是" : "否"}}
                </template>
            </yid-table-column>
        </yid-table>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import {exportExecl} from "../../library/helper/execl";
    export default {
        name: "reviews",
        data() {
            return {
                searchForm : {
                    memcodename : '',
                    saleTime : [],
                    rate : '',
                },
                rateList : [{
                    value : '1',
                    label : '好评'
                },{
                    value : '2',
                    label : '中评'
                },{
                    value : '3',
                    label : '差评'
                }],
                pageInfo:{page:1,limit:10},
            }
        },
        mounted(){
            let d = new Date
            let year = d.getFullYear()
            let month = d.getMonth()+1
            let month1 = d.getMonth()-2
            if(Number(month) < 10){
                month = "0" + month
            }
            if(Number(month1) < 10){
                month1 = "0" + month1
            }
            let day = d.getDate()
            if(Number(day) < 10){
                day = "0" + day
            }
            let date1 = year + "-" + month + "-" + day
            let date2 = year + "-" + month1 + "-" + day
            this.searchForm.saleTime.push(date1)
            this.searchForm.saleTime.unshift(date2)
            this.getData(this.searchFormReq);
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let saleTime = this.searchForm.saleTime;
                if(saleTime != null){
                    reqObj.saleTimeStart = this.searchForm.saleTime[0];
                    reqObj.saleTimeEnd = this.searchForm.saleTime[1];
                }else{
                    reqObj.saleTimeStart = ''
                    reqObj.saleTimeEnd = ''
                }
                reqObj.memcodename = this.searchForm.memcodename
                reqObj.rate = this.searchForm.rate
                return reqObj;
            }
        },
        methods:{
            getData(reqParams){
                console.log(reqParams);
                const fetch = service.member.servicerecords.memServicelogList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getRateName(row){
                let result = '';
                for(let i = 0; i < this.rateList.length; i++){
                    let rateObj  = this.rateList[i];
                    let rate = row.rate;
                    if(rate != null){
                        if(rate == rateObj.value){
                            result = rateObj.label
                        }
                    }
                }
                return result;
            },
            seach(){
              this.getData(this.searchFormReq);
            },
            exportComment(){
                const head = {
                    billcode: '单号',
                    saleTime: '消费时间',
                    memname: '姓名',
                    mobile: '手机号',
                    shopname: '门店',
                    sers: '消费项目',
                    craftsman: '服务员工',
                    eecode: '点评对象',
                    rate: '整体评价',
                    comment: '评论内容',
                    commentTime: '评价时间',
                    isReply: '是否已回复',
                }
                service.member.servicerecords.memServicelogExport({...this.searchFormReq}).then(res => {
                    if(res.resp_code=="200"){
                        res.data.forEach(item =>{
                            if(item.rate == '1'){
                                item.rate = '好评'
                            }else if(item.rate == '2'){
                                item.rate = '中评'
                            }else if(item.rate == '3'){
                                item.rate = '差评'
                            }

                            if(item.isReply == '0'){
                                item.isReply = '否';
                            }else if(item.isReply == '1'){
                                item.isReply = '是';
                            }
                        });
                        exportExecl(head,res.data,"顾客评价记录");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
