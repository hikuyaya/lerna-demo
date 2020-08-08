<template>
    <div class="checkRecords">
        <el-form ref="searchForm" inline :model="searchForm">

            <el-form-item label="门店：">

                <el-select clearable v-model.trim="searchForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职务：" prop="psid">
                <el-select   filterable placeholder="请选择" v-model.trim="searchForm.psid" @change="getSearchFormPositionLevelList">
                    <el-option :key="item.id" :label="item.psname" :value="item.id" v-for="item in searchFormPositionList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="级别：" prop="pslid">
                <el-select   filterable placeholder="请选择" v-model.trim="searchForm.pslid">
                    <el-option :key="item.id" :label="item.pslname" :value="item.id" v-for="item in searchFormPositionLevelList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员：" prop="memname">
                <el-input clearable filterable placeholder="姓名/工号" v-model="searchForm.memname"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-date-picker
                        :clearable = false
                        v-model="searchForm.cdateRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
                <el-button @click="seachRecords" type="primary">查询</el-button>
            </el-form-item>
        </el-form>
        <yid-table pagination ref="table" :data="tableData">
            <yid-table-column label="工号" min-width="100" prop="eecode"></yid-table-column>
            <yid-table-column label="员工姓名" min-width="120" prop="eename"></yid-table-column>
            <yid-table-column label="级别" min-width="120" prop="pslname"></yid-table-column>
            <yid-table-column label="班次" min-width="150" prop="pcInfo">
                <template slot-scope="scope">
                    {{scope.row.pcInfo}}
                    <i class="el-icon-edit" @click="alertBcDialog(scope.row)"></i>
                </template>
            </yid-table-column>
            <yid-table-column label="日期" min-width="100" prop="cdate">
                <template slot-scope="scope">
                    {{$yid.util.formatDate(scope.row.cdate)}}
                </template>
            </yid-table-column>
            <el-table-column label="上班打卡" align="center">
                <el-table-column prop="onWork" label="打卡时间" width="120"></el-table-column>
                <el-table-column prop="onStatus" label="考勤状态" width="80">
                    <template slot-scope="scope">
                        {{getStatusName(scope.row.onStatus)}}
                        <i class="el-icon-edit" @click="alertStatusDialog(scope.row,'on')"></i>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="下班打卡" align="center">
                <el-table-column prop="offWork" label="打卡时间" width="120"></el-table-column>
                <el-table-column prop="offStatus" label="考勤状态" width="80">
                    <template slot-scope="scope">
                        {{getStatusName(scope.row.offStatus)}}
                        <i class="el-icon-edit" @click="alertStatusDialog(scope.row,'off')"></i>
                    </template>
                </el-table-column>
            </el-table-column>
            <yid-table-column label="迟到时长（分）" min-width="100" prop="delay"></yid-table-column>
            <yid-table-column label="早退时长(分)" min-width="100" prop="zt"></yid-table-column>
            <yid-table-column label="休息(天)" min-width="80" prop="rest">
                <template slot-scope="scope">
                    {{scope.row.rest}}
                    <i class="el-icon-edit" @click="alertkqDialog(scope.row,'rest')"></i>
                </template>
            </yid-table-column>
            <yid-table-column label="学习(天)" min-width="80" prop="study">
                <template slot-scope="scope">
                    {{scope.row.study}}
                    <i class="el-icon-edit" @click="alertkqDialog(scope.row,'study')"></i>
                </template>
            </yid-table-column>
            <yid-table-column label="旷工(天)" min-width="80" prop="kg">
                <template slot-scope="scope">
                    {{scope.row.kg}}
                    <i class="el-icon-edit" @click="alertkqDialog(scope.row,'kg')"></i>
                </template>
            </yid-table-column>
        </yid-table>
        <yid-dialog :title="bcDialog.title" :visible.sync="bcDialog.visible" width="450px" @close="seachRecords">
            <el-form ref="bcForm" :model="bcForm"  label-width="140px">
                <el-form-item label="班次：">
                    <el-select value-key="id" placeholder="请选择班次" v-model.trim="bcForm.bcid">
                        <el-option value="0" label="未排班"/>
                        <el-option :key="item.id" :value="item.id" :label="item.cname" v-for="item in checkClassList"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="changeBc" type="primary">确定</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog :title="kqDialog.title" :visible.sync="kqDialog.visible" width="450px" @close="seachRecords">
            <el-form ref="kqForm" :model="kqForm"  label-width="100px">
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
        <yid-dialog :title="statusDialog.title" :visible.sync="statusDialog.visible" width="450px" @close="seachRecords">
            <el-form ref="kqForm" :model="statusForm"  label-width="100px">
                <el-form-item label="">
                    <el-select value-key="id" placeholder="请选择状态" v-model.trim="statusForm.status">
                        <el-option :key="item.value" :value="item.value" :label="item.lable" v-for="item in statusList1"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="changeStatus" type="primary">确定</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    export default {
        name: "reviews",
        data() {
            return {
                searchForm : {
                    cdateRange : [],
                    memInfo : '',
                    psid : '',
                    pslid : '',
                    memname : '',
                    shopid:''
                },
                tableData:[],
                searchFormPositionList:[], //职务list
                searchFormPositionLevelList:[], //级别list 搜索表单用
                pageInfo:{page:1,limit:10},
                statusList : [{
                    value : '0',
                    lable : '未打卡',
                },{
                    value : '1',
                    lable : '正常',
                },{
                    value : '2',
                    lable : '迟到',
                },{
                    value : '3',
                    lable : '早退',
                },{
                    value : '4',
                    lable : '旷工',
                },],
                statusList1 : [{
                    value : '1',
                    lable : '正常',
                },{
                    value : '2',
                    lable : '迟到',
                },{
                    value : '3',
                    lable : '早退',
                },{
                    value : '4',
                    lable : '旷工',
                },],
                bcDialog : {
                    title : '班次编辑',
                    visible : false,
                },
                bcForm:{
                    id : '',
                    bcid : '',
                },
                kqForm:{
                    id : '',
                    type : '',
                    kqid : '',
                },
                kqDialog : {
                    title : '考勤编辑',
                    visible : false,
                },
                statusDialog:{
                    title : '状态编辑',
                    visible : false,
                },
                statusForm :{
                    id : '',
                    type : '',
                    status : '',
                },
                checkClassList : [],
                allShopList:[],
                filterShopList:[]
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
            this.searchForm.cdateRange.push(date1)
            this.searchForm.cdateRange.unshift(date1)
            this.getCheckClassList();
            this.getSearchFormPositionList();
            this.seachRecords();
            this.getShopList({status:"0"});
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let cdateRange = this.searchForm.cdateRange;
                if(cdateRange){
                    reqObj.cdateStart = this.searchForm.cdateRange[0];
                    reqObj.cdateEnd = this.searchForm.cdateRange[1];
                }
                reqObj.memInfo = this.searchForm.memInfo
                reqObj.psid = this.searchForm.psid
                reqObj.pslid = this.searchForm.pslid
                reqObj.memname = this.searchForm.memname
                return reqObj;
            }
        },
        methods:{
            getCheckClassList(){
                service.pers.checkClass.checkClassAll({status : '1',shopid:this.searchForm.shopid}).then(res=>{
                    if(res.resp_code == 200) {
                        this.checkClassList = res.data;
                    }
                });
            },
            getSearchFormPositionLevelList(pslid){
                this.searchForm.pslid = null;
                service.positionLevel.list({status:"1",psid:pslid}).then(res=> {
                    if(res.resp_code == 200) {
                        this.searchFormPositionLevelList = res.data;
                    }
                })

            },
            getSearchFormPositionList(){
                service.position.list({status:"1",isDel:"0"}).then(res=> {
                    if(res.resp_code == 200) {
                        this.searchFormPositionList = res.data;
                    }
                })

            },
            getData(reqParams){
                console.log(reqParams);
                const fetch = service.pers.checkRecords.getRecordsList
                const params = {...this.pageInfo,...reqParams}
                params.shopid=this.searchForm.shopid
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
                /*const params = {...this.pageInfo,...reqParams}
                service.pers.checkRecords.getRecordsList(params).then(res=>{
                    if(res.resp_code == 200){
                        let list = res.data;
                        this.count = res.count
                        if(this.tableData.length <= 0 ){

                            this.tableData = list
                        }else{
                            this.tableData = this.tableData.concat(list);
                        }

                    }
                })*/
            },
            seachRecords(){
                this.getData(this.searchFormReq);
            },
            getStatusName(key){
                for(let i = 0; i < this.statusList.length; i++){
                    let statusObj  = this.statusList[i]
                    if(statusObj.value == key){
                        return statusObj.lable
                    }
                }
                return ""
            },
            alertBcDialog(row){
                this.bcDialog.visible = true;
                this.bcForm.id = row.id,
                this.bcForm.bcid = '';
                if(row.pcid != null && row.pcid != ''){
                    this.bcForm.bcid = String(row.pcid);
                }else{
                    this.bcForm.bcid = '0';
                }
            },
            cancelBcDialog(){
                this.bcDialog.visible = false;
            },
            alertkqDialog(row,type){
                this.kqDialog.visible = true;
                this.kqForm.id = row.id;
                this.kqForm.type = type;
                this.kqForm.kqid = '';
                if(type == 'rest'){
                    this.kqForm.kqid = row.restflag;
                }else if (type == 'study'){
                    this.kqForm.kqid = row.studayflag;
                }else if (type == 'kg'){
                    this.kqForm.kqid = row.kgflag;
                }
            },
            cancelkqDialog(){
                this.kqDialog.visible = false;
            },
            changeBc(){//更新班次
                let id = this.bcForm.id;
                let pcid = this.bcForm.bcid;
                const param  = {id:id,pcid:pcid}
                service.pers.checkRecords.editBc(param).then(res=>{
                    if(res.resp_code == 200){
                        yid.util.success("更新成功!");
                        this.cancelBcDialog();
                        this.seachRecords();
                    }
                })
            },
            changekq(){
                //更新考勤状态
                let id = this.kqForm.id
                let type = this.kqForm.type;
                let kqid = this.kqForm.kqid;

                if(type ==null || type.length ==0){
                    yid.util.info("请选择类型");
                    return;
                }
                if(kqid ==null || kqid.length ==0){
                    yid.util.info("请选择考勤,上午/下午/全天");
                    return;
                }
                const param  = {id:id,type:type,kqid:kqid}
                service.pers.checkRecords.editKq(param).then(res=>{
                    if(res.resp_code == 200){
                        yid.util.success("更新成功!");
                        this.cancelkqDialog();
                        this.seachRecords();
                    }
                })
            },
            alertStatusDialog(row,type){
                this.statusDialog.visible = true;
                this.statusForm.id = row.id;
                this.statusForm.type = type;
                this.statusForm.status = '';
                if(type == 'on'){
                    this.statusForm.status = row.onStatus;
                }else if (type == 'off'){
                    this.statusForm.status = row.offStatus;
                }
            },
            cancelStatusDialog(){
                this.statusDialog.visible = false;
            },
            changeStatus(){
                //更新考勤状态
                let id = this.statusForm.id
                let type = this.statusForm.type;
                let status = this.statusForm.status;
                if(type ==null || type.length ==0){
                    yid.util.info("请选择类型");
                    return;
                }
                if(status ==null || status.length ==0){
                    yid.util.info("请选择状态");
                    return;
                }
                if(type == 'on'){
                    if(status == '3'){
                        yid.util.info("上午打卡无法改为早退状态");
                        return;
                    }
                }else if(type == 'off'){
                    if(status == '2'){
                        yid.util.info("下午打卡无法改为迟到状态");
                        return;
                    }
                }
                const param  = {id:id,type:type,status:status}
                service.pers.checkRecords.editStatus(param).then(res=>{
                    if(res.resp_code == 200){
                        yid.util.success("更新成功!");
                        this.cancelStatusDialog();
                        this.seachRecords();
                    }
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

<style scoped>

</style>
