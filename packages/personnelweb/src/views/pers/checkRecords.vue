<template>

    <div class="checkRecords">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="查看明细" name="detail">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="门店：" :rules="[{ required: true, message: '门店不能为空'}]">
                        <el-select @clear="clearFormShopList('day')" clearable v-model.trim="searchForm.shopid"
                            filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id"
                                v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职务：" prop="pscode">
                        <el-select clearable filterable placeholder="请选择" v-model.trim="searchForm.pscode"
                            @change="getSearchFormPositionLevelList">
                            <el-option :key="item.id" :label="item.psname" :value="item.pscode"
                                v-for="item in searchFormPositionList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="级别：" prop="pslcode">
                        <el-select clearable filterable placeholder="请选择" v-model.trim="searchForm.pslcode">
                            <el-option :key="item.pslcode" :label="item.pslname" :value="item.pslcode"
                                v-for="item in searchFormPositionLevelList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="人员：" prop="memname">
                        <el-input clearable filterable placeholder="姓名/工号" v-model="searchForm.memname"></el-input>
                    </el-form-item>
                    <el-form-item label="选择日期" :rules="[{ required: true, message: '日期不能为空'}]">
                        <el-date-picker :clearable=false v-model="searchForm.cdateRange" type="daterange"
                            value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="seachRecords('day')" type="primary">查询</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="expRecords('day')" type="primary">导出</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="table" :data="tableData">
                    <yid-table-column label="工号" min-width="100" prop="eecode"></yid-table-column>
                    <yid-table-column label="员工姓名" min-width="120" prop="eename"></yid-table-column>
                    <yid-table-column label="级别" min-width="120" prop="pslname"></yid-table-column>
                    <yid-table-column label="班次" min-width="150" prop="pcInfo">
                        <template slot-scope="scope">
                            {{getPcInfo(scope.row)}}
                            <!--<i class="el-icon-edit" @click="alertBcDialog(scope.row)"></i>-->
                        </template>
                    </yid-table-column>
                    <yid-table-column label="日期" min-width="100" prop="cdate">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.cdate)}}
                        </template>
                    </yid-table-column>
                    <el-table-column label="上班打卡" align="center">
                        <el-table-column prop="onWork" label="打卡时间" width="120">
                            <template slot-scope="scope">
                                {{scope.row.onWork == null ? '' : scope.row.onWork}}
                                <i class="el-icon-edit" @click="alertStatusDialog(scope.row,'on',0,'day')"></i>
                            </template>
                        </el-table-column>
                        <el-table-column prop="onStatus" label="考勤状态" width="80">
                            <template slot-scope="scope">
                                {{getStatusName(scope.row.onStatus)}}
                                {{scope.row.onBkStatus == '1' ? '(补)' : ''}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="下班打卡" align="center">
                        <el-table-column prop="offWork" label="打卡时间" width="120">
                            <template slot-scope="scope">
                                {{scope.row.offWork == null ? '' : scope.row.offWork}}
                                <i class="el-icon-edit" @click="alertStatusDialog(scope.row,'off',0,'day')"></i>
                            </template>
                        </el-table-column>
                        <el-table-column prop="offStatus" label="考勤状态" width="80">
                            <template slot-scope="scope">
                                {{getStatusName(scope.row.offStatus)}}
                                {{scope.row.offBkStatus == '1' ? '(补)' : ''}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <yid-table-column label="迟到时长（分）" min-width="100" prop="delay"></yid-table-column>
                    <yid-table-column label="早退时长(分)" min-width="100" prop="zt"></yid-table-column>
                    <yid-table-column label="休息(天)" min-width="80" prop="rest">
                        <template slot-scope="scope">
                            {{scope.row.rest}}
                            <i class="el-icon-edit" @click="alertkqDialog(scope.row,'rest','day')"></i>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="学习(天)" min-width="80" prop="study">
                        <template slot-scope="scope">
                            {{scope.row.study}}
                            <i class="el-icon-edit" @click="alertkqDialog(scope.row,'study','day')"></i>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="旷工(天)" min-width="80" prop="kg">
                        <template slot-scope="scope">
                            {{scope.row.kg}}
                            <i class="el-icon-edit" @click="alertkqDialog(scope.row,'kg','day')"></i>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>

            <el-tab-pane label="查看月表" name="months">
                <el-form ref="searchForm_month" inline :model="searchForm_month">
                    <el-form-item label="门店："  :rules="[{ required: true, message: '门店不能为空'}]">
                        <el-select @clear="clearFormShopList('month')" v-model.trim="searchForm_month.shopid"
                            filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id"
                                v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职务：" prop="pscode">
                        <el-select clearable filterable placeholder="请选择" v-model.trim="searchForm_month.pscode"
                            @change="getSearchFormPositionLevelList_month">
                            <el-option :key="item.id" :label="item.psname" :value="item.pscode"
                                v-for="item in searchFormPositionList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="级别：" prop="pslcode">
                        <el-select clearable filterable placeholder="请选择" v-model.trim="searchForm_month.pslcode">
                            <el-option :key="item.pslcode" :label="item.pslname" :value="item.pslcode"
                                v-for="item in searchFormPositionLevelList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="人员：" prop="memname">
                        <el-input clearable filterable placeholder="姓名/工号" v-model="searchForm_month.memname">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="选择日期" :rules="[{ required: true, message: '日期不能为空'}]">
                        <el-date-picker :clearable=false v-model="month_cdate" :editable="false" type="month" placeholder="选择月"
                            @change="monthChange" :picker-options="setMonthDisabled">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="seachRecords('month')" type="primary">查询</el-button>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="handleDownload" type="primary">导出</el-button>
                    </el-form-item>
                </el-form>
                <!--  查看月表表格 start -->
                <yid-table class="month_table" ref="month_table" :data="month_tableData" height="600">
                    <el-table-column label="员工" min-width="120" prop="eename" fixed></el-table-column>
                    <el-table-column :label="(month.substring(0,1) == 0 ? month.substring(1) : month) + '月' +item + '号'" v-for="(item,index) in days" :key="index" align="center">
                        <el-table-column label='班次' min-width="70" align="center">
                            <template slot-scope="scope">
                                <span class="classname" :class="getProps(scope.row,item,'classname') == '未排班' ? 'not' : ''">{{getProps(scope.row,item,'classname')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label='上班' min-width="70" align="center">
                            <template slot-scope="scope">
                                <span class="kqBox" @click="alertStatusDialog(scope.row,'on',item,'month')" :class="getProps(scope.row,item,'classname') == '未排班' ? '' : getProps(scope.row,item,'onStatus') == '正常' ? '' : ((getProps(scope.row,item,'onStatus') == '迟到' || getProps(scope.row,item,'onStatus') == '早退')) ? 'not1' : getProps(scope.row,item,'onStatus') == '旷工' ? 'not2' :''">
                                    <span class="kqzt">{{getProps(scope.row,item,'onStatus')}} {{getProps(scope.row,item,'onBkStatus')}}</span>
                                    <span class="dktime">{{getProps(scope.row,item,'onWork')}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label='下班' min-width="70" align="center">
                            <template slot-scope="scope">
                                <span class="kqBox" @click="alertStatusDialog(scope.row,'off',item,'month')"  :class="getProps(scope.row,item,'classname') == '未排班' ? '' : getProps(scope.row,item,'offStatus') == '正常' ? '' : ((getProps(scope.row,item,'offStatus') == '迟到' || getProps(scope.row,item,'offStatus') == '早退')) ? 'not1' : getProps(scope.row,item,'offStatus') == '旷工' ? 'not2' :''">
                                    <span class="kqzt">{{getProps(scope.row,item,'offStatus')}} {{getProps(scope.row,item,'offBkStatus')}}</span>
                                    <span class="dktime">{{getProps(scope.row,item,'offWork')}}</span>
                                </span>
                            </template>
                        </el-table-column>  
                        <!-- <template slot-scope="scope">

                            <span class="item">
                                <span class="classname" :class="(getProps(scope.row,item,'onStatus') == '' && getProps(scope.row,item,'onWork') == '') ? 'not' :''">{{getProps(scope.row,item,'classname')}}</span>
                                <span class="on kqBox" :class="(getProps(scope.row,item,'onStatus') == '' && getProps(scope.row,item,'onWork') == '') ? 'not' :''">
                                    <span class="kqzt">{{(getProps(scope.row,item,'onStatus') == '' && getProps(scope.row,item,'onWork') == '') ? '' : '上班 (' + getProps(scope.row,item,'onStatus')+')'}} </span>
                                    <span class="dktime">{{getProps(scope.row,item,'onWork')}}</span>
                                </span>
                                <span class="off kqBox">
                                    <span class="kqzt">{{(getProps(scope.row,item,'offStatus') == '' && getProps(scope.row,item,'offWork') == '') ? '' :'下班 (' + getProps(scope.row,item,'offStatus')+')'}} </span>
                                    <span class="dktime">{{getProps(scope.row,item,'offWork')}}</span>
                                </span>
                            </span>
                            
                        </template> -->
                    </el-table-column>
                </yid-table>
                <!--  end   -->
            </el-tab-pane>
        </el-tabs>

        <yid-dialog :title="bcDialog.title" :visible.sync="bcDialog.visible" width="450px" @close="seachRecords">
            <el-form ref="bcForm" :model="bcForm" label-width="140px">
                <el-form-item label="班次：">
                    <el-select value-key="id" placeholder="请选择班次" v-model.trim="bcForm.bccode">
                        <el-option value="0" label="未排班" v-if="bcForm.bccode == 0"/>
                        <el-option :key="item.ccode" :value="item.ccode" :label="item.cname"
                            v-for="item in checkClassList" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="changeBc" type="primary">确定</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog :title="kqDialog.title" :visible.sync="kqDialog.visible" width="450px" @close="seachRecords('day')">
            <el-form ref="kqForm" :model="kqForm" label-width="100px">
                <el-form-item label="">
                    <el-radio-group v-model="kqForm.kqid">
                        <el-radio label="1">上午</el-radio>
                        <el-radio label="2">下午</el-radio>
                        <el-radio label="3">全天</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button @click="changekq" type="primary">确定</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog :title="statusDialog.title" :visible.sync="statusDialog.visible" width="450px"
            @close="seachRecords(activeName=='detail' ? 'day' : 'month')">
            <el-form ref="kqForm" :model="statusForm" >
                <el-form-item>
                    <div class="dkDate">
                        <span>打卡日期： </span>
                        <span>{{(month.substring(0,1) == '0' ? month.substring(1) : month) +'月' + day + '号'}}</span>
                    </div>
                </el-form-item>
                <el-form-item label="">
                    <div class="statusEdit">
                        <span>状态:</span>
                        <!-- <el-select value-key="id" placeholder="请选择状态" v-model.trim="statusForm.status" disabled>
                            <el-option :key="item.value" :value="item.value" :label="item.lable"
                                v-for="item in statusList1" />
                        </el-select> -->
                        <span>{{status}}</span>
                    </div>
                </el-form-item>
                
                <el-form-item >
                    <div class="bkTime">
                       <span>打卡时间</span>
                       <!--  新增时间选择器  -->
                       <el-time-picker v-model="bkTime" format='HH:mm' value-format="HH:mm" :clearable=false>
                       </el-time-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button class="editButton" @click="sureChangeStatus" type="primary">确定</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog :title="timeDialog.title" :visible.sync="timeDialog.visible" width="450px">
            <el-form>
                <el-form-item>
                    <div class="sureText">
                        <span>调整打卡时间后, 考勤记录会标记为"补卡", 并根据打卡时间重新核实考勤状态。 是否确定修改?</span>
                        <!-- <span>是否确定修改?</span> -->
                    </div>
                </el-form-item>
                <el-form-item>
                    
                    <el-button class="editButton" @click="changeStatus" type="primary">确定</el-button>
                    <el-button class="editButton" @click="cancelChangeStatus" type="cancel">取消</el-button>
                </el-form-item>
            </el-form>    
            
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import download from '@src/library/http/download'
    import { export_json_to_excel } from '@src/vendor/Export2Excel'

    export default {
        name: "reviews",
        data() {
            return {
                searchForm: {
                    cdateRange: [],
                    memInfo: '',
                    ps: '',
                    pslcode: '',
                    memname: '',
                    shop: '',
                    shopcode:''
                },
                searchForm_month: {
                    cdateRange: [],
                    memInfo: '',
                    ps: '',
                    pslcode: '',
                    memname: '',
                    shop: '',
                    shopcode:''
                },
                tableData: [],
                month_tableData: [], //查看月表的table数据
                searchFormPositionList: [], //职务list
                searchFormPositionLevelList: [], //级别list 搜索表单用
                pageInfo: {
                    page: 1,
                    limit: 10
                },
                statusList: [{
                    value: '0',
                    lable: '未打卡',
                }, {
                    value: '1',
                    lable: '正常',
                }, {
                    value: '2',
                    lable: '迟到',
                }, {
                    value: '3',
                    lable: '早退',
                }, {
                    value: '4',
                    lable: '旷工',
                }, ],
                statusList1: [{
                    value: '1',
                    lable: '正常',
                }, {
                    value: '2',
                    lable: '迟到',
                }, {
                    value: '3',
                    lable: '早退',
                }, {
                    value: '4',
                    lable: '旷工',
                }, ],
                bcDialog: {
                    title: '班次编辑',
                    visible: false,
                },
                bcForm: {
                    id: '',
                    bccode: '',
                },
                kqForm: {
                    id: '',
                    type: '',
                    kqid: '',
                },
                kqDialog: {
                    title: '考勤编辑',
                    visible: false,
                },
                statusDialog: {
                    title: '编辑',
                    visible: false,
                },
                timeDialog: {
                    title: '提示',
                    visible: false, 
                },
                statusForm: {
                    id: '',
                    type: '',
                    status: '',
                },
                checkClassList: [],
                allShopList: [],
                filterShopList: [],
                activeName: 'detail',
                month_cdate: '',
                year:'',
                month: '', //月表选择的月份
                day:'',     //修改的是多少号
                status:'',
                days: '', //月表选择月份有多少天
                bkTime:'',
                row:{},
                type:'',
                index:0,
                tab:'',
                oldTime:'',
                setMonthDisabled: {
                    disabledDate(time) {
                      const date = new Date(); 
                      const year = date.getFullYear(); 
                      let month = date.getMonth() + 1; 
                      month = month > 9 ? month : '0'+month
                      const nowDate =''+ year + month; 

                      // 获取时间选择器的月份信息
                      const timeyear = time.getFullYear(); 
                      let timemonth = time.getMonth() + 1; 
                      timemonth = timemonth > 9 ? timemonth : '0'+timemonth
                      const elTimeData =''+ timeyear + timemonth;

                      // 返回，时间选择器的日期月份大于当前日期的月份，又因为disabledDate函数是控制月份禁用不可选
                      // 所以，最终就是：时间选择器的月份大于当前的月份，就都禁用掉，所以就实现了最终效果：
                      // 大于等于当前月份都不可选 
                      return elTimeData > nowDate; // 这里虽然是字符串，但是弱类型语言js会做一个转换，是可以比较大小的如： '202107' > '202008'
                    },
                },
            }
        },
        mounted() {
            let d = new Date
            let year = d.getFullYear()
            let month = d.getMonth() + 1
            if (Number(month) < 10) {
                month = "0" + month
            }
            let day = d.getDate()
            if (Number(day) < 10) {
                day = "0" + day
            }
            let date1 = year + "-" + month + "-" + day
            this.searchForm.cdateRange.push(date1)
            this.searchForm.cdateRange.unshift(date1)

            let days = new Date(year, month, 0).getDate() 
            let date2 = year + '-' + month
            this.searchForm_month.cdateRange.push(year + "-" + month + "-01")
             this.searchForm_month.cdateRange.push(year + "-" + month + "-" + days)

            // this.searchForm_month.cdateRange = new Date(this.searchForm_month.cdateRange)
            this.month_cdate = year + '-' +month

            this.year = year
            this.month = month
            this.getCheckClassList('day');
            this.getSearchFormPositionList();
            // this.seachRecords('day');
            this.getShopList({
                status: "1"
            });
        },
        computed: {
            searchFormReq: function () {
                let reqObj = {}
                let cdateRange = this.searchForm.cdateRange;
                if (cdateRange) {
                    reqObj.cdateStart = this.searchForm.cdateRange[0];
                    reqObj.cdateEnd = this.searchForm.cdateRange[1];
                } else {
                    reqObj.cdateStart = '';
                    reqObj.cdateEnd = '';
                }
                reqObj.memInfo = this.searchForm.memInfo
                reqObj.pscode = this.searchForm.pscode
                reqObj.pslcode = this.searchForm.pslcode
                reqObj.memname = this.searchForm.memname
                return reqObj;
            },
            searchFormMonthReq: function () {
                let reqObj = {}
                let cdateRange = this.searchForm_month.cdateRange;
                if (cdateRange) {
                    reqObj.cdateStart = this.searchForm_month.cdateRange[0];
                    reqObj.cdateEnd = this.searchForm_month.cdateRange[1];
                } else {
                    reqObj.cdateStart = '';
                    reqObj.cdateEnd = '';
                }
                reqObj.memInfo = this.searchForm_month.memInfo
                reqObj.pscode = this.searchForm_month.pscode
                reqObj.pslcode = this.searchForm_month.pslcode
                reqObj.memname = this.searchForm_month.memname
                return reqObj;
            }
        },
        created() {
            //查询添加迟到/早退规则列表
            //  this.getCheckRuleList();
            //  this.getShopConfigList("");
            // this.getShopList({
            //     status: "1"
            // });
        },
        methods: {
            clearFormShopList(type) {
                if (type == 'day') {
                    this.searchForm.shopid = null
                    this.searchForm.shopcode = null
                } else if (type == 'month') {
                    this.searchForm_month.shopid = null
                    this.searchForm_month.shopcode = null
                }
                this.filterShopList = this.allShopList
            },
            getCheckClassList(type) {
                if (type == 'day') {
                    service.pers.checkClass.checkClassAll({
                        status: '1',
                        shopid: this.searchForm.shopid

                    }).then(res => {
                        if (res.resp_code == 200) {
                            this.checkClassList = res.data;
                        }
                    });
                } else if (type == 'month') {
                    service.pers.checkClass.checkClassAll({
                        status: '1',
                        shopid: this.searchForm_month.shopid
                    }).then(res => {
                        if (res.resp_code == 200) {
                            this.checkClassList = res.data;
                        }
                    });
                }

            },
            getSearchFormPositionLevelList(pscode) {
                let psid;
                this.searchFormPositionList.forEach(each => {
                    if (pscode == each.pscode) {
                        psid = each.id
                    }
                })
                service.positionLevel.list({
                    status: "1",
                    psid: psid
                }).then(res => {
                    if (res.resp_code == 200) {
                        this.searchFormPositionLevelList = res.data;
                    }
                })
            },
            getSearchFormPositionLevelList_month(pscode) {
                let psid;
                this.searchFormPositionList.forEach(each => {
                    if (pscode == each.pscode) {
                        psid = each.id
                    }
                })
                service.positionLevel.list({
                    status: "1",
                    psid: psid
                }).then(res => {
                    if (res.resp_code == 200) {
                        this.searchFormPositionLevelList = res.data;
                    }
                })
            },
            getSearchFormPositionList() {
                service.position.list({
                    status: "1",
                    isDel: "0"
                }).then(res => {
                    if (res.resp_code == 200) {
                        this.searchFormPositionList = res.data;
                    }
                })

            },
            getData(reqParams, type) {

                const fetch = service.pers.checkRecords.getRecordsList
                const params = {
                    ...this.pageInfo,
                    ...reqParams
                }
                if(type == 'day'){
                     params.shopcode = this.searchForm.shopcode+''
                     params.shopid = this.searchForm.shopid
                }else{
                     params.shopcode = this.searchForm_month.shopcode+''
                     params.shopid = this.searchForm_month.shopid
                }
                console.log(this.searchForm_month)
                if(params.shopid == undefined || params.shopid == ''){
                   return yid.util.error("请选择门店!")
                }
                if(type == 'day'){
                    // params.shopid = this.searchForm.shopid
                    // params.shopcode = this.searchForm.shopcode+''
                    //  let item = this.filterShopList.filter((i) =>{
                    //         if(i.shopcode == this.searchForm.shopcode){
                    //             return i
                    //         }
                    //     })
                    //   params.shopid =  item[0].id
                }else{
                    // params.shopid = this.searchForm_month.shopid
                    
                }
                
                params.type = '1'
                if (type == 'day') {
                    
                    this.$refs.table.reloadData({
                        fetch,
                        params,
                    });
                } else if (type == 'month') {
                    let eename = params.memname
                    delete params.memname
                    params.eename = eename
                    params.cdateEnd = this.searchForm_month.cdateRange[1]
                     params.cdateStart = this.searchForm_month.cdateRange[0]
                    
                    
                    // params.cdateEnd = year + '-' + month + '-' + days
                    // params.cdateStart = params.cdateStart + '-01'
                    // this.year = year
                    // this.month = month
                    // this.days = days
                     let month_tableData = []

                    service.pers.checkRecords.getShopMonthRecords(params).then(res => {
                        this.month_tableData =[]
                        let date = params.cdateStart
                        let year = date.split('-')[0]
                        let month = date.split('-')[1]
                        let date_temp  = new Date()
                        let year_temp = date_temp.getFullYear()

                        let month_temp = Number(date_temp.getMonth()) + 1 > 10 ? Number(date_temp.getMonth()) + 1 +'' : '0'+ (Number(date_temp.getMonth()) + 1)
                        let days
                        if(month == month_temp && year ==  year_temp){

                            days = date_temp.getDate()
                        }else{
                            days = new Date(year, month, 0).getDate() 

                        }
                        this.month = month
                        this.days = days
                        
                        if (res.data.length > 0) {
                            for (let i = 0; i < res.data.length; i++) {
                                if (month_tableData.length == 0) {
                                    month_tableData.push({
                                        eename: res.data[i].eename,
                                        pslname: res.data[i].pslname,
                                        eecode: res.data[i].eecode,
                                        eeid:res.data[i].eeid,
                                        shopcode: res.data[i].shopcode == null ? this.searchForm_month.shopcode: res.data[i].shopcode,
                                        data: []
                                    })
                                   
                                    for (let n = 0; n < this.days; n++) {
                                        month_tableData[0].data.push({
                                            cdate: n < 9 ? this.month + '-0' + (n + 1) : this.month + '-' + (n + 1),
                                            id:res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].id :null :null,
                                            classname: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].classname :null :null, //可能为null(未排班)
                                            onWork: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].onWork : null: null,
                                            onStatus: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].onStatus : null :null,
                                            offWork: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].offWork : null :null,
                                            offStatus: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].offStatus : null : null,
                                            onBkStatus:res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].onBkStatus : null : null,
                                            offBkStatus:res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].offBkStatus : null : null,
                                        })
                                    }
                                } else {
                                    let eecode_temp = month_tableData.map(item => {
                                        return item.eecode;
                                    })
                                    let index = eecode_temp.findIndex(function (data) {
                                        return data == res.data[i].eecode;

                                    });
                                    if (index == -1) { //没找到
                                        month_tableData.push({
                                            eename: res.data[i].eename,
                                            pslname: res.data[i].pslname,
                                            eecode: res.data[i].eecode,
                                            eeid:res.data[i].eeid,
                                            shopcode: res.data[i].shopcode == null ? this.searchForm_month.shopcode: res.data[i].shopcode,
                                            data: []
                                        })
                                       for (let n = 0; n < this.days; n++) {
                                            month_tableData[month_tableData.length-1].data.push({
                                                cdate: n < 9 ? this.month + '-0' + (n + 1) : this.month + '-' + (n + 1),
                                                id:res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].id :null :null,
                                                classname: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].classname :null :null, //可能为null(未排班)
                                                onWork: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].onWork : null :null,
                                                onStatus: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].onStatus : null:null,
                                                offWork: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].offWork : null:null,
                                                offStatus: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].offStatus : null :null,
                                                onBkStatus:res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].onBkStatus : null :null,
                                                offBkStatus:res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (n < 9 ? '0' + (n + 1) :  n + 1) ? res.data[i].offBkStatus : null :null,
                                            })
                                        }
                                    } else { //同一个人

                                        let index_temp = month_tableData[index].data.findIndex(item => item.cdate == res.data[i].cdate.substring(5, 10))
                                            month_tableData[index].data[index_temp] = {
                                                cdate: index_temp < 9 ? this.month + '-0' + (index_temp + 1) : this.month + '-' + (index_temp + 1),
                                                id:res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (index_temp < 9 ? '0' + (index_temp + 1) :  index_temp + 1) ? res.data[i].id :null :null,
                                                classname: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (index_temp < 9 ? '0' + (index_temp + 1) :  index_temp + 1) ? res.data[i].classname :null :null, //可能为null(未排班)
                                                onWork: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (index_temp < 9 ? '0' + (index_temp + 1) :  index_temp + 1) ? res.data[i].onWork : null :null,
                                                onStatus: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (index_temp < 9 ? '0' + (index_temp + 1) :  index_temp + 1) ? res.data[i].onStatus : null :null,
                                                offWork: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (index_temp< 9 ? '0' + (index_temp + 1) :  index_temp + 1) ? res.data[i].offWork : null :null,
                                                offStatus: res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (index_temp < 9 ? '0' + (index_temp+ 1) :  index_temp + 1) ? res.data[i].offStatus : null :null,
                                                onBkStatus:res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (index_temp < 9 ? '0' + (index_temp + 1) :  index_temp + 1) ? res.data[i].onBkStatus : null :null,
                                                offBkStatus:res.data[i].cdate != null ? res.data[i].cdate.substring(8, 10) == (index_temp < 9 ? '0' + (index_temp + 1) :  index_temp + 1) ? res.data[i].offBkStatus : null :null,
                                            }
                                       
                                    }
                                }


                            }

                            let item = this.filterShopList.filter((item) =>{
                            if(item.shopcode == this.searchForm_month.shopcode){
                                return item.id
                            }
                        })
                        let params1 = {
                            // shopid: item[0].id,
                             shopid:this.searchForm_month.shopid,
                            month: this.searchForm_month.cdateRange[0].substring(0,7)
                        }

                         service.pers.checkRecords.getShopEeScheduleList(params1).then(res => {
                             for(let i = 0;i<month_tableData.length;i++){
                                 for(let m=0;m<month_tableData[i].data.length;m++){

                                     if(month_tableData[i].data[m].classname == null || month_tableData[i].data[m].classname == ''){
                                         if(month_tableData[i].data[m].id == null || month_tableData[i].data[m].id == ''){
                                             let item = ''
                                            item = res.data.filter((item) =>{
                                                if(month_tableData[i].eecode == item.eecode && month_tableData[i].data[m].cdate == item.day.substring(5,10)){
                                                    return item.classes
                                                }
                                            })[0]

                                            if(item != undefined){
                                                month_tableData[i].data[m].classname = item.classes 
                                            }
                                         }
                                        
                                        
                                     }

                                 }
                             }
                            this.month_tableData = month_tableData
                         })
                          
                        }

                    })
                        
                }


            },
            seachRecords(type) {
                if (type == 'day') {
                    this.getData(this.searchFormReq, 'day');
                } else if (type == 'month') {
                    this.getData(this.searchFormMonthReq, 'month');
                }

            },
            expRecords(type) {
                // console.log(type)
                var params

                    params = {
                        ...this.searchFormReq
                    }
                    params.type = '1'
                    if (this.searchForm.shopid) {
                        this.allShopList.forEach(e => {
                            if (this.searchForm.shopid == e.id) {
                                params.shopid = e.id
                                params.shopcode = e.shopcode
                                params.shopname = e.shopname
                            }
                        })
                    } else {
                        params.shopid = ''
                        params.shopcode = ''
                        params.shopname = ''
                    }

                download($yid.config.API.BASE + 'api-pers/checkrecords/expRecordsList', params)
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v =>
                  filterVal.map(j => {
                      if(j == 'eename'){
                          return v[j] 
                      }else{
                          if(j != null){
                              if(j.indexOf('+') == -1){       //一个单元格取单个值
                                let index = j.split(".")[0]      //日期的索引
                                let prop = j.split(".")[1]       //要取的某一天的班次字段

                                return v.data[index][prop] == null ? '未排班' : v.data[index][prop]
                            }else{                           //一个单元格取考勤状态,打卡时间,(是否是补卡状态) 3个值需要拼接
                              let arr = j.split("+")
                              let index = arr[0].split(".")[0]
                              let prop1
                              if(v.data[index][arr[0].split(".")[1]] == 1){          //打卡状态
                                prop1 = '正常'
                              }else if(v.data[index][arr[0].split(".")[1]] == 2){
                                  prop1 = '迟到'
                              }else if(v.data[index][arr[0].split(".")[1]] == 3){
                                  prop1 = '早退'
                              }else if(v.data[index][arr[0].split(".")[1]] == 4){
                                  prop1 = '旷工'
                              }else if(v.data[index][arr[0].split(".")[1]] == null){
                                  prop1 = ''
                              } 
                              let bkStatus = v.data[index][arr[2].split(".")[1]] == 1 ? '(补)' : ''        //补卡状态

                              let prop2 = arr[1].split(".")[1]            //打卡时间
                              let time = v.data[index][prop2] == null ? '' : v.data[index][prop2].substring(11,16)
                              
                              if(prop1 != '' || bkStatus != ''){
                                  return prop1  + bkStatus + '\n'+  time
                              }else{
                                  return time
                              }
                              
                            }
                          }
                           
                      }
                     
                    
                  })
                )
            },
            handleDownload() {
                //对导出数据进行再处理
                let excelData_temp =  this.month_tableData
                // console.log()
                //一级表头
                let multiHeader = [['员工']]
                //二级表头
                let tHeadr = ['']
                //每一列的取值
                let filterVal = ['eename']
                let month = this.month.substring(0,1) == '0' ? this.month.substring(1) : this.month
                for(let i = 0; i < this.days; i++){
                    multiHeader[0].push(month+'月'+(i+1)+'号','','')
                    tHeadr.push('班次','上班','下班')
                    filterVal.push(i+'.classname',i+'.onStatus+'+i+'.onWork+'+i+'.onBkStatus',i+'.offStatus+'+i+'.offWork+'+i+'.offBkStatus')
                }
                let excelData = this.formatJson(filterVal,excelData_temp)
                let merges = [
                    'A1:A2'

                ]
                export_json_to_excel({
                    multiHeader,
                    header:tHeadr,
                    data:excelData,
                    merges,
                    bookType:'xlsx',
                })
                // console.log(multiHeader,tHeadr,filterVal)
            },
            getStatusName(key) {
                for (let i = 0; i < this.statusList.length; i++) {
                    let statusObj = this.statusList[i]
                    if (statusObj.value == key) {
                        return statusObj.lable
                    }
                }
                return ""
            },
            alertBcDialog(row) {
                this.bcDialog.visible = true;
                this.bcForm.id = row.id,
                    this.bcForm.bcid = '';
                this.bcForm.bccode = '';
                if (row.pccode != null && row.pccode != '') {
                    this.bcForm.bccode = String(row.pccode);
                } else {
                    this.bcForm.bccode = '0';
                }
            },
            cancelBcDialog() {
                this.bcDialog.visible = false;
            },
            alertkqDialog(row, type) {
                this.kqDialog.visible = true;
                this.kqForm.id = row.id;
                this.kqForm.type = type;
                this.kqForm.kqid = '';
                if (type == 'rest') {
                    this.kqForm.kqid = row.restflag;
                } else if (type == 'study') {
                    this.kqForm.kqid = row.studayflag;
                } else if (type == 'kg') {
                    this.kqForm.kqid = row.kgflag;
                }
            },
            cancelkqDialog() {
                this.kqDialog.visible = false;
            },
            changeBc() { //更新班次
                let id = this.bcForm.id;
                let pccode = this.bcForm.bccode;
                const param = {
                    id: id,
                    pccode: pccode
                }
                service.pers.checkRecords.editBc(param).then(res => {
                    if (res.resp_code == 200) {
                        yid.util.success("更新成功!");
                        this.cancelBcDialog();
                        this.seachRecords('day');
                    }
                })
            },
            changekq() {
                //更新考勤状态
                let id = this.kqForm.id
                let type = this.kqForm.type;
                let kqid = this.kqForm.kqid;

                if (type == null || type.length == 0) {
                    yid.util.info("请选择类型");
                    return;
                }
                if (kqid == null || kqid.length == 0) {
                    yid.util.info("请选择考勤,上午/下午/全天");
                    return;
                }
                const param = {
                    id: id,
                    type: type,
                    kqid: kqid
                }
                service.pers.checkRecords.editKq(param).then(res => {
                    if (res.resp_code == 200) {
                        yid.util.success("更新成功!");
                        this.cancelkqDialog();
                        this.seachRecords('day');
                    }
                })
            },
            alertStatusDialog(row, type, index, tab) {

                this.statusDialog.visible = true;
                this.statusForm.id = row.id == undefined ? '' : row.id;
                this.statusForm.type = type;
                this.statusForm.status = '';

                this.row = row
                this.type = type
                this.index = index
                this.tab = tab
               if(tab == 'month'){
                   this.day = index
                    if (type == 'on') {
                        this.bkTime = row.data[index-1].onWork != null ? row.data[index-1].onWork.substring(11,16) : ''
                        this.oldTime = row.data[index-1].onWork != null ? row.data[index-1].onWork.substring(11,16) : ''
                        this.statusForm.status = row.data[index-1].onStatus;
                        this.status = this.getStatusName(row.data[index-1].onStatus)
                    } else if (type == 'off') {
                      this.bkTime = row.data[index-1].offWork != null ? row.data[index-1].offWork.substring(11,16) : ''
                      this.oldTime = row.data[index-1].offWork != null ? row.data[index-1].offWork.substring(11,16) : ''
                      this.statusForm.status = row.data[index-1].offStatus;
                      this.status = this.getStatusName(row.data[index-1].offStatus)
                    }
                    console.log(this.statusForm)
               }else{
                   this.month = row.cdate.substring(5,7)
                   this.day = row.cdate.substring(8,10).substring(0,1) == 0 ? row.cdate.substring(8,10).substring(1) : row.cdate.substring(8,10)
                    if (type == 'on') {
                        this.bkTime = row.onWork != null ? row.onWork.substring(11,16) : ''
                        this.oldTime = row.onWork != null ? row.onWork.substring(11,16) : ''
                        this.statusForm.status = row.onStatus;
                        this.status = this.getStatusName(row.onStatus)
                    } else if (type == 'off') {
                        this.bkTime = row.offWork != null ? row.offWork.substring(11,16) : ''
                        this.oldTime = row.offWork != null ? row.offWork.substring(11,16) : ''
                        this.statusForm.status = row.offStatus;
                        this.status = this.getStatusName(row.offStatus)
                    }
               }
               
            },
            cancelStatusDialog() {
                this.timeDialog.visible = false;
                this.statusDialog.visible = false;
            },
            cancelChangeStatus(){
                this.timeDialog.visible = false;
                this.bkTime = this.oldTime
            },
            sureChangeStatus(){
                this.timeDialog.visible = true;
            },
            changeStatus() {
                //更新考勤状态
                let id = this.statusForm.id
                let type = this.statusForm.type;
                let status = this.statusForm.status;
                if (type == null || type.length == 0) {
                    yid.util.info("请选择类型");
                    return;
                }
                // if (status == null || status.length == 0) {
                //     yid.util.info("请选择状态");
                //     return;
                // }
                if (type == 'on') {
                    if (status == '3') {
                        yid.util.info("上午打卡无法改为早退状态");
                        return;
                    }
                } else if (type == 'off') {
                    if (status == '2') {
                        yid.util.info("下午打卡无法改为迟到状态");
                        return;
                    }
                }
                console.log(this.searchForm_month)
                if(this.bkTime != ''){
                    let shopid
                    if(this.activeName == 'detail'){
                        shopid = this.searchForm.shopid
                    }else{
                        shopid = this.searchForm_month.shopid
                    }
                    const param = {
                    // id: id,
                    // type: type,
                    // status: status
                    eeid: this.row.eeid,
                    eecode:this.row.eecode,
                    eename: this.row.eename,
                    // shopcode: this.searchForm_month.shopcode,
                    // shopcode:this.row.shopcode,
                    shopid: shopid,
                    cdate:this.year+'-'+this.month+'-'+(this.day <10 ? '0'+this.day : this.day) + ' ' + this.bkTime + ':00',
                    ctype: this.type == 'on' ? 1 : 2,
                    onBkStatus: this.type == 'on' ? 1 : '',
                    offBkStatus: this.type == 'off' ? 1 : '',
                }
                service.pers.checkRecords.bkSignIn(param).then(res => {
                    if (res.resp_code == 200) {
                        yid.util.success("更新成功!");
                        this.cancelStatusDialog();
                        this.seachRecords(this.activeName == 'detail' ? 'day' : 'month');
                    }
                })
                }else{
                    this.timeDialog.visible = false;
                    this.statusDialog.visible = false;
                }
                
            },

            getShopList(params) {

                service.chain.shop.shopList(params).then(res => {
                    if (res.resp_code == 200) {
                        this.filterShopList = res.data;
                        console.log(this.filterShopList)
                        this.allShopList = Object.assign(this.filterShopList); //保留原数据
                    }
                })
            },
            filterShop(v) {
                this.filterShopList = this.allShopList.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            },
            getPcInfo(row) {
                let info = '';
                if (!yid.util.isEmpty(row.pccode)) {
                    if (row.pccode === '-1' || row.pccode === '-2') {
                        info = row.classname
                    } else {
                        info = row.classname + ' ' + row.stime + '-' + row.etime
                    }
                } else {
                    info = '未排班'
                }
                return info;
            },
            handleClick(tab) {
                if (tab.name == 'detail') {

                    // this.seachRecords('day')
                } else if (tab.name == 'months') {
                    // this.seachRecords('month')
                }
            },
            monthChange(e) {
                // this.searchForm_month.cdateRange[0] = new Date(e).formatDate('yyyy-MM')
                let date = new Date(e).formatDate('yyyy-MM')
                    let year = date.split('-')[0]
                    let month = date.split('-')[1]
                    let days = new Date(year, month, 0).getDate() 
                    this.searchForm_month.cdateRange[0] = year + '-' + month + '-01'
                     this.searchForm_month.cdateRange[1] = year + '-' + month + '-'+ days
                     this.year = year
                     
                    //  console.log(this.month)
            },
            getProps(evt,day,type){
                if(type == 'classname'){
                    return evt.data[day - 1].classname  == null ? '未排班' : evt.data[day - 1].classname
                }else if(type == 'onWork'){
                    return evt.data[day - 1].onWork  == null ? '' : evt.data[day - 1].onWork.substring(11,16)
                }else if(type == 'onStatus'){
                    for (let i = 0; i < this.statusList.length; i++) {
                        let statusObj = this.statusList[i]
                        if (statusObj.value == evt.data[day - 1].onStatus) {
                            return statusObj.lable
                        }
                    }
                    return ""
                }else if(type == 'offWork'){
                    return evt.data[day - 1].offWork  == null ? '' : evt.data[day - 1].offWork.substring(11,16)
                }else if(type == 'offStatus'){
                    for (let i = 0; i < this.statusList.length; i++) {
                        let statusObj = this.statusList[i]
                        if (statusObj.value == evt.data[day - 1].offStatus) {
                            return statusObj.lable
                        }
                    }
                    return ""
                }else if(type == 'offBkStatus'){
                    return evt.data[day - 1].offBkStatus == 1 ? '(补)' : ''
                }else if(type == 'onBkStatus'){
                    return evt.data[day - 1].onBkStatus == 1 ? '(补)' : ''
                }
               
            },
        }
    }
</script>

<style scoped lang="scss">
    .month_table{
        /deep/ .el-table__cell{
            padding: 0 !important; 
        }
        /deep/ .cell{
            padding: 0 !important;
            height: 100%;
            display: flex !important;
            justify-content: center;
            align-items: center;
        }  

            .classname{
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .on{
                width: 100%;
            }
            .not{
                // background-color: #DAEEF3;
                // color: #169BD5;
            }
            .not1{
                background-color: #FDE9D9;
                color: #FF0000;
            }
            .not2{
                background-color: #F2DCDB;
                color: #FF0000;
            }
        }
        .kqBox{
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            justify-content: center;
        }
        .statusEdit{
            >span{
                margin-right: 42px;
            }
        }
        .bkTime{
            // margin-top: 30px;
            >span{
                margin-right: 20px;
            }
            /deep/ .el-date-editor.el-input{
                width: 100px !important;
            }
        }
        .editButton{
            float: right;
            margin-right: 30px;
        }
        .sureText{
            text-align: center;
            > span:first-child{
                display: block;
            }
        }
        /deep/ .el-table__body-wrapper{
            height: 518px !important;
        }
        /deep/ .el-table__fixed-body-wrapper{
            top: 80px !important;
            height: 510px !important;
        }
</style>