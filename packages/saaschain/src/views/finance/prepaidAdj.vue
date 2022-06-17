<template>
    <div class="salaryRewardDetail">
        <el-collapse-transition>
            <div v-show="showList">
                <el-row>
                    <el-button @click="jobAlert(false,'')" type="primary">添加</el-button>
                </el-row>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form :model="searchForm" inline ref="searchForm">
                    <el-form-item label="原门店编码：" prop="shopcode">
                        <el-input v-model="searchForm.shopcode" clearable   style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="现门店编码：" prop="adjShopcode">
                        <el-input v-model="searchForm.adjShopcode" clearable   style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="交易时间：" prop="payTimeRange">
                        <div class="block">
                            <el-date-picker
                                    :clearable = false
                                    v-model="searchForm.payTimeRange"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                    </el-form-item>
                </el-form>

                <yid-table pagination ref="jobtable" :data="jobData" style="margin-top: 15px;" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="原交易门店编码" min-width="150" prop="shopcode"></yid-table-column>
                    <yid-table-column label="原交易门店名称" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column label="交易日期" min-width="100" prop="payTime"></yid-table-column>
                    <yid-table-column label="订单金额" min-width="150" prop="money"></yid-table-column>
                    <yid-table-column label="商户订单号" min-width="150" prop="paymentNo"></yid-table-column>
                    <yid-table-column label="系统订单号" min-width="150" prop="billcode"></yid-table-column>
                    <yid-table-column label="调整门店编码" min-width="200" prop="adjShopcode"></yid-table-column>
                    <yid-table-column label="调整门店名称" min-width="150" prop="adjShopname"></yid-table-column>
                    <yid-table-column label="调整时间" min-width="150" prop="updatedTime"></yid-table-column>
                    <yid-table-column label="操作" min-width="150" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="jobAlert(true,scope.row)">编辑</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>

        <el-collapse-transition>
            <div v-show="!showList">
                <el-button @click="back" type="primary">返回</el-button>
                <el-button @click="saveJob" type="primary">保存</el-button>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="prepaidAdjForm" :model="prepaidAdjForm" style="margin-top: 16px"
                         label-width="130px" label-position="right">
                    <el-row :gutter="20">
                        <el-col :span="8">
                <el-form-item label="商户订单号：" prop="paymentNo">
                   {{prepaidAdjForm.paymentNo}}
                </el-form-item>
                <el-form-item label="系统订单号：" prop="billcode" :rules="[{ required: true, message: '系统订单号为空'}]">
                    <el-input v-model="prepaidAdjForm.billcode"  @change="getprepaid"></el-input>

                </el-form-item>
                <el-form-item label="原门店编码：" prop="shopcode"  >
                    {{prepaidAdjForm.shopcode}}
                </el-form-item>
                <el-form-item label="原门店名称：" prop="shopname"  :disabled="true">
                    {{prepaidAdjForm.shopname}}
                </el-form-item>
                <el-form-item label="交易时间：" prop="payTime"  >
                    {{prepaidAdjForm.payTime}}
                </el-form-item>

                <el-form-item label="订单金额：" prop="money" >
                    {{prepaidAdjForm.money}}
                </el-form-item>
                <el-form-item label="调整门店编码：" prop="adjShopcode"  :rules="[{ required: true, message: '调整门店编码为空'}]">
                    <el-input v-model="prepaidAdjForm.adjShopcode" @change="getshopcode"></el-input>
                </el-form-item>
                <el-form-item label="调整门店名称：" prop="adjShopname"  >
                    {{prepaidAdjForm.adjShopname}}
                </el-form-item>
                        </el-col>
                    </el-row>
            </el-form>
            </div>
        </el-collapse-transition>

    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    export default {
        name: "dept",
        data() {
            return {
                activeName: 'position',
                showList: true,
                type:'1',
                searchForm: {
                    shopcode: "",
                    adjShopcode: "",
                    payTimeRange : [],
                },
                prepaidAdjForm:{
                    id:'',
                    billcode:'',
                    paymentNo :'',
                    orderinfo :'',
                    money : '',
                    payTime : '',
                    adjShopid : '',
                    adjShopcode : '',
                    adjShopname : '',
                    shopid : '',
                    shopcode : '',
                    shopname : '',
                    shoptype : '',
                    brandid : '',
                    brandcode : '',
                },
                pageInfo:{page:1,limit:10},
                maxCode:0,
                allShopList: [],
                prepaidData: [],
                jobData: [

                ],



                jobDialog: {
                    title: '',
                    visible: false,
                },

            }
        },
        created() {
          //  this.getjobList();
            this.getShopList();
        },

        mounted() {

            //this.getjobList();

        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                reqObj.shopcode = this.searchForm.shopcode;
                reqObj.adjShopcode =  this.searchForm.adjShopcode;
                let payTimeRange = this.searchForm.payTimeRange;
                if(payTimeRange){
                    reqObj.sPayTimeStart = this.searchForm.payTimeRange[0];
                    reqObj.sPayTimeEnd = this.searchForm.payTimeRange[1];
                }else{
                    reqObj.sPayTimeStart = ''
                    reqObj.sPayTimeEnd = ''
                }
                return reqObj;
            }
        },
        methods: {
            getData(reqParams) {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.jobtable.Pagination.internalPageSize;
                const fetch = service.finance.prepaidAdj.queryList
                const params = {...this.pageInfo, ...reqParams}
                params.isDel = "0"
                this.$refs.jobtable.reloadData({
                    fetch,
                    params,
                });
            },
            search(){
                this.pageInfo.page=0
                this.getData(this.searchFormReq);
            },
            rest(){
                this.$refs["searchForm"].resetFields()
            },

            getjobList(type){

                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.finance.prepaidAdj.jobList
                const params = this.pageInfo
                params.type = type

                this.$refs.jobtable.reloadData({
                    fetch,
                    params
                });
            },



            getshopcode() {
                let adjshopPobj = {};
                let adjshopcode = this.prepaidAdjForm.adjShopcode;
                adjshopPobj = this.allShopList.find((shopp)=>{

                    return shopp.shopcode === adjshopcode;
                });
                if(yid.util.isEmpty(adjshopPobj)){
                    yid.util.error("没有店号为"+adjshopcode+"的门店信息，请重新输入");
                    this.prepaidAdjForm.adjShopcode="";
                    return;
                }
                this.prepaidAdjForm.adjShopid = adjshopPobj.id;
                this.prepaidAdjForm.adjShopname = adjshopPobj.shopname;

            },
            getprepaid(){
                if(this.prepaidAdjForm.paymentNo=='' && this.prepaidAdjForm.billcode==''){
                    return false;
                }
                service.cashier.prepaidorder.queryByno({
                    billcode:this.prepaidAdjForm.billcode}).then(res => {
                    if (res.resp_code == 200) {
                        if(res.data==null){
                            yid.util.info("未找到订单信息,请确认")
                            return;
                        }
                        this.prepaidData = res.data;
                        this.prepaidAdjForm.billcode=  this.prepaidData.billcode;

                        this.prepaidAdjForm.paymentNo= this.prepaidData.paymentNo;
                        this.prepaidAdjForm.orderinfo = this.prepaidData.orderinfo;
                        this.prepaidAdjForm.money = this.prepaidData.money;
                        this.prepaidAdjForm.payTime =  this.prepaidData.payTime;
                        this.prepaidAdjForm.shopcode = this.prepaidData.shopcode;
                        let yshopPobj = {};
                        let yshopcode =this.prepaidAdjForm.shopcode
                        yshopPobj = this.allShopList.find((shopp)=>{
                            return shopp.shopcode === yshopcode;
                        });
                        this.prepaidAdjForm.shopname = yshopPobj.shopname;
                    }
                })
            },


            getShopList() {
                service.chain.shop.shopList({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.allShopList = res.data;

                    }
                })
            },
            jobAlert(tag,row) {
                this.showList = false;
                if(tag == false){
                    this.prepaidAdjForm.id = ''
                    this.prepaidAdjForm.billcode= '';
                    this.prepaidAdjForm.paymentNo='';
                    this.prepaidAdjForm.orderinfo ='';
                    this.prepaidAdjForm.money ='';
                    this.prepaidAdjForm.payTime = '';
                    this.prepaidAdjForm.adjShopid = '';
                    this.prepaidAdjForm.adjShopcode = '';
                    this.prepaidAdjForm.adjShopname = '';
                    this.prepaidAdjForm.shopid = '';
                    this.prepaidAdjForm.shopcode = '';
                    this.prepaidAdjForm.shopname = '';
                    this.prepaidAdjForm.shopType = '';
                    this.prepaidAdjForm.brandid = '';
                    this.prepaidAdjForm.brandcode = '';


                }else{

                    this.prepaidAdjForm.id = row.id;
                    this.prepaidAdjForm.billcode= row.billcode;
                    this.prepaidAdjForm.paymentNo=row.paymentNo;
                    this.prepaidAdjForm.orderinfo =row.orderinfo;
                    this.prepaidAdjForm.money =row.money;
                    this.prepaidAdjForm.payTime = row.payTime;
                    this.prepaidAdjForm.adjShopid = row.adjShopid;
                    this.prepaidAdjForm.adjShopcode = row.adjShopcode;
                    this.prepaidAdjForm.adjShopname = row.adjShopname;
                    this.prepaidAdjForm.shopid = row.shopid;
                    this.prepaidAdjForm.shopcode = row.shopcode;
                    this.prepaidAdjForm.shopname = row.shopname;


                }
            },
            saveJob(){
                this.$refs['prepaidAdjForm'].validate((valid) => {
                    if(valid){
                        let shopPobj = {};
                        let shopcode = this.prepaidAdjForm.shopcode;
                        shopPobj = this.allShopList.find((shopp)=>{

                            return shopp.shopcode === shopcode;
                        });
                        this.prepaidAdjForm.shopid = shopPobj.id;
                        this.prepaidAdjForm.shopname = shopPobj.shopname;
                        this.prepaidAdjForm.shopType = shopPobj.type;
                        this.prepaidAdjForm.brandId = shopPobj.brandId;
                        this.prepaidAdjForm.brandCode = shopPobj.brandCode;
                        this.prepaidAdjForm.brandName = shopPobj.brandName
                        service.finance.prepaidAdj.saveJob(this.prepaidAdjForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            this.back();
                            this.getData(this.searchFormReq);
                        });

                    }
                })

            },
            back() {
                this.$refs['prepaidAdjForm'].resetFields();
                this.showList = true;
            },

        }
    }
</script>

<style scoped>

</style>
