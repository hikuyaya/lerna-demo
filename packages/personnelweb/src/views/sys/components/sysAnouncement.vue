<template>
    <div class="sys-accounce">
        <div>
            <el-button @click="readAction">标记为已读</el-button>
            <el-button @click="deleteAction">删除</el-button>
        </div>

        <yid-table pagination ref="table" style="margin-top: 15px;" @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <yid-table-column label="标题内容" min-width="150" prop="content" align="left"></yid-table-column>
        </yid-table>
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
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData(){
                const fetch = service.push.adminMstatus.listchain;
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
                this.selectNews.forEach(function(value) {
                    value.isDel = "1"
                });
                service.push.adminMstatus.batchSave(this.selectNews).then(res=>{
                    if(res.resp_code == 200) {
                        this.getData();
                    }
                })
            },
            readAction(){
                this.selectNews.forEach(function(value) {
                    value.status = "2"
                });
                service.push.adminMstatus.batchSave(this.selectNews).then(res=>{
                    if(res.resp_code == 200) {
                        this.getData();
                    }
                })
            }
        }
    }
</script>

<style scoped lang='scss'>
    .sys-accounce {

    }
</style>
