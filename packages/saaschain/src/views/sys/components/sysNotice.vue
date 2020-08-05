<template>
    <div class="sys-notice">
        <div>
            <el-button @click="deleteAction">删除</el-button>
            <el-button @click="showPublishFormDialog" type="primary">发布通知</el-button>
        </div>

        <yid-table pagination ref="table" style="margin-top: 15px;" @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <yid-table-column label="标题内容" min-width="100" prop="title"></yid-table-column>
            <yid-table-column prop = "createdTime" label="发布时间">
                <template slot-scope="scope">
                    {{$yid.util.formatDate(scope.row.createdTime)}}
                </template>
            </yid-table-column>
            <yid-table-column label="发布者" prop="publisher" align="left"></yid-table-column>

        </yid-table>
        <yid-dialog :title="publishDialogTitle" :visible.sync="showPublishForm" @close="closeDialog" width="450px">
            <el-form :model="publishForm"  label-width="140px" ref="publishForm">
                <el-form-item prop="title" label="标题：" :rules="[{ required: true, message: '标题不能为空'}]">
                    <el-input maxlength="30" v-model="publishForm.title" placeholder="30个字以内"></el-input>
                </el-form-item>
                <el-form-item prop="content" label="内容详情：" :rules="[{ required: true, message: '内容不能为空'}]">
                    <el-input  v-model="publishForm.content"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="publish('publishForm')" type="primary">发布</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    export default {
        name: "sysnews",
        data() {
            return {
                pageInfo:{page:0,limit:10,isDel:"0"},
                selectNews:[],
                showPublishForm:false,
                publishForm: {
                    // title: '奖/扣罚项维护',
                    title:"",
                    content:"",
                },
                publishDialogTitle:"发布通知"
            }
        },
        mounted() {
            this.getData()
        },

        methods: {
            getData(){
                const fetch = service.push.insideMsg.list;
                const params = {...this.pageInfo}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            handleSelectionChange(rows){
                this.selectNews = rows;
            },
            deleteAction(){
                if(this.selectNews.length == 0){
                    return
                }

                this.selectNews.forEach(function(value) {
                    value.isDel = "1"
                });
                service.push.insideMsg.batchSave(this.selectNews).then(res=>{
                    if(res.resp_code == 200) {
                        this.getData();
                    }
                })
            },
            publish(){
                this.$refs["publishForm"].validate((valid) => {
                    if(valid){
                        service.push.insideMsg.publish({content:this.publishForm.content,title:this.publishForm.title,isDel:"0"}).then(res=>{
                            if(res.resp_code == 200) {
                                this.getData();
                                this.closeDialog();
                            }
                        })
                    }
                });
            },
            closeDialog(){
                this.showPublishForm = false;
            },
            showPublishFormDialog(){
                this.showPublishForm = true;
                this.$refs["publishForm"].resetFields()
            }

        }
    }
</script>

<style scoped lang='scss'>
    .sys-notice {

    }
</style>