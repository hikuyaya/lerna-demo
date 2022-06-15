<template>
    <div class="dept">
        <el-form :model="searchForm"  ref="searchForm" inline  :rules="searchRules" style="margin-top: 8px" label-position="left">
            <el-form-item label="门店:"  prop="shopid">
                <el-select @change="changeSelectShop" clearable v-model="searchForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="卡名称:" prop="cpname">
                <el-input clearable v-model.trim="searchForm.cpname" placeholder="请输入卡名称"  style="width: 350px;"></el-input>
            </el-form-item>
            <el-form-item label="卡类型:" prop="cardType">
                <el-select clearable v-model.trim="searchForm.cardType"   placeholder="请选择" style="width: 200px;">
                    <el-option :key="item.value" :label="item.name" :value="item.value" v-for="item in cardTypeArr">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select clearable v-model="searchForm.status"  placeholder="请选择状态" style="width: 120px;">
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="停用" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search()" type="primary">查询</el-button>
            </el-form-item>
        </el-form>
        <yid-table ref="table" :data="cardData">
            <yid-table-column label="编号" min-width="60" prop="cpcode"></yid-table-column>
            <yid-table-column label="卡名称" min-width="90" prop="cpname"></yid-table-column>
            <yid-table-column label="类型" min-width="60" prop="cardType">
                <template slot-scope="scope">
                    <div>{{scope.row.cardType=='1'?'储值卡':'资格卡'}}</div>
                </template>
            </yid-table-column>
            <yid-table-column label="开卡成本" min-width="100" prop="cost"></yid-table-column>
            <yid-table-column label="开卡金额" min-width="100" prop="money"></yid-table-column>
            <yid-table-column label="项目折扣" min-width="100" prop="serDis"></yid-table-column>
            <yid-table-column label="商品折扣" min-width="100" prop="proDis"></yid-table-column>
            <yid-table-column label="金额变动消息提醒" min-width="140" prop="needMsg">
                <template slot-scope="scope">
                    <div>{{scope.row.needMsg=='1'?'是':'不是'}}</div>
                </template>
            </yid-table-column>
            <yid-table-column label="卡号生成方式" min-width="120" prop="cardnoAuto">
                <template slot-scope="scope">
                    <div>{{scope.row.cardnoAuto=='1'?'自动':'手动'}}</div>
                </template>
            </yid-table-column>
            <yid-table-column label="充值赠送规则" min-width="140" prop="ruleType">
                <template slot-scope="scope">
                    <el-link type="primary" @click="editRule(scope.row)"
                             v-if="scope.row.cardType=='1'">{{scope.row.ruleType=="0"?'未设置':'查看规则'}}</el-link>
                </template>
            </yid-table-column>
            <yid-table-column label="异店划卡规则" min-width="140" prop="ruleType">
                <template slot-scope="scope">
                    <el-link type="primary" @click="showCardUseDialog(scope.row)">查看异店划卡规则</el-link>
                </template>
            </yid-table-column>
            <yid-table-column label="状态" min-width="110" prop="content">
                <template slot-scope="scope">
                    {{scope.row.statusInShop=='1' ? "正常" :"停办"}}
                </template>
            </yid-table-column>
        </yid-table>

        <yid-dialog :title="ruleDialog.title" :visible.sync="ruleDialog.visible" @close="levelCancel" width="800px">
            <el-row type="flex" justify="space-between" style="width:100%">
                <el-col>会员卡:{{ruleDialog.cardname}}</el-col>
            </el-row>
            <yid-table ref="table" style="margin-top: 15px;" :data="ruleDialog.cardRules">
                <yid-table-column label="类型" min-width="100" prop="type">
                    <template slot-scope="scope">
                        <div>{{scope.row.type=='3'?'开卡/充值':(scope.row.type=='1'?'开卡':'充值')}}</div>
                    </template>
                </yid-table-column>
                <yid-table-column label="金额" min-width="150" prop="money"></yid-table-column>
                <yid-table-column label="赠送模式" min-width="150" prop="giftType">
                    <template slot-scope="scope">
                        <div>{{scope.row.giftType?(scope.row.giftType=='1'?'固定金额':'百分比'):'无'}}</div>
                    </template>
                </yid-table-column>
                <yid-table-column label="赠送金额" min-width="150" prop="giftMoney">
                    <template slot-scope="scope">
                        <div>{{scope.row.giftType=='2'?scope.row.giftMoney+'%':scope.row.giftMoney}}</div>
                    </template>
                </yid-table-column>
            </yid-table>
        </yid-dialog>

        <yid-dialog :title="cardUseDialog.title" :visible.sync="cardUseDialog.visible" width="800px">
            <el-row type="flex" justify="space-between" style="width:100%">
                <el-col>会员卡:{{cardUseDialog.cardname}}</el-col>
            </el-row>
            <el-row  gutter="8" type="flex" justify="space-between" style="width:100%;margin-top: 8px">
                <el-col>是否允许跨店消费：</el-col>
                <el-col>
                    <el-row>{{cardUseDialog.isAcrossShopPay ? "允许" : "不允许"}}</el-row>
                    <el-row v-if="cardUseDialog.isAcrossShopPay && cardUseDialog.cardType == '1'">卡金类型：{{cardUseDialog.moneyArrStr}}</el-row>
                </el-col>
            </el-row>
            <el-row  gutter="8" type="flex" justify="space-between" style="width:100%;margin-top: 8px">
                <el-col>是否允许跨店续卡：</el-col>
                <el-col>{{cardUseDialog.isAcrossShopRecharge ? "允许" : "不允许"}}</el-col>
            </el-row>
            <el-row type="flex" justify="space-between" style="width:100%;margin-top: 8px">
                <el-col>是否允许跨品牌消费：</el-col>
                <el-col>
                    <el-row>{{cardUseDialog.isAcrossBrandPay ? "允许" : "不允许"}}</el-row>
                    <el-row v-if="cardUseDialog.isAcrossBrandPay && cardUseDialog.cardType != '1'">门店品牌：{{cardUseDialog.brandArrStr}}</el-row>
                </el-col>
            </el-row>

        </yid-dialog>


    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'

    export default {
        name: "cardSearch",
        data() {
            return {
                myheaders:{},
                cardnum: 3,
                status: '1',
                checkList: ['',''],
                labelPosition: 'left',
                cardData: [

                ],
                imageUrl: '',
                ruleDialog: {
                    title: '充值赠送规则',
                    visible: false,
                    cardid: '',
                    cpname:'',
                    cardRules: ''
                },
                cardUseDialog:{
                    title: "异店划卡规则",
                    visible:false,
                    cardname:"",
                    cardType:"",
                    isAcrossShopPay:false,// 是否跨店消费
                    moneyArrStr:"",//储值卡 卡金类型
                    isAcrossBrandPay:false,//是否跨品牌消费
                    isAcrossShopRecharge:false,//是否店充值
                    brandArrStr:"" //资格卡 跨品牌的
                },
                searchForm:{
                    cpname:"",
                    shopid:"",
                    cardType:"",
                    status:""
                },
                searchRules: {
                    shopid: [ { required: true, message: '必须选择一个门店', trigger: 'change' } ],
                },
                allShopList:[],
                filterShopList:[],
                cardTypeArr:[{value:"1",name:"储值卡"},{value:"2",name:"资格卡"}],
            }
        },
        methods: {
            changeSelectShop(v){
                this.searchForm.shopid = v;
            },
            search(){
                this.$refs['searchForm'].validate((valid) => {
                    if(!valid){
                        return
                    }
                    this.queryCardInfo({...this.searchForm})
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
            showCardUseDialog(row){
                    this.cardUseDialog.moneyArrStr = "";
                    this.cardUseDialog.brandArrStr = "";
                    this.cardUseDialog.cardname = row.cpname;
                    this.cardUseDialog.cardType = row.cardType;
                    let cardTemp = row.cardTemp;

                    if(row.cardType == "1"){
                        //储值卡
                        this.cardUseDialog.isAcrossShopPay = cardTemp.isSdiffshop == "1";
                        this.cardUseDialog.isAcrossBrandPay = cardTemp.isSdiffbrand == "1";
                        this.cardUseDialog.isAcrossShopRecharge = cardTemp.isSdiffcharge == "1";
                        if(this.cardUseDialog.isAcrossShopPay){
                            let moneyArr = []
                            if(cardTemp.sdsAllowCardm == "1"){
                                moneyArr.push("卡金")
                            }
                            if(cardTemp.sdsAllowGiftm == "1"){
                                moneyArr.push("赠送进")
                            }
                            this.cardUseDialog.moneyArrStr = moneyArr.toString();
                        }
                    }else{
                        //资格卡
                        this.cardUseDialog.isAcrossShopPay = cardTemp.isMdiffshop == "1";
                        this.cardUseDialog.isAcrossBrandPay = cardTemp.isMdiffbrand == "1";
                        this.cardUseDialog.isAcrossShopRecharge = cardTemp.isMdiffcharge == "1";
                        if(this.cardUseDialog.isAcrossBrandPay){
                            let brandArr = []
                            cardTemp.zgkBrandTypeArr.forEach(function (v,i,a) {
                                brandArr.push(v.name)
                            })
                            this.cardUseDialog.brandArrStr = brandArr.toString();
                        }
                    }
                this.cardUseDialog.visible = true;
            },
            editRule(row) {
                this.ruleDialog.cardid=row.id;
                this.ruleDialog.type="2";
                this.ruleDialog.cardname=row.cpname;
                this.ruleDialog.cardRules=[];
                service.chain.cardInfo.cardRules({cardid:row.id}).then(res =>{
                    this.ruleDialog.cardRules=res.data;
                    this.ruleDialog.visible = true;
                })
            },
            levelCancel(){
                this.ruleDialog.visible = false;
            },
            queryCardInfo(params){
                service.chain.cardIshop.searchListAll(params).then(res =>{
                    this.cardData=res.data;
                })
            },
            handleAvatarSuccess(res, file) {
                this.addDialog.photopath = res.data.url;
            },
            beforeAvatarUpload(file) {
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isJPG) {
                    yid.util.error('上传头像图片只能是 JPG/PNG 格式!');
                    return;
                }
                if (!isLt2M) {
                    yid.util.error('上传头像图片大小不能超过 10MB!');
                    return;
                }
                return isJPG && isLt2M;
            },
        },
        mounted() {
            this.getShopList({status:"1"});
            this.myheaders={
                authorization:'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
            };
        }
    }
</script>

<style scoped>

</style>