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
            <!--<el-form-item label="审核时间：">
                <el-date-picker
                        size="mini"
                        v-model="searchForm.auditTimeRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>-->
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
            <el-form-item label="门店：" prop="shopid" :rules="[{ required: true, message: '请选择一个门店'}]">
                    <el-select v-model.trim="searchForm.shopid" @change="getCraftsmans(searchForm.shopid)" filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 180px;">
                        <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                            <span style="float: left">{{ item.shopcode }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                        </el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="服务人员：">
                <!--<el-input v-model="searchForm.feeid"  style="width: 180px;"></el-input>-->
                <el-select clearable v-model="searchForm.feeid" filterable placeholder="请选择">
                    <el-option
                            v-for="item in employeeList"
                            :key="item.id"
                            :label="item.eename"
                            :value="item.id">
                    </el-option>
                    <el-option key="-1" label="公单" value="-1"></el-option>
                </el-select>
            </el-form-item>
            <!--<el-form-item label="日志状态：">
                <el-select clearable v-model="searchForm.status" filterable placeholder="请选择">
                    <el-option
                            v-for="item in status"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>-->
            <el-form-item label="发送回访信息状态：">
                <el-select clearable v-model="searchForm.sendStatus" filterable placeholder="请选择">
                    <el-option
                            v-for="item in sendStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="短信状态：">
                <el-select clearable v-model="searchForm.smsStatus" filterable placeholder="请选择">
                    <el-option
                            v-for="item in smsStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="反预约状态：">
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
            <yid-table-column label="姓名/昵称" min-width="100" prop="memname"></yid-table-column>
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
            <yid-table-column label="服务人员" min-width="150" prop="feeid">
                <template slot-scope="scope">
                    <span v-if='scope.row.feeid==-1'>公单</span>
                    <span v-if='scope.row.feeid!=-1'>{{getEename(scope.row.feeid)}}</span>
                </template>
            </yid-table-column>
            <yid-table-column label="编辑时间" min-width="200" prop="editDate"></yid-table-column>
            <!--<yid-table-column label="日志状态" min-width="150" prop="status">
                <template slot-scope="scope">
                    {{scope.row.status == '2' ? "已填写" : "未填写"}}
                </template>
            </yid-table-column>-->
            <yid-table-column label="是否发送回访信息" min-width="150" prop="sendStatus">
                <template slot-scope="scope">
                    <span v-if='scope.row.sendStatus==0'>未发送</span>
                    <span v-if='scope.row.sendStatus==1'>已发送</span>
                </template>
            </yid-table-column>
            <yid-table-column label="短信状态" min-width="150" prop="smsStatus">
                <template slot-scope="scope">
                    <span v-if='scope.row.smsStatus==1'>状态成功</span>
                    <span v-if='scope.row.smsStatus==2'>状态失败</span>
                </template>
            </yid-table-column>
            <yid-table-column label="短信内容" min-width="150" prop="content"></yid-table-column>
            <yid-table-column label="铺垫项目" min-width="150" prop="pdsers">
                <template  slot-scope="scope">
                    {{scope.row.pdsers}}&nbsp;&nbsp;{{scope.row.pdqtservs}}
                </template>
            </yid-table-column>
            <yid-table-column label="问题分析" min-width="150" prop="content1"></yid-table-column>
            <!--<yid-table-column label="图片1" min-width="150" prop="photopath1">
                <template  slot-scope="scope">
                    <img :src="scope.row.photopath1"  min-width="25" height="25" />
                </template>
            </yid-table-column>
            <yid-table-column label="图片2" min-width="150" prop="photopath2">
                <template  slot-scope="scope">
                    <img :src="scope.row.photopath2"  min-width="25" height="25" />
                </template>
            </yid-table-column>
            <yid-table-column label="图片3" min-width="150" prop="photopath3">
                <template  slot-scope="scope">
                    <img :src="scope.row.photopath3"  min-width="25" height="25" />
                </template>
            </yid-table-column>-->
            <!--<yid-table-column label="回访时间" min-width="200" prop="returnTime"></yid-table-column>
            <yid-table-column label="回访状态" min-width="150" prop="returnStatus">
                <template slot-scope="scope">
                    <span v-if='scope.row.returnStatus==1'>待回访</span>
                    <span v-if='scope.row.returnStatus==2'>已取消</span>
                    <span v-if='scope.row.returnStatus==3'>已预约</span>
                </template>
            </yid-table-column>-->
            <yid-table-column label="反预约时间" min-width="200" prop="returnTime"></yid-table-column>
            <yid-table-column label="反预约状态" min-width="150" prop="returnStatus">
                <template slot-scope="scope">
                    <span v-if='scope.row.returnStatus==1'>待回访</span>
                    <span v-if='scope.row.returnStatus==2'>已取消</span>
                    <span v-if='scope.row.returnStatus==3'>已预约</span>
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
                    //auditTimeRange : '',
                    shopcodename : '',
                    feeid : '',
                    //status : '',
                    returnStatus : '',
                    sendStatus : '',
                    smsStatus : '',
                    shopid:''
                },
                pageInfo:{page:1,limit:10},
                status: [{
                    value: '1',
                    label: '未填写'
                }, {
                    value: '2',
                    label: '待审核'
                }, {
                    value: '3',
                    label: '已审核'
                }, {
                    value: '4',
                    label: '已驳回'
                }],
                sendStatus:[{
                    value: '0',
                    label: '未发送'
                }, {
                    value: '1',
                    label: '已发送'
                }],
                smsStatus:[{
                    value: '1',
                    label: '状态成功'
                }, {
                    value: '2',
                    label: '状态失败'
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
            //this.getCraftsmans();
            this.getShopList({status:"1"});
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let createTimeRange = this.searchForm.createTimeRange;
                if(createTimeRange){
                    reqObj.createdTimeStart = this.searchForm.createTimeRange[0];
                    reqObj.createdTimeEnd = this.searchForm.createTimeRange[1];
                }else{
                    reqObj.createdTimeStart = '';
                    reqObj.createdTimeEnd = '';
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
               /* let auditTimeRange = this.searchForm.auditTimeRange;
                if(auditTimeRange != null){
                    reqObj.auditTimeStart = this.searchForm.auditTimeRange[0];
                    reqObj.auditTimeEnd = this.searchForm.auditTimeRange[1];
                }else{
                    reqObj.auditTimeStart = ''
                    reqObj.auditTimeEnd = ''
                }*/
                reqObj.shopcodename = this.searchForm.shopcodename
                reqObj.feeid = this.searchForm.feeid
                //reqObj.status = this.searchForm.status
                reqObj.returnStatus = this.searchForm.returnStatus
                reqObj.shopid = this.searchForm.shopid
                reqObj.sendStatus = this.searchForm.sendStatus
                reqObj.smsStatus = this.searchForm.smsStatus
                return reqObj;
            }
        },
        methods:{
            //获取服务人员列表
            getCraftsmans(){
                this.employeeList = [];
                service.employee.listAll({isDel:'0',shopid:this.searchForm.shopid}).then(res=> {
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
                this.$refs['searchForm'].validate((valid) => {
                    if (valid) {
                        this.pageInfo.page=1
                        this.getData(this.searchFormReq);
                    }
                })
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
            getEename(eeid){
                let eename =  "";
                this.employeeList.forEach(e=>{
                    if(Number(eeid) === Number(e.id)){
                        eename = e.eename;
                    }
                })
                return eename;
            }
        }
    }
</script>

<style scoped>

</style>
