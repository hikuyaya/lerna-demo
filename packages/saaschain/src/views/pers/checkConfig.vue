<template>
    <div>
        <el-form ref="form" :model="configForm" label-width="180px" color="#000" style="color: #000; font-weight: bold">
            <label>1、迟到：</label>
               <el-input v-model="configForm.allowCd" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 80px"></el-input> 分钟算正常<br/><br/>
            <label>2、早退：</label>
            <el-input v-model="configForm.allowZt" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 80px"></el-input> 分钟算正常<br/><br/>
            <label>3、迟到/早退：</label>
                <div style="max-height: 300px; overflow-y: scroll">
                    <div>
                        <div style="margin: 10px 0 15px 0">
                            <span style="margin-right: 20px">
                                类型：<el-select placeholder="请选择" v-model="ruleForm.type" style="width: 100px">
                                <el-option v-for="item in ruleTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>&nbsp;&nbsp;
                                <el-input v-model="ruleForm.value" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 80px"></el-input>
                                分钟为旷工：  <el-select v-model="ruleForm.kgDays" style="width: 90px">
                                 <el-option v-for="item in kgdays" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>天</span>
                            <yid-ask>为0或空表示没有旷工状态</yid-ask>
                            <el-button  @click="saveRule" type="primary" style="margin: 15px 0 0 15px">添加</el-button>
                        </div>
                    </div>
                <template v-for="rule in ruleList">
                        <div>
                            <div style="margin: 10px 0 15px 0">
                            <span style="margin-right: 20px">
                                类型：<el-select placeholder="请选择" v-model="rule.type" style="width: 100px" disabled="disabled">
                                <el-option v-for="item in ruleTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>&nbsp;&nbsp;
                                <el-input v-model="rule.value" readonly="readonly" style="width: 80px"></el-input>
                                分钟为旷工：  <el-input v-model="rule.kgDays" readonly="readonly" style="width: 80px"></el-input>天</span>
                                <el-button type="danger" style="height: 24px; margin-left: 10px" @click="delRule(rule.id)">删除</el-button>
                            </div>
                        </div>
                </template>
            </div>
            <label>4、考勤日的开始时间：</label>
            <el-time-picker type="date" placeholder="选择日期" v-model="configForm.cstartTime" format='HH:mm' value-format="HH:mm" style="width: 100px;"></el-time-picker>
            <yid-ask>例：开始时间为03:00，则03:00之前签到记录会作为前一天的签到</yid-ask><br/><br/>
            5、扫二维码签到时，还可增加以下辅助方式，选择后则扫码签到时，也需同时满足勾选的方式方可签到成功：<br/><br/>
            <el-checkbox v-model="isAddress" @change="checkAddress"/>1、办公地点
            <yid-ask>将办公地点设为考勤范围，通过手机定位，精确到10-300米的定位方式。</yid-ask><br/>
            <el-table pagination ref="addresstable" style="margin-top: 15px;" :data="addressData">
                <el-table-column label="考勤地点" min-width="200" prop="address">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.address"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="经度" min-width="60" prop="lat">
                    <template slot-scope="scope">
                        <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model="scope.row.lat"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="纬度" min-width="60" prop="lng">
                    <template slot-scope="scope">
                        <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model="scope.row.lng"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="有效范围" min-width="80">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.accuracy" placeholder="请选择">
                            <el-option v-for="item in accuracys" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="80" prop="content">
                    <template slot-scope="scope">
                        <el-link :disabled="!isAddress"  type="primary" @click="addressAlert(scope.row)">地图选址</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-checkbox v-model="isWifi" @change="checkWifi"/>2、Wi-Fi连接
            <yid-ask>精准定位到办公室内</yid-ask><br/>
            <el-table pagination ref="wifitable" style="margin-top: 15px;" :data="wifiData">
                <el-table-column label="Wi-Fi名称" min-width="200" prop="bssid"></el-table-column>
                <el-table-column label="MAC地址" min-width="100" prop="mac"></el-table-column>
                <el-table-column label="操作" min-width="80" prop="content">
                    <template slot-scope="scope">
                        <el-link :disabled="!isWifi" type="primary" @click="wifiAlert(scope.row)">编辑</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <el-row style="text-align: center; margin-top: 20px">
            <el-button type="primary" @click="saveConfig">保存</el-button>
        </el-row>

        <yid-dialog :title="addressDialog.title" :visible.sync="addressDialog.visible" width="600px">
            <iframe id="mapPage" width="100%" height="500px" frameborder=0
                    src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OLEBZ-25DCQ-GHY5C-GJ6B4-BPHC2-4GF2N&referer=myapp">
            </iframe>
            <el-form ref="addressForm" :model="addressForm"  label-width="200px">
                <!--<el-form-item label="有效范围">
                    <el-select v-model="addressForm.accuracy" placeholder="请选择">
                        <el-option v-for="item in accuracys" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item>
                    <el-button @click="getAddress" type="primary">确定</el-button>
                    <el-button @click="cancleAddress">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog :title="wifiDialog.title" :visible.sync="wifiDialog.visible" width="450px">
            <el-form ref="wifiForm" :model="wifiForm"  label-width="140px" >
                <el-form-item label="Wi-Fi名称：" prop="bssid">
                    <el-input v-model="wifiForm.bssid"></el-input>
                </el-form-item>
                <el-form-item label="MAC地址：" prop="mac">
                    <el-input v-model="wifiForm.mac"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getWifi" type="primary">确定</el-button>
                    <el-button @click="cancleWifi">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>
