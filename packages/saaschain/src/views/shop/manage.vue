<template>
    <div>
        <el-collapse-transition>
            <div v-show="listShow">
                <el-button @click="alertBrand" type="primary">新增</el-button>
                <el-form inline style="margin-top: 15px;">
                    <el-form-item label="门店：">
                        <el-input clearable v-model.trim="searchForm.pcodename" placeholder="门店编码/门店名称"  style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="业务类型：">
                        <el-select clearable v-model.trim="searchForm.type"   placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in btypeList">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌管理：">
                        <el-select clearable v-model.trim="searchForm.brandId"   placeholder="请选择" style="width: 160px;">
                            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in brandData">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区域：">
                        <el-select  ref="selectRegionRef" v-model="selectRegionForm.regionObj" placeholder="请选择门店区域" multiple collapse-tags  @change="selectRegion" style="width: 180px;">
                            <el-option :value="selectRegionForm.regionObjValue" style="height: auto">
                                <el-tree
                                        size="small"
                                        accordion="true"
                                        show-checkbox
                                        :default-expand-all="true"
                                        :data="regionData"
                                        :props="defaultProps"
                                        node-key="id"
                                        :check-strictly="true"
                                        @check-change="templateCheckChange"
                                        ref="templateRegionTree">
                                </el-tree>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="search()" type="primary">查询</el-button>
                    </el-form-item>
                </el-form>

                <yid-table pagination ref="table"  :data="tableData">
                    <yid-table-column label="门店logo" min-width="140" prop="logo">
                        <template slot-scope="scope">
                            <img :src="scope.row.logo"  min-width="25" height="25" />
                        </template>
                    </yid-table-column>
                    <yid-table-column label="门店编码" min-width="140" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="140" prop="shopname"></yid-table-column>
                    <yid-table-column label="门店品牌" min-width="140" prop="brandName"></yid-table-column>
                    <yid-table-column label="门店区域" min-width="140" prop="regionName"></yid-table-column>
                    <yid-table-column label="业务类型" min-width="140" prop="type">
                        <template slot-scope="scope">
                            {{getTypeName(scope.row.type)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="门店电话" min-width="140" prop="contacts"></yid-table-column>
                    <yid-table-column label="门店地址" min-width="140" prop="address"></yid-table-column>
                    <yid-table-column label="付款模板" min-width="140" prop="paytName"></yid-table-column>
                    <yid-table-column label="创建时间" min-width="140" prop="createdTime"></yid-table-column>
                    <yid-table-column label="是否显示门店" min-width="140" prop="billstatus"></yid-table-column>
                    <yid-table-column label="操作" min-width="60" prop="oper">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="showDetailPage(scope.row)">查看</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-show="!listShow">
                <ShopInfo ref="detailPage" @onClose="closeDetailPage"></ShopInfo>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import service from '@src/service'
    import ShopInfo from "./shopinfo"
    export default {
        name: "manage",
        data(){
            return {
                listShow:true,
                regionData: [],
                btypeList:[],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    disabled: this.disabledFn,
                },
                searchForm:{
                    pcodename:"",
                    type:"",
                    brandId:"",
                    regionId:""
                },
                selectRegionForm:{
                    regionObj:"",
                    regionObjValue:[],
                },
                businessType:[{type:"1",name:"美发"},{type:"2",name:"美容"},{type:"3",name:"综合"},],
                pageInfo:{page:1,limit:10},
                tableData:[],
                brandData:[],
                checkedRegionId: '',
            }
        },
        mounted(){
            this.getRegionTreeAll();
            this.getBrandList();
            this.getBtypeAll();
            this.getData();
        },
        components: {
            ShopInfo,
        },
        methods:{
            getRegionTreeAll(){
                service.chain.region.treeAll({status:"1"}).then(res=>{
                    if(res.resp_code == 200) {
                        this.regionData = res.data;
                    }
                })
            },
            getBtypeAll(){
                service.chain.btype.btypeAllList({status:"1"}).then(res=>{
                    if(res.resp_code == 200) {
                        this.btypeList = res.data;
                    }
                })
            },
            search(){
                this.pageInfo={page:1,limit:10}
                if(this.selectRegionForm.regionObjValue != null && this.selectRegionForm.regionObjValue.length > 0){
                    this.searchForm.regionId= this.selectRegionForm.regionObjValue[0].id;
                }else{
                    this.searchForm.regionId = "";
                }
                this.getData();
            },
            getData(){
                let params = {...this.pageInfo, ...this.searchForm}
                const fetch = service.chain.shop.shopListWithPage
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getBrandList(){
                service.chain.brand.brandList({isDel:'0'}).then(res=>{
                    if(res.resp_code == 200) {
                        this.brandData = res.data;
                    }
                })
            },
            selectRegion(e){
                var arrNew = [];
                var dataLength = this.selectRegionForm.regionObjValue.length;
                var eleng = e.length;
                for(let i = 0; i< dataLength ;i++){
                    for(let j = 0; j < eleng; j++){
                        if(e[j] === this.selectRegionForm.regionObjValue[i].name){
                            arrNew.push(this.selectRegionForm.regionObjValue[i])
                        }
                    }
                }
                this.$refs.templateRegionTree.setCheckedNodes(arrNew);//设置勾选的值
            },
            clearSelectRegion(){
                this.selectRegionForm.regionObjValue = []
                this.selectRegionForm.regionObj = ""
                this.searchForm.regionId = "";
                this.$refs.templateRegionTree.setCheckedNodes([]);//设置勾选的值
            },
            disabledFn(data, node){
                if (data.status === '2') {
                    return true;
                } else {
                    return false;
                }
            },
            templateCheckChange(data,checked,child){
                if(!checked){
                    this.clearSelectRegion();
                    return
                }

                if(checked === true){
                    this.checkedRegionId = data.id
                    this.$refs.templateRegionTree.setCheckedKeys([data.id]);
                }else{
                    if(this.checkedRegionId === data.id){
                        this.$refs.templateRegionTree.setCheckedKeys([data.id]);
                    }
                }

                let res = this.$refs.templateRegionTree.getCheckedNodes(false, false); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
                let arrLabel = [];
                let arr = [];
                res.forEach(item => {
                    arrLabel.push(item.name);
                    arr.push(item);
                });
                this.selectRegionForm.regionObjValue = arr;
                this.selectRegionForm.regionObj = arrLabel;

                let _this = this;
                setTimeout(function() {
                    _this.$refs.selectRegionRef.blur();
                }, 50);
            },
            getTypeName(type){
                let result = '未知';
                for(let i = 0; i < this.btypeList.length; i++){
                  if(this.btypeList[i].id == type){
                      return this.btypeList[i].name
                  }
                }
                return result;
            },
            showDetailPage(row){
                this.$refs.detailPage.init(row);
                this.listShow = false;
            }
        }
    }
</script>

<style scoped>

</style>