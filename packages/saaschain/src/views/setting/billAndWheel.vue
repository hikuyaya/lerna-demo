<template>
    <div class="dept">
        <el-tabs v-model="activeName">
            <el-tab-pane label="收银开单配置" name="bill">
                <el-form label-width="140px">
                    <el-form-item label="手牌号：">
                        <el-radio-group v-model="marketOrderConfig.isAutoNo">
                            <el-radio label="0">手动手牌号</el-radio>
                            <el-radio label="1">自动手牌号</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="手牌号段：">
                        <el-input v-model="marketOrderConfig.noMin" label="开始号" style="width: 150px" @change="saveBillNo" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>~
                        <el-input v-model="marketOrderConfig.noMax" label="结束号" style="width: 150px" @change="saveBillNo" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>&nbsp;
                        <span style="color:#646464">手牌号段最多只支持100个；服务单结账完成、过期、作废后自动释放手牌号</span>
                    </el-form-item>
                    <el-form-item label="输入手机号查卡：">
                        <el-radio-group v-model="marketOrderConfig.isAllowMobile">
                            <el-radio label="0">不允许</el-radio>
                            <el-radio label="1">允许</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="输入卡号查询：">
                        <el-radio-group v-model="marketOrderConfig.isAllowCardno">
                            <el-radio label="0">不允许</el-radio>
                            <el-radio label="1">允许</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否需要电子签名：">
                        <el-radio-group v-model="marketOrderConfig.isNeedSign">
                            <el-radio label="0">关闭</el-radio>
                            <el-radio label="1">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否自动打印小票：">
                        <el-radio-group v-model="marketOrderConfig.isAutoPrint">
                            <el-radio label="0">关闭</el-radio>
                            <el-radio label="1">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否推送消息：">
                        <el-radio-group v-model="marketOrderConfig.isPushWxmsg">
                            <el-radio label="0">关闭</el-radio>
                            <el-radio label="1">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否需要评价：">
                        <el-radio-group v-model="marketOrderConfig.isRate">
                            <el-radio label="0">关闭</el-radio>
                            <el-radio label="1">开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <!--<el-tab-pane label="员工轮牌配置" name="wheel">
                <el-button @click="addWheel()" type="primary">新增</el-button>
                <el-form ref="wheelform" :model="wheelform" inline label-width="60px" color="#000" style="color: #000; font-weight: bold; margin-top: 20px;">
                    <el-form-item label="门店：">
                        <el-select clearable v-model.trim="wheelform.shopid" filterable :filter-method="filterShop" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=""><el-button type="primary" @click="getWheelConfig()">查询</el-button></el-form-item><br/>
                </el-form>
                <yid-table ref="wcTable" :data="wheelConfigData" style="margin-top: 15px;">
                    <yid-table-column label="名称" min-width="100" prop="cwcname"></yid-table-column>
                    <yid-table-column label="对应级别类型" min-width="150" prop="cwcPsname"></yid-table-column>
                    <yid-table-column label="位置" min-width="150" prop="_postion"></yid-table-column>
                    <yid-table-column label="每日洗牌" min-width="150" prop="_dayClean"></yid-table-column>
                    <yid-table-column label="收银联动" min-width="150" prop="_withCashier"></yid-table-column>
                    <yid-table-column label="操作" min-width="250">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteWheel(scope.row.id)">
                                删除
                            </el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>-->

            <!--<el-tab-pane label="轮牌临休配置" name="rest">
                <el-button @click="addWheelRest()" type="primary">新增</el-button>
                <el-form ref="resetform" :model="resetform" inline label-width="60px" color="#000" style="color: #000; font-weight: bold; margin-top: 20px;">
                    <el-form-item label="门店：">
                        <el-select clearable v-model.trim="resetform.shopid" filterable :filter-method="filterShop2" placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList2">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=""><el-button type="primary" @click="getWheelRest()">查询</el-button></el-form-item><br/>
                </el-form>
                <yid-table ref="wcRestTable" :data="wheelRestData" style="margin-top: 15px; width: 420px;">
                    <yid-table-column label="名称" min-width="130">
                        <template slot-scope="scope">
                            <el-input v-show="scope.row.edit" size="small" v-model="scope.row.cwrname"/>
                            <span v-show="!scope.row.edit">{{ scope.row.cwrname }}</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="时长（分）" min-width="130">
                        <template slot-scope="scope">
                            <el-input v-show="scope.row.edit" size="small" v-model="scope.row.time"/>
                            <span v-show="!scope.row.edit">{{ scope.row.time }}</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="140">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="scope.row.edit=true"
                                     v-show="!scope.row.edit">
                                编辑
                            </el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="updateWheelRest(scope.row)"
                                     v-show="scope.row.edit">
                                保存
                            </el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;"
                                     @click="deleteWheelRest(scope.row.id)">
                                删除
                            </el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>-->

            <el-tab-pane label="小票打印设置" name="printset">
                <yid-table ref="printsetTable" :data="printsetData" style="margin-top: 15px; width: 780px;">
                    <yid-table-column label="小票模板编号"prop="code"  min-width="150"></yid-table-column>
                    <yid-table-column label="模板名称" prop="name" min-width="150"></yid-table-column>
                    <yid-table-column label="对应业务类型" prop="btname" min-width="150"></yid-table-column>
                    <yid-table-column label="打印联数" prop="printnum" min-width="150"></yid-table-column>
                    <yid-table-column label="操作" min-width="150">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="editPrintSet(scope.row)">
                                编辑
                            </el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="销售工位配置" name="station">
                <yid-table ref="stationTable" :data="stationData" style="margin-top: 15px; width: 480px;">
                    <yid-table-column label="对应业务类型"prop="name"  min-width="150"></yid-table-column>
                    <yid-table-column label="销售工位数" prop="num" min-width="150"></yid-table-column>
                    <yid-table-column label="操作" min-width="140">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="editStation(scope.row)">
                                编辑
                            </el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>

        <yid-dialog :title="wcRestDialog.title" :visible.sync="wcRestDialog.visible" @close="wcRestCancel"
                    width="550px">
            <el-form label-width="140px" ref="dialogWcRest" :rules="wcRestDialog.rules" :model="wcRestDialog.model">
                <el-form-item label="名称：" prop="cwrname">
                    <el-input v-model="wcRestDialog.model.cwrname"/>
                </el-form-item>
                <el-form-item label="时长(分)：" prop="time">
                    <el-input v-model="wcRestDialog.model.time" type="number" min="0"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveWheelRest">保存</el-button>
                    <el-button @click="wcRestCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog :title="wcDialog.title" :visible.sync="wcDialog.visible" @close="wcCancel" width="550px">
            <el-form label-width="140px" ref="dialogWc" :rules="wcDialog.rules" :model="wcDialog.model">
                <el-form-item label="名称：" prop="cwcname">
                    <el-input v-model="wcDialog.model.cwcname"/>
                </el-form-item>
                <el-form-item label="位置：" prop="postion">
                    <el-radio-group v-model="wcDialog.model.postion">
                        <el-radio label="1">第一工位</el-radio>
                        <el-radio label="2">第二工位</el-radio>
                        <el-radio label="3">第三工位</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="对应级别类型：" v-model="wcDialog.model.ps" prop="ps">
                    <el-select placeholder="请选择所对应级别类型" multiple v-model="wcDialog.model.ps">
                        <el-option
                                v-for="(ps,i) in dtPs"
                                :key="ps.pscode"
                                :label="ps.psname"
                                :value="i">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="每日洗牌：" prop="dayClean">
                    <el-radio-group v-model="wcDialog.model.dayClean">
                        <el-radio label="0">否</el-radio>
                        <el-radio label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="收银联动：" prop="withCashier">
                    <el-radio-group v-model="wcDialog.model.withCashier">
                        <el-radio label="0">否</el-radio>
                        <el-radio label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveWheelConfig">保存</el-button>
                    <el-button @click="wcCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="stationDialog.title" :visible.sync="stationDialog.visible" @close="wcRestCancel" width="700px">
            <el-row>
                <el-col :span="3">销售工位</el-col>
                <el-col :span="6">工位名称</el-col>
                <el-col :span="8">对应职务</el-col>
                <el-col :span="4">可添加人数</el-col>
                <el-col :span="1"></el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="3">第一工位</el-col>
                <el-col :span="6"><el-input v-model="stationDialog.ps1.name" style="width: 140px" clearable/></el-col>
                <el-col :span="8"><el-select v-model="stationDialog.ps1.ps" multiple placeholder="请选择" clearable>
                    <el-option v-for="item in psList" :key="item.id" :value="item.id" :label="item.psname"></el-option>
                </el-select></el-col>
                <el-col :span="4"><el-input type="number" min="0" max="5" v-model="stationDialog.ps1.pepnum" clearable/></el-col>
                <el-col :span="1"><i @click="delStation(1)" class="el-icon-delete" style="padding-left: 10px;"></i></el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="3">第二工位</el-col>
                <el-col :span="6"><el-input v-model="stationDialog.ps2.name" style="width: 140px" clearable/></el-col>
                <el-col :span="8"><el-select v-model="stationDialog.ps2.ps" multiple placeholder="请选择" clearable>
                    <el-option v-for="item in psList" :key="item.id" :value="item.id" :label="item.psname"></el-option>
                </el-select></el-col>
                <el-col :span="4"><el-input type="number" min="0" max="5" v-model="stationDialog.ps2.pepnum" clearable/></el-col>
                <el-col :span="1"><i @click="delStation(2)" class="el-icon-delete" style="padding-left: 10px;"></i></el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="3">第三工位</el-col>
                <el-col :span="6"><el-input v-model="stationDialog.ps3.name" style="width: 140px" clearable/></el-col>
                <el-col :span="8"><el-select v-model="stationDialog.ps3.ps" multiple placeholder="请选择" clearable>
                    <el-option v-for="item in psList" :key="item.id" :value="item.id" :label="item.psname"></el-option>
                </el-select></el-col>
                <el-col :span="4"><el-input type="number" min="0" max="5" v-model="stationDialog.ps3.pepnum" clearable/></el-col>
                <el-col :span="1"><i @click="delStation(3)" class="el-icon-delete" style="padding-left: 10px;"></i></el-col>
            </el-row>
            <el-row style="margin-top: 20px;">
                <el-col :span="2" :offset="8"><el-button type="primary" @click="saveStation()">保存</el-button></el-col>
                <el-col :span="2" :offset="4"><el-button @click="stationDialog.visible=false">关闭</el-button></el-col>
            </el-row>
        </yid-dialog>

    </div>
