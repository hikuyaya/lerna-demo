<template>
  <div>
    <el-collapse-transition>
      <div v-show="showList">
        <el-button @click="showCardSystemSettingPage()" type="primary"
          >新增</el-button
        >
        <el-form
          inline
          :model="searchForm"
          ref="searchForm"
          style="margin-top: 8px">
          <el-form-item label="会员卡体系：">
            <el-input
              clearable
              v-model="searchForm.pcodename"
              placeholder="编码/名称"
              style="width: 160px"></el-input>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-select
              clearable
              v-model="searchForm.brandId"
              @change="changeBrand">
              <el-option
                v-for="item in brandList"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店：">
            <el-select
              @clear="clearFormShopList"
              clearable
              v-model.trim="searchForm.shopid"
              filterable
              :filter-method="filterShop"
              placeholder="请选择门店"
              style="width: 160px">
              <el-option
                :key="item.id"
                :label="item.shopname"
                :value="item.id"
                v-for="item in filterShopList">
                <span style="float: left">{{ item.shopcode }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.shopname
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select
              style="width: 100px"
              v-model="searchForm.status"
              clearable
              placeholder="请选择">
              <el-option value="1" label="正常"></el-option>
              <el-option value="2" label="停用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>

        <yid-table ref="table" style="margin-top: 10px">
          <yid-table-column
            label="编码"
            min-width="80"
            prop="code"></yid-table-column>
          <yid-table-column
            label="名称"
            min-width="80"
            prop="name"></yid-table-column>
          <yid-table-column label="适用门店" min-width="80" prop="shopNum">
            <template slot-scope="scope">
              <div>
                <el-row gutter="8">{{ scope.row.brandName }}</el-row>
                <el-row gutter="8">共{{ scope.row.shopNum }}家门店</el-row>
                <el-row gutter="8">
                  <el-link type="primary" @click="showShopDialog(scope.row)"
                    >查看修改</el-link
                  >
                </el-row>
              </div>
            </template>
          </yid-table-column>
          <yid-table-column label="备注" min-width="80" prop="memo" />
          <yid-table-column
            label="修改人"
            prop="updatedBy"
            width="100"></yid-table-column>
          <yid-table-column
            label="修改时间"
            prop="updatedTime"
            width="110"></yid-table-column>
          <yid-table-column label="状态" min-width="80" prop="status">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-text="启用"
                inactive-text="停用"
                active-value="1"
                inactive-value="2"
                active-color="#339933"
                inactive-color="#DCDFE6"
                @change="updateStatus(scope.row)">
              </el-switch>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="80" prop="shopNum">
            <template slot-scope="scope" fixed="right">
              <el-link
                type="primary"
                @click="showCardSystemSettingPage(scope.row)"
                >编辑</el-link
              >
              <el-link
                type="primary"
                style="margin-left: 6px"
                @click="showCardSettingPage(scope.row)"
                >设置会员卡</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="showCardSystemSetting">
        <CardSystemSetting
          ref="cardSystemSetting"
          @onClose="closeCardSystemSettingPage" />
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="showCardSetting">
        <CardSetting ref="cardSetting" @onClose="closeCardSettingPage" />
      </div>
    </el-collapse-transition>

    <yid-dialog
      :title="shopDialog.title"
      :visible.sync="shopDialog.visible"
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
          <el-form-item label="业务类型：">
            <el-select
              clearable
              filterable
              v-model="shopSearchForm.type"
              placeholder="请选择业务类型"
              style="width: 160px">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in btypeList">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：">
            <el-select
              @clear="clearSelectRegion"
              clearable
              ref="selectRegionRef"
              v-model="shopSearchForm.regionObj.name"
              placeholder="请选择门店区域"
              style="width: 180px">
              <el-option
                hidden
                :value="shopSearchForm.regionObj.id"
                style="height: auto"></el-option>
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
          <yid-table
            pagination
            ref="tableShop"
            style="margin-top: 10px"
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
          <el-link type="primary" @click="deleteBatch()">批量删除</el-link>
          <yid-table
            ref="selectTableShop"
            style="margin-top: 10px"
            :data="shopDialog.selectShopList"
            @selection-change="handleSelectionData">
            <el-table-column type="selection" width="55"></el-table-column>
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
                  >删除</el-link
                >
              </template>
            </yid-table-column>
          </yid-table>
        </el-col>
      </el-row>
      <el-row justify="space-between" style="margin-top: 10px">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="saveShop">选好了</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="cancelSaveShop">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import CardSystemSetting from './components/cardSystemSetting'
import CardSetting from './components/cardSetting'

export default {
  name: 'cardconfig',
  components: {
    CardSystemSetting,
    CardSetting
  },
  data() {
    return {
      showList: true,
      showCardSystemSetting: false,
      showCardSetting: false,
      pageInfo: { page: 1, limit: 10 },
      searchForm: {
        pcodename: '',
        status: '',
        brandId: null,
        shopid: null
      },
      shopSearchForm: {
        pcodename: '',
        type: '',
        regionObj: '',
        status: null
      },
      shopDialog: {
        visible: false,
        title: '选择门店',
        selectShopList: [], //已经选择的适用门店
        orgSelectShopList: [] //保存选择的适用门店  用于取消时还原
      },
      selectRow: null,
      shopList: [],
      brandList: [],
      btypeList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectShopList: [], //左边 临时保存的
      allShopList: [],
      filterShopList: [],
      selectShopData: []
    }
  },
  mounted() {
    this.getBrandList()
    this.getShopListForSearch({ status: '1' })
    this.search()
  },
  methods: {
    clearFormShopList() {
      this.searchForm.shopid = null
      this.filterShopList = this.allShopList
    },
    getShopListForSearch(params) {
      service.chain.shop.shopList(params).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    changeBrand(id) {
      this.getShopListForSearch({ brandId: id })
    },
    deleteShop(row) {
      let cardName = this.selectRow.name
      let shopname = row.shopname
      let tips =
        '删除门店,【' +
        cardName +
        '】下的会员卡将不在【' +
        shopname +
        '】中显示，若会员卡在本店还存有卡金将不能使用，确定要删除吗？'
      yid.util.confirm(tips, '', '', () => {
        let i = -1
        let deleteRow = {}
        this.shopDialog.selectShopList.forEach((p, index) => {
          if (p.id == row.id) {
            i = index
            deleteRow = p
          }
        })
        this.shopDialog.selectShopList.splice(i, 1)
      })
    },
    getShopList(p) {
      const fetch = service.chain.shop.shopListWithPage
      let params = { ...this.pageInfo, ...p }
      this.$refs['tableShop'].reloadData({
        fetch,
        params
      })
    },

    async showShopDialog(row) {
      this.selectShopList = []
      this.selectRow = row
      this.shopDialog.selectShopList = JSON.parse(JSON.stringify(row.shopList))
      this.shopDialog.orgSelectShopList = JSON.parse(
        JSON.stringify(row.shopList)
      )

      if (
        this.brandList.length == 0 ||
        this.btypeList.length == 0 ||
        this.regionData.length == 0
      ) {
        await this.getBtypeAll()
        await this.getRegionData()
      }
      this.shopDialog.visible = true
      if (this.$refs.tableShop != null) {
        this.$refs.tableShop.clearSelection() // 清空表单选项
        this.$refs.tableShop.clearData() //清空表单数据
      }
    },
    updateStatus(row) {
      row = this.assembleCardSystemInfo(row)
      if (row.status == '2') {
        let tips =
          '禁用后，【' + row.name + '】内的会员卡同时禁用！确定要禁用吗？'
        yid.util.confirm(
          tips,
          '',
          '',
          () => {
            service.chain.cardTemp.saveOrUpdate(row).then(res => {
              if (res.resp_code == 200) {
                this.getData()
              } else {
                yid.util.error('保存失败')
              }
            })
          },
          () => {
            row.status = '1'
          }
        )
      } else {
        service.chain.cardTemp.saveOrUpdate(row).then(res => {
          if (res.resp_code == 200) {
            this.getData()
          } else {
            yid.util.error('保存失败')
          }
        })
      }
    },
    search() {
      this.pageInfo = { page: 1, limit: 100 }
      this.getData(this.searchForm)
    },
    getData(reqParams) {
      const fetch = service.chain.cardTemp.searchList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    closeCardSystemSettingPage() {
      this.showCardSystemSetting = false
      this.showCardSetting = false
      this.showList = true
      this.getData()
    },
    closeCardSettingPage() {
      this.showCardSystemSetting = false
      this.showCardSetting = false
      this.showList = true
    },
    showCardSystemSettingPage(data) {
      this.showCardSystemSetting = true
      this.showList = false
      this.$refs.cardSystemSetting.initData(data)
    },
    showCardSettingPage(data) {
      this.showCardSetting = true
      this.showList = false
      this.$refs.cardSetting.initData(data)
    },
    getBrandList() {
      service.chain.brand.brandList({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.brandList = res.data
        }
      })
    },
    async getBtypeAll() {
      await service.chain.btype.btypeAllList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.btypeList = res.data
        }
      })
    },
    async getRegionData() {
      await service.chain.region.treeAll({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.regionData = res.data
        }
      })
    },
    getTypeName(type) {
      let result = '未知'
      for (let i = 0; i < this.btypeList.length; i++) {
        if (this.btypeList[i].id == type) {
          return this.btypeList[i].name
        }
      }
      return result
    },
    clearSelectRegion() {
      this.shopSearchForm.regionObj = {}
      this.$refs.templateRegionTree.setCheckedKeys([])
    },
    getSelectAllRegion(region, regionChildrenIds) {
      if (region.children == null) {
        return
      }
      for (let i = 0; i < region.children.length; i++) {
        let child = region.children[i]
        regionChildrenIds.push(child.id)
        this.getSelectAllRegion(child, regionChildrenIds)
      }
    },
    handleNodeClick(data, checked, node) {
      if (checked == true) {
        let id = data.id
        let valueObj = {}
        valueObj.id = id
        valueObj.name = data.name
        this.shopSearchForm.regionObj = valueObj
        this.shopSearchForm.regionObj.childrenIds = []
        this.getSelectAllRegion(data, this.shopSearchForm.regionObj.childrenIds)
        this.$refs.templateRegionTree.setCheckedKeys([id])
      } else {
        if (this.shopSearchForm.regionObj.id == data.id) {
          this.$refs.templateRegionTree.setCheckedKeys([data.id])
        }
      }
      this.$refs.selectRegionRef.blur()
    },
    queryShop() {
      this.pageInfo = { page: 1, limit: 10 }
      let req = {}
      req.pcodename = this.shopSearchForm.pcodename
      req.brandId = this.selectRow.brandId
      req.type = this.shopSearchForm.type
      req.status = this.shopSearchForm.status
      if (this.shopSearchForm.regionObj && this.shopSearchForm.regionObj.id) {
        //大区及以内区域都保存进去
        this.shopSearchForm.regionObj.childrenIds.push(
          this.shopSearchForm.regionObj.id
        )
        req.regionIds = this.shopSearchForm.regionObj.childrenIds.toString()
      } else {
        req.regionIds = ''
      }
      this.getShopList(req)
    },
    handleSelectionShopChange(rows) {
      this.selectShopList = rows
    },
    addShop() {
      this.selectShopList.map(m => {
        let flag = true
        this.shopDialog.selectShopList.forEach(p => {
          if (p.id == m.id || p.shopid == m.id) {
            flag = false
            this.$message.warning('门店：' + p.shopname + '已勾选')
          }
        })
        if (flag) {
          this.shopDialog.selectShopList.push(m)
        }
      })
    },
    saveShop() {
      this.selectRow.shopList = this.shopDialog.selectShopList
      this.selectRow = this.assembleCardSystemInfo(this.selectRow)
      service.chain.cardTemp.saveOrUpdate(this.selectRow).then(res => {
        if (res.resp_code == 200) {
          this.getData()
          this.shopDialog.visible = false
        } else {
          yid.util.error('保存失败')
        }
      })
    },
    cancelSaveShop() {
      this.shopDialog.selectShopList = this.shopDialog.orgSelectShopList
      this.shopDialog.visible = false
    },
    //主要用于重组体系品牌新
    assembleCardSystemInfo(selectRowInfo) {
      if (selectRowInfo.isSdiffbrand == '1') {
        let brandCodeArr = selectRowInfo.sdbBrandsCode.split(',')
        selectRowInfo.czkBrandTypeArr = []
        for (let i = 0; i < brandCodeArr.length; i++) {
          this.brandList.forEach(each => {
            if (each.code == brandCodeArr[i]) {
              selectRowInfo.czkBrandTypeArr.push(each)
            }
          })
        }
      }

      if (selectRowInfo.isMdiffbrand == '1') {
        let brandCodeArr = selectRowInfo.mdbBrandsCode.split(',')
        selectRowInfo.zgkBrandTypeArr = []
        for (let i = 0; i < brandCodeArr.length; i++) {
          this.brandList.forEach(each => {
            if (each.code == brandCodeArr[i]) {
              selectRowInfo.zgkBrandTypeArr.push(each)
            }
          })
        }
      }
      return selectRowInfo
    },
    handleSelectionData(rows) {
      this.selectShopData = rows
    },
    //批量删除
    deleteBatch() {
      if (this.selectShopData.length == 0) {
        yid.util.warning('请勾选删除的门店')
        return
      }
      this.selectShopData.forEach(item => {
        this.shopDialog.selectShopList.forEach((p, index) => {
          if (item.id == p.id) {
            this.shopDialog.selectShopList.splice(index, 1)
          }
        })
      })
      console.log(this.shopDialog.selectShopList)
    }
  }
}
</script>

<style scoped lang="scss"></style>
