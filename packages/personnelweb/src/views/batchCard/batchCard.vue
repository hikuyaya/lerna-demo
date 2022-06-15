<template>
    <div>
        <el-collapse-transition>
            <div class="batchCard" v-show="editCardShow">
                <!-- <el-button @click="add" type="primary">新增</el-button> -->
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="门店：" :rules="[{ required: true}]">
                        <el-select v-model.trim="searchForm.shopid"
                            filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id"
                                v-for="item in allShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期：">
                        <el-date-picker
                                :clearable = false
                                v-model="searchForm.saleTimeRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="search" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>

                <yid-table pagination ref="bkTable" style="margin-top: 15px;">
                    <yid-table-column label="单据编号"  prop="billcode"></yid-table-column>
                    <yid-table-column label="门店" prop="shopname"></yid-table-column>
                    <yid-table-column label="充值时间" prop="createdTime"></yid-table-column>
                    <yid-table-column label="顾客" prop="memName"></yid-table-column>
                    <yid-table-column label="消费内容" prop="content"></yid-table-column>
                    <yid-table-column label="充值总金额" prop="ysje"></yid-table-column>
                    <yid-table-column label="服务人员" prop="eename">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.yjsList">{{royaltys.eename}}|{{royaltys.yjje}}<br></span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作人" prop="updatedBy"></yid-table-column>
                    <yid-table-column label="详情">
                        <template slot-scope="scope">
                             <el-link type="primary" @click="checkCard(scope.row)">详情</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>

        <el-collapse-transition>
            <div class="editCard" v-show="!editCardShow">
                <div class="editCardHead">
                    <el-button @click="pre">返回</el-button>
                    <el-button @click="save" type="primary" :disabled="true">保存并结账</el-button>
                </div>

                <div class="openCardInfo">
                    <div class="cardIMg">
                        <img :src="selectedCardType.photopath">
                        <div v-if="selectedCardType.photopath == ''" class="cardImgModal">
                            <div>储值卡</div>
                            <div style="display: flex;justify-content: space-between;">
                                <div>{{selectedCardType.cpname}}</div>
                                <div>{{'¥'+cardInfo.money}}</div>
                            </div>
                        </div>
                    </div>
                    <el-form class="cardForm" ref="cardForm" :model="cardInfo" :disabled="true">
                        <div class="cardForm_left">
                             <el-form-item class="must" label="顾客姓名： " :rules="[{ required: true}]">
                                <el-input :class="this.redborder == 'memname' ? 'redborder' : ''" clearable filterable v-model="cardInfo.memname"></el-input>
                            </el-form-item>
                            <el-form-item label="会员卡号： ">自动生成</el-form-item>
                            <el-form-item class="must" label="单卡金额： " :rules="[{ required: true}]">
                                <el-input  :class="this.redborder == 'money' ? 'redborder' : ''"  clearable filterable v-model="cardInfo.money" @input="moneyChange"></el-input>
                            </el-form-item>
                             <el-form-item class="must" label="开卡数量： " :rules="[{ required: true}]">
                                <el-input  :class="this.redborder == 'cardnum' ? 'redborder' : ''"  clearable filterable v-model="cardInfo.cardnum" @input="cardnumChange"></el-input>
                            </el-form-item>
                        </div>
                        <div class="cardForm_right">
                            <el-form-item label="付款金额： ">{{cardInfo.ysje}}</el-form-item>

                            <el-form-item  label="付款方式： " class="paylist must" :rules="[{ required: true}]">
                                <div style="width:300px;">
                                    <el-select clearable filterable v-model.trim="cardInfo.pays[0].payname" @change="checkpay" :class="this.redborder == 'paylist' ? 'redborder' : ''">
                                        <el-option v-for="(item,index) in paylist" :key="index" :label="item.payname" :value="item.paycode" style="padding-left:18px;">
                                        </el-option>
                                    </el-select>
                                    
                                    <el-input class="payje" :class="this.redborder == 'payje' ? 'redborder' : ''" v-show="cardInfo.pays[0].paycode !== '52' && cardInfo.pays[0].paycode !== ''"  clearable filterable v-model="cardInfo.pays[0].payje" @input="payjeChange"></el-input>
                                    <!--  银联通付款方式  选择的流水单号 -->
                                    <span :class="this.redborder == 'paycode' ? 'redborder' : ''" v-show="cardInfo.pays[0].paycode == '52'">{{cardInfo.pays[0].paymentNo}}</span>
                                </div>
                                
                            </el-form-item>
                            <!-- 第一工位的服务人员  -->
                            <el-form-item :label="gwlist[0].name+': '">
                                <div class="ygbox">
                                    <div class="ygcontent" v-if="cardInfo.yjs[0][0].eecode === '' && cardInfo.yjs[0].length == 1">
                                        <div class="yg">
                                            <!-- <span>服务人员</span> -->
                                            <el-select filterable v-model.trim="cardInfo.yjs[0][0].eename" >
                                                <el-option v-for="(item,index) in eelist[0]" :key="index" :label="item.eename" :value="item.eename" style="padding-left:18px;">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="yj">
                                            <!-- <span>设置业绩</span> -->
                                            <el-input clearable filterable v-model="cardInfo.yjs[0][0].je"></el-input>
                                        </div>
                                        <span class="del_yg" v-show="cardInfo.yjs[0].length > 1" @click="deleteyg(cardInfo.yjs[0][0],'1',0)">删除</span>
                                    </div>
                                    <!-- 保存之后打开，有多个人的情况  -->
                                    <div class="ygcontent" v-else v-for="(item,index) in cardInfo.yjs[0]" :key="index">
                                        <div class="yg">
                                            <!-- <span>服务人员</span> -->
                                            <el-select filterable v-model.trim="item.eename" >
                                                <el-option v-for="(item1,index) in eelist[0]" :key="index" :label="item1.eename" :value="item1.eename" style="padding-left:18px;">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="yj">
                                            <!-- <span>设置业绩</span> -->
                                            <el-input clearable filterable v-model="item.je"></el-input>
                                        </div>
                                        <span  class="del_yg" v-show="cardInfo.yjs[0].length > 1" @click="deleteyg(item,'1',index)">删除</span>
                                    </div>
                                    <div style="display:flex;">
                                        <!-- <span class="addyg" @click="addyg('1')">添加</span> -->
                                        <span class="addWarning" v-show="firstWarningFlag1">该工位下最多只允许添加{{this.gwlist[0].pepnum}}人!</span>
                                    </div>
                                    
                                </div>
                            </el-form-item>

                            <!-- 第二工位的服务人员  -->
                            <el-form-item v-if="gwlist.length > 1" :label="gwlist[1].name+': '">
                                <div class="ygbox">
                                    <div class="ygcontent" v-if="cardInfo.yjs[1][0].eecode === '' && cardInfo.yjs[1].length == 1">
                                        <div class="yg">
                                            <!-- <span>服务人员</span> -->
                                            <el-select filterable v-model.trim="cardInfo.yjs[1][0].eename" >
                                                <el-option v-for="(item,index) in eelist[1]" :key="index" :label="item.eename" :value="item.eename" style="padding-left:18px;">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="yj">
                                            <!-- <span>设置业绩</span> -->
                                            <el-input clearable filterable v-model="cardInfo.yjs[1][0].je"></el-input>
                                        </div>
                                        <span class="del_yg" v-show="cardInfo.yjs[1].length > 1" @click="deleteyg(cardInfo.yjs[1][0],'2',0)">删除</span>
                                    </div>
                                    <!-- 保存之后打开，有多个人的情况  -->
                                    <div class="ygcontent" v-else v-for="(item,index) in cardInfo.yjs[1]" :key="index">
                                        <div class="yg">
                                            <!-- <span>服务人员</span> -->
                                            <el-select filterable v-model.trim="item.eename" >
                                                <el-option v-for="(item1,index) in eelist[1]" :key="index" :label="item1.eename" :value="item1.eename" style="padding-left:18px;">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="yj">
                                            <!-- <span>设置业绩</span> -->
                                            <el-input clearable filterable v-model="item.je"></el-input>
                                        </div>
                                        <span  class="del_yg" v-show="cardInfo.yjs[1].length > 1" @click="deleteyg(item,'2',index)">删除</span>
                                    </div>
                                    <div style="display:flex;">
                                        <!-- <span class="addyg" @click="addyg('2')">添加</span> -->
                                        <span class="addWarning" v-show="firstWarningFlag2">该工位下最多只允许添加{{this.gwlist[1].pepnum}}人!</span>
                                    </div>
                                    
                                </div>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>

                <div class="cardInfoList" v-if="memberTableFlag">
                    <el-table ref="membertable" :data="memberList" :resizable="false" :span-method="objectSpanMethod">
                        <yid-table-column label="消费内容" min-width="100" prop="content"></yid-table-column>
                        <yid-table-column label="关联实体卡" min-width="100" prop="cardcmcode">
                            <template slot-scope="scope">
                                <span :class="(scope.row.cardcmcode == '' || scope.row.cardcmcode == null) ? 'relation' : ''">
                                    {{(scope.row.cardcmcode == '' || scope.row.cardcmcode == null) ? '关联实体卡' : scope.row.cardcmcode}}
                                </span>
                            </template> 
                        </yid-table-column>
                        <yid-table-column label="类型" min-width="100">开卡</yid-table-column>
                        <yid-table-column label="开卡金额" min-width="100" prop="money"></yid-table-column>
                        <yid-table-column label="服务人员" min-width="100" prop="yjs">
                            <template slot-scope="scope">
                                <span class="serveyg" v-for="(item,index) in scope.row.yjs" :key="index">
                                    {{item.eeid}} {{item.eename}} {{item.je}}
                                </span>
                            </template>
                        </yid-table-column>
                    </el-table>
                </div>
            </div>
        </el-collapse-transition>

        <!-- 选择卡类型弹窗 -->
         <yid-dialog class='cardTypeDialog' :title="cardtype.title" :visible.sync="cardtype.visible" width="450px">
            <ul>
                <li class="cardlist"  v-for="(item,index) in cardTypeList" :key="index" @click="selectedCard(item,index)" :class="activeindex == index ? 'active' : ''">{{item.cpname}}</li>
            </ul>  
            <el-button @click="next" type="primary">下一步</el-button>
        </yid-dialog>

         <!--银联通  查流水弹窗-->
        <yid-dialog :title="dialogProduct.title" :visible.sync="dialogProduct.visible"  width="900px">
            <checkPay ref="paySelectPage" :ysje="cardInfo.ysje" @onClose="closedProductDialog"></checkPay>
            <!-- <checkPay ref="paySelectPage"></checkPay> -->
        </yid-dialog>

        <!-- 关联实体卡 -->
        <yid-dialog :title="dialogRelation.title" v-if="dialogRelation.visible" :visible.sync="dialogRelation.visible"  width="500px">
            <relationCard :sitem="sitem" @onClose="closedRelation"></relationCard>
        </yid-dialog>
    
    </div>

