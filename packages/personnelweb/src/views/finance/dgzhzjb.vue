<template>
    <div>
        <el-form ref="elSearchForm" inline :model="searchForm" :rules="rules.searchForm">
            <el-form-item label="店号：" prop="shopcode">
                <el-input v-model="searchForm.shopcode" style="width: 150px;"></el-input>
            </el-form-item>
            <el-form-item label="财务片区：" prop="facode">
                <fa-select :code.sync="searchForm.facode"></fa-select>
            </el-form-item>
            <el-form-item label="日期：" prop="rqRange" label-width="100px">
                <div class="block">
                    <el-date-picker
                            :clearable = true
                            v-model="searchForm.rqRange"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="">
                <el-button @click="search" type="primary">查询</el-button>
                <el-button @click="rest" type="primary">重置</el-button>
                <el-button @click="excel" type="primary">导出</el-button>
            </el-form-item>
        </el-form>
        <yid-table ref="elTable" :data="tableData" style="margin-top: 15px;" :height="wheight" :row-class-name="$yid.util.getTableClass">
            <yid-table-column label="店号" min-width="100" prop="shopcode"></yid-table-column>
            <yid-table-column label="店名" min-width="100" prop="shopname"></yid-table-column>
            <yid-table-column label="资金总业绩" min-width="100" prop="totalMoney"></yid-table-column>
            <yid-table-column label="银联通实收金额" min-width="100" prop="money"></yid-table-column>
            <yid-table-column label="对公银联通实收金额" min-width="100" prop="gmoney"></yid-table-column>
            <yid-table-column label="银联对公手续费" min-width="100" prop="djMoney"></yid-table-column>
        </yid-table>


    </div>
</template>

<script>

    import service from '@src/service'
    import yid from '@src/library'
    import download from '@src/library/http/download'
    import faSelect from './components/faSelect'
    export default {
        name:"dgzhzjb",
        components: {faSelect},
        data(){
            return {
                searchForm:{shopcode:"",facode:"",rqRange:[],rqMin:"",rqMax:""},
                tableData:[],
                wheight:window.innerHeight-320,
                rules:{
                    searchForm:{
                        rqRange:[
                            {required: true, message: '请选择日期', trigger: 'change'}
                        ],
                    },
                },
            }
        },
        mounted() {},
        watch: {},
        computed: {},
        methods: {
            search() {
                this.tableData = [];
                let params = {};
                let rqRange = this.searchForm.rqRange;
                if(rqRange&&rqRange.length>0){
                    params.rqMin = this.searchForm.rqRange[0];
                    params.rqMax = this.searchForm.rqRange[1];
                }else{
                    this.$message({type: 'error',message: "请选择查询日期范围"});
                    return;
                }
                params.shopcode = this.searchForm.shopcode;
                params.facode = this.searchForm.facode;
                service.cashier.prepaidorder.dgzhzjb(params).then(res=>{
                    if (res.resp_code == 200)
                        this.tableData = res.data;
                })
            },
            rest() {
                this.$refs["elSearchForm"].resetFields();
                this.tableData = [];
            },
            excel() {
                let params = {};
                let rqRange = this.searchForm.rqRange;
                if(rqRange&&rqRange.length>0){
                    params.rqMin = this.searchForm.rqRange[0];
                    params.rqMax = this.searchForm.rqRange[1];
                }else{
                    this.$message({type: 'error',message: "请选择查询日期范围"});
                    return;
                }
                params.shopcode = this.searchForm.shopcode;
                params.facode = this.searchForm.facode;
                download(yid.config.API.BASE + 'api-cashier/prepaidorder/report/dgzhzjb/excel', params)
            },
        },
    }

</script>

<style scoped lang="scss">

</style>