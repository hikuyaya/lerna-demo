<template>
    <div>
        <el-row>
            <el-button @click="back" type="primary">返回</el-button>
            <el-button v-show="isSp" @click="auditBill" type="primary" style="margin-left: 60px">复核</el-button>
            <el-button v-show="isSp"  @click="openRject(1)" type="primary">驳回</el-button>
            <el-button v-show="isCancelFh"  @click="cancelFhBill" type="primary">取消复核</el-button>
            <el-button v-print="printObj" v-show="true" @click="handleprint(printObj)" type="primary">打印</el-button>
        </el-row>
        <div ref="printId" id="printId" cellspacing="0" cellpadding="0" border="0">
        <el-form ref="billForm" :model="billForm" style="margin-top: 16px;" label-width="100px" label-position="right">
            <el-row>
                <span><b>单据编码：</b>{{billForm.billcode}}</span>
                <span style="margin-left: 80px"><b>店号：</b>{{billForm.shopcode}}</span>
                <span style="margin-left: 80px"><b>会员姓名：</b>{{billForm.memname}}</span>
                <span style="margin-left: 80px"><b>会员手机号：</b>{{billForm.mobile}}</span>
                <span style="margin-left: 80px"><b>会员id：</b>{{billForm.memid}}</span>
            </el-row>
            <el-row style="margin-top: 10px">
                <b>是否跨店承担退款：</b>
                <label>{{billForm.isKd==0?'否':billForm.isKd==1?'是':''}}</label>
            </el-row>
            <el-row style="margin-top: 10px;">
                <b style=" font-size: 16px">退款明细：</b>
                <label style="cursor: pointer; color: #00AAEE" @click="showHyDetail">查看注销资产明细 + </label>
            </el-row>
            <div style="margin-top: 10px">
                <el-row>
                    <el-col :span="8">会员卡注销金额：<label style="font-size: 16px; font-weight: bold">￥{{billForm.cardMoney}}</label></el-col>
                    <el-col :span="8">可用套餐注销金额：<label style="font-size: 16px; font-weight: bold">￥{{billForm.packageMoney}}</label></el-col>
                    <el-col :span="8">寄存产品注销金额：<label style="font-size: 16px; font-weight: bold">￥{{billForm.productMoney}}</label></el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                            <span style="font-size: 16px; font-weight: bold;">
                                <label style="color: red">*</label>
                                合计实退金额：<label style="font-size: 20px; color: red"><b>{{billForm.totalMoney>0?'￥' + billForm.totalMoney:billForm.totalMoney}}</b></label>

                            </span>
                </el-row>
            </div>
            <el-row style="margin-top: 15px">
                <el-col :span="8">
                    <div><label style="color: red; font-weight: bold; margin-right: 5px">*</label>退款联系人：
                        <el-input clearable placeholder="姓名" disabled  v-model.trim="billForm.tkname"  style="width: 100px;"></el-input>
                        <el-input clearable placeholder="手机号" disabled v-model.trim="billForm.tkmobile"  style="width: 150px;margin-left: 10px"></el-input>
                    </div>
                    <div style="display: flex;flex-wrap: wrap;margin-top: 15px; line-height: 36px">
                        <label style="color: red; font-weight: bold; margin-right: 5px">*</label>打款方式：
                        <el-select clearable filterable placeholder="请选择" style="width: 160px;  margin-right: 10px" disabled v-model.trim="billForm.tktype">
                            <el-option key="'k_'+1" value="1" label="店内支出卡"></el-option>
                            <el-option key="'k_'+2" value="2" label="顾客银行卡"></el-option>
                            <el-option key="'k_'+3" value="3" label="退为卡金"></el-option>
                        </el-select>
                        <el-input clearable placeholder="开户行" disabled v-model.trim="billForm.bank"  style="width: 150px; margin-right: 10px"></el-input>
                        <el-input clearable placeholder="户名" disabled v-model.trim="billForm.payee"  style="width: 100px; margin-right: 10px"></el-input>
                        <el-input clearable placeholder="账户" disabled v-model.trim="billForm.bankno" style="width: 200px; margin-right: 10px"></el-input>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div style="display: flex;flex-wrap: wrap;margin-top: 15px; line-height: 36px">
                        <label style="color: red; font-weight: bold; margin-right: 5px">*</label>退款属性：
                        <el-select clearable filterable placeholder="请选择" disabled style="width: 300px;" v-model.trim="billForm.tkattr">
                            <el-option key="'tk_'+1" value="1" label="仅注销无退款"></el-option>
                            <el-option key="'tk_'+2" value="2" label="员工离职"></el-option>
                            <el-option key="'tk_'+3" value="3" label="个人原因"></el-option>
                            <el-option key="'tk_'+4" value="4" label="技术原因"></el-option>
                            <el-option key="'tk_'+5" value="5" label="消费原因"></el-option>
                            <el-option key="'tk_'+6" value="6" label="服务及接待"></el-option>
                            <el-option key="'tk_'+7" value="7" label="关店原因"></el-option>
                            <el-option key="'tk_'+8" value="8" label="其它"></el-option>
                        </el-select>
                    </div>
                    <div style="display: flex;flex-wrap: wrap;margin-top: 15px; line-height: 36px">
                        <label style="color: red; font-weight: bold; margin-right: 5px">*</label>退款方式：
                        <el-select clearable filterable placeholder="请选择" disabled style="width: 300px;" v-model.trim="billForm.tkway">
                            <el-option key="'tk0_'+1" value="1" label="营业款"></el-option>
                            <el-option key="'tk0_'+2" value="2" label="预留款"></el-option>
                            <el-option key="'tk0_'+3" value="3" label="退卡保证金"></el-option>
                            <el-option key="'tk0_'+4" value="4" label="风险金"></el-option>
                            <el-option key="'tk0_'+5" value="5" label="关店退款"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div style="display: flex">
                        <label>附件：</label>
                        <div v-if="billForm.photopath" style="display: flex; flex-direction: column">

                            <el-image
                                    :key="item"
                                    style="width: 100px; height:100px"
                                    :src="billForm.photopath"
                                    :preview-src-list="photosrcList">
                            </el-image>
                        </div>

                    </div>
                </el-col>
            </el-row>
            <el-row>
                <label style="color: red; font-weight: bold; margin-right: 5px">*</label>退款原因：
                <el-input
                        type="textarea" disabled
                        :rows="5"
                        placeholder="请输入内容500字以内"
                        v-model="billForm.tkcontent" style="margin-top: 10px">
                </el-input>
            </el-row>
            <el-row :gutter="20" style="margin-top: 15px; border-top: 1px #f2f2f2 solid; padding-top: 15px">
                <el-col :span="8" style="overflow: hidden">
                    <div style="display: flex; flex-direction: column">
                        <div>
                            核实退款属性：
                            <el-select clearable filterable placeholder="请选择" style="width: 200px;" v-model.trim="billForm.hstkattr" disabled>
                                <el-option key="'tk_'+1" value="1" label="仅注销无退款"></el-option>
                                <el-option key="'tk_'+2" value="2" label="员工离职"></el-option>
                                <el-option key="'tk_'+3" value="3" label="个人原因"></el-option>
                                <el-option key="'tk_'+4" value="4" label="技术原因"></el-option>
                                <el-option key="'tk_'+5" value="5" label="消费原因"></el-option>
                                <el-option key="'tk_'+6" value="6" label="服务及接待"></el-option>
                                <el-option key="'tk_'+7" value="7" label="关店原因"></el-option>
                                <el-option key="'tk_'+8" value="8" label="其它"></el-option>
                            </el-select>
                        </div>
                        <div>
                            核实退款原因：
                            <el-input
                                    type="textarea"
                                    :rows="5"
                                    placeholder="请输入内容500字以内"
                                    v-model="billForm.hstkcontent" style="margin-top: 10px" disabled>
                            </el-input>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div style="display: flex; flex-direction: column">

                        <div>
                            回访备注：
                            <el-input
                                    type="textarea"
                                    :rows="5"
                                    placeholder="请输入内容500字以内"
                                    v-model="billForm.hsmemo" style="margin-top: 10px" disabled>
                            </el-input>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-form>
        </div>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--消费记录-->
        <el-dialog
                :title="detailDialog.title"
                :visible.sync="detailDialog.visible"
                width="1300px"
                center :close-on-click-modal ='false'>
            <records ref="detailRecord" :activetab ='activetab'></records>
        </el-dialog>
        <!--注销详情-->
        <el-dialog
                :title="hyDetailDialog.title"
                :visible.sync="hyDetailDialog.visible"
                width="1300px"
                center :close-on-click-modal ='false'>
            <hydetail ref="detailPage" :billForm ='billForm'></hydetail>
        </el-dialog>
    </div>
