<template>
    <div class="appoint-conf">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
            <el-tab-pane label="预约规则设置" name="rule">
                <el-form ref="ruleForm" :model="ruleForm" :label-position="labelPosition" label-width="200px" >
                    <el-form-item label="预约开始时间：" :rules="[{ required: true, message: '预约开始时间不能为空'}]">
                        <el-time-picker type="date" placeholder="选择日期" v-model="ruleForm.stime" format='HH:mm' value-format="HH:mm"></el-time-picker>
                    </el-form-item>
                    <el-form-item label="预约结束时间：" :rules="[{ required: true, message: '预约结束时间不能为空'}]">
                        <el-time-picker type="date" placeholder="选择日期" v-model="ruleForm.etime" format='HH:mm' value-format="HH:mm"></el-time-picker>
                    </el-form-item>
                    <el-form-item label="可预约天数：">
                        <el-input-number v-model="ruleForm.maxday" placeholder="可预约天数" :min="1" style="width: 200px;"></el-input-number>
                    </el-form-item>
                    <el-form-item label="自助预约需提前的天数：">
                        <el-select value-key="id" v-model="ruleForm.earlierday" clearable filterable placeholder="请选择">
                            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in earlierdays"></el-option>
                        </el-select> 天
                        <yid-ask>如需提前的天数为0，则表示可预约当天</yid-ask>
                    </el-form-item>
                    <el-form-item label="当天预约需提前：">
                        <el-select value-key="id" v-model="ruleForm.earliertime" clearable filterable placeholder="请选择">
                            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in earliertimes"></el-option>
                        </el-select> 分钟
                        <yid-ask>如需提前的分钟数为0，则表示不需提前，随时可约</yid-ask>
                    </el-form-item>
                    <el-form-item label="取消预约需提前：">
                        <el-select value-key="id" v-model="ruleForm.canceltime" clearable filterable placeholder="请选择">
                            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in canceltimes"></el-option>
                        </el-select> 分钟
                        <yid-ask>顾客线上预约后，离预约时间N分钟以内支持顾客自主取消；门店当天可随时取消</yid-ask>
                    </el-form-item>
                    <el-form-item label="预约时长占用模式：">
                        <el-radio-group v-model="ruleForm.timeType">
                            <el-radio label="1">预约时长叠加</el-radio>
                            <el-radio label="2">预约时长累计</el-radio>
                        </el-radio-group>
                        <yid-ask>注：叠加时以时间最长的项目为准占用，累计时以所有项目的总时长为准占用</yid-ask>
                    </el-form-item>
                    <el-form-item label="预约时是否可选择人数：">
                        <el-radio-group v-model="ruleForm.multiUser">
                            <el-radio label="1">可选择</el-radio>
                            <el-radio label="0">不可选择</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="预约时是否可选时长：">
                        <el-radio-group v-model="ruleForm.timeMode">
                            <el-radio label="1">可选择</el-radio>
                            <el-radio label="0">不可选择</el-radio>
                        </el-radio-group>
                        <yid-ask>可以则顾客可不选服务项目直接选需要的服务时长</yid-ask>
                    </el-form-item>
                    <el-form-item label="是否显示员工级别：">
                        <el-radio-group v-model="ruleForm.showPslevel" @change="ifpslevelShow">
                            <el-radio label="1">显示</el-radio>
                            <el-radio label="0">不显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox
                                :indeterminate="isIndeterminate"
                                v-model="checkAll"
                                @change="handleCheckAllChange" v-if="pslevelShow">全选</el-checkbox>
                        <el-checkbox-group v-model="check" @change="handleCheckedCitiesChange" v-if="pslevelShow">
                                <el-checkbox v-for="item in levelList" :key="item.id" :label="item.id">
                                    <span>{{item.pslname}}</span>
                                </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="是否显示员工好评率：">
                        <el-radio-group v-model="ruleForm.showRate">
                            <el-radio label="1">显示</el-radio>
                            <el-radio label="0">不显示</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否开启预约播报：">
                        <el-radio-group v-model="ruleForm.broadcast">
                            <el-radio label="1">开启</el-radio>
                            <el-radio label="0">不开启</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="预约项目显示方式：">
                        <el-radio-group v-model="ruleForm.serShowType">
                            <el-radio label="1">按分类</el-radio>
                            <el-radio label="2">按项目</el-radio><yid-ask>可前往“预约项目设置”模块设置具体可预约分类或项目</yid-ask>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="预约限制：">
                        <el-checkbox v-model="depositCheck"></el-checkbox>
                        <span style="margin-left: 10px;">预约需缴纳保证金</span>
                        <el-input v-model="ruleForm.deposit" placeholder=""  @blur="check1" style="width: 50px;margin: 0 10px 0 10px"></el-input>
                        <span>元，爽约不退还</span>
                        <yid-ask>如果在可取消预约时段内取消的，可以正常退款</yid-ask>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="restrictedCheck"></el-checkbox>
                        <span style="margin-left: 10px;">连续爽约</span>
                        <el-input v-model="ruleForm.restricted" placeholder="" @blur="check2" style="width: 50px;margin: 0 10px 0 10px"></el-input>
                        <span>次后顾客将不能在线预约</span>
                        <yid-ask>可在管理后台的全部会员—会员详情中开启预约权限</yid-ask>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="restrictedDayCheck"></el-checkbox>
                        <span style="margin-left: 10px;">连续爽约</span>
                        <el-input v-model="ruleForm.restrictedDay" placeholder="" @blur="check3" style="width: 50px;margin: 0 10px 0 10px"></el-input>
                        <span>次后顾客将在</span>
                        <el-input v-model="ruleForm.miss" placeholder="" @blur="check3" style="width: 50px;margin: 0 10px 0 10px"></el-input>
                        <span>天内不能在线预约</span>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="dayLimitCheck"></el-checkbox>
                        <span style="margin-left: 10px;">顾客最多每天能预约</span>
                        <el-input v-model="ruleForm.dayLimit" placeholder="" @blur="check4" style="width: 50px;margin: 0 10px 0 10px"></el-input>
                        <span>次</span>
                        <yid-ask>每天预约N次后,当天将不能再提交预约</yid-ask>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="saveConfig" type="primary">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="预约项目设置" name="project">
                <el-form>
                    <el-form-item label="预约项目选择显示方式：" style="margin-bottom:10px">
                        <el-radio-group v-model="yytype" @change="serviceShow">
                            <el-radio label="1">按分类显示</el-radio>
                            <el-radio label="2">按项目显示</el-radio>
                        </el-radio-group>
                        <br/>
                        {{this.serviceMemo}}
                    </el-form-item>
                </el-form>
                <el-button @click="saveService" type="primary">保存</el-button>
                <el-table ref="typetable" :data="servicetypeData" style="margin-top: 15px;" v-if="!typeShow">
                    <el-table-column width="0" v-if="true"></el-table-column>
                    <el-table-column align="center" label="分类编码" min-width="100" prop="scode"></el-table-column>
                    <el-table-column align="center" label="分类名称" min-width="150" prop="sname"></el-table-column>
                    <el-table-column align="center" label="预约显示名称" min-width="150" prop="yyname">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.yyname"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务时长(分钟)" min-width="150" prop="time" align="center" :render-header="renderHeaderMethods">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.time"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否可预约" prop="isyy" min-width="100">
                        <template slot="header" slot-scope="scope">
                            <el-checkbox
                                    class="returnCheck"
                                    :indeterminate="tableIsIndeterminate"
                                    :scope="scope"
                                    v-model="checkAll"

                                    @change="handleChange"
                            >是否可预约</el-checkbox>
                        </template>
                        <template slot-scope="scope">
                            <el-checkbox
                                    v-model="scope.row.isyy"

                                    @change="tableCheckboxChange"
                            ></el-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table ref="infotable" :data="serviceinfoData" style="margin-top: 15px;" v-if="typeShow">
                    <el-table-column align="center" label="项目编码" min-width="100" prop="servcode"></el-table-column>
                    <el-table-column align="center" label="项目分类" min-width="150" prop="servtname"></el-table-column>
                    <el-table-column align="center" label="项目名称" min-width="150" prop="servname"></el-table-column>
                    <el-table-column align="center" label="预约显示名称" min-width="150" prop="yyname">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.yyname"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="服务时长(分钟)" min-width="150" prop="time">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.time"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否可预约" prop="isyy" min-width="100">
                        <template slot="header" slot-scope="scope">
                            <el-checkbox
                                    class="returnCheck"
                                    :indeterminate="tableIsIndeterminate"
                                    :scope="scope"
                                    v-model="checkAll"

                                    @change="handleChange1"
                            >是否可预约</el-checkbox>
                        </template>
                        <template slot-scope="scope">
                            <el-checkbox
                                    v-model="scope.row.isyy"

                                    @change="tableCheckboxChange1"
                            ></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="可预约员工级别" min-width="150" prop="pslevel">
                        <template slot-scope="scope">
                            {{getPslevelName(scope.row)}}
                            <i class="el-icon-edit" @click="getPslevels(scope.row)"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="预约渠道设置" name="channel">
                <el-button @click="addChannel(false,'')" type="primary">新增渠道</el-button>
                <yid-table pagination ref="channelTable" style="margin-top: 15px;">
                    <yid-table-column label="渠道编码" min-width="100" prop="yccode"></yid-table-column>
                    <yid-table-column label="渠道名称" min-width="150" prop="ycname"></yid-table-column>
                    <yid-table-column label="操作" min-width="100" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" :disabled="getIsEdit(scope.row)" @click="addChannel(true, scope.row)">编辑</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>
        <yid-dialog :title="addDialog.title" :visible.sync="addDialog.visible" @close="getchannelList" width="450px">
            <el-form ref="channelForm" :model="channelForm"  label-width="140px">
                <el-form-item label="渠道编码：" prop="yccode" :rules="[{ required: true, message: '渠道编号为空'}]">
                    {{channelForm.yccode}}
                </el-form-item>
                <el-form-item label="渠道名称："  prop="ycname" :rules="[{ required: true, message: '渠道名称为空'}]">
                    <el-input v-model="channelForm.ycname" placeholder="请输入5字以内"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="saveChannel" type="primary">保存</el-button>
                    <el-button @click="cancleChannel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog :title="pslevelDialog.title" :visible.sync="pslevelDialog.visible" width="450px">
            <el-form  label-width="30px">
                <el-form-item>
                    <el-checkbox
                            :indeterminate="isIndeterminate1"
                            v-model="checkAll1"
                            @change="handleCheckAllChange1">全选</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-checkbox-group v-model="pslevelCheck" @change="handleCheckedCitiesChange1">
                        <el-checkbox v-for="item in levelList" :key="item.id" :label="item.id" style="width: 100px">
                            <span>{{item.pslname}}</span>
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button @click="setPslevels" type="primary">确定</el-button>
                    <el-button @click="canclePslevel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    export default {
        name: "config",
        data() {
            return {
                labelPosition: "right",
                activeTab: "rule",
                pslevelShow : false,
                pslevelShow1 : false,
                isIndeterminate: false,
                isIndeterminate1 : false,
                checkAll: false,
                checkAll1 : false,
                depositCheck : false,
                restrictedCheck: false,
                restrictedDayCheck: false,
                dayLimitCheck: false,
                tableIsIndeterminate : false,
                check: [],
                pslevelCheck : [],
                checkedGameId: [],
                checkedGameId1 :[],
                pageInfo:{page:1,limit:10},
                yytype : '1',
                typeShow : false,
                servicetypeData : [],
                serviceinfoData : [],
                ruleForm: {
                    id : "",
                    stime : "",
                    etime : "",
                    maxday : "7",
                    earlierday : "0",
                    earliertime : "0",
                    canceltime : "0",
                    timeType : "",
                    multiUser : "",
                    timeMode : "",
                    showPslevel : "",
                    pslevel : "",
                    showRate : "",
                    broadcast : "",
                    deposit : "",
                    restricted : "",
                    restrictedDay : "",
                    miss : "",
                    dayLimit : "",
                    serShowType : "",
                },
                addDialog: {
                    title: "新增渠道",
                    visible: false
                },
                pslevelDialog : {
                    title: "新增可预约员工级别",
                    visible : false
                },
                earlierdays : [{
                    id : 0, name : '0天'
                },{
                    id : 1, name : '1天'
                },{
                    id : 2, name : '2天'
                },{
                    id : 3, name : '3天'
                },{
                    id : 4, name : '4天'
                },{
                    id : 5, name : '5天'
                },{
                    id : 6, name : '6天'
                },{
                    id : 7, name : '7天'
                }],
                earliertimes : [{
                    id : 0, name : '0'
                },{
                    id : 30, name : '30'
                },{
                    id : 60, name : '60'
                },{
                    id : 90, name : '90'
                },{
                    id : 120, name : '120'
                },{
                    id : 150, name : '150'
                },{
                    id : 180, name : '180'
                }],
                canceltimes : [{
                    id : 0, name : '0'
                },{
                    id : 30, name : '30'
                },{
                    id : 60, name : '60'
                },{
                    id : 90, name : '90'
                },{
                    id : 120, name : '120'
                },{
                    id : 150, name : '150'
                },{
                    id : 180, name : '180'
                }],
                levelList : [],
                channelForm : {
                    yccode : '',
                    ycname : '',
                },
                tempRow : {},
                serviceMemo : '注：服务时长不设置则默认为一个预约区间；显示名称不设置默认为“分类名称”',
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            //获取所有级别
            init(){
                service.dept.levelAll({status : 1}).then(res=>{
                    if(res.resp_code == 200){
                        this.levelList = res.data;
                        for (let i = 0; i < this.levelList.length; i++) {
                            this.checkedGameId.push(this.levelList[i].id);
                            this.checkedGameId1.push(this.levelList[i].id)
                        }
                        service.yy.config.getYYconfig().then(res=>{
                            if(res.resp_code == 200){
                                if(res.data.length > 0){
                                    this.ruleForm = res.data[0];
                                    if(this.ruleForm.showPslevel == '1'){
                                        this.pslevelShow = true;
                                        const pslevels = this.ruleForm.pslevel.split(";");
                                        const checkold = [];
                                        if(pslevels.length > 0){
                                            pslevels.forEach(item => {
                                                checkold.push(String(item));
                                            })
                                        }
                                        this.check = checkold;
                                        this.handleCheckedCitiesChange(this.check);
                                    }else{
                                        this.checkAll = false;
                                        this.pslevelShow = false;
                                        this.check = [];
                                        this.isIndeterminate = false;
                                    }
                                    if(this.ruleForm.deposit != null && this.ruleForm.deposit != ""){
                                        this.depositCheck = true;
                                    }
                                    if(this.ruleForm.restricted != null && this.ruleForm.restricted != ""){
                                        this.restrictedCheck = true;
                                    }
                                    if((this.ruleForm.restrictedDay != null && this.ruleForm.restrictedDay != "") || (this.ruleForm.miss != null && this.ruleForm.miss != "")){
                                        this.restrictedDayCheck = true;
                                    }
                                    if(this.ruleForm.dayLimit != null && this.ruleForm.dayLimit != ""){
                                        this.dayLimitCheck = true;
                                    }
                                }
                            }
                        });
                    }
                });

            },
            handleCheckAllChange(val) {
                this.check = val ? this.checkedGameId : [];
                this.isIndeterminate = false;
            },
            handleCheckAllChange1(val) {
                this.pslevelCheck = val ? this.checkedGameId1 : [];
                this.isIndeterminate1 = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.levelList.length;
                this.isIndeterminate =
                    checkedCount > 0 && checkedCount < this.levelList.length;
            },
            handleCheckedCitiesChange1(value) {
                let checkedCount = value.length;
                this.checkAll1 = checkedCount === this.levelList.length;
                this.isIndeterminate1 =
                    checkedCount > 0 && checkedCount < this.levelList.length;
            },
            ifpslevelShow(){
                this.checkAll = false;
                this.handleCheckAllChange(false);
                let show = this.ruleForm.showPslevel;
                if(show == '1'){
                    this.pslevelShow = true;
                }else{
                    this.pslevelShow = false;
                }
            },
            serviceShow(){
                if(this.yytype === '1'){
                    this.typeShow = false;
                    this.serviceMemo = '注：服务时长不设置则默认为一个预约区间；显示名称不设置默认为“分类名称”';
                    this.getServicetypeList();
                }else{
                    this.typeShow = true;
                    this.serviceMemo = '注：显示名称不设置默认为“项目名称”';
                    this.getServiceinfoList();
                }
            },
            check1(){
                let deposit = this.ruleForm.deposit;
                if(deposit != null && deposit != ""){
                    this.depositCheck = true;
                }else{
                    this.depositCheck = false;
                }
            },
            check2(){
                let restricted = this.ruleForm.restricted;
                if(restricted != null && restricted != ""){
                    this.restrictedCheck = true;
                }else{
                    this.restrictedCheck = false;
                }
            },
            check3(){
                let restrictedDay = this.ruleForm.restrictedDay;
                let miss = this.ruleForm.miss;
                if((restrictedDay != null && restrictedDay != "") || (miss != null && miss != "")){
                    this.restrictedDayCheck = true;
                }else{
                    this.restrictedDayCheck = false;
                }
            },
            check4(){
                let dayLimit = this.ruleForm.dayLimit;
                if(dayLimit != null && dayLimit != ""){
                    this.dayLimitCheck = true;
                }else{
                    this.dayLimitCheck = false;
                }
            },
            saveConfig(){
                //ruleForm
                this.$refs['ruleForm'].validate((valid) => {
                    if(valid){
                        if(this.ruleForm.stime == '' && this.ruleForm.stime.length == 0){
                            yid.util.alert("开始时间不能为空");
                            return false;
                        }
                        if(this.ruleForm.etime == '' && this.ruleForm.stime.length == 0){
                            yid.util.alert("结束时间时间不能为空");
                            return false;
                        }
                        let pslevel = '';
                        const pslevels = this.check;
                        pslevels.forEach(item =>{
                            pslevel = pslevel + item + ";";
                        })
                        pslevel = pslevel.substr(0,pslevel.length-1);
                        this.ruleForm.pslevel = pslevel;
                        console.log(this.ruleForm);
                        //保存规则设置
                        service.yy.config.setYYconfig(this.ruleForm).then(res =>{
                            if(res.resp_code == 200){
                                yid.util.alert("保存成功")
                            }else{
                                this.$message({
                                    message: "保存规则设置失败!",
                                    type: 'warning'
                                });
                            }
                        })
                    }
                })
            },
            getServicetypeList(){
                service.servicetype.getServicetypes({}).then(res =>{
                    if(res.resp_code == 200){
                        if(res.data.length > 0){
                            res.data.forEach(item=>{
                                if(item.isyy == '1'){
                                    item.isyy = true;
                                }else{
                                    item.isyy = false;
                                }
                            })
                        }
                        this.servicetypeData = res.data;
                        this.tableCheckboxChange();
                    }
                })
            },
            getServiceinfoList(){
                service.serviceInfo.findServiceList({isDel : 0}).then(res =>{
                    if(res.resp_code == 200){
                        if(res.data.length > 0){
                            res.data.forEach(item=>{
                                if(item.isyy == '1'){
                                    item.isyy = true;
                                }else{
                                    item.isyy = false;
                                }
                            })
                        }
                        this.serviceinfoData = res.data;
                        this.tableCheckboxChange1();
                    }
                })
            },
            getPslevelName(row){
                let result = '';
                if(row.pslevel != null && row.pslevel != ''){
                    const pslevels = row.pslevel.split(";")
                    for (let i = 0; i < this.levelList.length; i++) {
                        if(pslevels.length > 0){
                            pslevels.forEach(item=>{
                                if(item == this.levelList[i].id){
                                    result = result + this.levelList[i].pslname + ',';
                                }
                            })
                        }
                    }
                }
                result = result.substr(0,result.length-1);
                return result;
            },
            getchannelList(){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.channelTable.Pagination.internalPageSize;
                const fetch = service.yy.channel.channelList
                const params = this.pageInfo
                this.$refs.channelTable.reloadData({
                    fetch,
                    params
                });
            },
            handleClick(tab) {
                if(tab.name == 'rule'){
                    this.init();
                }else if(tab.name == 'project'){
                    //获取预约分类设置
                    service.yy.config.getYYconfig().then(res=>{
                            if(res.resp_code == 200){
                                if(res.data.length > 0){
                                    if(res.data[0].serShowType === '2'){
                                        this.yytype = '2';
                                        this.serviceMemo = '注：显示名称不设置默认为“项目名称”';
                                        this.typeShow = true;
                                        this.getServiceinfoList();
                                    }else{
                                        this.yytype = '1';
                                        this.serviceMemo = '注：服务时长不设置则默认为一个预约区间；显示名称不设置默认为“分类名称”';
                                        this.typeShow = false;
                                        this.getServicetypeList();
                                    }
                                }
                            }
                    })

                }else if(tab.name == 'channel'){
                    this.getchannelList();
                }
            },
            addChannel(tag = false,row) {
                this.addDialog.visible = true;
                this.addDialog.title = tag? '编辑预约渠道' : '添加预约渠道';
                if(tag == false){
                    this.channelForm.id = '';
                    this.channelForm.ycname = '';
                    //获取预约渠道编码
                    service.yy.channel.getCode({}).then(res =>{
                        this.channelForm.yccode = res.data;
                    });
                    this.channelForm.revision = '1'
                }else{
                    this.channelForm.id = row.id;
                    this.channelForm.yccode=row.yccode;
                    this.channelForm.ycname= row.ycname;
                    this.channelForm.revision = row.revision
                }
            },
            saveChannel(){
                this.$refs['channelForm'].validate((valid) => {
                    if(valid){
                        if(this.channelForm.ycname.length > 5){
                            yid.util.info("请输入5字以内渠道名称!")
                            return false;
                        }
                        service.yy.channel.saveChannel(this.channelForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            this.getchannelList();
                        });
                        this.cancleChannel();
                    }
                })
            },
            cancleChannel(){
                this.addDialog.visible = false;
            },
            getPslevels(row){
                let pslevel =  row.pslevel;
                this.pslevelCheck = [];
                if(pslevel != null && pslevel.length > 0){
                    const pslevels = pslevel.split(";");
                    if(pslevels.length > 0){
                        pslevels.forEach(item=>{
                            this.pslevelCheck.push(String(item));
                        })
                    }
                }
                this.handleCheckedCitiesChange1(this.pslevelCheck);
                //弹框选择职务列表
                this.pslevelDialog.visible = true;
                this.tempRow = row;
            },
            setPslevels(){
                if(this.pslevelCheck.length > 0){
                    let pslevels = "";
                    this.pslevelCheck.forEach(item =>{
                        pslevels = pslevels + item + ";";
                    })
                    pslevels = pslevels.substr(0,pslevels.length - 1);
                    this.tempRow.pslevel = pslevels;
                }else{
                    yid.util.alert("请选择员工级别!")
                }
                this.pslevelDialog.visible = false;
            },
            canclePslevel(){
                this.pslevelDialog.visible = false;
            },
             saveService(){
              if(this.yytype == '1'){
                  for(let i = 0;i<this.servicetypeData.length;i++){
                      const servicetype = this.servicetypeData[i];
                      if(servicetype.isyy === true){
                          servicetype.isyy = '1';
                      }else{
                          servicetype.isyy = '0';
                      }
                  }
                  console.log(this.servicetypeData);
                  service.servicetype.updateTypes({types:this.servicetypeData}).then(res=> {
                      if(res.resp_code == 200) {
                          this.getServicetypeList();
                      }
                  });
              }else{
                  for(let i = 0;i<this.serviceinfoData.length;i++){
                      const serviceinfo = this.serviceinfoData[i];
                      if(serviceinfo.isyy === true){
                          serviceinfo.isyy = '1';
                      }else{
                          serviceinfo.isyy = '0';
                      }
                  }
                  console.log(this.serviceinfoData);
                  service.serviceInfo.updateInfos({servs:this.serviceinfoData}).then(res=> {
                      if(res.resp_code == 200) {
                          this.getServiceinfoList();
                      }
                  });
              }
            },
            getIsEdit(row){
                if(row.yccode == '01' || row.yccode=='02' || row.ycname=='小程序' || row.ycname=='反预约'){
                    return true;
                }else{
                    return false;
                }
            },
            handleChange(val){
                if (val) {
                    this.servicetypeData.forEach(item => {
                        item.isyy = true;
                    });
                    this.tableIsIndeterminate = false;
                } else {
                    this.servicetypeData.forEach(item => {
                        item.isyy = false;
                    });
                    this.tableIsIndeterminate = false;
                }
            },
            tableCheckboxChange() {
                setTimeout(() => {
                    let isAllTrue = this.servicetypeData.every(
                        item => item.isyy === true
                    );
                    let isAllFalse = this.servicetypeData.every(
                        item => item.isyy === false
                    );
                    if (isAllTrue) {
                        this.tableIsIndeterminate = false;
                        this.checkAll = true;
                    } else if (isAllFalse) {
                        this.tableIsIndeterminate = false;
                        this.checkAll = false;
                    } else {
                        this.checkAll = false;
                        this.tableIsIndeterminate = true;
                    }
                }, 0);
            },
            handleChange1(val){
                if (val) {
                    this.serviceinfoData.forEach(item => {
                        item.isyy = true;
                    });
                    this.tableIsIndeterminate = false;
                } else {
                    this.serviceinfoData.forEach(item => {
                        item.isyy = false;
                    });
                    this.tableIsIndeterminate = false;
                }
            },
            tableCheckboxChange1() {
                setTimeout(() => {
                    let isAllTrue = this.serviceinfoData.every(
                        item => item.isyy === true
                    );
                    let isAllFalse = this.serviceinfoData.every(
                        item => item.isyy === false
                    );
                    if (isAllTrue) {
                        this.tableIsIndeterminate = false;
                        this.checkAll = true;
                    } else if (isAllFalse) {
                        this.tableIsIndeterminate = false;
                        this.checkAll = false;
                    } else {
                        this.checkAll = false;
                        this.tableIsIndeterminate = true;
                    }
                }, 0);
            },
            // 自定义表格展示提示信息
            renderHeaderMethods(h, {column}) {
                return h(
                    'div', {
                        style: 'display:flex;margin:auto;'
                    },
                    [
                        h('span', column.label),
                        h('promptMessages', {
                            props: {
                                messages: [
                                    '30分钟为一个预约区间，则30min＜服务',
                                    '时长≤60min，占两个预约区间，以此类推',
                                ]
                            }
                        })
                    ]
                )
            },
        }
    }
</script>

<style scoped lang="scss">
    .el-checkbox+.el-checkbox {
        margin-left: 0px;
    }
    .el-checkbox {
        margin-right: 25px;
    }
</style>