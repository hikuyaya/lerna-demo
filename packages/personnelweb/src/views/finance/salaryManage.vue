<template>
    <div class="salaryManage">
        <el-button @click="addAward" type="primary">新增</el-button>
        <yid-table pagination ref="table" :data="dataList" style="margin-top: 15px;" @selection-change="handleSelectionChange">
            <yid-table-column label="编码" min-width="150" prop="padcode"></yid-table-column>
            <yid-table-column label="名称" min-width="150" prop="padname"></yid-table-column>
            <yid-table-column label="类型" min-width="150" prop="padtype">
                <template slot-scope="scope">
                    {{scope.row.padtype == "1" ? '奖项' : '扣/罚项'}}
                </template>
            </yid-table-column>
            <yid-table-column label="状态" min-width="100" prop="status">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" inactive-color="#ff4949" @change="updateStatus(scope.row)">
                    </el-switch>
                </template>
            </yid-table-column>
            <yid-table-column label="操作" min-width="200" fixed="right">
                <template slot-scope="scope">
                    <el-link type="primary" @click="editAward(scope.row)">编辑</el-link>
                </template>
            </yid-table-column>
        </yid-table>
        <yid-dialog :title="awardValidateForm.title" :visible.sync="showAwardForm" @close="closeDialog" width="450px">
            <el-form :model="awardValidateForm"  label-width="140px" ref="awardValidateForm">
                <el-form-item prop="padtype" label="奖/扣罚项类型：">
                    <el-select clearable placeholder="请选择类型" style="width: 200px;" v-model.trim="awardValidateForm.padtype">
                        <el-option :key="item.type" :label="item.name" :value="item.type" v-for="item in awardValidateForm.list"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="padname" label="奖扣罚项名称：" :rules="[{ required: true, message: '奖扣罚项名称不能为空'}]">
                    <el-input maxlength="8" v-model="awardValidateForm.padname" placeholder="8个字以内"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="saveAward('awardValidateForm')" type="primary">保存</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'

    export default {
        name: "salaryManage",
        data(){
            return {
                dataList:[],
                pageInfo:{page:1,limit:10},
                maxCode:0,
                awardValidateForm: {
                    title: '奖/扣罚项维护',
                    visible: false,
                    list:[{"name":"奖项","type":"1"},{"name":"扣/罚项","type":"2"}],
                    padtype:"1",
                    padname:"",
                    direction : ""
                },
                actionType:"add",
                selectRowAward:{},
                showAwardForm:false
            }
        },

        mounted(){
            this.getData();
        },


        methods: {
            getData(){
                const fetch = service.awardDict.perAwardDictList
                const params = this.pageInfo
                this.$refs.table.reloadData({
                    fetch,
                    params
                });
            },
            handleSelectionChange() {
                this.pageInfo.page++
                this.getData();
            },
            addAward(){
                this.showAwardForm = true;
                this.$refs["awardValidateForm"].resetFields()
                this.awardValidateForm.padtype = '1';
                this.awardValidateForm.padname = '';
                this.awardValidateForm.direction = ''
                this.actionType = "add";

            },
            updateStatus(data){
                service.awardDict.saveAward(data).then(res=> {
                    if(res.resp_code == 200) {
                        this.getData();
                    }
                })
            },
            editAward(data){
                this.selectRowAward = data;
                this.showAwardForm = true;
                this.awardValidateForm.padname = data.padname;
                this.awardValidateForm.padtype = data.padtype;
                this.actionType = "edid";
            },
            saveAward(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let awardReqBody = {};
                        awardReqBody.padname =  this.awardValidateForm.padname;
                        awardReqBody.padtype = this.awardValidateForm.padtype;

                        if(this.actionType == "add"){
                            awardReqBody.status = '1'
                        }else{
                            awardReqBody.id = this.selectRowAward.id
                        }
                        if(this.awardValidateForm.padtype == "1"){
                            awardReqBody.direction = '1'
                        }else if(this.awardValidateForm.padtype == "2"){
                            awardReqBody.direction = '-1'
                        }
                        service.awardDict.saveAward(awardReqBody).then(res=> {
                            if(res.resp_code == 200) {
                                this.restPageInfo();
                                this.getData();
                            }
                        })

                    }
                    this.closeDialog();
                });


            },
            closeDialog(){
                this.showAwardForm = false;
            },
            restPageInfo(){
               this.pageInfo={page:1,limit:10}
            }
        },

    }
</script>

<style scoped>

</style>