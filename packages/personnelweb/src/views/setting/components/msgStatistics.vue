<template>
    <div>
        <el-form ref="searchForm" inline :model="searchForm" :rules="searchRules" >
            <el-form-item label="门店：">
                <el-select clearable v-model.trim="searchForm.shopid" @clear="clearFormShop" @blur="clearFormShop" filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="日期模式:" prop="searchDateType">
                <el-select clearable v-model.trim="searchForm.searchDateType" placeholder="时间" style="width: 160px;" @change="changeSearchDateType">
                    <el-option :key="item.value" :label="item.name" :value="item.value" v-for="item in dateTypeList">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="searchForm.searchDateType== 'm'" prop="month">
                <el-date-picker
                        v-model="searchForm.month"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-if="searchForm.searchDateType== 'd'" prop="day">
                <el-date-picker
                        v-model="searchForm.day"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
                <el-button @click="search" type="primary">查询</el-button>
            </el-form-item>
        </el-form>
        <yid-table pagination ref="table">
            <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
            <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
            <yid-table-column label="时间" min-width="100" prop="updatedTime"></yid-table-column>
            <yid-table-column label="验证码短信" min-width="100" prop="verifyNum"></yid-table-column>
            <yid-table-column label="群发短信" min-width="100" prop="groupNum"></yid-table-column>
            <yid-table-column label="服务回访" min-width="100" prop="serviceNum"></yid-table-column>
            <yid-table-column label="生日短信" min-width="100" prop="brithdayNum"></yid-table-column>
            <yid-table-column label="短信充值" min-width="100" prop="rechargeNum"></yid-table-column>
            <yid-table-column label="短信分配" min-width="100" prop="assignNum"></yid-table-column>
            <yid-table-column label="剩余短信" min-width="100" prop="shopname"></yid-table-column>
        </yid-table>
    </div>
</template>

<script>
    import service from '@src/service'
    export default {
        name: "msgStatistics",
        data(){
            return {
                allShopList:[],
                filterShopList:[],
                pageInfo:{page:1,limit:10},
                dateTypeList:[{value:"m",name:"按月查"},{value:"d",name:"按日查"}],
                searchForm:{
                    shopid:"",
                    month:"",
                    day:"",
                    searchDateType:"",
                },
                searchRules: {
                    searchDateType:[ { required: true, message: '请选择查询日期模式', trigger: 'blur' },],
                    month:[ { required: true, message: '请选择查询月', trigger: 'blur' },],
                    day:[ { required: true, message: '请选择查询日', trigger: 'blur' },],
                }
            }
        },
        mounted() {
            this.getShopList({status: "1"});
        },
        methods:{
            search(){
                this.$refs["searchForm"].validate((valid) => {
                    if (valid) {
                        this.pageInfo = {page:1,limit:10};
                        this.getStatisticsList(this.searchForm)
                    } else {
                        return false;
                    }
                });


            },
            getStatisticsList(reqParams){
                let fetch = reqParams.searchDateType == "m" ? service.push.smsMstatis.listChain : service.push.smsDstatis.listChain;
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
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
            },
            clearFormShop(){
                setTimeout(() =>{
                    if(this.searchForm.shopid == ''){
                        this.searchForm.shopid = "";
                        this.filterShopList = Object.assign(this.allShopList);
                    }

                },300)
            },
        }
    }
</script>

<style scoped>

</style>