<template>
<div class="hyrefundOlineDetail">
    <el-row>
        <el-button @click="back" type="primary">返回</el-button>
        <el-button @click="saveBill" v-show="!this.showButton" type="primary" style="margin-left: 60px">保存</el-button>
        <el-button @click="openRejectDialog" v-show="!this.showButton" type="primary">驳回</el-button>
        <el-button @click="auditBill" v-show="!this.showButton" type="primary">审核</el-button>
        <el-button v-print="printObj" v-show="true" @click="handleprint(printObj)">打印</el-button>
    </el-row>
    <div ref="printId" id="printId" cellspacing="0" cellpadding="0" border="0">
    <el-form ref="billForm" :model="billForm" style="margin-top: 16px; padding-bottom: 20px" label-width="100px" label-position="right">
        <el-row>
            <span><b>单据编码：</b>{{billForm.billcode?billForm.billcode:'自动生成'}}</span>
            <span style="margin-left: 80px"><b>店号：</b>{{billForm.shopcode}}</span>
            <span style="margin-left: 80px"><b>退款人：</b>
                <el-select filterable placeholder="请选择" :disabled="true" style="width: 110px;" v-model.trim="billForm.memType" @change="changememType">
                    <el-option
                        v-for="item in memtypelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!--<el-input clearable v-model.trim="searchTel" :disabled="true" placeholder="会员手机号码"  style="width: 150px; margin-right: 15px"></el-input>
                <el-button @click="searchMem" type="primary" v-if="hyType=='01'">查询</el-button>-->
            </span>
        </el-row>
        <el-row style="margin: 15px 0">
            <span><b>会员姓名：</b>{{billForm.memName}}</span>
            <span style="margin-left: 80px"><b>会员手机号：</b>{{billForm.memTel}}</span>
            <span style="margin-left: 80px"><b>会员id：</b>{{billForm.memId}}</span>
        </el-row>
        <el-row style="margin: 15px 0; font-size: 16px"><b>退款明细:</b></el-row>
        <el-row>
            <el-col :span="8">
                <div class="item">
                    <span class="labtitle"><label>*</label>项目分类：</span>
                    <el-select filterable placeholder="请选择" @change="showBillcode" v-show="billForm.shopType==1" :disabled ="true" style="width: 150px;" v-model.trim="billForm.serveTypeMf">
                        <el-option
                                v-for="item in servetypelistmf"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select filterable placeholder="请选择" @change="showBillcode" v-show="billForm.shopType==2" :disabled ="true" style="width: 150px;" v-model.trim="billForm.serveTypeMr">
                        <el-option
                                v-for="item in servetypelistmr"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input clearable placeholder="请输入订单号" v-show="showtkbillcode" :disabled ='true'  v-model.trim="billForm.tkBillcode"  style="width: 150px;"></el-input>
                </div>
                <div  class="item">
                    <span class="labtitle"><label>*</label>退款联系人：</span>
                    <el-input clearable placeholder="姓名" :disabled ='true'  v-model.trim="billForm.tkName"  style="width: 100px;"></el-input>
                    <el-input clearable placeholder="手机号" @blur="checktkmobile" :disabled ='true' v-model.trim="billForm.tkMobile"  style="width: 150px;"></el-input>
                </div>
                <div>
                    <span class="labtitle"  style="margin-bottom: 15px"><label>*</label>打款方式：</span>
                    <el-select filterable placeholder="请选择" @change="getTkInfo" style="width: 120px;  margin-right: 10px; margin-bottom: 15px" :disabled ='this.showPayType' v-model.trim="billForm.payType">
                        <el-option
                                v-for="item in paytypelist"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                        <el-option v-show="billForm.shopType==2" key="4" value="4" label="微慕卡"></el-option>
                    </el-select>
                    <!--<el-input clearable placeholder="开户行" :disabled ='true' v-model.trim="billForm.bank"  style="width: 150px; margin-right: 10px; margin-bottom: 15px"></el-input>-->
                    <el-select :disabled="this.showBankInfo" style="width: 150px" v-model="billForm.bank" placeholder="请选择开户行">
                        <el-option
                                clearable
                                v-for="item in bankList"
                                :key="item.id"
                                :label="item.bank"
                                :value="item.bank">
                        </el-option>
                    </el-select>
                    <el-input clearable placeholder="户名" :disabled="this.showBankInfo" v-model.trim="billForm.payee"  style="width: 100px; margin-right: 10px; margin-bottom: 15px"></el-input>
                    <el-input clearable placeholder="账户" :disabled="this.showBankInfo" oninput="value=value.replace(/[^\d]/g,'')" v-model.trim="billForm.bankno" style="width: 200px; margin-right: 10px; margin-bottom: 15px"></el-input>
                </div>
            </el-col>
            <el-col :span="8">
                <div  class="item"><span class="labtitle"><label></label>卡号：</span>
                    <el-input clearable placeholder="卡号" :disabled ='true'  v-model.trim="billForm.cmcode"  style="width: 150px;"></el-input>
                </div>
                <div  class="item">
                    <!--<span class="labtitle"><label>*</label>门店类型：</span>
                    <el-select clearable filterable placeholder="请选择" style="width: 160px;  margin-right: 10px" :disabled ='this.showButton' v-model.trim="billForm.shoptype">
                        <el-option key="'k_'+1" value="1" label="对私"></el-option>
                        <el-option key="'k_'+2" value="2" label="对私"></el-option>
                    </el-select>-->
                </div>
                <div  class="item">
                    <span class="labtitle"><label>*</label>退款属性：</span>
                    <el-select filterable placeholder="请选择" :disabled ='true'  v-model.trim="billForm.tkAttr">
                        <el-option
                                v-for="item in tkattrlist"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div  class="item">
                    <span class="labtitle"><label>*</label>退款方式：</span>
                    <el-select clearable filterable placeholder="请选择" :disabled ='this.showButton'  v-model.trim="billForm.tkType">
                        <el-option
                                v-for="item in tktypelist"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="item"><span class="labtitle"><label>*</label>实退金额：</span>
                    <el-input clearable placeholder="" @blur="checkTkmoney" :disabled ='true'  v-model.trim="billForm.tkMoney"  style="width: 130px;"></el-input>
                </div>
                <div class="item" style="display: flex">
                    <label>上传附件：</label>
                    <div style="display: flex; flex-direction: column">
                        <el-upload
                                :disabled = 'true'
                                :action="upload"
                                :headers="myheaders"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload" style="height: 130px">
                            <div style="width: 120px; height: 20px; position: relative">
                                <img v-if="billForm.photo" :src="billForm.photo" class="avatar el-upload" style="width: 120px;height: 120px">
                                <div style="width: 118px; height: 118px; border: 1px #ccc solid; border-radius: 4px; line-height: 120px; text-align: center" v-else><i class="el-icon-plus avatar-uploader-icon"></i></div>
                                <i class="el-icon-remove" v-show="billForm.photo" @click.stop="handleRemove"
                                   style="color: red; font-size: 20px; position: absolute; right: 2px; top: 2px; cursor: pointer">
                                </i>
                                <i class="el-icon-zoom-in" v-show="billForm.photo" @click.stop="handlePictureCardPreview(billForm.photo)"
                                   style="position: absolute; left: 50px; top: 50px; font-size: 20px">
                                </i>
                            </div>
                        </el-upload>
                        <label style="font-size: 13px">上传图片不超过2M，支持图片格式JPG、PNG</label>
                    </div>

                </div>
            </el-col>
        </el-row>
        <el-row>
            <label style="color: red; font-weight: bold; margin-right: 5px">*</label>退款原因：
            <el-input
                    @blur="checktkmemo"
                    type="textarea" :disabled ='true'
                    :rows="3"
                    placeholder="请输入内容500字以内"
                    v-model="billForm.tkmemo" style="margin-top: 10px">
            </el-input>
        </el-row>
        <el-row :gutter="20" style="margin-top: 15px; border-top: 1px #f2f2f2 solid; padding-top: 15px">
            <el-col :span="8" style="overflow: hidden">
                <div style="display: flex; flex-direction: column">
                    <div>
                        核实退款属性：
                        <el-select :disabled ='this.showButton' clearable filterable placeholder="请选择" style="width: 200px;" v-model.trim="billForm.hsAttr">
                            <el-option
                                    v-for="item in tkattrlist"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        核实退款原因：
                        <el-input :disabled ='this.showButton'  @blur="checktkmemo2"
                                type="textarea"
                                :rows="5"
                                placeholder="请输入内容500字以内"
                                v-model="billForm.hsmemo" style="margin-top: 10px">
                        </el-input>
                    </div>
                </div>
            </el-col>
            <el-col :span="16">
                <div style="display: flex; flex-direction: column">

                    <div>
                        回访备注：
                        <el-input :disabled ='this.showButton'  @blur="checktkmemo1"
                                type="textarea"
                                :rows="5"
                                placeholder="请输入内容500字以内"
                                v-model="billForm.memo" style="margin-top: 10px">
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

    <yid-dialog :title="rejectDialog.title" :visible.sync="rejectDialog.visible" width="450px">
        <el-form ref="rejectForm" :model="rejectForm"  label-width="140px">
            <el-form-item label="驳回原因：" prop="rejectMemo" :rules="[{ required: true, message: '驳回原因不能为空'}]">
                <el-input clearable v-model="rejectForm.rejectMemo" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="rejectBillsp" type="primary">确定</el-button>
                <el-button @click="closeRejectDialog">取消</el-button>
            </el-form-item>
        </el-form>
    </yid-dialog>

    <yid-dialog :title="auditDialog.title" :visible.sync="auditDialog.visible" width="450px">
        <el-form ref="rejectForm" :model="auditForm"  label-width="140px">
            <el-form-item label="审核原因：" prop="auditMemo" :rules="[{ required: true, message: '审核原因不能为空'}]">
                <el-input clearable v-model="auditForm.auditMemo" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="auditBill" type="primary">确定</el-button>
                <el-button @click="closeAuditDialog">取消</el-button>
            </el-form-item>
        </el-form>
    </yid-dialog>
