<template>
  <div class="tcConfig">
    <el-collapse-transition>
      <div v-show="visibleList.manage">
        <el-button @click="showDialogType()" type="primary">新增</el-button>
        <el-row style="color: #409EFF; margin: 15px 0">备注：门店只允许适用一种提成方案！</el-row>

        <el-form ref="searchForm" inline :model="searchForm" style="margin-top: 8px">
          <el-form-item label="提成方案：" prop="pcodename">
            <el-input v-model="searchForm.pcodename" clearable style="width: 150px;" placeholder="方案编码/方案名称"></el-input>
          </el-form-item>

          <el-form-item label="门店：" prop="scodename">
            <el-input v-model="searchForm.scodename" clearable style="width: 150px;" placeholder="门店编码/门店名称"></el-input>
          </el-form-item>

          <el-form-item label="状态：" prop="status">
            <el-select style="width: 100px" v-model="searchForm.status" clearable placeholder="请选择">
              <el-option value="1" label="正常"></el-option>
              <el-option value="2" label="停用"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button @click="search()" type="primary">查询</el-button>
          </el-form-item>
        </el-form>


        <yid-table pagination ref="tableRm" :data="rManageList">
          <yid-table-column label="编码" width="100" prop="prmcode"></yid-table-column>
          <yid-table-column label="提成方案名称" prop="prmname"></yid-table-column>
          <yid-table-column label="适用门店" prop="shopList">
            <template slot-scope="scope">
              <div>
                <el-row gutter="8">共{{ scope.row.shopList ? scope.row.shopList.length : 0 }}家门店</el-row>
                <el-row gutter="8">
                  <el-link type="primary" @click="showShopDialog(scope.row)">查看修改</el-link>
                </el-row>
              </div>
            </template>
          </yid-table-column>
          <yid-table-column label="备注" prop="memo"></yid-table-column>
          <yid-table-column label="状态" width="160">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.status"
                  inactive-color="#DCDFE6"
                  active-color="#409EFF"
                  active-text="启用"
                  inactive-text="停用"
                  active-value="1"
                  inactive-value="2"
                  @change="handleSwitch($event,scope.row)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" width="200" prop="content">
            <template slot-scope="scope">
              <el-link type="primary" @click="showDialogType(scope.row)">编辑</el-link>
              <el-link type="primary" style="margin: 0 10px 0 10px;"
                       @click="toItem(scope.row)">设置提成
              </el-link>
              <el-link type="primary" @click="copy(scope.row)">复制</el-link>
            </template>
          </yid-table-column>
        </yid-table>
        <!--新增提成方案弹出层-->
        <yid-dialog :title="dialogType.title" :visible.sync="dialogType.visible" @close="dialogCancel"
                    width="600px">
          <el-form label-width="100px" ref="formRm" :model="dialogType.model" :rules="rules">
            <el-form-item label="方案名称" prop="prmname">
              <el-input clearable v-model="dialogType.model.prmname" placeholder="请输入方案名称"
                        :rules="rules.prmname"
              ></el-input>
            </el-form-item>
            <el-form-item label="适用门店:" prop="shopList">
              <el-button type="primary" @click="selectShop()">选择门店</el-button>
              {{ dialogType.model.shopList && dialogType.model.shopList.length > 0 ? '共选中' + dialogType.model.shopList.length + '家门店' : '' }}
            </el-form-item>
            <el-form-item label="备注" prop="memo">
              <el-input type="textarea" v-model="dialogType.model.memo"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="saveOrUpdate">确定</el-button>
            </el-form-item>
          </el-form>
        </yid-dialog>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="visibleList.group">
        <tcGroups ref="tccc" :type="type"></tcGroups>
      </div>
    </el-collapse-transition>

    <yid-dialog :title="shopDialog.title" :visible.sync="shopDialog.visible" @close="shopDialog.visible=false"
                width="1100px">
      <el-row type="flex" justify="space-between">
        <el-form inline :model="shopSearchForm" ref="shopSearchForm">
          <el-form-item label="门店：">
            <el-input clearable v-model="shopSearchForm.pcodename" placeholder="门店名称/编码"
                      style="width: 160px;"></el-input>
          </el-form-item>
          <el-form-item label="业务类型：">
            <el-select clearable filterable v-model="shopSearchForm.type" placeholder="请选择业务类型" style="width: 160px;">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in btypeList">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-select clearable v-model="shopSearchForm.brandId">
              <el-option v-for="item in brandList" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：">
            <el-select @clear="clearSelectRegion" clearable ref="selectRegionRef"
                       v-model="shopSearchForm.regionObj.name" placeholder="请选择门店区域" style="width: 180px;">
              <el-option hidden :value="shopSearchForm.regionObj.id" style="height: auto"></el-option>
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
          <el-form-item label="门店提成方案：" prop="noroyalty">
            <el-select style="width: 100px" v-model="shopSearchForm.noroyalty" clearable placeholder="请选择">
              <el-option value="0" label="未设置"></el-option>
              <el-option value="1" label="已设置"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="queryShop()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="14">
          <yid-table pagination ref="tableShop" style="margin-top: 10px;" @selection-change="handleSelectionShopChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
            <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
            <yid-table-column label="门店品牌" min-width="60" prop="brandName"></yid-table-column>
            <yid-table-column label="门店区域" min-width="120" prop="regionName"></yid-table-column>
            <yid-table-column label="业务类型" min-width="80" prop="type">
              <template slot-scope="scope">
                {{ getTypeName(scope.row.type) }}
              </template>
            </yid-table-column>
            <yid-table-column label="门店提成方案" min-width="120" prop="prmname"></yid-table-column>
          </yid-table>
        </el-col>
        <el-col :span="1" style="padding: 60px 0px">
          <div>
            <el-button @click="addShop()" type="primary" size="mini"><i class="el-icon-right"></i></el-button>
          </div>
        </el-col>
        <el-col :span="8" style="margin-left: 5px;">
          <el-link type="primary" @click="deleteBatch()">批量删除</el-link>
          <yid-table ref="selectTableShop" style="margin-top: 10px;" :data="shopDialog.selectShopList"
                     @selection-change="handleSelectionData">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column label="门店编码" min-width="80" prop="shopcode"></yid-table-column>
            <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
            <yid-table-column label="门店提成方案" min-width="120" prop="prmname"></yid-table-column>
            <yid-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteShop(scope.row)">删除</el-link>
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px;">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="saveShop()">选好了</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="shopDialog.visible=false">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import tcGroups from "./tcGroups"

