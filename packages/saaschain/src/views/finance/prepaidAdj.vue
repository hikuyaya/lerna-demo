<template>
    <div class="dept">
        <el-tabs v-model="activeName" @tab-click="handleClick">

            <el-tab-pane label="银联通归属门店调整" name="position">
                <el-button @click="jobAlert(false,'')" type="primary">添加</el-button>

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
            </el-tab-pane>

        </el-tabs>

        <yid-dialog :title="jobDialog.title" :visible.sync="jobDialog.visible" width="450px">
            <el-form ref="prepaidAdjForm" :model="prepaidAdjForm"  label-width="140px">

                <el-form-item label="商户订单号：" prop="paymentNo" :rules="[{ required: true, message: '商户订单号为空'}]">
                    <el-input v-model="prepaidAdjForm.paymentNo"  @change="getprepaid"></el-input>
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

                <el-form-item>
                    <el-button @click="saveJob" type="primary">保存</el-button>
                    <el-button @click="jobCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

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

                type:'1',

                prepaidAdjForm:{
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
            this.getjobList();
        },

        mounted() {

            this.getjobList();
            this.getShopList();
        },
        methods: {


            getjobList(type){

                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.jobtable.Pagination.internalPageSize;
                const fetch = service.finance.prepaidAdj.jobList
                const params = this.pageInfo
                params.type = type

                this.$refs.jobtable.reloadData({
                    fetch,
                    params
                });
            },

            handleClick(tab, event) {
                this.getjobList();
            },

            getshopcode() {
                let adjshopPobj = {};
                let adjshopcode = this.prepaidAdjForm.adjShopcode;
                adjshopPobj = this.allShopList.find((shopp)=>{

                    return shopp.shopcode === adjshopcode;
                });
                this.prepaidAdjForm.adjShopid = adjshopPobj.shopid;
                this.prepaidAdjForm.adjShopname = adjshopPobj.shopname;

            },
            getprepaid(){
                if(this.prepaidAdjForm.paymentNo=='' && this.prepaidAdjForm.billcode==''){
                    return false;
                }
                service.cashier.prepaidorder.queryByno({paymentNo: this.prepaidAdjForm.paymentNo,
                    billcode:this.prepaidAdjForm.billcode,status:'1'}).then(res => {
                    if (res.resp_code == 200) {

                        if(res.data.length==0){
                            yid.util.info("未找到订单信息,请确认")
                        }
                        this.prepaidData = res.data[0];
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
            jobAlert(tag = false,row) {
                this.jobDialog.visible = true;
                this.jobDialog.title = tag? '编辑门店财务资料' : '添加门店财务资料';


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
                        this.prepaidAdjForm.shopid = shopPobj.shopid;
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
                            this.getjobList();
                        });
                        this.jobCancel();
                    }
                })

            },
            jobCancel() {
                this.jobDialog.visible = false;
            },

        }
    }
</script>

<style scoped>

</style>