</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import type from '@src/type'
import cache from "@src/library/helper/cache";
import checkPay from "./checkpay";
import relationCard from "./relationCard.vue"

export default {
    components: {checkPay,relationCard},
    data(){
        return {
            // shopid:'',
            allShopList:[],
            editCardShow: true,
            searchForm: {
                saleTimeRange : [],
                shopid:''
            },
            pageInfo:{page:1,limit:10},
            cardtype:{
                title:'选择卡',
                visible: false,
            },
            cardTypeList:[],            //卡类别列表
            activeindex:-1,             //选择卡选中index
            selectedCardType:{},         //选择卡的信息
            cardInfo:{                  //editCard表单数据
                memname:"",
                money:'',               //单卡金额
                ysje:'',                //付款金额
                cardnum:'',             //开卡数量
                pays:[{                    //支付方式
                    paycode:'',           //付款编码
                    payname:'',           //付款名称
                    payje:'',             //付款金额
                    paymentNo:''          //支付系统编码 微信支付宝有
                }],                 
                yjs:[
                    [{
                        eeid:'',           //员工ID
                        eecode:'',         //员工编码
                        eename:'',         //员工名称
                        psid:'',           //职务id
                        pscode:'',         //职务编码
                        pslid:'',          //职务级别id
                        pslcode:'',        //职务级别编码
                        postion:'',        //工位
                        je:''              //录入金额

                    }],
                    [{                      //第二工位
                        eeid:'',        
                        eecode:'',        
                        eename:'',     
                        psid:'',        
                        pscode:'',       
                        pslid:'',          
                        pslcode:'',      
                        postion:'',       
                        je:''            

                    }]
                    ],                   //服务员工列表
            },
            paylist:[],                  //支付方式列表
            gwlist:[{name:''}],                   //工位list
            eeAllList:[],                //店内所有员工
            eelist:[[],[]],                   //符合pscode的员工列表,分第一工位和第二工位
            // shopbase : [],
            firstWarningFlag1:false,         //第一工位超过到最大人数的警告提示
            firstWarningFlag2:false,         //第二工位超过到最大人数的警告提示
            dialogProduct: {
                    visible: false,
                    title:'扫码支付',
            },
            dialogRelation: {
                title: '关联实体卡',
                visible: false,
            },
            redborder:'',
            memberList:[],
            memberTableFlag: false,
            relationCardIndex:0,
            formDisableFlag:false,
            sitem:{}
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
        console.log(date1, this.searchForm,this.searchForm.saleTimeRange)
        this.searchForm.saleTimeRange.push(date1)
        this.searchForm.saleTimeRange.unshift(date1)
        // this.shopbase = cache.get(type.CACHE.SHOP);

        // this.getpaylist()
        this.getStaff()
        this.getShopList({
                status: "1"
            });
        this.add()
    },
    methods: {
        //还原方法
        restore(){ 
            this.activeindex = -1
            this.selectedCardType = {}
            this.cardInfo = {                  
                memname:"",
                money:'',              
                ysje:'',               
                cardnum:'',            
                pays:[{                
                    paycode:'',         
                    payname:'',   
                    payje:'',   
                    paymentNo:''        
                }],                 
                yjs:[
                    [{
                        eeid:'',          
                        eecode:'',      
                        eename:'',       
                        psid:'',        
                        pscode:'',      
                        pslid:'',       
                        pslcode:'',      
                        postion:'',     
                        je:''          

                    }],
                    [{
                        eeid:'',         
                        eecode:'',   
                        eename:'',      
                        psid:'',       
                        pscode:'',      
                        pslid:'',       
                        pslcode:'',     
                        postion:'',      
                        je:''       

                    }]
                    ],                   //服务员工列表
            }
        },
        getShopList(params) {

            service.chain.shop.shopList(params).then(res => {
                if (res.resp_code == 200) {
                    // this.filterShopList = res.data;
                    // console.log(this.filterShopList)
                    this.allShopList = res.data
                }
            })
        },
        filterShop(v) {
            this.allShopList = this.allShopList.filter((item) => {
                // 如果直接包含输入值直接返回true
                if (item.shopname.indexOf(v) !== -1) return true
                if (item.shopcode.indexOf(v) !== -1) return true
            })
        },
        add(){
            this.restore()
            this.formDisableFlag = false
            //去拿卡类型列表
            service.cardinfo.cardinfo({status:'1'}).then(res =>{
                    this.cardTypeList = res.data
                    // if(this.cardTypeList.length>1){
                    //     this.cardtype.visible = true
                    // }else if(this.cardTypeList.length == 1){
                    //     // this.cardtype.visible = true
                    //     this.selectedCardType = this.cardTypeList[0]
                    //     this.editCardShow = !this.editCardShow
                    // }
            })
        },
        DateMinus(date1, date2) {
            //date1:小日期   date2:大日期
            var sdate = new Date(date1);
            var now = new Date(date2);
            var days = now.getTime() - sdate.getTime();
            var day = parseInt(days / (1000 * 60 * 60 * 24));
            return day;
        },
        search(){
            this.pageInfo.page=1
            this.pageInfo.limit = this.$refs.bkTable.Pagination.internalPageSize;
            if($yid.util.isEmpty(this.searchForm.saleTimeRange[0]) || $yid.util.isEmpty(this.searchForm.saleTimeRange[1])){
                $yid.util.alert("请选择日期再进行查询!");
                return;
            }
            let arg = this.DateMinus(this.searchForm.saleTimeRange[0], this.searchForm.saleTimeRange[1]);
            if(Number(arg) > 30){
                $yid.util.error("时间间隔请选择30天之内!");
                return;
            }
            if($yid.util.isEmpty(this.searchForm.shopid)){
                return $yid.util.error("请选择门店!");
            }
            const fetch = service.cashier.cardRecords.cardRecordList
            const params = {
                page: this.pageInfo.page,
                limit: this.pageInfo.limit,
                updatedTimeStart: this.searchForm.saleTimeRange[0],
                updatedTimeEnd: this.searchForm.saleTimeRange[1],
                cardnum:0,                        //传0，只查开卡的
                shopid: this.searchForm.shopid
            }
            this.$refs.bkTable.reloadData({
                fetch,
                params,
            });

        },
        //点击详情
        checkCard(row){
            console.log(row)
            // this.cardtype.visible = true

            this.editCardShow = !this.editCardShow
            this.formDisableFlag = true
            this.cardInfo.memname = row.memName
            this.cardInfo.money = row.money
            this.cardInfo.ysje = row.ysje
            this.cardInfo.cardnum = row.cardnum
            this.cardInfo.pays = row.paysList
            let temp1 = []
            let temp2 = []
            this.cardInfo.yjs = []
            this.cardInfo.yjs.push(temp1,temp2)

            for(let n=0;n<this.cardTypeList.length;n++){
                if(row.cpcode == this.cardTypeList[n].cpcode){
                    this.selectedCardType =  this.cardTypeList[n]
                }
            }
            for(let i =0;i<row.yjsList.length;i++){
                if(row.yjsList[i].postion == '1'){
                    this.cardInfo.yjs[0].push(row.yjsList[i])
                }else{
                    this.cardInfo.yjs[1].push(row.yjsList[i])
                }
            }
            console.log(this.cardInfo)
            console.log(this.cardInfo.yjs,this.cardInfo.yjs.length)
            for(let m = 0;m<this.cardInfo.yjs.length;m++){
                if(this.cardInfo.yjs[m].length ==0){
                    this.cardInfo.yjs[m].push({
                        eeid:'',          
                        eecode:'',      
                        eename:'',       
                        psid:'',        
                        pscode:'',      
                        pslid:'',       
                        pslcode:'',      
                        postion:'',     
                        je:''
                    })
                }
            }
            if(row.memberList != null){
                this.memberList = row.memberList
                console.log(this.memberList,row.yjsList.length)
                if(row.yjsList.length > 0){
                    for(let i =0;i<this.memberList.length;i++){
                        this.memberList[i].yjs = row.yjsList
                    }
                }
                console.log(this.memberList)
                this.memberTableFlag = true
            }
            
        },
        selectedCard(e,index){
            this.activeindex = index
            this.selectedCardType = e
        },
        //下一步
        next(){
            this.cardtype.visible = false
            this.editCardShow = !this.editCardShow
        },
        //返回
        pre(){
            this.editCardShow = !this.editCardShow
            this.memberTableFlag = false
            this.search()
        },
        //单卡金额change
        moneyChange(){
            this.cardInfo.ysje = isNaN(Number(this.cardInfo.money) * Number(this.cardInfo.cardnum)) ? '' : Number(this.cardInfo.money) * Number(this.cardInfo.cardnum)
        },
        cardnumChange(){
            this.cardInfo.ysje = isNaN(Number(this.cardInfo.money) * Number(this.cardInfo.cardnum)) ? '' : Number(this.cardInfo.money) * Number(this.cardInfo.cardnum)
        },
        //保存并结账
        save(){
                this.redborder = ''
                //先验证表单
                if($yid.util.isEmpty(this.cardInfo.memname)){
                    this.redborder = 'memname'
                    return yid.util.error("顾客姓名必填!")
                }
                if($yid.util.isEmpty(this.cardInfo.money)){
                    this.redborder = 'money'
                    return yid.util.error("单卡金额必填!")
                }
                if($yid.util.isEmpty(this.cardInfo.cardnum)){
                    this.redborder = 'cardnum'
                    return yid.util.error("开卡数量必填!")
                }
                
                if($yid.util.isEmpty(this.cardInfo.pays[0].paycode)){
                    this.redborder = 'paylist'
                    return yid.util.error("付款方式必填!")
                }else if(this.cardInfo.pays[0].paycode != '52' && $yid.util.isEmpty(this.cardInfo.pays[0].payje)){
                    this.redborder = 'payje'
                    return yid.util.error("付款方式金额必填!")
                }else if(this.cardInfo.pays[0].paycode == '52' && $yid.util.isEmpty(this.cardInfo.pays[0].paymentNo)){
                    
                    return yid.util.error("银联通付款方式流水单号必传!")
                }else if(this.cardInfo.pays[0].paycode != '52' && this.cardInfo.pays[0].payje != ''){
                    if(this.cardInfo.pays[0].payje != this.cardInfo.ysje){
                        return yid.util.error("付款方式金额需与付款金额相等!")
                    }
                }
                if(this.cardInfo.yjs[0].length == 1 && $yid.util.isEmpty(this.cardInfo.yjs[0][0].eecode) && this.cardInfo.yjs[1].length == 1 && $yid.util.isEmpty(this.cardInfo.yjs[1][0].eecode)){
                    return yid.util.error("请选择服务人员!")
                }else{
                     let serveje
                    for(let i= 0;i<this.cardInfo.yjs.length;i++){
                        serveje  = 0
                        for(let m=0;m<this.cardInfo.yjs[i].length;m++){
                            if(this.cardInfo.yjs[i][m].eecode != ''){
                                if(serveje + Number(this.cardInfo.yjs[i][m].je) <  this.cardInfo.ysje || serveje + Number(this.cardInfo.yjs[i][m].je) == this.cardInfo.ysje){
                                    serveje = serveje + Number(this.cardInfo.yjs[i][m].je)
                                }else{
                                    return yid.util.error("员工业绩不得超过付款金额!")
                                }
                            }
                        }
                    }
                    
                }

            this.formDisableFlag = true
            let payname = this.paylist.filter(item => item.paycode == this.cardInfo.pays[0].paycode)[0].payname
            let yjs = []
            let eeid,eename
            for(let i =0;i<this.cardInfo.yjs.length;i++){
                for(let m=0;m<this.cardInfo.yjs[i].length;m++){ 
                    if(this.cardInfo.yjs[i][m].eecode != '' && this.cardInfo.yjs[i][m].eecode != '00'){
                        let eeitem = this.eeAllList.filter(item => item.eecode == this.cardInfo.yjs[i][m].eecode)
                        yjs.push({
                            eeid: eeitem[0].id,
                            eecode: eeitem[0].eecode,
                            eename: eeitem[0].eename,
                            psid: eeitem[0].psid,
                            pscode: eeitem[0].pscode,
                            pslid: eeitem[0].pslid,
                            pslcode: eeitem[0].pslcode,
                            postion:  i == 0 ? 1 : 2,
                            je: this.cardInfo.yjs[i][m].je == "" ? 0 :  this.cardInfo.yjs[i][m].je
                            
                        })
                    }else if(this.cardInfo.yjs[i][m].eecode == '00'){      //公单

                        yjs.push({
                            eeid: '-1',
                            eecode: '00',
                            eename: '公单',
                            postion:  i == 0 ? 1 : 2,
                            je: this.cardInfo.yjs[i][m].je == "" ? 0 :  this.cardInfo.yjs[i][m].je
                            
                        })
                    }
                }
            }
            let cashUuid = Math.uuid()             //唯一标记，每次新增都重新生成
            let params ={
                memid: 0,                                              
                memName: this.cardInfo.memname,
                sex: '1',
                cardname: this.cardTypeList[this.activeindex].cpname,   //卡类别的名称
                isOpen: 1,
                money: this.cardInfo.money,                            //单卡金额
                cardtype: 1,
                cardnum: this.cardInfo.cardnum,
                chid: this.cardTypeList[this.activeindex].id,          //卡类别的id
                cpcode:this.cardTypeList[this.activeindex].cpcode,     //卡类别的编码
                pays:[{
                    paycode: this.cardInfo.pays[0].paycode,
                    payje: this.cardInfo.pays[0].payje,
                    payname: payname,
                    paymentNo: this.cardInfo.pays[0].paycode == '52' ? this.cardInfo.pays[0].paymentNo : ''
                }],
                yjs: yjs,
                cashUuid:cashUuid
            }
            service.batchCard.saveRecord(params).then(res => {
                this.memberList = res.data.memberList
                if(res.data.yjs.length > 0){
                    for(let i =0;i<this.memberList.length;i++){
                        this.memberList[i].yjs = res.data.yjs
                    }
                }
                this.memberTableFlag = true
            })
        },
        //取支付方式
        // getpaylist(){
        //     let params = {
        //         type:'3',
        //         ptcode:'01',
        //         enable:'1'
        //     }
        //     service.batchCard.getpaytemplateListAll(params).then(res => {
        //         console.log('所有支付方式',res.data)
        //         this.paylist = res.data
        //     })
        // },
        //支付方式change
        checkpay(e){
            this.cardInfo.pays[0].payje = ''
            if(e == 52){                    //付款方式为银联通时，弹出窗口查流水
                this.dialogProduct.visible = true;
            }
            
        },
        //付款方式除了银联通，其他的后面都有input手动输入金额
        payjeChange(){

        },
        //获取员工
        getStaff(){
            this.gwlist = [{name:''}]
            this.eeAllList = []
            this.eelist = [[{eeid:'-1',eecode:'00',eename:'公单'}],[{eeid:'-1',eecode:'00',eename:'公单'}]]
            //开卡工位接口
            service.batchCard.getByCode('001').then(res => {
                this.gwlist = res.data.desc
                if(this.gwlist.length == 1){
                    this.cardInfo.yjs.splice(1,1)
                }
                //店内员工接口
                let shopid = this.searchForm.shopid
                let params = {shopid:shopid,status:'1'}
                service.sms.getemployeeByBranhid(params).then(res => {
                    this.eeAllList = res.data
                    for(let i=0;i<this.gwlist.length;i++){
                        for(let m=0;m<this.gwlist[i].pslist.length;m++){
                            for(let n=0;n<this.eeAllList.length;n++){
                                if(this.gwlist[i].pslist[m].pscode == this.eeAllList[n].pscode){
                                    if(i == 0){
                                        this.eeAllList[n].postion = 1
                                        this.eelist[0].push(this.eeAllList[n])
                                    }else if(i == 1){
                                        this.eeAllList[n].postion = 2
                                        this.eelist[1].push(this.eeAllList[n])
                                    }
                                }
                            }
                        }
                    }
                })
            })
        },
        //添加服务人员   type:1第一工位， 2 第二工位
        addyg(type){
                //判断该工位服务人数是否到最大人数   pepnum
                if(this.gwlist[Number(type)-1].pepnum > (this.cardInfo.yjs[Number(type)-1].length+1) || this.gwlist[Number(type)-1].pepnum == (this.cardInfo.yjs[Number(type)-1].length+1)){       
                    this.cardInfo.yjs[Number(type)-1].push({
                        eeid:'',          
                        eecode:'',      
                        eename:'',       
                        psid:'',        
                        pscode:'',      
                        pslid:'',       
                        pslcode:'',      
                        postion:'',     
                        je:''
                    })
                }else{
                    //弹出提示
                    if(type == '1'){
                        this.firstWarningFlag1 = true
                        setTimeout(()=>{
                            this.firstWarningFlag1 = false
                        },5000)
                    }else if(type == '2'){
                        this.firstWarningFlag2 = true
                        setTimeout(()=>{
                            this.firstWarningFlag2 = false
                        },5000)
                    }
                    
                }

           this.$forceUpdate()
        },
        //删除服务人员
        deleteyg(e,type,index){
            this.cardInfo.yjs[Number(type)-1].splice(index,1)
        },
        closedProductDialog(selectPay){
            this.cardInfo.pays[0].paymentNo = selectPay.billcode
            this.cardInfo.pays[0].payje = selectPay.money
        },
        //memberTable表格的合并单元格function
        objectSpanMethod(row){
            if(row.columnIndex == 4){
                if(row.rowIndex == 0){
                    return{
                      rowspan:this.memberList.length,
                      colspan:4
                    }
                }
            }
        },
        //关联实体卡
        // relationCard(scope){
        //     if(scope.row.cardcmcode == null){
        //         this.dialogRelation.visible = true
        //         this.relationCardIndex = scope.$index
        //         this.sitem = scope
        //     }
        // },
        //关联实体卡窗口关闭
        closedRelation(e){
            this.dialogRelation.visible = false
            
            if(e !== '' || e !==null || e !== undefined){
                this.memberList[this.relationCardIndex].cardcmcode = e
                let params = {
                    billcode: this.sitem.row.billcode,
                    cardcmcode: e,
                    cardno: this.sitem.row.cardno
                }
                service.batchCard.updateMemberCardCmcode(params).then(res => {
                    this.sitem = {}
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    /deep/ .el-form{
        display: flex;
        align-items: center;
        margin-top: 20px;
    }
    /deep/ .el-form-item{
        margin-bottom: 0px !important;
    }
    /deep/ .el-table th.el-table__cell.is-leaf{
        border-right: 1px solid #ebeef5;
    }
    /deep/ .el-table td.el-table__cell{
        border-right: 1px solid #ebeef5;
    }
    /deep/ .el-table .cell.el-tooltip{
        white-space: inherit;
    }
    ul,li{ 
        padding:0;margin:0;
        list-style:none
    }
    .cardTypeDialog{
        text-align: center;
        /deep/ .el-dialog{
            border-radius: 5px;
        }
        /deep/ .el-dialog__body{
            padding: 0 !important;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }
        .cardlist{
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-bottom: 1px solid #ccc;
            &:hover{
                background-color: #16a1ddc9;
                color: #fff;
            }
        }
        .active{
            background-color: #16a1ddc9;
            color: #fff;
        }
        button{
            margin: 20px 0 10px;
        }
    }
    .editCardHead{
        margin-bottom: 30px;
    }
    .openCardInfo{
        display: flex;
        justify-content: flex-start;
        .cardIMg{
            margin: 0px 70px;
            .cardImgModal{
                width: 370px;
                height: 160px;
                background-color: #b4bbc5;
                border-radius: 10px;
                padding: 12px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
        }
        .cardForm{
            flex-direction: row;
            // height: 200px;
            flex-wrap: wrap;
            margin-top: 0px;
            align-items: flex-start;
            flex: 1;
            .cardForm_left{
                margin-right: 4%;
            }
            /deep/ .el-form-item{
                // margin-right: 4%;
                display: flex;
                margin-bottom: 16px !important;
            }
            .must{
                margin-left: -8px;
            }
            .paylist{
                /deep/ .el-form-item__content{
                    width: 110px;
                }
                /deep/ .el-select{
                    margin-right: 24px;
                    width: 110px;
                }
                .payje{
                    width: 100px;
                }
            }
        }
    }
    .ygbox{
        display: flex;
        flex-direction: column;
        .ygcontent{
            display: flex;
            flex-direction: row;
            align-items: end;
            margin-bottom: 10px;
            .yg{
                display: flex;
                flex-direction: column;
                margin: 0px 20px;
                /deep/ .el-select{
                    width: 160px;
                }
            }
            .yj{
                display: flex;
                flex-direction: column;
                /deep/ .el-input{
                    width: 120px;
                }
            }
            .del_yg{
                margin-left: 2%;
                width: 40px;
                color: #00AAEE;
                &:hover{
                    cursor: pointer;
                }
            }
        }
        .addyg{
            color: #00AAEE;
            display: inline-block;
            width: 40px;
            margin-left: 20px;
            &:hover{
                cursor: pointer;
            }
        }
        .addWarning{
            color: red;
        }
    }
    .redborder{
        border-radius: 5px;
        /deep/ .el-input__inner{
            border-color: #ff00009c;
        }

    }
    .serveyg{
        display: block;
    }
    .relation{
        color: #0099FF;
        // cursor: pointer;
    }
</style>