export default {
  components: {
    tcGroups
  },
  name: "tcManagement",
  props: ['type'],
  data() {
    return {
      isAdd: true,
      isSeeShop: false,
      visibleList: {manage: true, group: false},
      dialogType: {
        visible: false,
        title: '提成方案名称',
        model: {prmname: null, memo: null, status: "1", shopList: []}
      },
      paginationParam: {
        page: 1,
        limit: 10,
      },
      rManageList: [],
      rules: {
        prmname: [{required: true, message: '请输入方案名称', trigger: 'blur'}],
      },
      shopDialog: {
        visible: false,
        title: "选择门店",
        selectShopList: [],//已经选择的适用门店
        isContainRoyaltyShop: false  //选中的门店是否含有包含其他提成的门店
      },
      shopSearchForm: {
        pcodename: "",
        type: "",
        brandId: "",
        regionObj: "",
        noroyalty: "0"  //0:无提成 1：有提成的
      },
      searchForm: {
        pcodename: "",
        scodename: "",
        status: ""
      },
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      pageInfo: {page: 0, limit: 10},
      shopList: [],
      brandList: [],
      btypeList: [],
      regionData: [],
      selectShopList: [], //选中的适用门店 还未添加到已选择的列表中
      selectShopData: [],
    }
  },
  methods: {
    getShopList(p) {
      const fetch = service.chain.shop.shopListWithRoyalty
      let params = {status: "1", ...this.pageInfo, ...p}
      this.$refs['tableShop'].reloadData({
        fetch,
        params,
      });
    },
    async getBrandList() {
      await service.chain.brand.brandList({isDel: '0'}).then(res => {
        if (res.resp_code == 200) {
          this.brandList = res.data;
        }
      })
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
    async selectShop() {
      this.shopDialog.visible = true;

      if (this.$refs['tableShop'] != null) {
        this.queryShop();
      }
    },
    getTypeName(type) {
      let result = '未知';
      for (let i = 0; i < this.btypeList.length; i++) {
        if (this.btypeList[i].id == type) {
          return this.btypeList[i].name
        }
      }
      return result;
    },
    handleSelectionShopChange(rows) {
      this.selectShopList = rows
    },
    saveShop() {
      if (this.shopDialog.isContainRoyaltyShop) {
        yid.util.confirm('选择的门店包括已设置提成方案的门店，保存后将会从原提成方案移至本方案中！', '', '', () => {
          this.dialogType.model.shopList = this.shopDialog.selectShopList;
          this.shopDialog.visible = false;
          if (this.isSeeShop) {
            this.saveOrUpdate();
          }
        },)
      } else {
        this.dialogType.model.shopList = this.shopDialog.selectShopList;
        this.shopDialog.visible = false;
        if (this.isSeeShop) {
          this.saveOrUpdate();
        }
      }
    },
    deleteShop(row) {
      yid.util.confirm('删除门店会导致门店员工提成无法正常计算，确定要删除吗？', '', '', () => {
        let i = -1;
        let deleteRow = {}
        this.shopDialog.selectShopList.forEach((p, index) => {
          if (p.shopid == row.shopid) {
            i = index
            deleteRow = p;
          }
        })
        this.selectShopList.splice(i, 1)
        this.shopDialog.selectShopList.splice(i, 1)

      })
    },
    toItem(v) {
      this.visibleList.group = true
      this.visibleList.manage = false
      this.$refs.tccc.rManage = $yid.util.deepClone(v)
      this.$refs.tccc.initGroupList(v.id)
    },
    search() {
      this.paginationParam = {page: 1, limit: 10}
      this.get(this.searchForm)
    },
    get(req) {
      const fetch = service.chain.royaltyManage.search
      const params = {...this.paginationParam, ...req, type: this.type};
      this.$refs.tableRm.reloadData({
        fetch,
        params
      }).catch(err => {
        console.log("分页数据加载失败")
        console.log(err)
      })
    },
    saveOrUpdate() {
      if (this.isSeeShop) {

        let param = $yid.util.deepClone(this.dialogType.model)
        param.type = this.type;
        service.chain.royaltyManage.saveOrUpdate(param).then(res => {
          $yid.util.alert(res.resp_msg)
          this.get()
          this.dialogCancel()
        })
        return
      }
      this.$refs['formRm'].validate((valid) => {
        if (valid) {

          let param = $yid.util.deepClone(this.dialogType.model)
          service.chain.royaltyManage.saveOrUpdate(param).then(res => {
            $yid.util.alert(res.resp_msg)
            this.get()
            this.dialogCancel()
          })
        } else {
          return false;
        }
      });
    },
    copy(row) {
      service.chain.royaltyManage.copy(row).then(res => {
        $yid.util.alert(res.resp_msg)
        this.get()
        this.dialogCancel()
      })
    },
    async showDialogType(model) {
      this.isAdd = model == null;
      this.isSeeShop = false;
      if (model) {
        this.dialogType.model = $yid.util.deepClone(model)
        this.shopDialog.selectShopList = this.dialogType.model.shopList
        this.selectShopList = this.dialogType.model.shopList
      } else {
        this.dialogType.model = {prmname: null, memo: null, status: "2"}
      }
      this.dialogType.visible = true
    },
    async showShopDialog(row) {
      this.isAdd = false;
      this.isSeeShop = true
      this.dialogType.model = $yid.util.deepClone(row)
      this.shopDialog.selectShopList = this.dialogType.model.shopList
      this.selectShopList = this.dialogType.model.shopList

      this.selectShop();
    },
    dialogCancel() {
      this.dialogType.visible = false
    },
    handleSwitch(nstatus, row) {
      if (nstatus == "2" && row.shopList && row.shopList.length > 0) {
        let tips = "【" + row.prmname + "】还存在适用门店，不可禁用！"
        row.status = "1"
        yid.util.error(tips);
        return
      }

      let param = {id: row.id, status: nstatus}
      service.chain.royaltyManage.status(param).then(res => {
        $yid.util.alert(res.resp_msg)
        this.get()
      })
    },
    addShop() {
      this.shopDialog.isContainRoyaltyShop = false
      this.selectShopList.map(m => {
        let flag = true
        if (m.prid && m.prid != null) {
          this.shopDialog.isContainRoyaltyShop = true
        }
        this.shopDialog.selectShopList.forEach(p => {
          if (p.id == m.id || p.shopid == m.id) {
            flag = false
            this.$message.warning('门店：' + m.shopname + '已勾选');
          }
        })

        if (flag) {
          this.shopDialog.selectShopList.push(m)
        }
      })
    },
    queryShop() {
      this.pageInfo = {page: 0, limit: 10};
      let req = {};
      req.pcodename = this.shopSearchForm.pcodename
      req.brandId = this.shopSearchForm.brandId
      req.type = this.shopSearchForm.type
      req.noroyalty = this.shopSearchForm.noroyalty
      if (this.shopSearchForm.regionObj && this.shopSearchForm.regionObj.id) {
        //大区及以内区域都保存进去
        this.shopSearchForm.regionObj.childrenIds.push(this.shopSearchForm.regionObj.id)
        req.regionIds = this.shopSearchForm.regionObj.childrenIds.toString();
      } else {
        req.regionIds = ""
      }
      this.getShopList(req)
    },
    async init() {
      await this.getBrandList()
      await this.getBtypeAll();
      await this.getRegionData();
    },
    handleSelectionData(rows) {
      this.selectShopData = rows;
    },
    //批量删除
    deleteBatch() {
      if (this.selectShopData.length == 0) {
        yid.util.warning("请勾选删除的门店");
        return;
      }
      this.selectShopData.forEach(item => {
        this.shopDialog.selectShopList.forEach((p, index) => {
          if (item.shopid == p.shopid) {
            this.shopDialog.selectShopList.splice(index, 1)
          }
        })
      })
    },
  },
  async mounted() {
    await this.init();
    this.get()
  },
}
</script>

<style scoped>

</style>
