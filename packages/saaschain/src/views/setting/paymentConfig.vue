<template>
    <div class="dept">
        <el-tabs v-model="activeName">
            <el-tab-pane label="项目" name="1">
                <el-row style="margin-top: 10px;">
                    <el-col :span="2">
                      <el-button type="primary" @click="save()">保存</el-button>
                    </el-col>
                    <el-col :span="22">注：结算允许的支付方式可勾选开启，设置为常用将展示在收银结账常用支付方式下。
                        其他支付方式可以在“混合支付”选用。拖动排序
                    </el-col>
                </el-row>
                <el-table ref="serviceTable" border :data="paymentData" style="margin-top: 10px;"  class="class1">
                    <el-table-column label="可用支付方式" prop="enable" min-width="150">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.enable">可用</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="设置为常用" prop="isOften" min-width="150">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.isOften">常用</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="支付方式名称" prop="payname" min-width="150"></el-table-column>
                    <el-table-column label="支付类型" prop="ptname" min-width="150"></el-table-column>
                    <el-table-column label="业绩比率%" prop="yjRate" min-width="150"></el-table-column>
                    <el-table-column label="类型下业绩比率%" prop="xyjRate" min-width="150">
                        <template slot-scope="scope">
                            <div v-if="scope.row.isOften || scope.row.enable">
                                <el-input type="number" min="0" max="100" v-model="scope.row.xyjRate"/></div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="商品" name="2">
                    <el-row style="margin-top: 10px;">
                        <el-col :span="2">
                            <el-button type="primary" @click="save()">保存</el-button>
                        </el-col>
                        <el-col :span="22">注：结算允许的支付方式可勾选开启，设置为常用将展示在收银结账常用支付方式下。
                            其他支付方式可以在“混合支付”选用。拖动排序
                        </el-col>
                    </el-row>
                    <el-table ref="goodTable" border :data="paymentData" style="margin-top: 10px;" class="class2">
                        <el-table-column label="可用支付方式" prop="enable" min-width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.enable">可用</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="设置为常用" prop="isOften" min-width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.isOften">常用</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付方式名称" prop="payname" min-width="150"></el-table-column>
                        <el-table-column label="支付类型" prop="ptname" min-width="150"></el-table-column>
                        <el-table-column label="业绩比率%" prop="yjRate" min-width="150"></el-table-column>
                        <el-table-column label="类型下业绩比率%" prop="xyjRate" min-width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isOften || scope.row.enable">
                                    <el-input type="number" min="0" max="100" v-model="scope.row.xyjRate"/></div>
                            </template>
                        </el-table-column>
                    </el-table>
            </el-tab-pane>
            <el-tab-pane label="开卡" name="3">
                    <el-row style="margin-top: 10px;">
                        <el-col :span="2">
                            <el-button type="primary" @click="save()">保存</el-button>
                        </el-col>
                        <el-col :span="22">注：结算允许的支付方式可勾选开启，设置为常用将展示在收银结账常用支付方式下。
                            其他支付方式可以在“混合支付”选用。拖动排序
                        </el-col>
                    </el-row>
                    <el-table ref="openCardTable" border :data="paymentData" style="margin-top: 10px;" class="class3">
                        <el-table-column label="可用支付方式" prop="enable" min-width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.enable">可用</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="设置为常用" prop="isOften" min-width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.isOften">常用</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付方式名称" prop="payname" min-width="150"></el-table-column>
                        <el-table-column label="支付类型" prop="ptname" min-width="150"></el-table-column>
                        <el-table-column label="业绩比率%" prop="yjRate" min-width="150"></el-table-column>
                        <el-table-column label="类型下业绩比率%" prop="xyjRate" min-width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isOften || scope.row.enable">
                                    <el-input type="number" min="0" max="100" v-model="scope.row.xyjRate"/></div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            <el-tab-pane label="充值/续卡" name="4">
                    <el-row style="margin-top: 10px;">
                        <el-col :span="2">
                            <el-button type="primary" @click="save()">保存</el-button>
                        </el-col>
                        <el-col :span="22">注：结算允许的支付方式可勾选开启，设置为常用将展示在收银结账常用支付方式下。
                            其他支付方式可以在“混合支付”选用。拖动排序
                        </el-col>
                    </el-row>
                    <el-table ref="recardTable" border :data="paymentData" style="margin-top: 10px;" class="class4">
                        <el-table-column label="可用支付方式" prop="enable" min-width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.enable">可用</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="设置为常用" prop="isOften" min-width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.isOften">常用</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付方式名称" prop="payname" min-width="150"></el-table-column>
                        <el-table-column label="支付类型" prop="ptname" min-width="150"></el-table-column>
                        <el-table-column label="业绩比率%" prop="yjRate" min-width="150"></el-table-column>
                        <el-table-column label="类型下业绩比率%" prop="xyjRate" min-width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isOften || scope.row.enable">
                                    <el-input type="number" min="0" max="100" v-model="scope.row.xyjRate"/></div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            <el-tab-pane label="购买套餐" name="5">
                    <el-row style="margin-top: 10px;">
                        <el-col :span="2">
                            <el-button type="primary" @click="save()">保存</el-button>
                        </el-col>
                        <el-col :span="22">注：结算允许的支付方式可勾选开启，设置为常用将展示在收银结账常用支付方式下。
                            其他支付方式可以在“混合支付”选用。拖动排序
                        </el-col>
                    </el-row>
                    <el-table ref="packageTable" border :data="paymentData" style="margin-top: 10px;" class="class5">
                        <el-table-column label="可用支付方式" prop="enable" min-width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.enable">可用</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="设置为常用" prop="isOften" min-width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.isOften">常用</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付方式名称" prop="payname" min-width="150"></el-table-column>
                        <el-table-column label="支付类型" prop="ptname" min-width="150"></el-table-column>
                        <el-table-column label="业绩比率%" prop="yjRate" min-width="150"></el-table-column>
                        <el-table-column label="类型下业绩比率%" prop="xyjRate" min-width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isOften || scope.row.enable">
                                    <el-input type="number" min="0" max="100" v-model="scope.row.xyjRate"/></div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            <el-tab-pane label="预收款" name="6 ">
                    <el-row style="margin-top: 10px;">
                        <el-col :span="2">
                            <el-button type="primary" @click="save()">保存</el-button>
                        </el-col>
                        <el-col :span="22">注：结算允许的支付方式可勾选开启，设置为常用将展示在收银结账常用支付方式下。
                            其他支付方式可以在“混合支付”选用。拖动排序
                        </el-col>
                    </el-row>
                    <el-table ref="advanTable" border :data="paymentData" style="margin-top: 10px;" class="class6">
                        <el-table-column label="可用支付方式" prop="enable" min-width="150">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.enable">可用</el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付方式名称" prop="payname" min-width="150"></el-table-column>
                        <el-table-column label="支付类型" prop="ptname" min-width="150"></el-table-column>
                    </el-table>
                </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

    import Sortable from 'sortablejs'
    import service from '@src/service'

    function isRepeat(arr) {
        var hash = {};
        for(var i in arr) {
            if(hash[arr[i]]) {
                return true;
            }
            hash[arr[i]] = true;
        }
        return false;
    }

    export default {
        name: "paymentConfig",
        data(){
            return {
                activeName: '1',
                payData: [], //平台+门店
                paymentData: [], //业务单据
            }
        },
        methods:{
            rowDrop () {//行拖拽
                const tbody = document.querySelector('.class'+this.activeName+' tbody');
                const _this = this;
                Sortable.create(tbody, {
                    draggable: ".el-table__row",
                    onEnd ({ newIndex, oldIndex }) {
                        const currRow = _this.paymentData.splice(oldIndex, 1)[0];
                        _this.paymentData.splice(newIndex, 0, currRow);
                        const params={
                            type:_this.activeName,
                            payments:[]
                        }
                        _this.paymentData.forEach((pay,index) =>{
                            params.payments.push({
                                id:pay.id,
                                num:index+1,
                                revision:pay.revision
                            })
                        })
                        service.payment.savePayments(params).then(res =>{
                            if(res.resp_code=="200"){
                                _this.getPaymentConfig()
                                $yid.util.success(res.resp_msg);
                            }else{
                                $yid.util.error(res.resp_msg);
                            }
                        })
                    }
                });
            },
            getPayConfig(){
                service.payment.getPayinfo({enable:'1'}).then(res =>{
                    this.payData=res.data;
                    this.getPaymentConfig();
                })
            },
            getPaymentConfig(){
                const that=this;
                this.paymentData=[];
                service.payment.getPayments({type:this.activeName,status:'1'}).then(res =>{
                    if(res.resp_code=="200"){
                        res.data.forEach(each =>{
                            each.isOften=each.isOften=='1'?true:false
                            each.enable=each.enable=='1'?true:false
                            that.paymentData.push({...each});
                        })
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            save(){
                let flag=false;
                this.paymentData.forEach((pay,index) =>{
                    pay.num=index+1
                    if(pay.yjRate && pay.xyjRate < 0){
                        $yid.util.error(pay.payname+"类型下业绩比率不能小于0");
                        flag=true;
                    }
                    if(pay.yjRate && pay.xyjRate > 100){
                        $yid.util.error(pay.payname+"类型下业绩比率不能天于100");
                        flag=true;
                    }
//                    if(pay.yjRate && pay.xyjRate > pay.yjRate){
//                        $yid.util.error(pay.payname+"类型下业绩比率不能大于业绩比率");
//                        flag=true;
//                    }
                })
                if(flag){
                    return
                }
                const params={
                    type:this.activeName,
                    payments:this.paymentData
                }
                params.payments.forEach(pay =>{
                    if(pay.isOften){
                        pay.isOften='1'
                    }else{
                        pay.isOften='0'
                    }
                    if(pay.enable){
                        pay.enable='1'
                    }else{
                        pay.enable='0'
                    }
                    if(!pay.isOften && !pay.enable){
                        pay.xyjRate=0
                    }
                })
                service.payment.savePayTemplates(params).then(res =>{
                    this.result(res)
                })
            },
            result(res){
                if(res.resp_code=="200"){
                    this.getPaymentConfig()
                    $yid.util.success(res.resp_msg);
                }else{
                    $yid.util.error(res.resp_msg);
                }
            }
        },
        mounted(){
            this.rowDrop('1')
            this.getPayConfig()
        },
        watch: {
            activeName() {
                this.rowDrop();
                this.getPaymentConfig()
            }
        }
    }
</script>

<style scoped>

</style>