</template>
<script>
    import yid from '@src/library'
    import { mapGetters } from 'vuex'
    import moment from 'moment';
    import hydetail from './components/hydetail'
    import records from "./components/records";
    import service from '@src/service'

    export default {
        name: "hyrefundDetail",
        components: {
            records,
            hydetail},
        data() {
            return {

                billForm:{

                    id:'',
                    billcode:'',
                    shopid:'',
                    shopcode:'',
                    shopname:'',
                    memname:'',
                    mobile:'',
                    memid:'',
                    isKd:'0',
                    cardChecked:false,
                    packChecked:false,
                    proChecked:false,
                    totalMoney:0,//实退金额
                    status:1,//1 未提交  2 已提交  3 已审批  4 已驳回  5 已复核
                    cardMoney:0,
                    packageMoney:0,
                    productMoney:0,
                    redpacksMoney:0,
                    couponnum:0,
                    tkname:'',
                    tkmobile:'',
                    tktype:'',
                    payee:'',
                    bank:'',
                    bankno:'',
                    tkattr:'',
                    tkway:'',
                    tkcontent:'',
                    photopath:'',
                    hsmemo:'',
                    hstkcontent:'',
                    hstkattr:'',
                    cardVOs:[],
                    packageVOs:[],
                    couponVOs:[],
                    productVOs:[],
                    redpackVOs:[],
                    rejectmemo:'',

        },
                printObj: {
                    id: "printId",
                    popTitle: "",
                    extraCss: "",
                    extraHead: '<meta http-equiv="Content-Language" content="zh-cn"/>'
                },
                photosrcList:[],
                activetab:'first',
                showButton : true,
                isSp:true,
                isCancelFh:false,
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                maxImgs:1,
                upload:"https://api.yidmall.com/api-file/files-anon",
                // upload: yid.config.API.UPLOAD,
                myheaders:{},
                detailDialog:{
                    visible:false,
                    title:'',
                },
                hyDetailDialog:{
                    visible:false,
                    title:'注销明细',
                },
                cards:[
                ],
                cardsye:[
                ],
                rechanges:[
                ],
                formCard:{
                    cardid:'',
                    date:[],
                    shopcode:'',//购买门店
                    lessNum:'',//余量
                },
                pageInfo:{page:0,limit:10},
                packages:[
                ],
                detailInitData:{},
                isShowHyDetail:false,

            }
        },
        computed: {
            ...mapGetters({
                userInfo: 'user/userInfo',
            })
        },
        created() {
            this.handleprint();
        },
        mounted(){
            this.myheaders = {
                authorization: "Bearer " + yid.cache.get(yid.type.USER.TOKEN)
            }
        },
        methods:{
            async initData(obj){
                //   await this.restData();
                this.baseData = obj;
                let headData =  this.baseData.headData
                this.billForm.shopid = headData.shopid;
                this.billForm.shopcode = headData.shopcode;
                this.billForm.shopname = headData.shopname;
                this.billForm.memname =headData.memname;
                this.billForm.mobile =headData.mobile;
                this.billForm.memid =headData.memid;
                this.billForm.cardVOs =headData.cardVOs;
                this.billForm.packageVOs = headData.packageVOs;
                this.billForm.couponVOs = headData.couponVOs;
                this.billForm.redpackVOs = headData.redpackVOs;
                this.billForm.productVOs = headData.productVOs;
                this.billForm.billcode = headData.billcode;
                this.billForm.status = headData.status;
                this.billForm.id = headData.id;
                this.billForm.cardMoney = headData.cardMoney;
                this.billForm.packageMoney = headData.packageMoney;
                this.billForm.productMoney = headData.productMoney;
                this.billForm.redpacksMoney = headData.redpacksMoney;
                this.billForm.couponnum = headData.couponnum;
                this.billForm.tkname = headData.tkname;
                this.billForm.tkmobile = headData.tkmobile;
                this.billForm.tktype = headData.tktype;
                this.billForm.payee = headData.payee;
                this.billForm.bank = headData.bank;
                this.billForm.bankno = headData.bankno;
                this.billForm.tkattr = headData.tkattr;
                this.billForm.tkway = headData.tkway;
                this.billForm.tkcontent = headData.tkcontent;
                this.billForm.photopath = headData.photopath;
                this.billForm.totalMoney = headData.totalMoney;
                this.billForm.hsmemo = headData.hsmemo;
                this.billForm.hstkcontent = headData.hstkcontent;
                this.billForm.hstkattr = headData.hstkattr;
                this.billForm.isKd = headData.isKd;
                this.billForm.autokcard = headData.autokcard;
                if(headData.autokcard=="1"){
                    this.billForm.cardChecked=true;
                }else{
                    this.billForm.cardChecked=false;
                }
                this.showButton = headData.status=='3';
                this.isSp = headData.status=='3';
                this.isCancelFh = headData.status=='4';
                this.photosrcList=[];
                this.photosrcList.push(this.billForm.photopath);
                console.error(this.baseData.actionType);
            },
            showHyDetail(){
                this.hyDetailDialog.visible = true
                this.detailInitData.headData = this.billForm;
                this.$nextTick(()=>{
                    this.$refs.detailPage.initData(this.detailInitData);
                })
            },
            //注销全部
            logout(){

            },
            back() {
               // this.$parent.search();
                this.$parent.showList = true
            },

            handleprint(val) {
                //console.log(val)
            },
             auditBill(){

                let id = this.billForm.id;
                let billcode = this.billForm.billcode;
                let status = this.billForm.status;
                if(!yid.util.isEmpty(billcode)){
                    yid.util.confirm("您确定要复核["+billcode+"]的单据?","","",()=>{
                        if(status == '1'){
                            yid.util.error("未提交的单据不能进行复核");
                            return false;
                        }else if(status == '2'){
                            yid.util.error("已提交的单据不能进行复核");
                            return false;
                        }else if(status == '4'){
                            yid.util.error("已复核单据不能进行复核");
                            return false;
                        }else{
                            //调用审核单据接口
                            service.finance.hyrefund.censorFh({id:id,billcode:billcode}).then(res=>{
                                if(res.resp_code=="200"){
                                    yid.util.success("复核成功");
                                    this.showList = true;
                                    this.showButton = false;
                                    this.isSp = false;
                                }else{
                                    yid.util.error(res.resp_msg);
                                }
                            })
                        }
                    })
                }else{
                    yid.util.error("单据保存后再进行复核!");
                    return;
                }
            },
            cancelFhBill(){

                let id = this.billForm.id;
                let billcode = this.billForm.billcode;
                let status = this.billForm.status;
                if(!yid.util.isEmpty(billcode)){
                    yid.util.confirm("您确定要取消复核["+billcode+"]的单据?","","",()=>{
                        if(status != '4'){
                            yid.util.error("未复核的单据不能取消复核");
                            return false;
                        }else{
                            //调用审核单据接口
                            service.finance.hyrefund.cancelFhBill({id:id,billcode:billcode}).then(res=>{
                                if(res.resp_code=="200"){
                                    yid.util.success("取消复核成功");
                                    this.showList = true;
                                    this.showButton = false;
                                    this.isCancelFh = false;
                                }else{
                                    yid.util.error(res.resp_msg);
                                }
                            })
                        }
                    })
                }else{
                    yid.util.error("单据保存后再进行复核!");
                    return;
                }
            },


            showDetail(type){
                type=='cards'?this.detailDialog.title = '卡金明细':
                    type=='packages'?this.detailDialog.title = '套餐明细':
                        type=='products'?this.detailDialog.title = '寄存记录':
                            type=='coupons'?this.detailDialog.title = '优惠券记录':
                                type=='redpacks'?this.detailDialog.title = '红包记录':''
                this.detailDialog.visible = true

            },
            openRject(type) {
                this.$prompt('', '请输入驳回原因', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                    // inputErrorMessage: '邮箱格式不正确'
                }).then(({ value }) => {
                    if(!yid.util.isEmpty(value)){
                        this.billForm.rejectmemo =value;
                        //驳回
                        this.rejectBill();

                    }else{
                        yid.util.error("请先填写驳回原因");
                    }

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },

            rejectBill(){
                let id = this.billForm.id;
                let billcode = this.billForm.billcode;
                let status = this.billForm.status;
                let rejectmemo= this.billForm.rejectmemo;

                if(status == '4'){
                    yid.util.error("已复核的单据不能驳回");
                    return;
                }
                //调用驳回单据接口
                service.finance.hyrefund.rejectBillFh({id:id,billcode:billcode,rejectmemo:rejectmemo}).then(res=>{
                    if(res.resp_code=="200"){
                        yid.util.success("驳回成功");
                        this.$parent.showList = true
                        this.$parent.search();
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },

        }
    }
</script>
<style scoped lang="scss">
    .hyrefund{
        height: 100%;
        overflow: auto;
        /deep/.el-table{
            .disableRowClass{
                color: #ccc;
            }
        }

    }
</style>