</div>
</template>
<script>
    import yid from '@src/library'
    import { mapGetters } from 'vuex'
    import moment from 'moment';
    import service from '@src/service'
    export default {
        name: "hyrefundOlineDetail",
        data() {
            return {
                hyType:'01',
                searchTel : '',
                baseData : {},
                showtkbillcode : false,
                showBankInfo : false,
                showPayType : false,
                billForm:{
                    id : '',
                    billcode:'',
                    shopid : '',
                    shopcode:'',
                    shopname :'',
                    shopType : '',
                    brandId :'',
                    brandCode : '',
                    memType : '',
                    memName:'',
                    memTel:'',
                    memId:'',
                    serveType:'',
                    serveTypeMf:'',
                    serveTypeMr:'',
                    tkName:'',
                    tkMobile : '',
                    tkBillcode :'',
                    bank:'',
                    bankno:'',
                    payee:'',
                    cmcode:'',
                    tkAttr:'',
                    hsAttr:'',
                    tkType:'',
                    payType :'',
                    photo:'',
                    tkmemo:'',
                    hsmemo : '',
                    memo:'',
                    tkMoney:'',//实退金额
                    status:'',//1-申请，2-提交，3-已审核，4-已复核 9-作废，0-驳回
                    auditBy:'',
                    auditMemo : '',
                    auditTime : '',
                    rejectBy : '',
                    rejectTime : '',
                    rejectMemo : '',
                    createdBy : '',
                    createdTime : '',
                    updatedBy : '',
                    updatedTime : '',
                 },
                memtypelist:[{
                    value: '1',
                    label: '会员'
                }, {
                    value: '2',
                    label: '散客'
                }],
                statusList:[{
                    value: '1',
                    label: '未提交'
                }, {
                    value: '2',
                    label: '已提交'
                }, {
                    value: '3',
                    label: '客服已审批'
                }, {
                    value: '4',
                    label: '财务已复核'
                }, {
                    value: '0',
                    label: '已驳回'
                }, {
                    value: '9',
                    label: '已作废'
                }],
                tktypelist:[{
                    value: '1',
                    label: '营业款'
                }, {
                    value: '2',
                    label: '预留款'
                }, {
                    value: '3',
                    label: '退卡保证金'
                }, {
                    value: '4',
                    label: '风险金'
                }, {
                    value: '5',
                    label: '关店退款'
                }],
                servetypelistmf:[{
                    value: '1',
                    label: '线上项目团单'
                }, {
                    value: '2',
                    label: '洗护产品'
                }, {
                    value: '3',
                    label: '跨店承担退卡'
                }, {
                    value: '4',
                    label: '跨月消费退款'
                }, {
                    value: '5',
                    label: '其他'
                }, {
                    value: '6',
                    label: '老卡退卡'
                }],
                servetypelistmr:[{
                    value: '1',
                    label: '美容项目'
                }, {
                    value: '2',
                    label: '美容产品'
                }, {
                    value: '3',
                    label: '微慕'
                }, {
                    value: '4',
                    label: '跨店承担退卡'
                }, {
                    value: '5',
                    label: '其他'
                }],
                paytypelist:[{
                    value: '1',
                    label: '店内支出卡'
                }, {
                    value: '2',
                    label: '顾客银行卡'
                }, {
                    value: '3',
                    label: '退为卡金'
                }],
                tkattrlist : [{
                    value: '1',
                    label: '仅注销无退款'
                }, {
                    value: '2',
                    label: '员工离职'
                }, {
                    value: '3',
                    label: '个人原因'
                }, {
                    value: '4',
                    label: '技术原因'
                }, {
                    value: '5',
                    label: '消费原因'
                }, {
                    value: '6',
                    label: '服务及接待'
                }, {
                    value: '7',
                    label: '关店原因'
                }, {
                    value: '8',
                    label: '其它'
                }],
                maxImgs:1,
                upload:"https://api.yidmall.com/api-file/files-anon",
                myheaders:{},
                dialogImageUrl: '',
                dialogVisible: false,
                showButton : false,
                printObj: {
                    id: "printId",
                    popTitle: "",
                    extraCss: "",
                    extraHead: '<meta http-equiv="Content-Language" content="zh-cn"/>'
                },
                rejectDialog: {
                    title: "",
                    visible: false
                },
                rejectForm: {
                    rejectMemo: ""
                },
                auditDialog: {
                    title: "",
                    visible: false
                },
                auditForm: {
                    auditMemo: ""
                },
                bankList : [],
            }
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
                this.restData();
                this.baseData = obj;
                this.bankList = this.baseData.bankList;
                this.billForm.shopcode = this.baseData.billData.shopcode;
                this.billForm.shopname = this.baseData.billData.shopname
                this.billForm.shopType = this.baseData.billData.shopType
                this.billForm.brandId = this.baseData.billData.brandId
                this.billForm.brandCode = this.baseData.billData.brandCode
                this.billForm.id = this.baseData.billData.id
                this.billForm.billcode = this.baseData.billData.billcode
                this.billForm.status = this.baseData.billData.status
                this.billForm.memType = this.baseData.billData.memType
                this.billForm.memName = this.baseData.billData.memName
                this.billForm.memTel = this.baseData.billData.memTel
                this.billForm.memId = this.baseData.billData.memId
                this.billForm.serveType = this.baseData.billData.serveType
                if(this.billForm.shopType==1){
                    this.billForm.serveTypeMf = this.baseData.billData.serveType
                }else if(this.billForm.shopType==2){
                    this.billForm.serveTypeMr = this.baseData.billData.serveType
                }
                this.billForm.cmcode = this.baseData.billData.cmcode
                this.billForm.tkMoney = this.baseData.billData.tkMoney
                this.billForm.tkName = this.baseData.billData.tkName
                this.billForm.tkMobile = this.baseData.billData.tkMobile
                this.billForm.tkAttr = this.baseData.billData.tkAttr
                this.billForm.photo = this.baseData.billData.photo
                this.billForm.payType = this.baseData.billData.payType
                this.billForm.tkType = this.baseData.billData.tkType
                this.billForm.payee = this.baseData.billData.payee
                this.billForm.bank = this.baseData.billData.bank
                this.billForm.bankno = this.baseData.billData.bankno
                this.billForm.tkmemo = this.baseData.billData.tkmemo
                this.billForm.hsmemo = this.baseData.billData.hsmemo
                this.billForm.hsAttr = this.baseData.billData.hsAttr
                this.billForm.memo = this.baseData.billData.memo
                this.billForm.createdBy = this.baseData.billData.createdBy
                this.billForm.createdTime = this.baseData.billData.createdTime
                this.billForm.rejectBy = this.baseData.billData.rejectBy
                this.billForm.rejectTime = this.baseData.billData.rejectTime
                this.billForm.rejectMemo = this.baseData.billData.rejectMemo
                this.billForm.auditBy = this.baseData.billData.auditBy
                this.billForm.auditedTime = this.baseData.billData.auditedTime
                this.billForm.auditMemo = this.baseData.billData.auditMemo
                if(this.billForm.serveTypeMf == '4'){
                    this.showtkbillcode = true;
                    this.billForm.tkBillcode = this.baseData.billData.tkBillcode
                }else{
                    this.showtkbillcode = false;
                }
                if(this.billForm.status == '2'){
                    this.showButton = false;
                    if(this.billForm.payType != '2'){
                        this.showBankInfo = true;
                    }else{
                        this.showBankInfo = false;
                    }
                    if(this.billForm.serveTypeMr == '3'){//微慕
                        this.showPayType = true;
                    }else{
                        this.showPayType = false;
                    }
                }else{
                    this.showBankInfo = true;
                    this.showButton = true;
                    this.showPayType = true;
                }
            },
            back() {
                this.$emit('onClose');
            },
            handleprint(val) {
                //console.log(val)
            },
            handleRemove(file) {
                this.billForm.photo = ''
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file;
                this.dialogVisible = true;
            },
            handleAvatarSuccess(res, file) {
                this.billForm.photo = res.data.url;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === "image/jpeg" || file.type === "image/png";
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    yid.util.warning("上传头像图片只能是 JPG/PNG 格式!");
                    return;
                }
                if (!isLt2M) {
                    yid.util.warning("上传头像图片大小不能超过 2MB!");
                    return;
                }
                return isJPG && isLt2M;
            },
            changememType(){
                if(!yid.util.isEmpty(this.billForm.memType)){
                    if(this.billForm.memType == 1){
                        this.hyType = '01';
                    }else{
                        this.searchTel = ''
                        this.billForm.memId = ''
                        this.billForm.memName = ''
                        this.billForm.memTel = ''
                        this.hyType = '02';
                    }
                }
            },
            restData(){
                Object.assign(this.$data, this.$options.data());
            },
            isPhone(val){
                if(yid.validate.telephone(val)){
                    return true;
                }else{
                    return false;
                }
            },
            isNumber(val) {
                if(yid.validate.pNumerical2(val)) {
                    return true;
                } else {
                    return false;
                }
            },
            checkTkmoney(){
                let val = this.billForm.tkMoney;
                if(!yid.util.isEmpty(val)){
                    if(!this.isNumber(val)){
                        yid.util.warning("实退金额必须输入小数点后两位以内的数字!");
                        this.billForm.tkMoney = '';
                        return
                    }
                    if(Number(val) <= 0){
                        yid.util.warning("实退金额必须大于0!");
                        this.billForm.tkMoney = '';
                        return;
                    }
                    if(val.length > 32){
                        yid.util.warning("输入数字长度超出范围!");
                        this.billForm.tkMoney = '';
                        return;
                    }
                }
            },
            checktkmobile(){
                let tkMobile = this.billForm.tkMobile;
                if(!yid.util.isEmpty(tkMobile)){
                    if(!this.isPhone(tkMobile)){
                        yid.util.warning("请输入正确的手机号码!");
                        this.billForm.tkMobile = '';
                        return
                    }
                }
            },
            showBillcode(){
                let typemf = this.billForm.serveTypeMf;
                if(!yid.util.isEmpty(typemf)){
                    if(typemf == '4'){
                        this.showtkbillcode = true;
                    }else{
                        this.billForm.tkBillcode = '';
                        this.showtkbillcode = false;
                    }
                }
            },
            getTkInfo(){
                let payType = this.billForm.payType;
                if(!yid.util.isEmpty(payType)){
                    if(payType == '1'){
                        this.showBankInfo = true;
                        //查询店内支出帐号
                        service.finance.shopExt.listAll({shopcode:this.billForm.shopcode,isDel:"0"}).then(res=>{
                            if(res.data.length > 0){
                                let shopext = res.data[0];
                                this.billForm.payee = shopext.payee
                                this.billForm.bank = shopext.bank
                                this.billForm.bankno = shopext.bankno
                            }else{
                                yid.util.info("门店收款帐号未配置");
                                this.billForm.payee = ''
                                this.billForm.bank = ''
                                this.billForm.bankno = ''
                                return
                            }
                        })
                    }else if(payType == '2'){
                        this.showBankInfo = false;
                        this.billForm.payee = ''
                        this.billForm.bank = ''
                        this.billForm.bankno = ''
                        return
                    }else if(payType == '3'){
                        this.showBankInfo = true;
                        this.billForm.payee = ''
                        this.billForm.bank = ''
                        this.billForm.bankno = ''
                        return
                    }else if(payType == '4'){
                        this.showBankInfo = true;
                        this.billForm.payee = '曹骋'
                        this.billForm.bank = '中国银行'
                        this.billForm.bankno = '6217867600001204760'
                        return
                    }
                }
            },
            checktkmemo(){
                let tkmemo = this.billForm.tkmemo;
                if(!yid.util.isEmpty(tkmemo)){
                    if(tkmemo.length > 500){
                        yid.util.info("退款原因长度超过限制!");
                        this.billForm.tkmemo = ''
                        return
                    }
                }
            },
            checktkmemo1(){
                let memo = this.billForm.memo
                if(!yid.util.isEmpty(memo)){
                    if(memo.length > 500){
                        yid.util.info("回访备注长度超过限制!");
                        this.billForm.memo = ''
                        return
                    }
                }
            },
            checktkmemo2(){
                let hsmemo = this.billForm.hsmemo
                if(!yid.util.isEmpty(hsmemo)){
                    if(hsmemo.length > 500){
                        yid.util.info("核实退款原因长度超过限制!");
                        this.billForm.hsmemo = ''
                        return
                    }
                }
            },
            saveBill(){
                if(yid.util.isEmpty(this.billForm.memType)){
                    yid.util.warning("退款人类型不能为空!");
                    return
                }
                if(this.billForm.memType == '1'){
                    if(yid.util.isEmpty(this.billForm.memId) || yid.util.isEmpty(this.billForm.memName) || yid.util.isEmpty(this.billForm.memTel)){
                        yid.util.warning("退款人为会员类型的需要查询会资料信息!");
                        return
                    }
                }
                let serveType = '';
                if(!yid.util.isEmpty(this.billForm.serveTypeMf)){
                    serveType = this.billForm.serveTypeMf
                }
                if(!yid.util.isEmpty(this.billForm.serveTypeMr)){
                    serveType = this.billForm.serveTypeMr
                }
                this.billForm.serveType = serveType;
                if(yid.util.isEmpty(this.billForm.serveType)){
                    yid.util.warning("项目分类不能为空!");
                    return
                }
                if(this.billForm.shopType == '1'){
                    if(this.billForm.serveType == '4'){
                        let tkBillcode = this.billForm.tkBillcode;
                        if(yid.util.isEmpty(tkBillcode)){
                            yid.util.warning("当选择消费退款时,需要必填对应消费单据编号!");
                            return
                        }
                    }
                }
                if(yid.util.isEmpty(this.billForm.tkMoney)){
                    yid.util.warning("实退金额不能为空!");
                    return
                }
                if(yid.util.isEmpty(this.billForm.tkName) || yid.util.isEmpty(this.billForm.tkMobile)){
                    yid.util.warning("退款联系人信息不能为空!");
                    return
                }
                if(yid.util.isEmpty(this.billForm.tkAttr)){
                    yid.util.warning("退款属性不能为空!");
                    return
                }
                if(yid.util.isEmpty(this.billForm.payType)){
                    yid.util.warning("打款方式不能为空!");
                    return
                }
                if(this.billForm.payType == '1' || this.billForm.payType=='2'){
                    if(yid.util.isEmpty(this.billForm.payee) || yid.util.isEmpty(this.billForm.bank) || yid.util.isEmpty(this.billForm.bankno)){
                        yid.util.warning("打款方式为店内支出卡或者顾客银行卡时,对应的银行账户信息不能为空!");
                        return
                    }

                    /*if(this.billForm.bankno.length > 19){
                        yid.util.warning("打款银行账户信息超出长度!");
                        return
                    }*/
                }
                if(yid.util.isEmpty(this.billForm.tkType)){
                    yid.util.warning("退款方式不能为空!");
                    return
                }
                if(yid.util.isEmpty(this.billForm.tkmemo)){
                    yid.util.warning("退款原因不能为空!");
                    return
                }
                if(yid.util.isEmpty(this.billForm.hsAttr)){
                    yid.util.warning("核实退款原因不能为空!");
                    return
                }
                console.log(this.billForm);
                service.finance.xxtkRecords.saveBill(this.billForm).then(res=>{
                    if(res.resp_code=="200"){
                        this.billForm = res.data;
                        if(this.billForm.shopType==1){
                            this.billForm.serveTypeMf = this.billForm.serveType
                        }else if(this.billForm.shopType==2){
                            this.billForm.serveTypeMr = this.billForm.serveType
                        }
                        yid.util.success("保存成功");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            openRejectDialog() {
                this.rejectForm.rejectMemo = "";
                this.rejectDialog.visible = true;
            },
            closeRejectDialog() {
                this.rejectDialog.visible = false;
            },
            rejectBillsp(){
                if (!yid.util.isEmpty(this.billForm.billcode)) {
                    if (yid.util.isEmpty(this.rejectForm.rejectMemo)) {
                        yid.util.error("驳回原因不能为空!");
                        return;
                    }
                    if (this.billForm.status == "1") {
                        yid.util.error("单据状态为【未提交】不能进行驳回!");
                        return;
                    }else if (this.billForm.status == "4") {
                        yid.util.error("单据状态为【已复核】不能进行驳回!");
                        return;
                    } else if (this.billForm.status == "0") {
                        yid.util.error("单据状态为【已驳回】不能进行驳回!");
                        return;
                    } else if (this.billForm.status == "9") {
                        yid.util.error("单据状态为【已作废】不能进行驳回!");
                        return;
                    }
                    this.billForm.rejectMemo = this.rejectForm.rejectMemo;
                    service.finance.xxtkRecords.rejectBillsp(this.billForm).then(res => {
                        if (res.resp_code == "200") {
                            yid.util.success("驳回成功!");
                            this.closeRejectDialog();
                            this.back();
                        } else {
                            yid.util.error(res.resp_msg);
                        }
                    });
                } else {
                    yid.util.error("单据编码为空!");
                    return;
                }
            },
            closeAuditDialog(){
                this.auditDialog.visible = false;
            },
            auditBill(){
                if(yid.util.isEmpty(this.billForm.memType)){
                    yid.util.warning("退款人类型不能为空!");
                    return
                }
                if(this.billForm.memType == '1'){
                    if(yid.util.isEmpty(this.billForm.memId) || yid.util.isEmpty(this.billForm.memName) || yid.util.isEmpty(this.billForm.memTel)){
                        yid.util.warning("退款人为会员类型的需要查询会资料信息!");
                        return
                    }
                }
                let serveType = '';
                if(!yid.util.isEmpty(this.billForm.serveTypeMf)){
                    serveType = this.billForm.serveTypeMf
                }
                if(!yid.util.isEmpty(this.billForm.serveTypeMr)){
                    serveType = this.billForm.serveTypeMr
                }
                this.billForm.serveType = serveType;
                if(yid.util.isEmpty(this.billForm.serveType)){
                    yid.util.warning("项目分类不能为空!");
                    return
                }
                if(this.billForm.shopType == '1'){
                    if(this.billForm.serveType == '4'){
                        let tkBillcode = this.billForm.tkBillcode;
                        if(yid.util.isEmpty(tkBillcode)){
                            yid.util.warning("当选择消费退款时,需要必填对应消费单据编号!");
                            return
                        }
                    }
                }
                if(yid.util.isEmpty(this.billForm.tkMoney)){
                    yid.util.warning("实退金额不能为空!");
                    return
                }
                if(yid.util.isEmpty(this.billForm.tkName) || yid.util.isEmpty(this.billForm.tkMobile)){
                    yid.util.warning("退款联系人信息不能为空!");
                    return
                }
                if(yid.util.isEmpty(this.billForm.tkAttr)){
                    yid.util.warning("退款属性不能为空!");
                    return
                }
                if(yid.util.isEmpty(this.billForm.payType)){
                    yid.util.warning("打款方式不能为空!");
                    return
                }
                if(this.billForm.payType == '1' || this.billForm.payType=='2'){
                    if(yid.util.isEmpty(this.billForm.payee) || yid.util.isEmpty(this.billForm.bank) || yid.util.isEmpty(this.billForm.bankno)){
                        yid.util.warning("打款方式为店内支出卡或者顾客银行卡时,对应的银行账户信息不能为空!");
                        return
                    }
                   /* if(this.billForm.bankno.length > 19){
                        yid.util.warning("打款银行账户信息超出长度!");
                        return
                    }*/
                }
                if(yid.util.isEmpty(this.billForm.tkType)){
                    yid.util.warning("退款方式不能为空!");
                    return
                }
                if(yid.util.isEmpty(this.billForm.tkmemo)){
                    yid.util.warning("退款原因不能为空!");
                    return
                }
                service.finance.xxtkRecords.saveBill(this.billForm).then(res=>{
                    if(res.resp_code=="200"){
                        this.billForm = res.data;
                        if(this.billForm.shopType==1){
                            this.billForm.serveTypeMf = this.billForm.serveType
                        }else if(this.billForm.shopType==2){
                            this.billForm.serveTypeMr = this.billForm.serveType
                        }

                        if(yid.util.isEmpty(this.billForm.hsAttr)){
                            yid.util.warning("核实退款原因不能为空!");
                            return
                        }
                        let id = this.billForm.id;
                        let billcode = this.billForm.billcode;
                        let status = this.billForm.status;
                        if(!yid.util.isEmpty(billcode)){
                            yid.util.confirm("您确定要审核["+billcode+"]的单据?","","",()=>{
                                if(status == '1'){
                                    yid.util.error("未提交的单据不能再次进行审核");
                                    return;
                                }else if(status == '3'){
                                    yid.util.error("已审核的单据不能再次进行审核");
                                    return;
                                }else if(status == '4'){
                                    yid.util.error("已复核的单据不能再次进行审核");
                                    return;
                                }else if(status == '9'){
                                    yid.util.error("已作废的单据不能再次进行审核");
                                    return;
                                }else if(status == '0'){
                                    yid.util.error("已驳回的单据不能再次进行审核");
                                    return;
                                }else{
                                    //调用审核单据接口
                                    service.finance.xxtkRecords.auditBillsp({id:id,billcode:billcode}).then(res=>{
                                        if(res.resp_code=="200"){
                                            yid.util.success("审核成功");
                                            this.back();
                                        }else{
                                            yid.util.error(res.resp_msg);
                                        }
                                    })
                                }
                            })
                        }else{
                            yid.util.error("单据保存后再进行审核!");
                            return;
                        }
                    }else{
                        yid.util.error(res.resp_msg);
                        return
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .hyrefundOlineDetail{
        height: 100%;
        .item{
            margin-bottom: 15px;
        }
        .labtitle{

            text-align: left;
            display: inline-block;

            label{
                color: red;
                font-weight: bold;
                margin-right: 5px
            }
        }
    }

</style>
