<template>
    <div>
        <el-page-header @back="goBack"></el-page-header>
        <el-form :model="settingForm"  :rules="settingFormRules" label-width="150px" ref="settingForm" style="margin-top: 8px">
            <el-form-item label="编码：" prop="code">
                {{settingForm.code}}<explain style="color:silver">套餐编号从001开始自动叠加</explain> <explain style="color:silver">编号限定从001开始的整数,自动叠加</explain>
            </el-form-item>
            <el-form-item label=" 会员卡体系名称：" prop="name">
                <el-input ref="name" v-model="settingForm.name" placeholder="卡名称"/>
            </el-form-item>
            <el-form-item label="适用门店:" prop="shopList">
                <el-button type="primary" @click="selectShop()">选择门店</el-button>
            </el-form-item>
            <row>储值卡异店划卡设置：</row>
            <el-form-item label="是否允许跨店消费" style="margin-top: 8px" prop="isSdiffshop">
                <el-radio-group v-model="settingForm.isSdiffshop" >
                    <el-radio label="1">允许</el-radio>
                    <el-radio label="0">不允许</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="卡金类型"  prop="sShopCardMoneyTypeArr" v-if="settingForm.isSdiffshop == '1'">
                <el-checkbox-group  v-model="settingForm.sShopCardMoneyTypeArr">
                    <el-checkbox v-for="item in cardMoneyTypeArr" :label="item.name" :key="item.value">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="是否允许跨店充值" style="margin-top: 8px" prop="isSdiffcharge">
                <el-radio-group v-model="settingForm.isSdiffcharge" >
                    <el-radio label="1">允许</el-radio>
                    <el-radio label="0">不允许</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否允许跨品牌消费" style="margin-top: 8px" prop="isSdiffbrand">
                <el-radio-group v-model="settingForm.isSdiffbrand" >
                    <el-radio label="1">允许</el-radio>
                    <el-radio label="0">不允许</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="卡金类型"  prop="sBrandCardMoneyTypeArr" v-if="settingForm.isSdiffbrand == '1'">
                <el-checkbox-group  v-model="settingForm.sBrandCardMoneyTypeArr">
                    <el-checkbox v-for="item in cardMoneyTypeArr" :label="item.name" :key="item.value">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="门店品牌"  v-if="settingForm.isSdiffbrand == '1'">
                <el-checkbox :indeterminate="sBrandIndeterminates" v-model="isCheckSBrandTypeAll" @change="handlesBrandTypeCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group  v-model="settingForm.sBrandTypeArr" @change="handleCheckedSBrandTypeChange">
                    <el-checkbox v-for="item in brandList" :label="item" :key="item.id" >{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <row>资格卡异店划卡设置：</row>
            <el-form-item label="是否允许跨店消费" style="margin-top: 8px" prop="isMdiffshop">
                <el-radio-group v-model="settingForm.isMdiffshop" >
                    <el-radio label="1">允许</el-radio>
                    <el-radio label="0">不允许</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否允许跨店续卡" style="margin-top: 8px" prop="isMdiffcharge">
                <el-radio-group v-model="settingForm.isMdiffcharge" >
                    <el-radio label="1">允许</el-radio>
                    <el-radio label="0">不允许</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否允许跨品牌消费" style="margin-top: 8px" prop="isSdiffbrand">
                <el-radio-group v-model="settingForm.isSdiffbrand" >
                    <el-radio label="1">允许</el-radio>
                    <el-radio label="0">不允许</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="门店品牌" v-if="settingForm.isSdiffbrand == '1'">
                <el-checkbox :indeterminate="sBrandIndeterminates" v-model="isCheckSBrandTypeAll" @change="handlesBrandTypeCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group  v-model="settingForm.sBrandTypeArr" @change="handleCheckedSBrandTypeChange">
                    <el-checkbox v-for="item in brandList" :label="item" :key="item.id" >{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="备注：">
                <el-input v-model="settingForm.memo" placeholder="请填写备注" type="textarea"/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary">取消</el-button>
                <el-button type="primary"  @click="save" >保存</el-button>
            </el-form-item>
        </el-form>


        <yid-dialog :title="shopDialog.title" :visible.sync="shopDialog.visible" @close="shopDialog.visible=false" width="1100px">
            <el-row type="flex" justify="space-between">
                <el-form inline :model="shopSearchForm"  ref="shopSearchForm">
                    <el-form-item label="门店：">
                        <el-input clearable v-model="shopSearchForm.pcodename" placeholder="门店名称/编码" style="width: 160px;"></el-input>
                    </el-form-item>
                    <el-form-item label="业务类型：">
                        <el-select clearable filterable v-model="shopSearchForm.type"   placeholder="请选择业务类型" style="width: 160px;">
                            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in btypeList">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌：">
                        <el-select clearable v-model="shopSearchForm.brandId" >
                            <el-option v-for="item in brandList" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区域：">
                        <el-select  @clear="clearSelectRegion" clearable ref="selectRegionRef" v-model="shopSearchForm.regionObj.name" placeholder="请选择门店区域"  style="width: 180px;">
                            <el-option  hidden :value="shopSearchForm.regionObj.id" style="height: auto"></el-option>
                                <el-tree
                                        :expand-on-click-node="false"
                                        :check-on-click-node="true"
                                        show-checkbox
                                        check-strictly
                                        node-key="id"
                                        :data="regionData"
                                        :props="defaultProps"
                                        @check-change="handleNodeClick"
                                        ref="templateRegionTree">
                                </el-tree>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="queryShop()">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-col :span="14">
                    <yid-table pagination ref="tableShop" style="margin-top: 10px;" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
                        <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
                        <yid-table-column label="门店品牌" min-width="60" prop="brandName"></yid-table-column>
                        <yid-table-column label="门店区域" min-width="120" prop="regionName"></yid-table-column>
                        <yid-table-column label="业务类型" min-width="80" prop="type" >
                            <template slot-scope="scope">
                                {{getTypeName(scope.row.type)}}
                            </template>
                        </yid-table-column>
                    </yid-table>
                </el-col>
                <el-col :span="1" style="padding: 60px 0px">
                    <div><el-button @click="addShop()" type="primary" size="mini"><i class="el-icon-right"></i></el-button></div>
                </el-col>
                <el-col :span="8" style="margin-left: 5px;">
                    <yid-table ref="selectTableShop" style="margin-top: 10px;" :data="shopDialog.selectShopList">
                        <yid-table-column label="门店编码" min-width="80" prop="shopcode"></yid-table-column>
                        <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
                        <yid-table-column label="操作" min-width="80">
                            <template slot-scope="scope">
                                <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteShop(scope.row)">删除</el-link>
                            </template>
                        </yid-table-column>
                    </yid-table>
                </el-col>
            </el-row>
            <el-row  justify="space-between" style="margin-top: 10px;">
                <el-col :span="2" :offset="10" ><el-button type="primary" @click="saveShop()">保存</el-button></el-col>
                <el-col :span="2" ><el-button @click="shopDialog.visible=false">取消</el-button></el-col>
                <el-col :span="10"></el-col>
            </el-row>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    export default {
        name: "cardSystemSetting",
        data(){
            return{
                pageInfo:{page:0,limit:10},
                isAddNew:true,
                sBrandIndeterminates:false,
                isCheckSBrandTypeAll:false,
                shopSearchForm:{
                  pcodename:"",
                  type:"",
                  brandId:"",
                  regionObj:""
                },
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                settingForm:{
                    code:"",
                    name:"",
                    memo:"",
                    shopList:"",
                    //储值卡
                    isSdiffshop:"",
                    sShopCardMoneyTypeArr:[],
                    isSdiffbrand:"",
                    isSdiffcharge:"",
                    sBrandCardMoneyTypeArr:[],
                    sBrandTypeArr:[],
                    //资格卡
                    isMdiffshop:"",
                    isMdiffcharge:""
                },
                settingFormRules:{
                    name:[{required: true, message:'请填写会员卡体系名称'}, {min: 0, max: 10, message: '卡名称在10个字符以内'}],
                    shopList:[{type: 'array',required: true, message:'请至少选择一个适用门店'}],
                },
                shopList:[],
                brandList:[],
                btypeList:[],
                regionData: [],
                shopDialog:{
                    visible:false,
                    title:"选择门店",
                    selectShopList:[]
                },
                cardMoneyTypeArr:[{value:"0",name:"卡金"},{value:"1",name:"赠送金"}],
            }
        },
        methods:{
            initData(data){
                this.init();
                this.isAddNew = data == null;
            },
            getBtypeAll(){
                service.chain.btype.btypeAllList({status:"1"}).then(res=>{
                    if(res.resp_code == 200) {
                        this.btypeList = res.data;
                    }
                })
            },
            getRegionData(){
                service.chain.region.treeAll({status:"1"}).then(res=>{
                    if(res.resp_code == 200) {
                        this.regionData = res.data;
                    }
                })
            },
            selectShop(){
                this.shopDialog.visible = true;
                if( this.$refs['tableShop'] != null){
                    this.getShopList();
                }
            },
            queryShop(){
                this.pageInfo = {page:0,limit:10};
                let req = {};
                req.pcodename = this.shopSearchForm.pcodename
                req.brandId = this.shopSearchForm.brandId
                req.type = this.shopSearchForm.type
                if(this.shopSearchForm.regionObj && this.shopSearchForm.regionObj.id){
                    req.regionId = this.shopSearchForm.regionObj.id;
                }
                this.getShopList(req)
            },
            save(){
                this.$refs["settingForm"].validate((valid) => {
                  if(!valid){
                      return
                  }
                })
            },
            handlesBrandTypeCheckAllChange(val){
                this.settingForm.sBrandTypeArr = val ? this.brandList : [];
                this.sBrandIndeterminates = false;

            },
            handleCheckedSBrandTypeChange(value){
                let checkedCount = value.length;
                this.isCheckSBrandTypeAll = checkedCount === this.brandList.length;
                this.sBrandIndeterminates = checkedCount > 0 && checkedCount < this.brandList.length;
            },
            getShopList(p){
                const fetch = service.chain.shop.shopListWithPage
                let params = {status:"1",...this.pageInfo,...p}
                this.$refs['tableShop'].reloadData({
                    fetch,
                    params,
                });
            },
            getBrandList(){
                service.chain.brand.brandList({isDel:'0'}).then(res=>{
                    if(res.resp_code == 200) {
                        res.data.forEach(each =>{
                            this.brandList.push({id:each.id, code:each.code, name:each.name})
                        })
                    }
                })
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
            clearSelectRegion(){
                this.shopSearchForm.regionObj = {};
                this.$refs.templateRegionTree.setCheckedKeys([]);
            },
            handleNodeClick(data,checked,node){
                if(checked == true) {
                    let valueObj = {};
                    valueObj.id = data.id;
                    valueObj.name = data.name;
                    this.shopSearchForm.regionObj = valueObj
                    this.$refs.templateRegionTree.setCheckedKeys([data.id]);
                } else {
                    if (this.shopSearchForm.regionObj.id == data.id) {
                        this.$refs.templateRegionTree.setCheckedKeys([data.id]);
                    }
                }
                this.$refs.selectRegionRef.blur()
            },
            goBack(){
                this.$emit('onClose');
            },
            init(){
                this.getBrandList()
                this.getBtypeAll();
                this.getRegionData();
            }
        },
    }
</script>

<style scoped>

</style>