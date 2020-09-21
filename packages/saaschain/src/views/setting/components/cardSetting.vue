<template>
    <div class="dept">
        <el-form inline>
            <el-form-item label="">
                <el-button type="primary" @click="add()">新增</el-button>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="lookup()">{{status=='2'?'停办':'正常'}}会员卡</el-button>
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
                             v-if="scope.row.cardType=='1'">{{scope.row.ruleType=="0"?'新建规则':'编辑规则'}}</el-link>
                </template>
            </yid-table-column>
            <yid-table-column label="操作" min-width="110" prop="content">
                <template slot-scope="scope">
                    <el-link type="primary" @click="edit(scope.row)">编辑</el-link>
                    <label> / </label>
                    <el-switch
                            @change="stop(scope.row)"
                            v-model="scope.row.status=='1'?true:false"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </template>
            </yid-table-column>
        </yid-table>

        <yid-dialog :title="addDialog.title" :visible.sync="addDialog.visible" @close="levelCancel(1)" width="820px">
            <el-form :model="addDialog" :rules="rules" label-width="170px" ref="copyForm">
                <el-form-item label="卡编号：">
                    <el-input v-model="addDialog.cpcode" disabled style="width:80px"/> <explain style="color:silver">编号限定从001开始的整数,自动叠加</explain>
                </el-form-item>
                <el-form-item label="卡名称：" prop="cpname">
                    <el-input ref="name" v-model="addDialog.cpname" placeholder="卡名称"/>
                </el-form-item>
                <el-form-item label="项目分类：" prop="cardType">
                    <el-radio-group v-model="addDialog.cardType" :disabled="addDialog.id">
                        <el-radio label="1">储值卡类型</el-radio>
                        <el-radio label="2">资格卡类型</el-radio>
                    </el-radio-group>
                    <el-form v-if="addDialog.cardType==1" label-position="left" class="form-type" label-width="120px">
                        <el-form-item label="开卡金额：">
                            <el-input type="number" clearable v-model="addDialog.money" min="0" placeholder="开卡金额" style="width:220px"/>
                        </el-form-item>
                        <el-form-item label="开卡赠送：">
                            <el-input type="number" clearable v-model="addDialog.gmoney" min="0" placeholder="开卡赠送" style="width:220px"/>
                        </el-form-item>
                        <el-form-item label="开卡成本：">
                            <el-input type="number" clearable v-model="addDialog.cost" min="0" placeholder="开卡成本" style="width:220px"/>
                        </el-form-item>
                        <el-form-item label="最低充值金额：">
                            <el-input type="number" clearable v-model="addDialog.minmoney" min="0" placeholder="最低充值金额" style="width:220px"/>
                        </el-form-item>
                        <el-form-item label="充值提醒金额：">
                            <el-input type="number" clearable v-model="addDialog.reminderMoney" min="0" placeholder="充值提醒金额" style="width:220px"/>
                        </el-form-item>
                        <el-form-item label="有效期：">
                            <el-input type="number" clearable v-model="addDialog.expireMonth" min="0" placeholder="不填为永久有效" style="width:220px" />个月
                        </el-form-item>
                    </el-form>
                    <el-form v-if="addDialog.cardType==2" label-position="left" class="form-type" label-width="100px">
                        <el-form-item label="开卡金额：">
                            <el-input type="number" v-model="addDialog.money2" placeholder="开卡金额" style="width:220px"/>
                        </el-form-item>
                        <el-form-item label="有效期：">
                            <el-select v-model="addDialog.expireMonth2" filterable placeholder="有效月数" style="width: 160px;">
                                <el-option value="6" label="6个月"></el-option>
                                <el-option value="12" label="12个月"></el-option>
                                <el-option value="24" label="24个月"></el-option>
                                <el-option value="36" label="36个月"></el-option>
                                <el-option value="date" label="固定日期"></el-option>
                            </el-select>
                            <el-date-picker
                                    v-model="addDialog.expire2"
                                    type="date"
                                    v-show="addDialog.expireMonth2=='date'"
                                    style="width: 150px;"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="续卡配置：">
                            <div style="width:100%">
                                <el-row :key="index" v-for="(card,index) in addDialog.cardRules" style="width:100%">
                                    <el-col :span="8">
                                        <el-input type="number" min="1" v-model="card.month" style="width: 80px;" placeholder="月数"/>个月
                                    </el-col>
                                    <el-col :span="8">
                                        <el-input type="number" min="0" v-model="card.money" style="width: 80px;" placeholder="金额"/>元
                                    </el-col>
                                    <el-col :span="1">
                                        <i @click="delCardRule(index)" class="el-icon-delete"></i>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-link type="primary" @click="addCardRule()">添加</el-link>
                        </el-form-item>
                    </el-form>
                </el-form-item>
                <el-form-item v-if="addDialog.cardType==1" label="金额变动消息提醒：">
                    <el-select v-model="addDialog.needMsg" placeholder="请选择" style="width: 160px;">
                        <el-option value="0" label="不发送"></el-option>
                        <el-option value="1" label="发送"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目折扣：" prop="serDis">
                    <el-input type="number" clearable v-model="addDialog.serDis" style="width: 500px;" min="0" max="9.99" placeholder="折扣请输入一个数字，如9表示9折，8.5表示八五折，0表示没有折扣"/>
                </el-form-item>
                <el-form-item label="商品折扣：" prop="proDis">
                    <el-input type="number" clearable v-model="addDialog.proDis" style="width: 500px;" min="0" max="9.99" placeholder="折扣请输入一个数字，如9表示9折，8.5表示八五折，0表示没有折扣"/>
                </el-form-item>
                <el-form-item label="卡号输入：" prop="cardnoAuto">
                    <el-select v-model="addDialog.cardnoAuto" placeholder="请选择" style="width: 160px;">
                        <el-option value="1" label="自动"></el-option>
                        <el-option value="0" label="手动"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="卡过期支持消费：">
                    <el-radio-group v-model="addDialog.expireLimit">
                        <el-radio label="1">支持</el-radio>
                        <el-radio label="0">不支持</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否允许转赠：" v-if="addDialog.cardType==1">
                    <el-radio-group v-model="addDialog.isTransfer">
                        <el-radio label="1">允许</el-radio>
                        <el-radio label="0">不允许</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="addDialog.cardType==1" label="赠送金是否打折：">
                    <el-radio-group v-model="addDialog.giftDis">
                        <el-radio label="1">支持</el-radio>
                        <el-radio label="0">不支持</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--<el-form-item label="不享受会员卡折扣的支付方式：">
                    <el-checkbox-group v-model="addDialog.pays">
                        <el-checkbox label="1">现金</el-checkbox>
                        <el-checkbox label="2">银联</el-checkbox>
                        <el-checkbox label="3">支付宝</el-checkbox>
                        <el-checkbox label="4">微信</el-checkbox>
                        <el-checkbox label="5">大众点评</el-checkbox>
                        <el-checkbox label="6">划卡</el-checkbox>
                        <el-checkbox label="7">划增现金</el-checkbox>
                        <el-checkbox label="8">欠款</el-checkbox>
                        <el-checkbox label="9">红包</el-checkbox>
                        <el-checkbox label="10">免单</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>-->
                <el-form-item label="开卡备注：">
                    <el-input v-model="addDialog.memo" placeholder="请填写备注"/>
                    <explain style="color:silver">"添加会员(开卡）”操作时，新开卡会员的备注栏将导入此处输入的内容，可以用于对某种卡的使用或操作方法做特别说明</explain>
                </el-form-item>
                <el-form-item label="会员卡面图片：">
                    <el-upload
                            class="avatar-uploader"
                            action="https://sass.yidmall.com/api/api-file/files-anon"
                            :headers="myheaders"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="addDialog.photopath" :src="addDialog.photopath"  style="width: 200px;height: 200px" class="avatar el-upload">
                        <i v-else class="el-icon-plus avatar-uploader-icon el-upload"></i>
                        <div class="el-upload__tip" slot="tip">仅支持jpg，png格式的图片上传 图片尺寸：200px*200px</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveCardInfo()">保存</el-button>
                    <el-button @click="levelCancel(1)">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="ruleDialog.title" :visible.sync="ruleDialog.visible" @close="levelCancel(2)" width="800px">
            <el-row type="flex" justify="space-between" style="width:100%">
                <el-col>会员卡:{{ruleDialog.cardname}}</el-col>
                <el-col style="width:90px;"><el-button type="primary" style="width:90px;" @click="addRuleDialog()">新增规则</el-button></el-col>
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
                <yid-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="editRuleDialog(scope.row)">编辑</el-link>
                        <label> / </label>
                        <el-link type="primary" @click="delRuleDialog(scope.row)">删除</el-link>
                    </template>
                </yid-table-column>
            </yid-table>
            <el-row type="flex" justify="space-between" style="width:100%; padding-top:10px">
                <el-col span="6"></el-col>
                <el-col span="6"></el-col>
                <el-col span="6"><el-button @click="levelCancel(2)">确定</el-button></el-col>
                <el-col span="6"></el-col>
            </el-row>
        </yid-dialog>

        <yid-dialog :title="ruleAddDialog.title" :visible.sync="ruleAddDialog.visible" @close="levelCancel(3)" width="800px">
            <el-form :model="ruleAddDialog" :rules="cardRules" label-width="150px" ref="cardForm">
                <el-form-item label="类型：" prop="type">
                    <el-checkbox  v-model="ruleAddDialog.type" disabled>充值</el-checkbox>
                </el-form-item>
                <el-form-item label="开卡/充值金额：" prop="money">
                    <el-input type="number" min="0" placeholder="金额" v-model="ruleAddDialog.money"/><br/>
                </el-form-item>
                <el-form-item label="赠送模式：">
                    <el-radio-group v-model="ruleAddDialog.giftType">
                        <el-radio label="1">固定赠送金额</el-radio>
                        <el-radio label="2">充值金额比例</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="赠送：" prop="giftMoney">
                    <el-input type="number" min=0 v-model="ruleAddDialog.giftMoney"/>{{ruleAddDialog.giftType=='1'?'元':'%'}}
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveRuleDialog()">保存</el-button>
                    <el-button @click="levelCancel(3)">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'

    const validatorDisNumber = (rule, value, callback) => {
        if (!value) {
            return callback(new Error("请填写折扣"));
        } else {
            if (Number(value)<0 || Number(value)>10) {
                return callback(new Error('您输的折扣不能小于0大于10'))
            }else{
                callback();
            }
        }
    };
    export default {
        name: "cardSetting",
        data() {
            return {
                myheaders:{},
                cardnum: 3,
                status: '2',
                checkList: ['',''],
                labelPosition: 'left',
                cardData: [
                    {
                        no: '001',
                        name: '普通级别卡',
                        type: '储值卡',
                        cost: 20,
                        price: 500,
                        pjdiscount: 30,
                        pddiscount: 50,
                        redminder: '是',
                        origin: '自动',
                        rule: '1'
                    }
                ],
                imageUrl: '',
                addDialog: {
                    title: '',
                    visible: false,
                    cpcode: '',
                    cpname: '',
                    money: '',
                    gmoney: '',
                    cardType: '',
                    minmoney: '',
                    reminderMoney: '',
                    expire: '',
                    expireMonth: '',
                    keepMoney: '',
                    money2: '',
                    expire2: '',
                    expireMonth2: '',
                    memo: '',
                    photopath: '',
                    needMsg: '',
                    serDis: '',
                    proDis: '',
                    cardnoAuto: '',
                    expireLimit: '',
                    withGmoney: '',
                    giftDis: '',
                    pays: [],
                    cardRules: [],
                    isTransfer: '',
                },
                ruleDialog: {
                    title: '',
                    visible: false,
                    cardid: '',
                    cpname:'',
                    cardRules: ''
                },
                ruleAddDialog: {
                    title: '',
                    visible: false,
                    cardid: '',
                    type: true,
                    money: '',
                    giftType: '',
                    giftMoney: ''
                },
                rules:{
                    cpname:[{required: true, message:'请填写卡名称'}, {min: 0, max: 10, message: '卡名称在10个字符以内'}],
                    cardType:[{required: true, message:'请选择项目分类'}],
                    serDis:[{required: true, validator: validatorDisNumber}],
                    proDis:[{required: true, validator: validatorDisNumber}],
                    cardnoAuto:[{required: true, message:'请选择卡号输入类型'}]
                },
                cardRules:{
                    money: [{required: true,message:'充值金额必填'}]
                }
            }
        },
        methods: {
            lookup(){
                this.queryCardInfo(this.status);
                if(this.status=='1'){
                    this.status='2'
                }else{
                    this.status='1'
                }
            },
            add() {
                Object.keys(this.addDialog).forEach(key =>{
                    this.addDialog[key]=''
                });
                this.addDialog.id=null;
                this.addDialog.pays= [];
                this.addDialog.cardRules= [{month:'',money:''},{month:'',money:''}];
                this.addDialog.title = '新增会员卡';
                service.cardinfo.newcode().then(res =>{
                    this.addDialog.cpcode=res.data;
                    this.addDialog.visible = true;
                    this.addDialog.ruleType = '0';
                    this.addDialog.cardType = '1';
                    this.addDialog.expireLimit = '1';
                    this.addDialog.giftDis = '1';
                    this.addDialog.status = '1';
                    this.addDialog.revision = 1;
                    this.$refs.name.focus()
                })
            },
            edit(row){
                this.addDialog.title = '编辑会员卡';
                const that=this;
                service.cardinfo.cardInfoByID(row.id).then(res =>{
                    this.addDialog={...this.addDialog,...res.data};
                    if(res.data.noDisPay){
                        this.addDialog.pays=res.data.noDisPay.split(";");
                    }
                    if(this.addDialog.cardType == '2'){
                        this.addDialog.money= '';
                        this.addDialog.cost= '';
                        this.addDialog.minmoney= '';
                        this.addDialog.reminderMoney= '';
                        this.addDialog.expire= '';
                        this.addDialog.expireMonth= '';
                        this.addDialog.money2= res.data.money;
                        this.addDialog.expire2= res.data.expire;
                        this.addDialog.expireMonth2= res.data.expireMonth;
                    }else{
                        this.addDialog.money2= '';
                        this.addDialog.expire2= '';
                        this.addDialog.expireMonth2= '';
                    }
                    if(!res.data.cardRules){
                        this.addDialog.cardRules= [{month:'',money:''},{month:'',money:''}];
                    }else{
                        this.addDialog.cardRules= [];
                        res.data.cardRules.forEach(item =>{
                            this.addDialog.cardRules.push({
                                id:item.id,
                                cardid:item.cardid,
                                month:item.month,
                                money:item.money
                            })
                        })
                    }
                    this.addDialog.visible = true;
                })
            },
            stop(row){
                const params={
                    id:row.id,
                    revision:row.revision
                };
                if(row.status=="1"){
                    params.status='2';
                }else{
                    params.status='1';
                }
                service.cardinfo.editCardStatus(params).then(res =>{
                    if(res.resp_code=="200"){
                        this.queryCardInfo(row.status);
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            saveCardInfo(){
                const that=this;
                this.$refs['copyForm'].validate(valid =>{
                    if (valid) {
                        if(that.addDialog.cardType == '2'){
                            that.addDialog.money= that.addDialog.money2;
                            that.addDialog.cost= '';
                            that.addDialog.minmoney= '';
                            that.addDialog.reminderMoney= '';
                            that.addDialog.expire= that.addDialog.expire2;
                            that.addDialog.expireMonth= that.addDialog.expireMonth2;
                        }
                        if(that.addDialog.expireMonth=='date'){
                            that.addDialog.expireType='1';
                            that.addDialog.expireMonth='';
                        }else{
                            that.addDialog.expireType='2';
                        }
                        that.addDialog.noDisPay=that.addDialog.pays.join(";");
                        service.cardinfo.saveCardInfo(that.addDialog).then(res =>{
                            if(res.resp_code=="200"){
                                that.levelCancel(1);
                                that.queryCardInfo('1');
                                yid.util.success(res.resp_msg);
                            }else{
                                yid.util.error(res.resp_msg);
                            }
                        })
                    }else {
                        return false
                    }
                })
            },
            addCardRule(){
                this.addDialog.cardRules.push({
                    cardid:'',
                    month:'',
                    money:''
                })
            },
            delCardRule(index){
                yid.util.confirm('确定删除续卡配置？', '','', ()=> {
                    this.addDialog.cardRules.splice(index,1)
                })
            },
            editRule(row) {
                this.ruleDialog.title ='充值赠送规则管理';
                this.ruleDialog.cardid=row.id;
                this.ruleDialog.type="2";
                this.ruleDialog.cardname=row.cpname;
                this.ruleDialog.cardRules=[];
                service.cardinfo.cardRules({cardid:row.id}).then(res =>{
                    this.ruleDialog.cardRules=res.data;
                    this.ruleDialog.visible = true;
                })
            },
            addRuleDialog(){
                this.ruleAddDialog.title = '新增充值赠送规则';
                this.ruleAddDialog.visible = true;
                this.ruleAddDialog.id= null;
                this.ruleAddDialog.cardid= this.ruleDialog.cardid;
                this.ruleAddDialog.type= true;
                this.ruleAddDialog.money= '';
                this.ruleAddDialog.giftType= '1';
                this.ruleAddDialog.giftMoney= '';
            },
            editRuleDialog(row){
                this.ruleAddDialog.title = '编辑充值赠送规则';
                this.ruleAddDialog.visible = true;
                this.ruleAddDialog.cardid = this.ruleDialog.cardid;
                this.ruleAddDialog.id = row.id;
                this.ruleAddDialog.type= true;
                this.ruleAddDialog.money= row.money;
                this.ruleAddDialog.giftMoney = row.giftMoney;
                this.ruleAddDialog.giftType = row.giftType;
                this.ruleAddDialog.revision = row.revision;
            },
            delRuleDialog(row){
                const that=this;
                yid.util.confirm('确定删除充卡/充值规则？', '','', ()=> {
                    that.ruleDialog.cardRules.forEach(item =>{
                        if(row.id==item.id){
                            service.cardinfo.delCardRule(item.id).then(res =>{
                                if(res.resp_code=="200"){
                                    that.ruleDialog.cardRules=res.data;
                                }
                            })
                        }
                    })
                })
            },
            saveRuleDialog(){
                const that=this;
                this.$refs['cardForm'].validate(valid => {
                    if (valid) {
                        if(that.ruleAddDialog.giftType && !that.ruleAddDialog.giftMoney){
                            yid.util.error("请填写赠送");
                            return;
                        }
                        if(that.ruleAddDialog.giftType=='1' && that.ruleAddDialog.giftMoney){
                            if(Number(that.ruleAddDialog.giftMoney) > Number(that.ruleAddDialog.money)){
                                yid.util.error("赠送金额不能大于充值金额");
                                return;
                            }
                            if(Number(that.ruleAddDialog.giftMoney)<0){
                                yid.util.error('赠送金额不能小于0')
                                return
                            }
                        }
                        if(that.ruleAddDialog.giftType=='2' && that.ruleAddDialog.giftMoney){
                            if(Number(that.ruleAddDialog.giftMoney)<0 || Number(that.ruleAddDialog.giftMoney)>100){
                                yid.util.error('赠送百分比应该在0-100之间')
                                return
                            }
                        }
                        that.ruleAddDialog.type=2;
                        service.cardinfo.saveCardRules(that.ruleAddDialog).then(res =>{
                            if(res.resp_code=="200"){
                                that.levelCancel(3);
                                that.ruleDialog.cardRules=res.data;
                                yid.util.success(res.resp_msg);
                            }else{
                                yid.util.error(res.resp_msg);
                            }
                        })
                    }else {
                        return false
                    }
                })
            },
            levelCancel(i){
                if(i==1){
                    this.addDialog.visible = false;
                }
                if(i==2){
                    this.queryCardInfo('1')
                    this.ruleDialog.visible = false;
                }
                if(i==3){
                    this.ruleAddDialog.visible = false;
                }
            },
            queryCardInfo(status){
                service.cardinfo.cardinfo({status:status}).then(res =>{
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
            this.queryCardInfo('1')
            this.myheaders={
                authorization:'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
            };
        }
    }
</script>

<style scoped lang="scss">
    .form-type {
        background: #E4E7ED;
        padding: 20px;
        margin-top: 10px;
        .el-form-item {
            margin-bottom: 5px;

        }
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>