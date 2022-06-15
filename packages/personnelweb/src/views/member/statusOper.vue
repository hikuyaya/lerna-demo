<template>
    <div class="member-statusOper">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="冻结管理" name="freeze">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="">
                        <el-button @click="addFreeze" type="primary">新增</el-button>
                    </el-form-item>
                    <br>
                    <el-form-item label="会员查询：" prop="name">
                        <el-select style="width: 100px" v-model="searchForm.code" placeholder="请选择">
                            <el-option value="1" label="手机号"></el-option>
                            <el-option value="2" label="卡号"></el-option>
                            <el-option value="3" label="会员姓名"></el-option>
                            <el-option value="4" label="会员ID"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input clearable v-model.trim="searchForm.name" placeholder="手机号/卡号/会员姓名/会员ID"
                                  style="width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item label="操作人：">
                        <el-input clearable v-model="searchForm.updatedBy" placeholder="输入工号或姓名" style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="审批时间：">
                        <el-date-picker
                                :clearable = true
                                v-model="searchForm.updatedRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="clearSearchForm" type="primary">重置</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="table">
                    <yid-table-column label="会员ID" min-width="150" prop="id"></yid-table-column>
                    <yid-table-column label="姓名" min-width="100" prop="memname"></yid-table-column>
                    <yid-table-column label="手机号" min-width="150" prop="mobile"></yid-table-column>
                    <yid-table-column label="冻结时间" min-width="150" prop="updatedTime">
                        <template slot-scope="scope">
                            {{$yid.util.formatTime(scope.row.updatedTime)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作人" min-width="100" prop="updatedBy">
                        <template slot-scope="scope">
                            {{scope.row.updatedEecode}}&nbsp;&nbsp;{{scope.row.updatedBy}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="冻结原因" min-width="150" prop="freezeMemo"></yid-table-column>
                    <yid-table-column label="操作" min-width="150" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="cancelFreezeMember(scope.row)">解冻</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>

        <yid-dialog :title="memDialog.title" :visible.sync="memDialog.visible" @close="memCancel"
                    width="900px">
            <el-row type="flex" justify="space-between">
                <el-form inline>
                    <el-form-item label="输入冻结原因：">
                        <el-input  type="textarea" :rows="2" clearable v-model="memDialog.freezeMemo" placeholder="请输入冻结原因，200字以内"
                                  style="width: 600px;"></el-input>
                    </el-form-item>
                    <el-form-item label="添加会员资料：">
                        <el-input clearable v-model.trim="memDialog.name" placeholder="请输入手机号或卡号"
                                  style="width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="queryAddMem()">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-col>
                    <yid-table ref="tableAddMem"
                               style="margin-top: 10px;" :data="memdata" class="store-table">
                        <yid-table-column label="会员ID" min-width="150" prop="id"></yid-table-column>
                        <yid-table-column label="姓名" min-width="100" prop="memname"></yid-table-column>
                        <yid-table-column label="手机号" min-width="120" prop="mobile"></yid-table-column>
                        <yid-table-column label="会员卡" min-width="150" prop="cards">
                            <template slot-scope="scope">
                                <span v-for="card in scope.row.cards">
                                        {{card.cardname}}&nbsp;&nbsp;{{card.cardno}}<br>
                                </span>
                            </template>
                        </yid-table-column>
                        <yid-table-column label="操作" min-width="60" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" @click="deleteMem(scope.$index,scope.row)" style="margin-left: 6px;color: red">删除</el-button>
                            </template>
                        </yid-table-column>
                    </yid-table>
                </el-col>
            </el-row>
            已添加<font color="red">{{memdata.length}}</font>条会员
            <el-row justify="space-between" style="margin-top: 10px;">
                <el-col>
                    <el-button style="margin-left: 300px;" @click="memCancel">取消</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button type="primary" @click="freezeMembers" >开始冻结</el-button>
                </el-col>
            </el-row>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    export default {
        name: "statistics",
        data() {
            return {
                activeName : 'freeze',
                searchForm : {
                    code: "1",
                    name : '',
                    updatedBy : '',
                    updatedRange : [],
                },
                pageInfo:{page:1,limit:10},
                memrules: {name: {required: true, message: '请输入姓名/手机号/卡号', trigger: 'red'}},
                memDialog: {
                    visible: false,
                    title: '新增冻结信息',
                    status: '1',
                    freezeMemo : '',
                    name : '',
                },
                memdata : [],
            }
        },
        mounted(){
            //this.search();
        },
        methods:{
            clearSearchForm(){
                this.searchForm.code = '1';
                this.searchForm.name = '';
                this.searchForm.updatedBy = '';
                this.searchForm.updatedRange = [];
            },
            getData(reqParams){
                const fetch = service.member.memberinfo.chainPageMembers
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },

            getDataNoChangePage(reqParams) {
                const fetch = service.member.memberinfo.chainPageMembers
                const params = {...this.pageInfo, ...reqParams}
                this.$refs.table.reloadDataNoChangePage({
                    fetch,
                    params,
                });
            },

            search() {
                /*if (yid.util.isEmpty(this.searchForm.name)) {
                    if (this.searchForm.code == '1')
                        yid.util.error("请输入手机号");
                    if (this.searchForm.code == '2')
                        yid.util.error("请输入卡号");
                    if (this.searchForm.code == '3')
                        yid.util.error("请输入会员姓名");
                    if (this.searchForm.code == '4')
                        yid.util.error("请输入会员ID");
                    return;
                }*/

                const params = {
                    status: '2',
                    mobile : '',
                    cardno : '',
                    memname : '',
                    memberid : '',
                    updatedBy : '',
                    updatedTimeStart : '',
                    updatedTimeEnd : '',
                }

                if (this.searchForm.code == '1')
                    params.mobile = this.searchForm.name
                if (this.searchForm.code == '2')
                    params.cardno = this.searchForm.name
                if (this.searchForm.code == '3')
                    params.memname = this.searchForm.name
                if (this.searchForm.code == '4')
                    params.memberid = this.searchForm.name

                params.updatedBy = this.searchForm.updatedBy;
                let updatedRange = this.searchForm.updatedRange;
                if(!yid.util.isEmpty(updatedRange)){
                    params.updatedTimeStart = this.searchForm.updatedRange[0]+" 00:00:00";
                    params.updatedTimeEnd = this.searchForm.updatedRange[1]+" 23:59:59";
                }else{
                    params.updatedTimeStart = '';
                    params.updatedTimeEnd = '';
                }

                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getData(params);
            },

            searchNoChangePage() {
                /*if (!this.searchForm.name) {
                    if (this.searchForm.code == '1')
                        yid.util.error("请输入手机号");
                    if (this.searchForm.code == '2')
                        yid.util.error("请输入卡号");
                    if (this.searchForm.code == '3')
                        yid.util.error("请输入会员姓名");
                    if (this.searchForm.code == '4')
                        yid.util.error("请输入会员ID");
                    return;
                }*/

                const params = {
                    status: '2',
                    mobile : '',
                    cardno : '',
                    memname : '',
                    memberid : '',
                    updatedBy : '',
                    updatedTimeStart : '',
                    updatedTimeEnd : '',
                }

                if (this.searchForm.code == '1')
                    params.mobile = this.searchForm.name
                if (this.searchForm.code == '2')
                    params.cardno = this.searchForm.name
                if (this.searchForm.code == '3')
                    params.memname = this.searchForm.name
                if (this.searchForm.code == '4')
                    params.memberid = this.searchForm.name

                params.updatedBy = this.searchForm.updatedBy;
                let updatedRange = this.searchForm.updatedRange;
                if(!yid.util.isEmpty(updatedRange)){
                    params.updatedTimeStart = this.searchForm.updatedRange[0];
                    params.updatedTimeEnd = this.searchForm.updatedRange[1];
                }else{
                    params.updatedTimeStart = '';
                    params.updatedTimeEnd = '';
                }

                this.pageInfo.page = this.$refs.table.Pagination.internalCurrentPage;
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getDataNoChangePage(params);
            },
            cancelFreezeMember(row){
                yid.util.confirm("您确定要解冻["+row.memname+"]的会员资料?","","",()=>{
                    service.member.memberinfo.cancelFreezeMember({memid:row.id || row.memid}).then(res =>{
                        if(res.resp_code=="200"){
                            yid.util.success("解冻成功!");
                            this.search();
                        }else{
                            yid.util.error(res.resp_msg);
                        }
                    });
                })
            },
            handleClick(row){
                if(row.name == 'freeze'){
                    this.search();
                }
            },
            memCancel(){
                this.memDialog.visible = false;
                this.memDialog.name = '';
                this.memDialog.freezeMemo = '';
                this.$refs['tableAddMem'].clearData({});
            },
            addFreeze(){
                this.memdata = [];
                this.memDialog.visible = true;
            },
            deleteMem(index,row){
                this.memdata.splice(index, 1)
            },
            queryAddMem(){
                if(yid.util.isEmpty(this.memDialog.name)){
                    yid.util.error("请输入手机号或卡号进行查询");
                    return
                }
                service.member.memberinfo.chainPageMembersNoPage({name:this.memDialog.name,status:this.memDialog.status}).then(res =>{
                    if(res.resp_code=="200"){
                        if(res.data.length > 0){
                            res.data.forEach(mem=>{
                                if(this.memdata.length>0){
                                    let flag = true;
                                    this.memdata.forEach(r=>{
                                        if(r.id == mem.id){
                                            flag = false;
                                        }
                                    })
                                    if(flag){
                                        this.memdata.push(mem);
                                    }
                                }else{
                                    this.memdata.push(mem);
                                }
                            })
                        }else{
                            yid.util.info("未查到相关会员资料");
                            return;
                        }
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                });
            },
            freezeMembers(){
                if(yid.util.isEmpty(this.memDialog.freezeMemo.replace(/\s+/g,""))){
                    yid.util.error("请填写冻结原因!");
                    return;
                }
                if(this.memdata.length == 0){
                    yid.util.error("请添加会员后进行冻结!");
                    return;
                }
                if(this.memDialog.freezeMemo.length > 200){
                    yid.util.error("冻结原因不能超过200字!");
                    return;
                }
                let memids = "";
                this.memdata.forEach(mem=>{
                    memids = memids+""+mem.id+ ",";
                })
                service.member.memberinfo.freezeMember({memids:memids.substr(0,memids.length-1),freezeMemo:this.memDialog.freezeMemo}).then(res=>{
                    if(res.resp_code=="200"){
                        yid.util.success("冻结成功!");
                        this.memCancel();
                        this.search();
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
