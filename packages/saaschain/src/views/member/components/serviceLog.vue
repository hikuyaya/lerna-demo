<template>
    <div>
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="消费日期：">
                <el-date-picker
                        :clearable = false
                        v-model="searchForm.createTimeRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="编辑时间：">
                <el-date-picker
                        size="mini"
                        v-model="searchForm.editDateRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="回访时间：">
                <el-date-picker
                        v-model="searchForm.returnTimeRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="门店：">
                    <el-select clearable v-model.trim="searchForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 180px;">
                        <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                            <span style="float: left">{{ item.shopcode }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                        </el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="服务人员：">
                <el-select clearable v-model="searchForm.craftsman" filterable placeholder="请选择">
                    <el-option
                    v-for="item in employeeList"
                    :key="item.id"
                    :label="item.eename"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日志状态：">
                <el-select clearable v-model="searchForm.status" filterable placeholder="请选择">
                    <el-option
                            v-for="item in status"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="回访状态：">
                <el-select clearable v-model="searchForm.returnStatus" filterable placeholder="请选择">
                    <el-option
                            v-for="item in returnStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
                <el-button @click="searchLog" type="primary">查询</el-button>
            </el-form-item>
        </el-form>
        <yid-table pagination ref="table" style="margin-top: -5px; width: 100%;">
            <yid-table-column label="姓名" min-width="100" prop="memname"></yid-table-column>
            <yid-table-column label="手机号" min-width="150" prop="mobile"></yid-table-column>
            <yid-table-column label="性别" min-width="70" prop="sex">
                <template slot-scope="scope">
                    {{scope.row.sex == '1' ? "男" : "女"}}
                </template>
            </yid-table-column>
            <yid-table-column label="门店" min-width="150" prop="shopname"></yid-table-column>
            <yid-table-column label="单号" min-width="150" prop="billcode"></yid-table-column>
            <yid-table-column label="消费时间" min-width="150" prop="saleTime"></yid-table-column>
            <yid-table-column label="项目" min-width="150" prop="sers"></yid-table-column>
            <yid-table-column label="服务人员" min-width="150" prop="craftsman"></yid-table-column>
            <yid-table-column label="日志状态" min-width="150" prop="status">
                <template slot-scope="scope">
                    {{scope.row.status == '2' ? "已填写" : "未填写"}}
                </template>
            </yid-table-column>
            <yid-table-column label="服务日志" min-width="150" prop="content"></yid-table-column>
            <yid-table-column label="图片1" min-width="150" prop="photopath1">
                <template  slot-scope="scope">
                    <img :src="scope.row.photopath1"  min-width="25" height="25" />
                </template>
            </yid-table-column>
            <yid-table-column label="图片2" min-width="150" prop="photopath1">
                <template  slot-scope="scope">
                    <img :src="scope.row.photopath2"  min-width="25" height="25" />
                </template>
            </yid-table-column>
        </yid-table>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    export default {
        name: "serviceLog",
        data() {
            return {
                value1: '',
                searchForm :{
                    createTimeRange :[],
                    editDateRange : '',
                    returnTimeRange : '',
                    shopcodename : '',
                    craftsman : '',
                    status : '',
                    returnStatus : '',
                    shopid:''
                },
                pageInfo:{page:1,limit:10},
                status: [{
                    value: '1',
                    label: '未填写'
                }, {
                    value: '2',
                    label: '已填写'
                }],
                returnStatus: [{
                    value: '1',
                    label: '待回访'
                }, {
                    value: '2',
                    label: '已取消'
                }, {
                    value: '3',
                    label: '已预约'
                }],
                employeeList : [],
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
            let day = d.getDate()
            if(Number(day) < 10){
                day = "0" + day
            }
            let date1 = year + "-" + month + "-" + day
            this.searchForm.createTimeRange.push(date1)
            this.searchForm.createTimeRange.unshift(date1)
            this.getCraftsmans();
            this.getShopList({status:"1"});
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let createTimeRange = this.searchForm.createTimeRange;
                if(createTimeRange){
                    reqObj.createdTimeStart = this.searchForm.createTimeRange[0];
                    reqObj.createdTimeEnd = this.searchForm.createTimeRange[1];
                }
                let editDateRange = this.searchForm.editDateRange;
                if(editDateRange != null){
                    reqObj.editDateStart = this.searchForm.editDateRange[0];
                    reqObj.editDateEnd = this.searchForm.editDateRange[1];
                }else{
                    reqObj.editDateStart = ''
                    reqObj.editDateEnd = ''
                }
                let returnTimeRange = this.searchForm.returnTimeRange;
                if(returnTimeRange != null){
                    reqObj.returnTimeStart = this.searchForm.returnTimeRange[0];
                    reqObj.returnTimeEnd = this.searchForm.returnTimeRange[1];
                }else{
                    reqObj.returnTimeStart = ''
                    reqObj.returnTimeEnd = ''
                }
                reqObj.shopcodename = this.searchForm.shopcodename
                reqObj.craftsman = this.searchForm.craftsman
                reqObj.status = this.searchForm.status
                reqObj.returnStatus = this.searchForm.returnStatus
                reqObj.shopid = this.searchForm.shopid
                return reqObj;
            }
        },
        methods:{
            //获取服务人员列表
            getCraftsmans(){
                service.employee.listAll({isDel:'0'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.employeeList = res.data;
                    }
                })
            },
            getData(reqParams){
                const fetch = service.member.servicerecords.listLogForChain
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            searchLog(){
                this.pageInfo.page=1
                this.getData(this.searchFormReq);
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
