<template>
    <div class="djBill">
<!--        <bill-search-form :searchFunc="search"></bill-search-form>-->


        <el-button @click="test">导入流水</el-button>
        <fa-select :fa.sync="componentData.fa"></fa-select>


        <!-- 导入弹窗 -->
        <yid-dialog :title="importDialog.title" :visible.sync="importDialog.visible" @close="importCancel" width="700px">
            <import-excel-form :excelName="importDialog.excelName" :importFunc="importFunc" :importCancel="importCancel" :importPath="importDialog.importPath">
                <el-form ref="elImportForm" :model="importForm">
                    <el-form-item label="流水日期：" prop="serirqRange">
                        <div class="block">
                            <el-date-picker
                                    :clearable = true
                                    v-model="importForm.serirqRange"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="财务片区：" prop="facode">
<!--                        <el-select style="width: 100px" v-model="importForm.facode" clearable placeholder="请选择">-->
<!--                            <el-option-->
<!--                                    v-for="item in faList"-->
<!--                                    :key="item.id"-->
<!--                                    :label="item.name"-->
<!--                                    :value="item.code">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
                        <fa-select :fa.sync="importForm.fa"></fa-select>
                    </el-form-item>
                    <el-form-item label="导入方式：" prop="importType">
                        <el-select style="width: 100px" v-model="importForm.importType" clearable placeholder="请选择">
                            <el-option
                                    v-for="item in itList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </import-excel-form>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'

    import BillSearchForm from './components/billSearchForm'
    import importExcelForm from './components/importExcelForm'
    import faSelect from './components/faSelect'

    export default {
        components: {BillSearchForm,importExcelForm,faSelect},
        name: "financialdaily",
        data() {
            return {
                importDialog: {
                    title: '日结对账导入',
                    visible: false,
                    datas: [],
                    excelName: "财务对账模板.xls",
                    importPath:"api-finance/financialdaily/convertFd",
                },
                importForm:{
                    facode:"",
                    sserirq:"",
                    eserirq:"",
                    importType:"",
                    serirqRange:"",
                    list:[],
                    fa:{},
                },
                componentData:{fa:{}},
                faList:[],
                itList:[{value:"1",label:"覆盖"},{value:"2",label:"补充"}]
            }
        },
        mounted() {
            this.getDicFaList();
        },
        watch:{
            'importForm.serirqRange'(v) {
                if(v){
                    this.importForm.sserirq = v[0];
                    this.importForm.eserirq = v[1];
                }else{
                    this.importForm.sserirq = "";
                    this.importForm.eserirq = "";
                }
            },
            'importForm.fa'(v) {
                if(v){
                    this.importForm.facode = v.code;
                }else{
                    this.importForm.facode = "";
                }
            }
        },
        computed:{

        },
        methods: {
            test(){
                this.importDialog.visible = true;
            },
            getDicFaList(){
                service.finance.dicFinancialArea.financeAreaAll({"isDel":"0","status":"1"}).then(res => {
                    if (res.resp_code == 200)
                        this.faList = res.data;
                });
            },
            search(v){
                console.log("financialdaily:method:search",v);
            },
            importCancel(){
                this.importDialog.visible = false;
            },
            importFunc(list){
                console.log("list",list);
                if(!list){
                    this.$message({
                        type: 'error',
                        message: '导入解析数据为空，请检查导入文件内容是否合规。'
                    });
                    return false;
                }else{
                    this.importForm.list = list;
                }
                if(!this.importForm.eserirq||!this.importForm.sserirq){
                    this.$message({
                        type: 'error',
                        message: '请选择导入流水日期'
                    });
                    return false;
                }
                if(!this.importForm.facode){
                    this.$message({
                        type: 'error',
                        message: '请选择财务片区'
                    });
                    return false;
                }
                if(!this.importForm.importType){
                    this.$message({
                        type: 'error',
                        message: '请选择导入方式'
                    });
                    return false;
                }
                service.finance.financeDaily.importFd(this.importForm).then(res=>{
                    let result = res.data;
                    if (result.resp_code == 200){
                        this.$message({
                            type: 'success',
                            message: '导入成功'
                        });
                        this.importCancel();
                    }else{
                        this.$message({
                            type: 'error',
                            message: result.resp_msg
                        });
                        return false;
                    }
                });

            },

        }
    }
</script>

<style scoped lang="scss">
    .container {
        width:100%;
        height: 30px;
        /*overflow: auto;*/
        white-space: nowrap;
    }
</style>
