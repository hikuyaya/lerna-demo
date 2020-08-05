<template>
    <div class="stock-secure">
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="产品：" prop="pcodename">
                <el-input clearable placeholder="请输入产品编码/产品名称" v-model.trim="searchForm.pcodename" style="width: 180px;"></el-input>
            </el-form-item>
            <el-form-item label="产品品牌："  prop="brand">
                <el-select clearable filterable placeholder="请选择产品品牌" style="width: 180px;" v-model.trim="searchForm.brand">
                    <el-option :key="item.id" :label="item.bname" :value="item.id" v-for="item in searchProductBrandList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品品类：" prop="categrory">
                <el-select clearable filterable placeholder="请选择产品品类" style="width: 180px;" v-model.trim="searchForm.categrory">
                    <el-option :key="item.id" :label="item.cname" :value="item.id" v-for="item in searchProductcategorylList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
                <el-select  clearable filterable placeholder="请选择" v-model.trim="searchForm.status">
                    <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in statusList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search" type="primary">查询</el-button>
                <el-button @click="rest" type="primary">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row>
            <el-button type="primary" @click="showAdd">批量设置</el-button>
        </el-row>
        <yid-table pagination ref="table" :data="safeStockData" style="margin-top: 15px;" @selection-change="handleSelectionChange">
            <yid-table-column type="selection" width="55"></yid-table-column>
            <yid-table-column label="产品编码" min-width="80" prop="pcode"></yid-table-column>
            <yid-table-column label="产品名称" min-width="300" prop="pname"></yid-table-column>
            <yid-table-column label="规格" min-width="80" prop="norms"></yid-table-column>
            <yid-table-column label="库存数量" min-width="100" prop="stock"></yid-table-column>
            <yid-table-column label="安全库存" min-width="200" prop="safeStock">
                <template slot-scope="scope">
                    <el-input onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"  v-model="scope.row.safeStock" placeholder="请输入内容" @change="updateSafeStock(scope.row)"></el-input>
                </template>
            </yid-table-column>
        </yid-table>
        <yid-dialog :title="dialog.title" :visible.sync="dialog.visible" @close="cancel" width="550px">
            <el-form ref="safeForm" :model="safeForm" label-width="120px">
                <el-form-item label="安全库存数量" prop="safeStock" :rules="[{ required: true, message: '安全库存数量为空'}]">
                    <el-input-number clearable min="0"  v-model.trim="safeForm.safeStock" style="width: 200px;"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel" type="info">取消</el-button>
                    <el-button @click="save" type="primary">保存</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>
<script>
    import service from '@src/service'
    import yid from '@src/library'
    export default {
        name: "secure",
        data: function () {
            return {
                safeStockData:[],
                searchProductBrandList:[],
                searchProductcategorylList:[],
                pageInfo:{page:1,limit:10},
                statusList:[{
                    id : '1',
                    name : '正常'
                },{
                    id : '2',
                    name : '停用'
                }],
                input: "",
                dialog: {
                    visible: false
                },
                safeForm : {
                    safeStock : '',
                },
                searchForm: {
                    pcodename: "",
                    brand: "",
                    categrory: "",
                    status: ""
                },
                selectProducts:[],
            }
        },
        mounted(){
            this.getData();
            this.getProductBrandList();
            this.getProductcategorylList();
        },
        methods:{
            getData(reqParams){
                const fetch = service.stock.product.listByPage
                const params = {...this.pageInfo,...reqParams}
                params.status = "1";
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getProductBrandList(){
                service.productBrand.alllist({isDel:'0'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.searchProductBrandList = res.data;
                    }
                })
            },
            getProductcategorylList(){
                service.productCategory.alllist({level:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.searchProductcategorylList = res.data;
                    }
                })
            },
            search(){
                this.pageInfo.page=1
                this.getData(this.searchForm);
            },
            rest(){
                this.$refs["searchForm"].resetFields()
                this.search();
            },
            handleSelectionChange(rows) {
                this.selectProducts = rows
            },
            showAdd() {
                if(this.selectProducts.length > 0){
                    //this.$refs['safeForm'].resetFields();
                    this.safeForm.safeStock = "";
                }else{
                    yid.util.error("请选择需要修改的产品");
                    return;
                }
                this.dialog.title = '批量设置安全库存'
                this.dialog.visible = true
            },
            save(){
                this.$refs['safeForm'].validate((valid) => {
                    if(valid){
                        const productObjs = [];
                        for(let i=0;i<this.selectProducts.length;i++){
                            let productObj = this.selectProducts[i];
                            productObj.safeStock = this.safeForm.safeStock;
                            productObjs.push(productObj);
                        }
                        service.stock.product.batchSave({products:productObjs}).then(res=> {
                            if(res.resp_code == 200) {
                                //同时更新base库的库存表中的安全库存值
                                const baseProducts = [];
                                for(let i=0;i<this.selectProducts.length;i++){
                                    let baseproduct = {};
                                    baseproduct.id = this.selectProducts[i].pid;
                                    baseproduct.safeStock = this.selectProducts[i].safeStock;
                                    baseProducts.push(baseproduct);
                                }
                                service.base.product.batchSave({products:baseProducts}).then(res1=>{
                                    if(res1.resp_code == 200) {
                                        yid.util.success("更新成功!")
                                        this.cancel();
                                    }else{
                                        yid.util.error(res1.msg());
                                    }
                                })
                            }else{
                                yid.util.error(res.msg());
                            }
                        })
                    }
                })
            },
            cancel() {
                this.search();
                this.dialog.visible = false
            },
            updateSafeStock(row){
                service.stock.product.save(row).then(res=> {
                    if(res.resp_code == 200) {
                        //更新base库中的安全库存
                        let baseproduct = {};
                        baseproduct.id = row.pid;
                        baseproduct.safeStock = row.safeStock;
                        baseproduct.pcode = row.pcode;
                        service.base.product.save(baseproduct).then(res1=>{
                            if(res1.resp_code == 200) {
                                yid.util.success("更新成功!")
                                this.search();
                            }else{
                                yid.util.error(res1.msg());
                            }
                        })
                    }else{
                        yid.util.error(res.msg());
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>