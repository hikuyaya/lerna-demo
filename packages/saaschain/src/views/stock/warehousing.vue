<template>
    <div class="stock-warehousing">
        <div class="stock-outStock">
            <el-collapse-transition>
                <div v-show="listShow">
                    <el-form :model="searchForm" inline ref="searchForm">
                        <el-form-item label="单据编码：" prop="billcode">
                            <el-input v-model="searchForm.billcode" clearable   style="width: 180px;"></el-input>
                        </el-form-item>
                        <el-form-item label="单据类型：" prop="btype">
                            <el-select v-model="searchForm.btype" clearable placeholder="请选择">
                                <el-option
                                        v-for="item in typeDictList"
                                        :key="item.id"
                                        :label="item.sdiname"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="单据状态：" prop="status">
                            <el-select v-model="searchForm.status" clearable placeholder="请选择">
                                <el-option
                                        v-for="item in states"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="创建时间：" prop="createTimeRange">
                            <div class="block">
                                <el-date-picker
                                        :clearable = false
                                        v-model="searchForm.createTimeRange"
                                        type="daterange"
                                        value-format="yyyy-MM-dd"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="审核时间：" prop="sTimeRange">
                            <div class="block">
                                <el-date-picker
                                        :clearable = false
                                        v-model="searchForm.sTimeRange"
                                        type="daterange"
                                        value-format="yyyy-MM-dd"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="门店：" prop="shopid">
                            <el-select clearable v-model="searchForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                                <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                    <span style="float: left">{{ item.shopcode }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="search" type="primary">查询</el-button>
                            <el-button @click="rest" type="primary">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <!--<el-row>-->
                        <!--<el-button type="primary" @click="showDialogCk">新增</el-button>-->
                    <!--</el-row>-->
                    <yid-table pagination ref="table"  style="margin-top: 15px;">
                        <yid-table-column label="单据编号" width="180" prop="billcode" ></yid-table-column>
                        <yid-table-column label="单据类型" min-width="80" prop="bname"></yid-table-column>
                        <yid-table-column label="入库数量" width="110" prop="count"></yid-table-column>
                        <yid-table-column label="入库金额" width="110" prop="money"></yid-table-column>
                        <yid-table-column label="单据状态" min-width="80" prop="status">
                            <template slot-scope="scope">
                                {{getStatusName(scope.row.status)}}
                            </template>
                        </yid-table-column>
                        <yid-table-column label="创建时间" min-width="100" prop="createdTime">
                            <template slot-scope="scope">
                                {{$yid.util.formatDate(scope.row.createdTime)}}
                            </template>
                        </yid-table-column>
                        <yid-table-column label="创建人"  prop="createdBy"></yid-table-column>
                        <yid-table-column label="审核时间" min-width="100" prop="stime">
                            <template slot-scope="scope">
                                {{$yid.util.formatDate(scope.row.stime)}}
                            </template>
                        </yid-table-column>
                        <yid-table-column label="审核人"  prop="sname"></yid-table-column>
                        <yid-table-column label="撤单时间" min-width="100" prop="ctime">
                            <template slot-scope="scope">
                                {{$yid.util.formatDate(scope.row.ctime)}}
                            </template>
                        </yid-table-column>
                        <yid-table-column label="撤单人"  prop="cname"></yid-table-column>
                        <yid-table-column label="备注"  prop="memo"></yid-table-column>
                        <yid-table-column label="操作" min-width="240"  fixed="right">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.status === '1'" type="text" @click="deleteAction(scope.row)">删除</el-button>
                                <el-button  type="text" @click="showStockCon(scope.row)">明细</el-button>
                                <!--<el-button  v-if="scope.row.status == '1'" type="text" @click="reject(scope.row)">驳回</el-button>-->
                                <el-button  v-if="scope.row.status == '1'" type="text" @click="audit(scope.row)">审核</el-button>
                                <el-button  v-if="scope.row.status == '2'" type="text" @click="revoke(scope.row)">撤单</el-button>
                            </template>
                        </yid-table-column>
                    </yid-table>
                </div>
            </el-collapse-transition>
            <el-collapse-transition>
                <div v-show="!listShow">
                    <warehousingCon ref="detailPage" @onClose="closeDetailPage"></warehousingCon>
                </div>
            </el-collapse-transition>
        </div>
    </div>
