<template>
    <div>
        <el-button type="primary" @click="save" style="margin-top: 6px; margin-bottom: 12px">保存</el-button>
        <yid-table ref="table" :data="payTemplateList">
            <yid-table-column label="支付方式名称" min-width="90" prop="payname"></yid-table-column>
            <yid-table-column label="支付类型" min-width="60" prop="ptname"></yid-table-column>
            <yid-table-column label="费率（%）" min-width="100" prop="primaryRate"></yid-table-column>
            <el-table-column label="付款模板费率%" prop="freeRate" min-width="150">
                <template slot-scope="scope">
                        <el-input type="number" min="0" max="100" v-model="scope.row.freeRate"/>
                </template>
            </el-table-column>
        </yid-table>
    </div>
</template>

<script>
    import service from '@src/service'
    export default {
        name: "payRateSetting",
        data(){
            return{
                payTheadId:"",
                payTemplateList:[],
                title:""
            }
        },
        methods:{
            save(){
                this.payTemplateList.forEach((pay,index) =>{
                    if(pay.freeRate < 0){
                        $yid.util.error(pay.payname+"付款费率比率不能小于0");
                        return
                    }
                })
                const params={
                    payments:this.payTemplateList
                }
                service.chain.payTemplate.batchSave(params).then(res =>{
                    this.$emit('onClose');
                })
            },
            async initData(data){
                this.payTheadId = data.id;
                this.title  = "模板名称：" + data.name
                this.getPayTemplateList();
            },
            getPayTemplateList(){
                service.chain.payTemplate.listAll({type:7,phid:this.payTheadId,status: "1"}).then(res =>{
                    this.payTemplateList=res.data;
                    // this.getPaymentConfig();
                })
            },
        }
    }
</script>

<style scoped>

</style>