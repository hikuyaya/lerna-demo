<template>
    <div class="member-relation">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="会员分析查询" name="analyze">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="门店：">

                        <el-select clearable v-model.trim="searchForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="会员查询：">
                        <el-input clearable v-model="searchForm.memnametel" placeholder="姓名/手机号"  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="会员状态：">
                        <el-select clearable v-model.trim="searchForm.tags" filterable placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.mdsname" :value="item.mdscode" v-for="item in dictStatusList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="seniorSearch" type="primary">高级查询</el-button>
                        <el-button @click="exportUsers" type="primary">导出</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="table">
                    <yid-table-column label="姓名" min-width="100" prop="memname"></yid-table-column>
                    <yid-table-column label="手机号" min-width="150" prop="mobile"></yid-table-column>
                    <yid-table-column label="性别" min-width="70">
                        <template slot-scope="scope">
                            {{scope.row.sex == '1' ? "男" : "女"}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="门店" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column label="总卡金余额" min-width="150" prop="money"></yid-table-column>
                    <yid-table-column label="客单价" min-width="150" prop="univalent"></yid-table-column>
                    <yid-table-column label="消费总额" min-width="150" prop="servTotal"></yid-table-column>
                    <yid-table-column label="消费次数" min-width="150" prop="servNum"></yid-table-column>
                    <yid-table-column label="消费频次" min-width="150" prop="serviceRate"></yid-table-column>
                    <yid-table-column label="上次消费时间" min-width="150" prop="latelyTime"></yid-table-column>
                    <yid-table-column label="上次服务员工" min-width="150" prop="lastEename"></yid-table-column>
                    <yid-table-column label="会员状态" min-width="150" prop="tags">
                        <template slot-scope="scope">
                            {{getStatusName(scope.row)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="100" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="removeMem(scope.row)">移除</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="服务日志表" name="logs">
                <ServiceLog />
            </el-tab-pane>
        </el-tabs>

        <yid-dialog :title="searchDialog.title" :visible.sync="searchDialog.visible" width="450px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="性别：" prop="sex">
                    <el-radio-group v-model="searchForm.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="总卡金余额：" prop="money">
                    <el-input  v-model="searchForm.mintotalmoney"  style="width: 100px;"></el-input>-<el-input  v-model="searchForm.maxtotalmoney"  style="width: 100px;"></el-input>
                </el-form-item>
                <el-form-item label="消费总额：" prop="servTotal">
                    <el-input  v-model="searchForm.minServTotal"  style="width: 100px;"></el-input>-<el-input  v-model="searchForm.maxServTotal"  style="width: 100px;"></el-input>
                </el-form-item>
                <el-form-item label="消费次数：" prop="servNum">
                    <el-input  v-model="searchForm.minServNum"  style="width: 100px;"></el-input>-<el-input  v-model="searchForm.maxServNum"  style="width: 100px;"></el-input>
                </el-form-item>
                <el-form-item label="未来店：" prop="lastDay">
                    <el-input  v-model="searchForm.lastDay"  style="width: 100px;"></el-input>至今天（有多少天未到店）
                </el-form-item>
                <el-form-item label="顾客来源：" prop="channel">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.channel">
                        <el-option :key="item.id" :label="item.dcname" :value="item.id" v-for="item in distChannelList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属员工：" prop="eeid">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.eeid">
                        <el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否引流至线上：" prop="isOnline">
                    <el-radio-group v-model="searchForm.isOnline">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel">取消</el-button>
                    <el-button @click="searchgj" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import ServiceLog from "./components/serviceLog";
    import {exportExecl} from "../../library/helper/execl";
    export default {
        name: "member-relation",
        components: {
            ServiceLog,
        },
        data() {
            return {
                activeName : 'analyze',
                searchForm :{
                    memnametel:'',
                    tags : '',
                    sex : '',
                    mintotalmoney : '',
                    maxtotalmoney : '',
                    minServTotal : '',
                    maxServTotal : '',
                    minServNum : '',
                    maxServNum : '',
                    lastDay : '',
                    channel : '',
                    eeid : '',
                    isOnline :'',
                    shopid:''
                },
                dictStatusList : [],
                distChannelList : [],
                employeeList : [],
                pageInfo:{page:1,limit:10},
                model : {
                    startTime : '',
                    endTime : ''
                },
                searchDialog: {
                    title: '高级查询',
                    visible: false,
                },
                allShopList:[],
                filterShopList:[]
            }
        },
        mounted(){
            this.getDictStatusList();
            this.getDistChannelList();
            this.getCraftsmans();
            this.getData();
            this.getShopList({status:"1"});
        },
        methods:{
            getData(reqParams){
                const fetch = service.member.userinfo.relationListForChain
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getDictStatusList(){
                service.memInfo.statuslListAll({isDel:'0'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.dictStatusList = res.data;
                    }
                })
            },
            getDistChannelList(){
                service.memInfo.distchannelListAll({isDel:'0'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.distChannelList = res.data;
                    }
                })
            },
            //获取服务人员列表
            getCraftsmans(){
                service.employee.listAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.employeeList = res.data;
                    }
                })
            },
            handleClick(tab) {
                if(tab.name == 'analyze'){
                    this.search();
                }else if(tab.name == 'assignment'){
                    //this.getjobList();
                }else if(tab.name == 'logs'){
                    ServiceLog.methods.searchLog()
                }
            },
            getStatusName(row){
                let result = '';
                for(let i = 0; i < this.dictStatusList.length; i++){
                    let statusObj  = this.dictStatusList[i];
                    let tags = row.tags;
                    if(tags != null){
                        var arr =  tags.split(',');
                        arr.forEach((item) => {
                            if(statusObj.mdscode == item){
                                result = result + statusObj.mdsname + ',';
                            }
                        });
                    }
                }
                if(result != ''){
                    result = result.substr(0,result.length-1);
                }
                return result;
            },
            search(){
                console.log(this.searchForm);
                this.pageInfo.page=1
                this.getData(this.searchForm);
                this.cleanSearch();
            },
            cleanSearch(){
                this.searchForm.sex = '';
                this.searchForm.mintotalmoney = '';
                this.searchForm.maxtotalmoney = '';
                this.searchForm.minServTotal = '';
                this.searchForm.maxServTotal = '';
                this.searchForm.minServNum = '';
                this.searchForm.maxServNum = '';
                this.searchForm.lastDay = '';
                this.searchForm.channel = '';
                this.searchForm.eeid = '';
                this.searchForm.isOnline = '';
            },
            seniorSearch(){
                this.searchDialog.visible = true;
            },
            searchgj(){
                console.log(this.searchForm);
                this.search();
                this.searchDialog.visible = false;
            },
            cancel(){
                this.searchDialog.visible = false;
            },
            exportUsers(){
                const head = {
                    memname: '姓名',
                    mobile: '手机号',
                    sex: '性别',
                    shopname: '门店',
                    money: '卡金总余额',
                    univalent: '客单价',
                    servTotal: '消费总额',
                    servNum: '消费次数',
                    serviceRate: '消费频率',
                    latelyTime: '上次消费时间',
                    lastEename : '上次服务员工',
                    tags : '会员状态',
                }
                service.member.userinfo.relationExport({...this.searchForm}).then(res => {
                    if(res.resp_code=="200"){
                        res.data.forEach(item =>{
                            if(item.sex == '1'){
                                item.sex = '男'
                            }else if(item.sex == '2'){
                                item.sex = '女'
                            }
                            if(item.tags != null && item.tags != ''){
                                item.tags = this.getStatusName(item);
                            }
                        });
                        exportExecl(head,res.data,"会员分析查询");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            removeMem(row){
                console.log(row);
                row.isDel = '1';
                yid.util.confirm('删除会员将会删除会员下所有卡账户，您确认要删除会员信息吗？', '','', ()=> {
                    service.member.userinfo.removeUserinfo(row).then(res=> {
                        if(res.resp_code == 200) {
                            this.search();
                        }
                    });
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
            }
        }
    }
</script>

<style scoped lang="scss">
    .member-relation {

    }
</style>
