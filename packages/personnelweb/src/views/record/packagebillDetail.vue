<template>
    <div class="packagebillDetail">
        <el-page-header @back="goBack" content="详情页面">
        </el-page-header>
        <el-row style="text-align: right; margin-top: 20px">
            <template v-if="this.baseData.entryData.eeSign">
                <el-button @click="qianm">查看签名</el-button>
            </template>
            <template v-if="!this.baseData.entryData.eeSign">
                暂未签名
            </template>
            <el-button @click="get">打印小票</el-button>
            <el-button v-if="this.baseData.entryData.isHc == '0'" @click="editBillTotal" type="primary">保存</el-button>
        </el-row>
        <el-form ref="ruleForm" label-width="100px" >
            <el-form-item v-if="this.baseData.entryData.isHc == '1'" label="撤单时间：">
                {{this.baseData.entryData.hcTime}}
            </el-form-item>
            <el-form-item v-if="this.baseData.entryData.isHc == '1'" label="撤单人：">
                {{this.baseData.entryData.hcBy}}
            </el-form-item >
            <el-form-item v-if="this.baseData.entryData.isHc == '1'" label="撤单备注：">
                {{this.baseData.entryData.hcMemo}}
            </el-form-item>
            <el-form-item label="服务单号：">
                {{this.baseData.entryData.billcode}}
            </el-form-item>
            <el-form-item label="客户信息：">
                {{this.baseData.entryData.memName}} {{getSexName(this.baseData.entryData.sex)}} {{this.baseData.entryData.mobile}} {{this.baseData.entryData.cardInfo == null ? '' : '【'+this.baseData.entryData.cardInfo+' '+this.baseData.entryData.cmcode+'】'}}
                {{this.baseData.entryData.isgx == "1"?"(共享卡)":""}}
            </el-form-item>
            <el-form-item label="消费时间：">
                {{this.baseData.entryData.saleTime}}
            </el-form-item>
            <el-form-item label="消费详情：">
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="spname"
                            label="消费内容"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="sname"
                            label="套餐内容"
                            width="180">
                        <template slot-scope="scope">
                            <span v-for="serv in scope.row.servList">【{{serv.stype=='2' ? '产品':'项目'}}】 {{serv.sname}}*{{serv.num}}<br></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="royaltyNum"
                            label="数量"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="ysje"
                            label="总价">
                        <template slot-scope="scope">
                            ￥{{keepTwoDecimal(Number(scope.row.totalprice))}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="eename"
                            label="服务人员">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">第{{royaltys.postion}}工位：{{royaltys.eecode}} {{royaltys.eename}}<br></span>
                            <span><el-link v-if="baseData.entryData.isHc == '0'" type="primary" :underline="false" @click="editBill(scope.row)">编辑</el-link></span>
                            <!--<span><el-link type="primary" :underline="false">编辑</el-link></span>-->
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="performance"
                            label="业绩">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">￥{{royaltys.yj}}<br></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="royalty"
                            label="提成">
                        <template slot-scope="scope">
                            <span v-for="royaltys in scope.row.royaltyList">￥{{royaltys.royalty == null ? 0 :royaltys.royalty}}<br></span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="支付方式：">
                <span>单据金额：￥{{this.baseData.entryData.totalMoney}}</span>
                <div style="border-top: 1px solid #333;width: 250px" />
                <span v-if="Number(this.baseData.entryData.zkeTotal) > 0">优惠券 -￥{{this.baseData.entryData.zkeTotal}}</span ><span v-if="Number(this.baseData.entryData.zkeTotal) > 0"><br/></span>
                <span v-for="pays in this.baseData.entryData.paysList">{{pays.payname}} ￥{{pays.money}}{{pays.isdf=='1' || pays.isgx=='1'?'(代付)':''}}<br></span>
                <div style="border-top: 1px solid #333;width: 250px" />
                <span>应收金额：￥{{this.baseData.entryData.hjbillje}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消费金额：￥{{this.baseData.entryData.hjbillje}}</span>
            </el-form-item>
            <el-form-item label="活动详情：">
                <!--<span v-for="zss in zsData">
                    <span v-for="packagezss in zss.packageZsInfos">
                        <span>【{{packagezss.maname}}】 {{getpackageBtype(packagezss.btype)}}{{packagezss.name}} {{getpackageMtype(packagezss.mtype)}}
                            <span v-if="packagezss.money?true:false">￥{{Number(packagezss.money).toFixed(2)}}</span>
                            <span v-if="packagezss.num?true:false">*{{(packagezss.num)}}</span>
                        </span><br>
                    </span>
                </span>-->
                <div class="zengs" v-show="zsData.length > 0" v-for="zs in zsData">
                    <span class="item">活动名称：<label>【{{zs.name}}】</label></span>
                    <span class="item" >赠送内容： /
                                <label v-show="zs.walletname">赠送红包：{{zs.walletname}}  /  </label>
                                <label v-show="zs.ticketname">赠送优惠券：{{zs.ticketname}}  /  </label>
                            </span>
                </div>
            </el-form-item>
            <el-form-item label="单据备注：">
                {{this.baseData.entryData.memo}}
            </el-form-item>
            <el-form-item label="是否为补单：">
                <span v-show="this.baseData.entryData.isBill == '0'">否</span>
                <span v-show="this.baseData.entryData.isBill == '1'">是&nbsp;&nbsp;{{this.baseData.entryData.refBillcode}}</span>
            </el-form-item>
        </el-form>

        <yid-dialog :title="editDialog.title" :visible.sync="editDialog.visible" width="500px">
            <span>项目名称:{{editForm.spname}}&nbsp;&nbsp;&nbsp;&nbsp;消费金额:￥{{editForm.money}}</span><br><br>

            <template v-for="station in stations">
                <div>
                    <div>第{{station.postion}}工位：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置业绩(输入的金额必须大于0)</div>
                    <template :index="index" v-for="(ees,index) in editRow.royaltyList">
                        <div v-if="station.postion === ees.postion" style="margin: 5px 0 5px 0">
                            <el-select placeholder="请选择" v-model="editForm.eeyjList[index].eeid" style="width: 120px">
                                <template v-for="psls in station.pslist">
                                    <template v-for="emp in employeeList">
                                        <div v-if="emp.psid === psls.psid">
                                            <el-option  :key="emp.id" :label="emp.eename" :value="emp.id"></el-option>
                                        </div>
                                    </template>
                                </template>
                            </el-select>&nbsp;&nbsp;
                            <el-input v-model="editForm.eeyjList[index].performance" style="width: 150px"></el-input>&nbsp;&nbsp;
                            <el-link type="primary" @click="delEmployee(ees,index)">删除</el-link>
                        </div>
                    </template>
                    <div>
                        <el-link type="primary" @click="addEmployee(station)">添加</el-link>
                    </div>
                </div>
            </template>

            <el-row style="text-align: center; margin-top: 20px">
                <el-button @click="editCancel">取消</el-button>
                <el-button @click="editTableData" type="primary">确定</el-button>
            </el-row>
        </yid-dialog>

        <!--签名-->
        <el-dialog
                :visible.sync="centerDialogVisible"
                width="870"
                center :show-close="false" class="isign">
            <div class="title">
                <ul>顾客签名：</ul>
                <ul>服务人员签名：</ul>
            </div>
            <div class="img">
                <img :src="isSign" v-if="isSign" />
                <label v-else>没有签名哦！</label>
            </div>
            <span slot="footer" class="dialog-footer" @click="centerDialogVisible = false">关 闭</span>
        </el-dialog>

    </div>
</template>

<script>
    import service from '@src/service'
    import {isEmpty} from "../../library/helper/util";
    export default {
        name: "packagebillDetail",
        data() {
            return {
                baseData : {},
                tableData :[],
                zsData : [],
                editDialog: {
                    title: '编辑服务人员',
                    visible: false,
                },
                editForm:{
                    id : '',
                    sname : '',
                    money : '',
                    eeyjList : []
                },
                editRow : {},
                stations : [],
                employeeList : [],
                centerDialogVisible: false,
                isSign:'',
            }
        },
        methods: {
            async initData(obj){
                this.restData();
                this.baseData = obj;
                this.getYjs(this.baseData.entryData.saleTime,this.baseData.billid);
                this.getZss(this.baseData.entryData.saleTime,this.baseData.billid);
            },
            /* objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                 console.log(row, rowIndex)
                 if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
                     if (row.rows) { // 如果有值,说明需要合并
                         return [row.rows, 1]
                     } else return [0, 0]
                 }
             },*/
            goBack() {
                this.$emit('onClose');
            },
            getIsCompute(val){
                let result = '否';
                if(val == '1'){
                    result = '是';
                }
                return result;
            },
            restData(){
                Object.assign(this.$data, this.$options.data());
            },
            getYjs(saleTime,id){
                //查询业绩列表
                service.cashier.packageRecords.packagerecordyj({saleTime:saleTime,id:id}).then(res=>{
                    if(res.resp_code == 200) {
                        this.tableData = res.data;
                    }
                })
            },
            getZss(saleTime,id){
                service.cashier.packageRecords.packagerecordzs({saleTime:saleTime,id:id}).then(res=>{
                    if(res.resp_code == 200) {
                        if(res.data.length>0){
                            let arr = []
                            arr = res.data
                            arr.forEach(item=>{
                                let obj = {}
                                if(item.packageZsInfos && item.packageZsInfos.length>0){
                                    let walletsArr = []
                                    let ticketArr = []
                                    item.packageZsInfos.filter(a=>{
                                        if(a.btype==1){
                                            walletsArr.push(a.name)
                                        }
                                        if(a.btype==2){
                                            ticketArr.push(a.name)
                                        }
                                    })
                                    this.$set(obj,'name',item.packageZsInfos[0].maname)
                                    this.$set(obj,'walletname',walletsArr.join(','))
                                    this.$set(obj,'ticketname',ticketArr.join(','))
                                    this.zsData.push(obj)
                                }
                            })
                        }
                        //this.zsData = res.data;
                    }
                })
            },
            getSexName(sex){
                let res = '';
                if(sex === '1'){
                    res = '男';
                }else if(sex === '2'){
                    res = '女';
                }
                return res;
            },
            getRate(rate){
                let res = "";
                if(rate === "0"){
                    res = "不评价"
                }else if(rate === "1"){
                    res = "不满意"
                }else if(rate === "2"){
                    res = "一般"
                }else if(rate === "3"){
                    res = "满意"
                }
                return res;
            },
            getpackageBtype(btype){
                let res = "";
                if(btype === "1"){
                    res = "红包："
                }else if(btype === "2"){
                    res = "优惠券："
                }else if(btype === "3"){
                    res = "服务："
                }else if(btype === "4"){
                    res = "产品："
                }
                return res;
            },
            getpackageMtype(mtype){
                let res = "";
                if(mtype === "1"){
                    res = "金额："
                }else if(mtype === "2"){
                    res = "折扣："
                }
                return res;
            },
            keepTwoDecimal(num) {
                var result = parseFloat(num);
                if (isNaN(result)) {
                    alert('传递参数错误，请检查！');
                    return false;
                }
                result = Math.round(num * 100) / 100;
                return result;
            },
            getStations(shopid,code){
                //获取工位信息
                service.wheelRest.station({shopid:Number(shopid),code:code}).then(res=>{
                    this.stations = res.data.desc;
                })
            },
            getEmployeeList(shopid){
                service.employee.listAll({shopid:shopid,isDel:'0'}).then(res=>{
                    this.employeeList = res.data;
                })
            },
            editBill(row){//编辑单据
                this.editRow = row;
                this.editForm.spname = this.editRow.spname;
                this.editForm.money = this.keepTwoDecimal(Number(row.totalprice))
                this.editForm.eeyjList = this.editRow.royaltyList;
                this.editForm.eeyjList.forEach(data=>{
                    data.eeid = String(data.eeid);
                })
                this.getStations(this.baseData.entryData.shopid,"003");
                this.getEmployeeList(this.baseData.entryData.shopid);
                console.log(this.editRow);
                this.editDialog.visible = true;
            },
            editCancel(){
                //查询列表
                this.getYjs(this.baseData.entryData.saleTime,this.baseData.billid);
                this.editDialog.visible = false;
            },
            delEmployee(ees,index){
                this.editRow.royaltyList.splice(index,1)
            },
            addEmployee(station){
                let postion =  station.postion;
                let rowindex = 0;
                this.tableData.forEach(data=>{
                    rowindex = rowindex + data.royaltyList.length;
                })
                const royalty = {};
                royalty.postion = postion;
                royalty.rowindex= rowindex;
                this.editRow.royaltyList.push(royalty);
            },
            editTableData(){
                let sumje1 = 0;
                let sumje2 = 0;
                let sumje3 = 0;

                var ee1 = [];
                var ee2 = [];
                var ee3 = [];

                //获取员工其它信息
                for(let i=0 ; i<this.editForm.eeyjList.length ; i++){
                    let edit = this.editForm.eeyjList[i];

                    if(isEmpty(edit.eeid)){
                        $yid.util.error("请选择员工！");
                        return;
                    }

                    if(isEmpty(edit.performance)){
                        $yid.util.error("请输入业绩金额！");
                        return;
                    }

                    this.employeeList.forEach(employee=>{
                        if(Number(employee.id) === Number(edit.eeid)){
                            edit.eecode = employee.eecode;
                            edit.eename = employee.eename;
                            edit.psid = employee.psid;
                            edit.psname = employee.psname;
                            edit.pslid = employee.pslid;
                            edit.pslname = employee.pslname;
                        }
                    })

                    if(isNaN(edit.performance)){
                        $yid.util.error("业绩必须输入数字！");
                        return;
                    }

                    if(Number(edit.performance) <= 0){
                        $yid.util.error("业绩必须输入大于0的数字！");
                        return;
                    }

                    if(edit.postion === 1){
                        sumje1 = sumje1 + Number(edit.performance);
                        ee1.push(edit.eecode);
                    }
                    if(edit.postion === 2){
                        sumje2 = sumje2 + Number(edit.performance);
                        ee2.push(edit.eecode);
                    }
                    if(edit.postion === 3){
                        sumje3 = sumje3 + Number(edit.performance);
                        ee3.push(edit.eecode);
                    }
                }

                //判断同一个工位是否有重复员工，同一个工位业绩总额是否超出
                if(sumje1 > this.editForm.money || sumje2 > this.editForm.money || sumje2 > this.editForm.money){
                    $yid.util.error("同一工位业绩总额不能超过消费总额！");
                    return;
                }

                if(this.isRepeat(ee1)){
                    $yid.util.error("同一工位存在相同员工！");
                    return;
                }

                //给列表赋值
                this.editRow.royaltyList  = this.editForm.eeyjList;

                console.log(this.editRow);

                //隐藏弹出框
                this.editDialog.visible = false;
            },
            isRepeat(ary) {
                var flag = false;
                var s = ary.join(",") + ",";
                for (var i = 0; i < ary.length; i++) {
                    if (s.replace(ary[i] + ",", "").indexOf(ary[i] + ",") > -1) {
                        flag = true;
                    }
                }
                return flag;
            },
            editBillTotal(){
                //拼接json调用改单方法
                let id = this.baseData.entryData.id;
                let royaltyList = [];
                this.tableData.forEach(data=>{
                    data.royaltyList.forEach(res=>{
                        royaltyList.push(res);
                    })
                })
                const param = {};
                param.record = {id:id};
                param.eeyjList = royaltyList;
                console.log(param);
                service.cashier.packageRecords.reviseBill(param).then(res=>{
                    if(res.resp_code == 200) {
                        $yid.util.success("操作成功！");
                        this.goBack();
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })

            },
            qianm(){
                this.centerDialogVisible = true
                this.isSign = this.baseData.entryData.eeSign;
            },
        }
    }
</script>

<style lang="scss" scoped>

    //签名
    .isign{
        /deep/.el-dialog__header{
            display: none;
        }
        /deep/.el-dialog__body{
            padding: 0;
            .title{
                display: flex;
                ul{
                    flex: 1;
                }
            }
            .img{
                display: flex;
                justify-content: center;
                align-items: center;
                height:300px;
                width: 100%;

                overflow: hidden;
                div{
                    width: 100%;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 300px;
                        overflow: hidden;
                    }

                }
            }
        }
    }
</style>
