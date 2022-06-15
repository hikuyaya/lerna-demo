<template>
  <yid-dialog
    title="选择门店"
    :visible.sync="visible"
    @close="cancelSaveShop"
    width="1100px">
    <el-row type="flex" justify="space-between">
      <el-form inline :model="shopSearchForm" ref="shopSearchForm">
        <el-form-item label="门店：">
          <el-input
            clearable
            v-model="shopSearchForm.pcodename"
            placeholder="门店名称/编码"
            style="width: 160px"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select
            clearable
            v-model="shopSearchForm.status"
            placeholder="请选择状态"
            style="width: 120px">
            <el-option label="正常" value="1"></el-option>
            <el-option label="关店" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="业务类型：">-->
        <!--<el-select clearable filterable v-model="shopSearchForm.type" placeholder="请选择业务类型"-->
        <!--style="width: 160px;">-->
        <!--<el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in btypeList">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="区域：">-->
        <!--<el-select @clear="clearSelectRegion" clearable ref="selectRegionRef"-->
        <!--v-model="shopSearchForm.regionObj.name" placeholder="请选择门店区域" style="width: 180px;">-->
        <!--<el-option hidden :value="shopSearchForm.regionObj.id" style="height: auto"></el-option>-->
        <!--<el-tree-->
        <!--:expand-on-click-node="false"-->
        <!--:check-on-click-node="true"-->
        <!--show-checkbox-->
        <!--check-strictly-->
        <!--node-key="id"-->
        <!--:data="regionData"-->
        <!--:props="defaultProps"-->
        <!--@check-change="handleNodeClick"-->
        <!--ref="templateRegionTree">-->
        <!--</el-tree>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="">
          <el-button type="primary" @click="queryShop()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col :span="14">
        <yid-table
          pagination
          ref="tableShop"
          style="margin-top: 10px"
          Å
          @selection-change="handleSelectionShopChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <yid-table-column
            label="门店编码"
            min-width="60"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="门店名称"
            min-width="100"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="门店品牌"
            min-width="60"
            prop="brandName"></yid-table-column>
          <yid-table-column
            label="门店区域"
            min-width="120"
            prop="regionName"></yid-table-column>
          <yid-table-column label="业务类型" min-width="80" prop="type">
            <template slot-scope="scope">
              {{ getTypeName(scope.row.type) }}
            </template>
          </yid-table-column>
        </yid-table>
      </el-col>
      <el-col :span="1" style="padding: 60px 0px">
        <div>
          <el-button @click="addShop()" type="primary" size="mini"
            ><i class="el-icon-right"></i
          ></el-button>
        </div>
      </el-col>
      <el-col :span="8" style="margin-left: 5px">
        <yid-table ref="selectTableShop" style="margin-top: 10px" :data="list">
          <yid-table-column
            label="门店编码"
            min-width="80"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="门店名称"
            min-width="100"
            prop="shopname"></yid-table-column>
          <yid-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <el-link
                type="primary"
                style="margin: 0 10px 0 10px"
                @click="deleteShop(scope.row)"
                >删除
              </el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </el-col>
    </el-row>
    <el-row justify="space-between" style="margin-top: 10px">
      <el-col :span="2" :offset="10">
        <el-button type="primary" @click="saveShop()">选好了</el-button>
      </el-col>
      <el-col :span="2">
        <el-button @click="cancelSaveShop">取消</el-button>
      </el-col>
      <el-col :span="10"></el-col>
    </el-row>
  </yid-dialog>
</template>

<script type="text/ecmascript-6">

import service from '@src/service'
import yid from '@src/library'

export default {
    data() {
        return {
            shopList: [],
            brandList: [],
            btypeList: [],
            shopSearchForm: {
                pcodename: "",
                type: "",
                regionObj: "",
                status: null
            },

            selectShopList: [],
            list:[]
        }
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        brandCode:{

            type: String,
            default: ""
        }
    },
    async mounted() {

        await this.getBrandList()
        await this.getBtypeAll();
      //  await this.getRegionData();

    },
    methods: {

        saveShop() {

            this.$emit("change", this.list);
        },
        cancelSaveShop() {
            this.$emit("close");
        },
        async getBtypeAll() {
            await service.chain.btype.btypeAllList({status: "1"}).then(res => {
                if (res.resp_code == 200) {
                    this.btypeList = res.data;
                }
            })
        },
        async getRegionData() {
            await service.chain.region.treeAll({status: "1"}).then(res => {
                if (res.resp_code == 200) {
                    this.regionData = res.data;
                }
            })
        },
        async getBrandList() {
            await service.chain.brand.brandList({isDel: '0'}).then(res => {
                if (res.resp_code == 200) {
                    this.brandList = res.data;
                    // res.data.forEach(each =>{
                    //     this.brandList.push({id:each.id, code:each.code, name:each.name})
                    // })
                }
            })
        },

        queryShop() {
            this.pageInfo = {page: 1, limit: 10};
            let req = {};
            req.pcodename = this.shopSearchForm.pcodename
            req.brandCode = this.brandCode
            req.type = this.shopSearchForm.type
            req.status = this.shopSearchForm.status
            if (this.shopSearchForm.regionObj && this.shopSearchForm.regionObj.id) {
                //大区及以内区域都保存进去
                this.shopSearchForm.regionObj.childrenIds.push(this.shopSearchForm.regionObj.id)
                req.regionIds = this.shopSearchForm.regionObj.childrenIds.toString();
            } else {
                req.regionIds = ""
            }
            this.getShopList(req)

        },
        getShopList(p) {
            const fetch = service.chain.shop.shopPageList
            let params = {...this.pageInfo, ...p}
            this.$refs['tableShop'].reloadData({
                fetch,
                params,
            });
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
        handleSelectionShopChange(rows){
            this.selectShopList = rows
        },
        addShop(){

            this.selectShopList.map(m =>{
                let flag=true
                this.list.forEach(p =>{
                    if(p.id == m.id || p.shopid == m.id){
                        flag=false
                        this.$message.warning( '门店：' + p.shopname + '已勾选');
                    }
                })
                if(flag){
                    this.list.push(m)
                }
            })
        },deleteShop(row){

                let i=-1;
                let deleteRow = {}
                this.list.forEach((p,index) =>{
                    if(p.id == row.id){
                        i=index
                        deleteRow = p;
                    }
                })
                this.list.splice(i,1)


        },
    }
}
</script>

<style lang="scss" scoped></style>
