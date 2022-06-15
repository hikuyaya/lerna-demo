<template>
    <div>
        <el-collapse-transition>
            <div>
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="员工：" prop="eename">
                        <el-input  v-model="searchForm.eename" placeholder="姓名或工号" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间：" prop="createTimeRange">
                        <el-date-picker  style="width: 300px;"
                                :clearable = true
                                v-model="searchForm.createTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="submitForm" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                    </el-form-item>
                </el-form>

                <yid-table  ref="table" pagination style="width: 100%;margin-top: 20px;">
                    <yid-table-column
                            prop="eecode"
                            label="员工编号"
                            width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="eename"
                            label="姓名"
                            width="150">
                    </yid-table-column>
                    <yid-table-column
                            label="性别"
                            width="80">
                        <template slot-scope="scope">
                            {{scope.row.sex == '1' ? "男" : "女"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column
                            prop="mobile"
                            label="手机号"
                            width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="originalShopcode"
                            label="调出机构/门店"
                            width="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.otype=='1'">{{"("+scope.row.originalShopcode+")"+scope.row.originalShopname}}</div>
                            <div v-if="scope.row.otype=='2'">{{"("+scope.row.originalRegionCode+")"+scope.row.originalRegionName}}</div>
                        </template>
                    </yid-table-column>
                    <yid-table-column
                            prop="currentShopcode"
                            label="调入机构/门店" width="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.ctype=='1'">{{"("+scope.row.currentShopcode+")"+scope.row.currentShopname}}</div>
                            <div v-if="scope.row.ctype=='2'">{{"("+scope.row.currentRegionCode+")"+scope.row.currentRegionName}}</div>
                        </template>
                    </yid-table-column>
                    <yid-table-column
                            prop="originalBname"
                            label="原业务组" width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="originalPsname"
                            label="原职务" width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="originalPslname"
                            label="原级别" width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="currentBname"
                            label="现业务组" width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="currentPsname"
                            label="现职务" width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop="currentPslname"
                            label="现级别" width="120">
                    </yid-table-column>
                    <yid-table-column
                            prop = "createdTime"
                            label="调动时间" width="130">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.createdTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column
                            prop = "oper"
                            label="操作人" width="90">
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>

    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import download from '@src/library/http/download'
    import {isEmpty} from "../../library/helper/validate";

    export default {
        name: "profilelog",
        data(){
            return {
                pageInfo:{page:0,limit:10},

                searchForm:{
                    eename: null,
                    createTimeRange:"",
                },
            }
        },
        mounted(){

        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                reqObj.eename = this.searchForm.eename;
                let createTimeRange = this.searchForm.createTimeRange;
                if(createTimeRange){
                    reqObj.sCreatedTimeStart = this.searchForm.createTimeRange[0]+" 00:00:00";
                    reqObj.sCreatedTimeEnd = this.searchForm.createTimeRange[1]+" 23:59:59";
                }else{
                    reqObj.sCreatedTimeStart = '';
                    reqObj.sCreatedTimeEnd = '';
                }
                return reqObj;
            }
        },
        methods:{
            submitForm(){
                if(isEmpty(this.searchFormReq.eename) && isEmpty(this.searchFormReq.sCreatedTimeStart) && isEmpty(this.searchFormReq.sCreatedTimeEnd)){
                    yid.util.error('请至少输入一个条件');
                    return
                }
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.employeelog.list
                const params = {...this.pageInfo,...this.searchFormReq}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            rest(){
                this.$refs["searchForm"].resetFields()
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