</template>
<script>
    import warehousingCon from "./warehousingCon"
    import service from '@src/service'

    export default {
        components: {
            warehousingCon
        },
        name: "warehousing",
        data: function () {
            return {
                listShow:true,
                searchForm: {
                    billcode:"",
                    btype: "",
                    status: "",
                    createTimeRange:"",
                    sTimeRange:"",
                    shopid:""
                },
                states: [{
                    value: '1',
                    label: '未审核'
                }, {
                    value: '2',
                    label: '已审核'
                }, {
                    value: '3',
                    label: '已撤单'
                },{
                    value: '4',
                    label: '已驳回'
                }],
                pageInfo:{page:0,limit:10,isDel:"0"},
                typeDictList:[], //单据类型
                detailInitData:{}, // 传入明细组件的初始值
                allShopList:[],
                filterShopList:[]
            }
        },

        mounted(){
                this.getData();
                this.getTypeDictList();
                this.getShopList({status:"0"});
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                reqObj.billcode = this.searchForm.billcode;
                reqObj.status =  this.searchForm.status;
                reqObj.btype = this.searchForm.btype;
                reqObj.shopid = this.searchForm.shopid;
                let createTimeRange = this.searchForm.createTimeRange;
                if(createTimeRange){
                    reqObj.sCreatedTimeStart = this.searchForm.createTimeRange[0];
                    reqObj.sCreatedTimeEnd = this.searchForm.createTimeRange[1];
                }
                let sTimeRange = this.searchForm.sTimeRange;
                if(sTimeRange){
                    reqObj.sSTimeStart = this.searchForm.sTimeRange[0];
                    reqObj.sSTimeEnd = this.searchForm.sTimeRange[1];
                }
                return reqObj;
            }
        },

        methods: {
            showStockCon(row){
                this.detailInitData.actionType = "edit";
                this.detailInitData.entryData = row;
                this.$refs.detailPage.initData(this.detailInitData);
                this.listShow = false;
            },
            showDialogCk(){

                this.detailInitData.actionType = "add";
                this.$refs.detailPage.initData(this.detailInitData);
                this.listShow = false;
            },
            closeDetailPage(){
                this.detailInitData = {};
                this.listShow = true;
                this.getData(this.searchFormReq);

            },
            getData(reqParams){
                const fetch = service.stock.entry.list
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getTypeDictList(){
                service.stock.dictInout.list({type:service.stock.dictInout.inType,isDel:"0"}).then(res=> {
                    if(res.resp_code == 200) {
                        this.typeDictList = res.data;
                    }
                })
            },
            search(){
                this.pageInfo.page=0
                this.getData(this.searchFormReq);
            },
            rest(){
                this.$refs["searchForm"].resetFields()
            },
            getStatusName(key){
                for(let i = 0; i < this.states.length; i++){
                    let statusObj  = this.states[i]
                    if(statusObj.value == key){
                        return statusObj.label
                    }
                }
                return "未知状态"
            },
            deleteAction(row){
                row.isDel = "1"
                service.stock.entry.save(row).then(res=> {
                    if(res.resp_code == 200) {
                        service.stock.entryProducts.batchDelete({seid:row.id}).then(res=>{
                            if(res.resp_code == 200){
                                this.getData(this.searchFormReq);
                            }
                        })
                    }
                })
            },
            audit(row){
                service.stock.entry.audit(row).then(res=> {
                    if(res.resp_code == 200) {
                        this.getData(this.searchFormReq);
                    }
                })
            },
            revoke(row){
                //撤单
                service.stock.entry.revoke(row).then(res=> {
                    if(res.resp_code == 200) {
                        this.getData(this.searchFormReq);
                    }
                })
            },
            reject(row){
                //驳回
                service.stock.entry.reject(row).then(res=> {
                    if(res.resp_code == 200) {
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
            }

        }

    }
</script>
<style scoped lang="scss">
    .rtrtr label{
        display: block;
        margin-bottom: 20px;
        height: 40px;
        padding: 12px 20px 0 10px;
    }
    .el-radio.is-bordered + .el-radio.is-bordered{
        margin-left: 0;
    }
    .rtrtr .el-radio{
        margin-right: 0;
    }

</style>
