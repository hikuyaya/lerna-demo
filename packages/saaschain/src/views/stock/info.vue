<template>
    <div class="stock-info">
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
        <yid-table pagination ref="table" style="margin-top: 15px;" @selection-change="handleSelectionChange" :row-class-name="$yid.util.getStockClass">
            <yid-table-column label="产品编码" min-width="150" prop="pcode"></yid-table-column>
            <yid-table-column label="产品名称" min-width="80" prop="pname"></yid-table-column>
            <yid-table-column label="规格" min-width="120" prop="norms"></yid-table-column>
            <yid-table-column label="单位" min-width="130" prop="unit"></yid-table-column>
            <yid-table-column label="品牌" width="100" prop="bname"></yid-table-column>
            <yid-table-column label="类别" min-width="100" prop="cname"></yid-table-column>
            <yid-table-column label="进价" min-width="100" prop="cost"></yid-table-column>
            <yid-table-column label="售价" min-width="100" prop="price"></yid-table-column>
            <yid-table-column label="库存" min-width="100" prop="stock"></yid-table-column>
            <yid-table-column label="安全库存" min-width="100" prop="safeStock"></yid-table-column>
            <yid-table-column label="平均成本" min-width="100" prop="averageCost"></yid-table-column>
            <yid-table-column label="库存总金额" min-width="100" prop="money"></yid-table-column>
            <yid-table-column label="最近入库时间" min-width="100" prop="latelyInTime">
                <template slot-scope="scope">
                    {{$yid.util.formatDate(scope.row.latelyInTime)}}
                </template>
            </yid-table-column>
            <yid-table-column label="最近出库时间" min-width="100" prop="latelyOutTime">
                <template slot-scope="scope">
                    {{$yid.util.formatDate(scope.row.latelyOutTime)}}
                </template>
            </yid-table-column>
            <yid-table-column label="客户库存" min-width="100" prop="customerStock"></yid-table-column>
            <yid-table-column label="状态" min-width="100" prop="status">
                <template slot-scope="scope">
                    {{scope.row.status == '1' ? "正常" : "停用"}}
                </template>

            </yid-table-column>
        </yid-table>
    </div>
</template>

<script>
    import service from '@src/service'
    export default {
        name: "info",
        data() {
            return {
                searchProductBrandList:[],
                searchProductcategorylList:[],
                statusList:[{
                    id : '1',
                    name : '正常'
                },{
                    id : '2',
                    name : '停用'
                }],
                pageInfo:{page:1,limit:10},
                searchForm: {
                    pcodename: "",
                    brand: "",
                    categrory: "",
                    status: ""
                }
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
                this.search()
            },
            handleSelectionChange() {
                this.pageInfo.page++
                this.getData(this.searchForm);
            },
        }
    }
</script>

<style scoped>

</style>