<script>
    import service from '@src/service'
    import yid from '@src/library'
    import Iframe from "../../library/components/tabs/page/Iframe";
    import {isEmpty} from "../../library/helper/validate";
    var tempAddress = {};
    export default {
        name: "checkConfig",
        components: {Iframe},
        data: function () {
            return {
                isAddress : false,
                isWifi : false,
                configForm : {
                    id : '',
                    address : '',
                    lat : '',
                    lng : '',
                    accuracy : '',
                    bssid : '',
                    mac : '',
                    allowCd : '',
                    allowZt : '',
                    cstartTime : '00:00',
                },
                ruleList : [],
                ruleForm : {
                    value : '',
                    type : '',
                    kgDays : '',
                },
                addressData : [],
                wifiData : [],
                ruleTypes : [{
                    id : 1,
                    name : '迟到'
                },{
                    id : 2,
                    name : '早退'
                }],
                kgdays : [{
                    id : 0,
                    name : '0',
                },{
                    id :0.5,
                    name : '0.5',
                },{
                    id : 1,
                    name : '1',
                }],
                accuracys : [{
                    id : 100,
                    name :'100米'
                },{
                    id : 200,
                    name :'200米'
                },{
                    id : 300,
                    name :'300米'
                }],
                addressDialog : {
                    title : '考勤地点维护',
                    visible : false
                },
                addressForm : {
                    address : '',
                    lat : '',
                    lng : '',
                    //accuracy :'',
                },
                wifiDialog : {
                    title : 'Wi-Fi考勤维护',
                    visible : false
                },
                wifiForm : {
                    bssid : '',
                    mac : '',
                },
            }
        },
        mounted() {
            window.addEventListener('message', function(event) {
                // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
                var loc = event.data;
                if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                    console.log('location', loc);
                    tempAddress = loc;
                }
            }, false);
        },
        created() {
            //查询添加迟到/早退规则列表
            this.getCheckRuleList();
            this.getShopConfigList();
        },
        methods: {
            getCheckRuleList(){
                service.pers.checkRule.checkruleList({isDel : '0'}).then(res=>{
                    if(res.resp_code == 200) {
                        if(res.data != null && res.data.length > 0){
                            this.ruleList = res.data;
                            this.ruleList.forEach(res=>{
                                res.type = Number(res.type);
                            })
                        }else{
                            this.ruleList = [];
                        }
                    }
                })
            },
            getShopConfigList(){
                service.pers.shopConfig.shopconfigList({}).then(res=>{
                    if(res.resp_code == 200) {
                        if(res.data.length > 0){
                            this.configForm = res.data[0];
                            this.wifiData = [];
                            this.addressData = [];
                            //给列表赋值
                            if(res.data[0].bssid != null && res.data[0].bssid.length > 0){
                                this.isWifi = true;
                                this.wifiForm.bssid = res.data[0].bssid;
                                this.wifiForm.mac = res.data[0].mac;
                                this.wifiData.push({bssid:this.wifiForm.bssid,mac:this.wifiForm.mac})
                            }else{
                                this.wifiData.push({bssid:'',mac:''})
                            }
                            if(res.data[0].address != null && res.data[0].address.length > 0){
                                this.isAddress = true;
                                this.addressForm.address = res.data[0].address;
                                this.addressForm.lat = res.data[0].lat;
                                this.addressForm.lng = res.data[0].lng;
                                this.addressData.push({address:this.addressForm.address,lat:this.addressForm.lat,lng:this.addressForm.lng,accuracy:res.data[0].accuracy})
                            }else{
                                this.addressData.push({address:'',lat:'',lng:'',accuracy:'100'});
                            }
                        }else{
                            this.wifiData.push({bssid:'',mac:''});
                            this.addressData.push({address:'',lat:'',lng:'',accuracy:'100'});
                        }
                    }
                })
            },
            //添加迟到/早退规则
            saveRule(){
                this.ruleForm.isDel = '0'
                if(this.ruleForm.type == null || this.ruleForm.type == 0){
                    yid.util.info("请选择类型");
                    return false;
                }
                if(this.ruleForm.value == null || this.ruleForm.value == 0){
                    yid.util.info("请填写迟到/早退天数");
                    return false;
                }
                if(this.ruleForm.kgDays == null || this.ruleForm.kgDays == 0){
                    yid.util.info("请选择旷工天数");
                    return false;
                }
                service.pers.checkRule.saveCheckrule(this.ruleForm).then(res=>{
                    if(res.resp_code == 200) {
                        this.getCheckRuleList();
                        this.ruleForm.id = '';
                        this.ruleForm.value = '';
                        this.ruleForm.type = '';
                        this.ruleForm.kgDays = '';
                    }
                })
            },
            delRule(ruleid){
                service.pers.checkRule.saveCheckrule({id:ruleid,isDel:'1'}).then(res=>{
                    if(res.resp_code == 200) {
                        this.getCheckRuleList();
                    }
                })
            },
            addressAlert(){
                this.addressForm.address = this.addressData[0].address;
                this.addressForm.lat = this.addressData[0].lat;
                this.addressForm.lng = this.addressData[0].lng;
                this.addressForm.accuracy = this.addressData[0].accuracy;
                this.addressDialog.visible = true;
            },
            wifiAlert(){
                this.wifiForm.bssid = this.wifiData[0].bssid;
                this.wifiForm.mac = this.wifiData[0].mac;
                this.wifiDialog.visible = true;
            },
            cancleAddress(){
                this.addressDialog.visible = false;
            },
            cancleWifi(){
                this.wifiDialog.visible = false;
            },
            getAddress(){
                console.log(tempAddress);
                if(isEmpty(tempAddress.latlng)){
                    yid.util.info("请选择地址");
                    return;
                }
                if(isEmpty(this.addressForm.accuracy)){
                    this.addressForm.accuracy = 100;
                }
                if(this.addressData.length === 1){
                    if(tempAddress != null){
                        this.addressForm.address = tempAddress.poiaddress;
                        this.addressForm.lat = tempAddress.latlng.lat;
                        this.addressForm.lng = tempAddress.latlng.lng;
                        this.addressData[0].address = this.addressForm.address;
                        this.addressData[0].lat =this.addressForm.lat;
                        this.addressData[0].lng =this.addressForm.lng;
                        this.addressData[0].accuracy =this.addressForm.accuracy;
                        this.addressDialog.visible = false;
                    }
                }else{
                    return false;
                }
            },
            checkAddress(){
                if(!this.isAddress){
                    /*this.addressForm.address = '';
                    this.addressForm.lat = '';
                    this.addressForm.lng = '';
                    this.addressForm.accuracy = '';
                    this.addressData = [{}];*/
                }
            },
            checkWifi(){
                if(!this.isWifi){
                    /*this.wifiForm.bssid = '';
                    this.wifiForm.mac = '';
                    this.wifiData = [{}];*/
                }
            },
            getWifi(){
                if(this.wifiData.length === 1){
                    this.wifiData[0].bssid = this.wifiForm.bssid;
                    this.wifiData[0].mac = this.wifiForm.mac;
                    this.wifiDialog.visible = false;
                }else{
                    return false;
                }
            },

            saveConfig(){

                if(this.configForm.allowCd == null || this.configForm.allowCd.length == 0){
                    yid.util.info("请允许迟到分钟数");
                    return;
                }

                if(this.configForm.allowZt == null || this.configForm.allowZt.length == 0){
                    yid.util.info("请允许早退分钟数");
                    return;
                }

                if(this.isAddress){
                    if(this.addressData[0].address == null || this.addressData[0].address.length == 0){
                        yid.util.info("请编辑考勤地点");
                        return;
                    }
                    if(this.addressData[0].lat == null || this.addressData[0].lat.length == 0){
                        yid.util.info("请编辑经度");
                        return;
                    }
                    if(this.addressData[0].lng == null || this.addressData[0].lng.length == 0){
                        yid.util.info("请编辑纬度");
                        return;
                    }
                    if(this.addressData[0].accuracy == null || this.addressData[0].accuracy.length == 0){
                        yid.util.info("请选择有效范围");
                        return;
                    }
                }

                this.configForm.address = this.addressData[0].address;
                this.configForm.lat = this.addressData[0].lat;
                this.configForm.lng = this.addressData[0].lng;
                this.configForm.accuracy = this.addressData[0].accuracy;

                if(this.isWifi){
                    if(this.wifiForm.bssid == null || this.wifiForm.bssid.length == 0){
                        yid.util.info("请编辑Wi-Fi连接");
                        return;
                    }
                }

                this.configForm.bssid = this.wifiForm.bssid;
                this.configForm.mac = this.wifiForm.mac;
                console.log(this.configForm);
                service.pers.shopConfig.saveShopconfig(this.configForm).then(res=>{
                    if(res.resp_code == 200) {
                        yid.util.success("保存成功");
                        this.getShopConfigList();
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .config .el-row{
        margin: 10px 0;
        padding-left:50px;
        display: block;
    }

</style>