<template>
    <div>
        <!--会员卡消费明细-->
        <el-row v-if="activetab=='first'">
            <el-form ref="record" label-width="100px" label-position="right">
                选择会员卡：
                <el-select clearable filterable placeholder="请选择" style="width: 300px;" v-model.trim="formCard.cardid" @change="changeCardinfo">
                    <el-option v-for="(card, cardindex) in cardLists" :key="card.cardid" :value="card.cardid" :label="card.cardno + ' ' +card.cardname"></el-option>
                </el-select>
            </el-form>
            <el-row :gutter="10">
                <el-col :span="8">
                    <div style="padding:15px 0 17px 0">卡金批次明细：</div>
                    <yid-table :data="cardsye" height="300">
                        <yid-table-column label="门店编码" min-width="70" prop="shopcode"></yid-table-column>
                        <yid-table-column label="门店名称" min-width="120" prop="shopname"></yid-table-column>
                        <yid-table-column label="卡金余额" min-width="70" prop="money"></yid-table-column>
                        <yid-table-column label="赠送金余额" min-width="90" prop="zmoney"></yid-table-column>
                    </yid-table>
                </el-col>
                <el-col :span="16">
                    <div style="padding:15px 0 10px 0">
                        <label>充值赠送记录：</label>
                        <el-date-picker
                                v-model="formCard.date"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" style="width:300px; margin-right: 15px">
                        </el-date-picker>
                        <el-button @click="searchRechages" type="primary">查询</el-button>
                    </div>
                    <yid-table :data="rechanges" height="300">
                        <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
                        <yid-table-column label="门店名称" min-width="120" prop="shopname"></yid-table-column>
                        <yid-table-column label="充值单号" min-width="120" prop="billcode"></yid-table-column>
                        <yid-table-column label="充值时间" min-width="120" prop="updatedTime"></yid-table-column>
                        <yid-table-column label="充值金额" min-width="70" prop="money"></yid-table-column>
                        <yid-table-column label="赠送金额" min-width="70" prop="gmoney"></yid-table-column>
                        <yid-table-column label="赠送项目" prop="zinfo"></yid-table-column>
                    </yid-table>
                </el-col>
            </el-row>
        </el-row>
        <!--套餐记录-->
        <el-row v-if="activetab=='second'">
            <el-row>
                <label>购买时间：</label>
                <el-date-picker
                        v-model="formCard.date"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" style="width:300px; margin-right: 15px">
                </el-date-picker>
                <label style="margin-left: 20px">购买门店：</label>
                <el-select clearable filterable placeholder="请选择" style="width: 150px;" v-model.trim="formCard.shopcode" @change="changCard">
                    <el-option v-for="shop in shopLists" :key="shop.shopcode" :value="shop.shopcode" :label="shop.shopname"></el-option>
                </el-select>
                <label style="margin-left: 20px">查看余量：</label>
                <el-select clearable filterable placeholder="请选择" style="width: 150px;" v-model.trim="formCard.lessNum" @change="changCard">
                    <el-option v-for="less in lessType" :key="less.id" :value="less.id" :label="less.value"></el-option>
                </el-select>
                <el-button style="margin-left: 20px" @click="searchPackages" type="primary">查询</el-button>
            </el-row>
            <yid-table :data="packages" pagination style="margin-top: 20px; min-height: 443px">
                <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
                <yid-table-column label="门店名称" min-width="120" prop="shopname"></yid-table-column>
                <yid-table-column label="购买时间" min-width="120" prop="buytime"></yid-table-column>
                <yid-table-column label="订单号" min-width="120" prop="billcode"></yid-table-column>
                <yid-table-column label="类型" min-width="70" prop="type"></yid-table-column>
                <yid-table-column label="套餐名称" min-width="90" prop="packageinfoname"></yid-table-column>
                <yid-table-column label="项目/产品名称"  prop="servname"></yid-table-column>
                <yid-table-column label="总数量" min-width="60" prop="total"></yid-table-column>
                <yid-table-column label="剩余数量" min-width="60" prop="snum"></yid-table-column>
                <yid-table-column label="到期日期" min-width="100" prop="expiryTime">
                    <template slot-scope="scope">
                        {{$yid.util.formatTime(scope.row.expiryTime)}}
                    </template>
                </yid-table-column>
            </yid-table>
        </el-row>
        <!--寄存记录-->
        <el-row v-if="activetab=='third'">
            <el-row>
                <label>购买时间：</label>
                <el-date-picker
                        v-model="formCard.date"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" style="width:300px; margin-right: 15px">
                </el-date-picker>
                <label style="margin-left: 20px">购买门店：</label>
                <el-select clearable filterable placeholder="请选择" style="width: 150px;" v-model.trim="formCard.shopcode" @change="changCard">
                    <el-option v-for="shop in shopLists" :key="shop.shopcode" :value="shop.shopcode" :label="shop.shopname"></el-option>
                </el-select>
                <label style="margin-left: 20px">查看余量：</label>
                <el-select clearable filterable placeholder="请选择" style="width: 150px;" v-model.trim="formCard.lessNum" @change="changCard">
                    <el-option v-for="less in lessType" :key="less.id" :value="less.id" :label="less.value"></el-option>
                </el-select>
                <el-button style="margin-left: 20px" @click="searchPicks" type="primary">查询</el-button>
            </el-row>
            <yid-table :data="picks" pagination style="margin-top: 20px; min-height: 443px">
                <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
                <yid-table-column label="门店名称" min-width="120" prop="shopname"></yid-table-column>
                <yid-table-column label="购买时间" min-width="120" prop="buyTime"></yid-table-column>
                <yid-table-column label="订单号" min-width="120" prop="billcode"></yid-table-column>
                <yid-table-column label="寄存来源" min-width="70">
                    <template slot-scope="scope">{{scope.row.source==1?'购买商品':scope.row.couponType==2?'套餐划扣':''}}</template>
                </yid-table-column>
                <yid-table-column label="商品名称"  prop="pname"></yid-table-column>
                <yid-table-column label="商品编号"  prop="pcode"></yid-table-column>
                <yid-table-column label="购买单价" min-width="60" prop="price"></yid-table-column>
                <yid-table-column label="寄存数量" min-width="60" prop="total"></yid-table-column>
                <yid-table-column label="已领取" min-width="100" prop="outnum"></yid-table-column>
                <yid-table-column label="剩余数量" min-width="100" prop="checknum"></yid-table-column>
            </yid-table>
        </el-row>
    </div>