</template>

<script>

    import service from '@src/service'
    import {isEmpty} from "../../library/helper/validate";

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
        name: "billAndWheel",
        data() {
            return {
                activeName: 'bill',
                marketOrderConfig: {},
                radioInitGroup:{
                    isAutoNo:false,
                    isAllowMobile:false,
                    isNeedSign:false,
                    isAutoPrint:false,
                    isPushWxmsg:false,
                    isRate:false,
                    isAllowCardno:false,
                },
                dtPostion: ['', '第一工位', '第二工位', '第三工位'],
                dtYN: ['否', '是'],
                dtPs: [],
                wheelConfigData: [],
                wheelRestData: [],
                wcDialog: {
                    title: '新增轮牌',
                    visible: false,
                    model: {
                        cwcname: '',
                        ps: '',
                        cwcPscode: '',
                        cwcPsname: '',
                        postion: '',
                        dayClean: '',
                        withCashier: '',
                    },
                    rules: {
                        cwcname: [
                            {required: true, message: '请输入名称', trigger: 'blur'},
                        ],
                        postion: [
                            {required: true, message: '请选择位置', trigger: 'change'}
                        ],
                        ps: [
                            {required: true, message: '请选择对应级别位置', trigger: 'change'}
                        ],
                        dayClean: [
                            {required: true, message: '请选择是否每日洗牌', trigger: 'change'}
                        ],
                        withCashier: [
                            {required: true, message: '请选择是否收银联动', trigger: 'change'}
                        ],
                    },
                },
                wcRestDialog: {
                    title: '新增轮牌临休',
                    visible: false,
                    model: {
                        cwrname: '',
                        time: 0,
                    },
                    rules: {
                        cwrname: [
                            {required: true, message: '请输入名称', trigger: 'blur'},
                        ],
                        time: [
                            {required: true, message: '请输入时间', trigger: 'blur', min: 0}
                        ],
                    },
                },
                stationData: [],
                stationDialog: {
                    title:'编辑工位配置',
                    visible: false,
                    id:'',
                    name:'',
                    num:'',
                    revision: '',
                    ps1: {
                      postion: 1,
                      name:'',
                      ps:[],
                      pepnum:'',
                      pslist:[]
                    },
                    ps2: {
                        postion: 2,
                        name:'',
                        ps:[],
                        pepnum:'',
                        pslist:[]
                    },
                    ps3: {
                        postion: 3,
                        name:'',
                        ps:[],
                        pepnum:'',
                        pslist:[]
                    }
                },
                stationList: [
                    {
                        postion: 1,
                        name:'',
                        ps:[],
                        pepnum:'',
                        pslist:[]
                    }],
                psList: [],
                printsetData: [],
                printitemData: [],
                allShopList:[],
                filterShopList:[],
                wheelform: {
                    shopid: ""
                },
                allShopList2:[],
                filterShopList2:[],
                resetform: {
                    shopid: ""
                }
            }
        },
        methods: {
            saveBillNo(){
                let noMin = this.marketOrderConfig.noMin
                let noMax = this.marketOrderConfig.noMax
                if(isEmpty(noMin) || isEmpty(noMax)){
                    $yid.util.info("开始号和结束号不能为空")
                    return;
                }
                if(Number(noMin) > Number(noMax)){
                    $yid.util.info("开始号不能大于结束号")
                    return;
                }
                if(Number(noMax)-Number(noMin)>=100){
                    $yid.util.info("手牌号段最多只支持100个！");
                    return;
                }
                let param = {noMin: noMin,noMax:noMax, revision: this.marketOrderConfig.revision, id: this.marketOrderConfig.id}
                service.marketOrderConfig.saveNo(param).then(res => {
                    this.marketOrderConfig.revision = res.data.revision
                });
            },
            getMarketOrderConfig() {
                service.marketOrderConfig.orderConfig().then(res => {
                    this.marketOrderConfig = res.data
                })
            },
            getWheelConfig() {
                console.log(this.wheelform);

                service.wheelConfig.getCwc(this.wheelform.shopid).then(res => {
                    this.wheelConfigData = res.data
                })
            },
            getWheelRest() {
                service.wheelRest.getCwr(this.resetform.shopid).then(res => {
                    res.data.map(e => {
                        e.edit = false
                    })
                    this.wheelRestData = res.data
                }).catch(err => {
                    this.wheelRestData = [{
                        id: 1,
                        cwrname: '午休',
                        time: 45,
                        edit: false
                    }, {
                        id: 2,
                        cwrname: '临休',
                        time: 30,
                        edit: false
                    }]
                });
            },
            addWheel() {
                this.wcDialog.visible = true
            },
            deleteWheel(id) {
                $yid.util.confirm('你确定要删除该轮牌配置吗？', '', '', () => {
                    service.wheelConfig.deleteCwc(id).then(res => {
                        $yid.util.alert(res.resp_msg)
                        this.getWheelConfig()
                    });
                })
            },
            saveWheelConfig() {
                this.$refs['dialogWc'].validate((valid) => {
                    if (valid) {
                        service.wheelConfig.saveCwc(this.wcDialog.model).then(res => {
                            $yid.util.alert(res.resp_msg)
                            this.getWheelConfig()
                            this.wcDialog.visible = false
                        });
                    } else {
                        return false;
                    }
                });
            },
            wcCancel() {
                this.wcDialog.visible = false
                this.$refs['dialogWc'].resetFields();
            },
            addWheelRest() {
                this.wcRestDialog.visible = true
            },
            saveWheelRest() {
                this.$refs['dialogWcRest'].validate((valid) => {
                    if (valid) {
                        service.wheelRest.saveCwr(this.wcRestDialog.model).then(res => {
                            $yid.util.alert(res.resp_msg)
                            this.getWheelRest()
                            this.wcRestDialog.visible = false
                        });
                    } else {
                        return false;
                    }
                });
            },
            updateWheelRest(v) {
                service.wheelRest.saveCwr(v).then(res => {
                    $yid.util.alert(res.resp_msg)
                    this.getWheelRest()
                });
            },
            deleteWheelRest(id) {
                $yid.util.confirm('你确定要删除该轮牌配置吗？', '', '', () => {
                    service.wheelRest.deleteCwr(id).then(res => {
                        $yid.util.alert(res.resp_msg)
                        this.getWheelRest()
                    });
                })
            },
            wcRestCancel() {
                this.wcRestDialog.visible = false
                this.$refs['dialogWcRest'].resetFields();
            },
            getJobList() {
                service.position.list({status:'1'}).then(res => {
                    this.dtPs = res.data
                })
            },
            getStationConfig() {
                service.wheelRest.getStations().then(res => {
                    this.stationData = res.data
                })
            },
            editStation(row) {
                service.wheelRest.getStationdesc({statid:row.id}).then(res => {
                    if(res.resp_code=="200"){
                        this.stationDialog.visible=true;
                        this.stationDialog.id=row.id;
                        this.stationDialog.code=row.code;
                        this.stationDialog.name=row.name;
                        this.stationDialog.num=row.num;
                        this.stationDialog.revision=row.revision;
                        this.stationDialog.ps1= {id:'', postion:1, name:'', ps:[], pepnum:'', pslist:[]};
                        this.stationDialog.ps2= {id:'', postion:2, name:'', ps:[], pepnum:'', pslist:[]};
                        this.stationDialog.ps3= {id:'', postion:3, name:'', ps:[], pepnum:'', pslist:[]};
                        if(res.data && res.data.length>0){
                            for(let j=0;j<res.data.length; j++){
                                if(res.data[j].postion == 1){
                                    this.stationDialog.ps1.id=res.data[j].id;
                                    this.stationDialog.ps1.name=res.data[j].name;
                                    this.stationDialog.ps1.pepnum=res.data[j].pepnum;
                                    this.stationDialog.ps1.pslist=[];
                                    if(null!=res.data[j].pslist){
                                        res.data[j].pslist.forEach(item =>{
                                            this.stationDialog.ps1.ps.push(String(item.psid))
                                        })
                                    }
                                }
                                if(res.data[j].postion == 2){
                                    this.stationDialog.ps2.id=res.data[j].id;
                                    this.stationDialog.ps2.name=res.data[j].name;
                                    this.stationDialog.ps2.pepnum=res.data[j].pepnum;
                                    this.stationDialog.ps2.pslist=[];
                                    if(null!=res.data[j].pslist){
                                        res.data[j].pslist.forEach(item =>{
                                            this.stationDialog.ps2.ps.push(String(item.psid))
                                        })
                                    }
                                }
                                if(res.data[j].postion == 3){
                                    this.stationDialog.ps3.id=res.data[j].id;
                                    this.stationDialog.ps3.name=res.data[j].name;
                                    this.stationDialog.ps3.pepnum=res.data[j].pepnum;
                                    this.stationDialog.ps3.pslist=[];
                                    if(null!=res.data[j].pslist){
                                        res.data[j].pslist.forEach(item =>{
                                            this.stationDialog.ps3.ps.push(String(item.psid))
                                        })
                                    }
                                }
                            }
                        }
                    }else{
                        $yid.uitl.error(res.resp_msg)
                    }
                })
            },
            saveStation(){
                let flag=false; let psArry=[];
                this.stationList=[];
                if(this.stationDialog.ps1.name || this.stationDialog.ps1.pepnum){
                    this.stationList.push(this.stationDialog.ps1);
                }
                if(this.stationDialog.ps2.name || this.stationDialog.ps2.pepnum){
                    this.stationList.push(this.stationDialog.ps2);
                }
                if(this.stationDialog.ps3.name || this.stationDialog.ps3.pepnum){
                    this.stationList.push(this.stationDialog.ps3);
                }
                if(this.stationList.length == 0){
                    $yid.util.error("至少配制一个工位!")
                    return
                }
                this.stationList.map(m=>{
                    if(!m.name){
                        flag=true;
                        $yid.util.error(m.name+" 请输入工位名称!")
                    }
                    if(m.ps.length>0){
                        m.ps.map(p =>{
                            psArry.push(p)
                        })
                        m.pslist=[];
                        m.ps.forEach(p =>{
                            this.psList.forEach(ps =>{
                                if(p == String(ps.id)){
                                    m.pslist.push({
                                        psid:ps.id,
                                        psname:ps.psname
                                    })
                                }
                            })
                        })
                    }
                    if(Number(m.pepnum)>5 || Number(m.pepnum)<1){
                        flag=true;
                        $yid.util.error(m.name+" 可添加人数，最多5人，最少一人!")
                    }else{
                        m.pepnum=Number(m.pepnum)
                    }
                })
                if(flag){
                    return;
                }
                const param={
                    id:this.stationDialog.id,
                    num:this.stationList.length,
                    desc:this.stationList
                }
                if(isRepeat(psArry)){
                    $yid.util.confirm('当前销售工位中有重复的对应职位，设置生效后将可能导致重复计业绩，是否继续？', '', '', () => {
                        service.wheelRest.saveStation(param).then(res =>{
                            if(res.resp_code=="200"){
                                this.getStationConfig();
                                this.stationDialog.visible=false;
                                $yid.util.alert(res.resp_msg)
                            }else{
                                $yid.util.error(res.resp_msg)
                            }
                        })
                    })
                }else{
                    service.wheelRest.saveStation(param).then(res =>{
                        if(res.resp_code=="200"){
                            this.getStationConfig();
                            this.stationDialog.visible=false;
                            $yid.util.alert(res.resp_msg)
                        }else{
                            $yid.util.error(res.resp_msg)
                        }
                    })
                }
            },
            getPrintTempset() {
                service.wheelRest.getPrintTempset().then(res => {
                    this.printsetData = res.data
                })
                service.wheelRest.getPrintItem().then(res => {
                    this.printitemData = res.data
                })
            },
            editPrintSet(row) {},
            addStation(){
                if(this.stationList.length>=3){
                    return;
                }
                this.stationList.push({postion: 1,
                    name:'',
                    ps:[],
                    pepnum:5,
                    pslist:[]}
                )
            },
            delStation(index){
                if(this.stationList.length==1){
                    return;
                }
                this.stationList.splice(index,1);
            },
            getShopList() {
                service.chain.shop.shopList({status:'0'}).then(res => {
                    if(res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                        this.filterShopList2 = res.data;
                        this.allShopList2 = Object.assign(this.filterShopList2);//保留原数据
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
            filterShop2(v){
                this.filterShopList2 = this.allShopList2.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            }
        },
        mounted() {
            service.wheelRest.getPostions({status:'1'}).then(res =>{
                this.psList=res.data;
            })
        },
        created() {
            this.getJobList()
            this.getMarketOrderConfig()
            this.getShopList()
        },
        watch: {
            'marketOrderConfig.isAllowCardno'(v) {
                if (this.radioInitGroup.isAllowCardno) {
                    let param = {isAllowCardno: v, revision: this.marketOrderConfig.revision, id: this.marketOrderConfig.id}
                    service.marketOrderConfig.save(param).then(res => {
                        this.marketOrderConfig.revision = res.data.revision
                    });
                } else {
                    this.radioInitGroup.isAllowCardno = true
                }
            },
            activeName(v) {
                if (v === "bill") {
                    this.getMarketOrderConfig()
                } else if (v === "wheel") {
                    this.getWheelConfig()
                } else if (v === "rest") {
                    this.getWheelRest()
                } else if (v === "station"){
                    this.getStationConfig()
                } else if (v === "printset"){
                    this.getPrintTempset()
                }
            },
            'marketOrderConfig.isAutoNo'(v) {
                if (this.radioInitGroup.isAutoNo) {
                    let param = {isAutoNo: v, revision: this.marketOrderConfig.revision, id: this.marketOrderConfig.id}
                    service.marketOrderConfig.updateIsAutoNo(param).then(res => {
                        this.marketOrderConfig.revision = res.data.revision
                    });
                } else {
                    this.radioInitGroup.isAutoNo = true
                }
            },
            'marketOrderConfig.isAllowMobile'(v) {
                if (this.radioInitGroup.isAllowMobile) {
                    let param = {isAllowMobile: v, revision: this.marketOrderConfig.revision, id: this.marketOrderConfig.id}
                    service.marketOrderConfig.updateIsAllowMobile(param).then(res => {
                        this.marketOrderConfig.revision = res.data.revision
                    });
                } else {
                    this.radioInitGroup.isAllowMobile = true
                }
            },
            'marketOrderConfig.isNeedSign'(v) {
                if (this.radioInitGroup.isNeedSign) {
                    let param = {isNeedSign: v, revision: this.marketOrderConfig.revision, id: this.marketOrderConfig.id}
                    service.marketOrderConfig.save(param).then(res => {
                        this.marketOrderConfig.revision = res.data.revision
                    });
                } else {
                    this.radioInitGroup.isNeedSign = true
                }
            },
            'marketOrderConfig.isAutoPrint'(v) {
                if (this.radioInitGroup.isAutoPrint) {
                    let param = {isAutoPrint: v, revision: this.marketOrderConfig.revision, id: this.marketOrderConfig.id}
                    service.marketOrderConfig.save(param).then(res => {
                        this.marketOrderConfig.revision = res.data.revision
                    });
                } else {
                    this.radioInitGroup.isAutoPrint = true
                }
            },
            'marketOrderConfig.isPushWxmsg'(v) {
                if (this.radioInitGroup.isPushWxmsg) {
                    let param = {isPushWxmsg: v, revision: this.marketOrderConfig.revision, id: this.marketOrderConfig.id}
                    service.marketOrderConfig.save(param).then(res => {
                        this.marketOrderConfig.revision = res.data.revision
                    });
                } else {
                    this.radioInitGroup.isPushWxmsg = true
                }
            },
            'marketOrderConfig.isRate'(v) {
                if (this.radioInitGroup.isRate) {
                    let param = {isRate: v, revision: this.marketOrderConfig.revision, id: this.marketOrderConfig.id}
                    service.marketOrderConfig.save(param).then(res => {
                        this.marketOrderConfig.revision = res.data.revision
                    });
                } else {
                    this.radioInitGroup.isRate = true
                }
            },
            wheelConfigData(v) {
                //  后端数据表格展示转化
                v.map(e => {
                    e._postion = this.dtPostion[e.postion]
                    e._dayClean = this.dtYN[e.dayClean]
                    e._withCashier = this.dtYN[e.withCashier]
                })
            },
            'wcDialog.model.ps'(v) {
                let indexs = $yid.util.deepClone(v).splice(',')
                this.wcDialog.model.cwcPscode = '';
                this.wcDialog.model.cwcPsname = '';
                indexs.map(i => {
                    this.wcDialog.model.cwcPscode === '' ? (this.wcDialog.model.cwcPscode = this.dtPs[i].id) : (this.wcDialog.model.cwcPscode = this.wcDialog.model.cwcPscode + ',' + this.dtPs[i].id)
                    this.wcDialog.model.cwcPsname === '' ? (this.wcDialog.model.cwcPsname = this.dtPs[i].psname) : (this.wcDialog.model.cwcPsname = this.wcDialog.model.cwcPsname + ',' + this.dtPs[i].psname)
                })
            },

        }
    }

</script>