</template>
<script>
    import yid from '@src/library'
    import { mapGetters } from 'vuex'
    import service from '@src/service'
    export default {
        name: "records",
        props:{
            activetab:String,
        },
        data() {
            return {
                cards:[],
                cardsye:[],
                rechanges:[],
                formCard:{
                    memid:'',
                    brandCode:'',
                    cardid:'',
                    date:[],
                    shopcode:'',//购买门店
                    lessNum:'',//余量
                },
                pageInfo:{page:0,limit:10},
                packages:[],
                shopLists:[],
                lessType:[
                    {
                        id:'',
                        value:'全部'
                    },
                    {
                        id:'1',
                        value:'大于0'
                    },
                    {
                        id:'0',
                        value:'等于0'
                    }
                ],
                picks:[],
                cardLists:[],
            }
        },
        computed: {
            ...mapGetters({
                userInfo: 'user/userInfo',
            })
        },
        mounted(){
        },
        methods:{
            async initData(obj){
                //   await this.restData();
                this.baseData = obj;
                if(!yid.util.isEmpty(this.baseData.shopLists)){
                    this.shopLists=this.baseData.shopLists;
                }
                if(!yid.util.isEmpty(this.baseData.cardLists)){
                    this.cardLists=this.baseData.cardLists;
                }
                this.formCard.memid=this.baseData.headData.memid
                this.formCard.brandCode=this.baseData.headData.brandCode

            },
            changeCardinfo() {
                this.formCard.shopcode = ''
                this.formCard.date=[]
                if (this.formCard.cardid) {
                    this.queryShopCardMoney(this.formCard.cardid);
                }
            },
            changCard(e){
                this.formCard.cardid= e
            },
            searchRechages(){
                if(!this.formCard.cardid){
                    yid.util.warning("请选择会员卡");
                    return
                }
                if(this.formCard.date.length==0){
                    yid.util.warning("请选择查询日期");
                    return
                }
                let sdate = this.formCard.date[0];
                let edate = this.formCard.date[1];

                service.finance.hyrefund.queryCardRecords({cardid:this.formCard.cardid,sdate,edate}).then(res => {
                    if (res.resp_code == "200") {
                        this.rechanges = res.data;
                        yid.util.alert("查询完成");
                    } else {
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            //查询套餐明细
            searchPackages(){
                if(this.formCard.date.length==0){
                    yid.util.warning("请选择查询日期");
                    return
                }
                let sSTimeStart = this.formCard.date[0]
                let sSTimeEnd = this.formCard.date[1]
                let parms = {
                    memid:this.formCard.memid,
                    brandCode:this.formCard.brandCode,
                    sSTimeStart,
                    sSTimeEnd,
                    shopcode:this.formCard.shopcode,
                    snum:this.formCard.lessNum,
                };
                service.finance.hyrefund.queryMemPackageTk(parms).then(res =>{
                    if(res.resp_code == "200"){
                        this.packages = res.data;
                        yid.util.alert("查询完成");
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            //查询寄存明细
            searchPicks(){
                if(this.formCard.date.length==0){
                    yid.util.warning("请选择查询日期");
                    return
                }
                let sSTimeStart = this.formCard.date[0]
                let sSTimeEnd = this.formCard.date[1]
                let parms = {
                    memid:this.formCard.memid,
                    brandCode:this.formCard.brandCode,
                    sSTimeStart,
                    sSTimeEnd,
                    shopcode:this.formCard.shopcode,
                    snum:this.formCard.lessNum,
                }
                service.finance.hyrefund.queryMemProductTk(parms).then(res =>{
                    if(res.resp_code == "200"){
                        this.picks = res.data.data;
                        debugger;
                        yid.util.alert("查询完成");
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            queryShopCardMoney(id) {
                this.cardsye = []
                service.member.memberinfo.queryShopcardmoney({cardid: id}).then(res => {
                    this.cardsye = res.data
                })
            },
        }
    }
</script>
<style scoped lang="scss">
    .hyrefund{
        height: 100%;
        /deep/.el-table{
            .disableRowClass{
                color: #ccc;
            }
        }

    }
</style>