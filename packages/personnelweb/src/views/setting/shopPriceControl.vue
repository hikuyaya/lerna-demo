<template>
  <div class="dept">
    <el-form inline>
      <el-form-item label="">
        <el-button type="primary" @click="addShopPriceContr()">添加</el-button>
        <el-button type="primary" @click="editShopPriceContr()">编辑</el-button>
        <el-button type="primary" @click="deleteShopPriceContr()"
          >移除</el-button
        >
      </el-form-item>
      <br />
      <el-form-item label="业务类型：">
        <el-select
          clearable
          v-model="form.type"
          placeholder="请选择业务类型"
          label-width="150px">
          <el-option label="美发" value="1"></el-option>
          <el-option label="美容" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店：">
        <el-input
          clearable
          v-model="form.shop"
          placeholder="门店名称/编码"
          style="width: 180px"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          clearable
          v-model="form.priceControl"
          placeholder="请选择状态"
          style="width: 120px">
          <el-option label="加收" value="0"></el-option>
          <el-option label="减扣" value="1"></el-option>
          <el-option label="不可变价" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="queryShopPriceControl()"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <yid-table
      ref="tableService"
      pagination
      style="width: 90%"
      :data="dataList"
      @selection-change="selectionData">
      <el-table-column type="selection" width="55"> </el-table-column>
      <yid-table-column label="业务类型" prop="type" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.type == '1'">{{ '美发' }}</div>
          <div v-if="scope.row.type == '2'">{{ '美容' }}</div>
        </template>
      </yid-table-column>
      <yid-table-column
        label="门店编码"
        prop="shopcode"
        width="120"></yid-table-column>
      <yid-table-column
        label="门店名称"
        prop="shopname"
        width="120"></yid-table-column>
      <yid-table-column
        label="所属价格体系"
        prop="pricename"
        width="140"></yid-table-column>
      <yid-table-column
        label="添加时间"
        prop="createdTime"
        width="120"></yid-table-column>
      <yid-table-column
        label="修改时间"
        prop="updatedTime"
        width="120"></yid-table-column>
      <yid-table-column
        label="操作人"
        prop="createdBy"
        width="120"></yid-table-column>
      <yid-table-column label="调价控制" prop="priceControl" width="120">
        <template slot-scope="scope">
          <label v-if="scope.row.priceControl == '0'">加收</label>
          <label v-if="scope.row.priceControl == '1'">减扣</label>
          <label v-if="scope.row.priceControl == '2'">不可变价</label>
        </template>
      </yid-table-column>
    </yid-table>
    <yid-dialog
      :title="shopDialog.title"
      :visible.sync="shopDialog.visible"
      width="1200px">
      <el-row type="flex" justify="space-between">
        <el-form inline>
          <el-form-item label="门店：">
            <el-input
              clearable
              v-model="shopDialog.shop"
              placeholder="门店名称/编码"
              style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="业务类型：">
            <el-select clearable v-model="shopDialog.type">
              <el-option
                :label="type.name"
                :value="type.value"
                v-for="type in types"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-select
              clearable
              v-model="shopDialog.brand"
              style="width: 120px">
              <el-option
                v-for="item in brands"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：">
            <el-select
              ref="selectRegionRef"
              @clear="clearSelectRegion"
              clearable
              v-model="shopDialog.region.name"
              style="width: 140px">
              <el-option
                hidden
                :value="shopDialog.region.id"
                style="height: auto"></el-option>
              <el-tree
                :expand-on-click-node="false"
                :check-on-click-node="true"
                show-checkbox
                check-strictly
                node-key="id"
                :data="regions"
                :props="defaultProps"
                @check-change="handleNodeClick"
                ref="templateRegionTree">
              </el-tree>
            </el-select>
          </el-form-item>
          <el-form-item label="价格体系：">
            <el-select
              clearable
              v-model="shopDialog.isptid"
              style="width: 100px">
              <el-option label="未设置" value="2"></el-option>
              <el-option label="已设置" value="1"></el-option>
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
            ref="table1"
            style="margin-top: 10px"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <yid-table-column
              label="门店编码"
              min-width="80"
              prop="shopcode"></yid-table-column>
            <yid-table-column
              label="门店名称"
              min-width="100"
              prop="shopname"></yid-table-column>
            <yid-table-column
              label="门店品牌"
              min-width="70"
              prop="brandName"></yid-table-column>
            <yid-table-column
              label="门店区域"
              min-width="110"
              prop="regionName"></yid-table-column>
            <yid-table-column label="业务类型" min-width="70" prop="type">
              <template slot-scope="scope">
                {{ scope.row.type | formatValue(types) }}
              </template>
            </yid-table-column>
            <yid-table-column
              label="价格体系"
              min-width="100"
              prop="pricename"></yid-table-column>
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
          <yid-table
            ref="table2"
            style="margin-top: 10px"
            :data="shopDialog.shoplist">
            <yid-table-column
              label="门店编码"
              min-width="80"
              prop="shopcode"></yid-table-column>
            <yid-table-column
              label="门店名称"
              min-width="100"
              prop="shopname"></yid-table-column>
            <yid-table-column
              label="价格体系"
              min-width="120"
              prop="pricename"></yid-table-column>
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
          <el-button type="primary" @click="setShop()">下一步</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="shopDialog.visible = false">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog
      :title="priceControlData.title"
      :visible.sync="priceControlData.visible"
      width="500px">
      <el-form :model="priceControlData" label-width="145px">
        <el-form-item label="选中门店数:">
          {{ this.shopNum }}
        </el-form-item>
        <el-form-item v-if="isShow" label="设置调价状态:">
          <el-radio-group v-model="priceControlData.priceControl">
            <el-radio label="0">加收</el-radio>
            <el-radio label="1">减扣</el-radio>
            <el-radio label="2">不可变价</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!isShow">
          {{ '是否确定移除门店价格控制?' }}
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save()">确定</el-button>
          <el-button @click="levelCancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'

/**
 * 清空
 * @param obj
 */
function isClear(obj) {
  for (var i in obj) {
    if (obj[i] instanceof Array) {
      obj[i] = []
    } else {
      obj[i] = ''
    }
  }
}

export default {
  name: 'shopPriceControl',
  data() {
    return {
      form: {
        type: '',
        shop: '',
        priceControl: ''
      },
      priceControlList: [],
      pageInfo: { page: 1, limit: 10 },
      shopDialog: {
        id: '',
        title: '',
        visible: false,
        shop: '',
        type: '',
        branch: '',
        region: '',
        shoplist: [],
        isptid: '',
        page: 1,
        limit: 10,
        count: 0,
        status: '1'
      },
      addDialog: {
        id: '',
        title: '',
        visible: false,
        code: '',
        name: '',
        memo: '',
        shoplist: [],
        branch: ''
      },
      priceControlData: {
        title: '',
        visible: false,
        priceControl: ''
      },
      selectShops: [],
      branchs: [],
      brands: [],
      regions: [],
      flag: false,
      types: [
        { name: '美发', value: '1' },
        { name: '美容', value: '2' }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isShow: false,
      shopNum: null,
      dataList: []
    }
  },
  mounted() {
    this.init()
    this.queryShopPriceControl()
    this.queryData()
  },
  filters: {
    formatValue(str, stsList) {
      let label = ''
      stsList.map(m => {
        if (m.value == str) {
          label = m.name
        }
      })
      if (label) {
        return label
      } else {
        return str
      }
    }
  },
  methods: {
    init() {
      service.chain.servShop.findbrands({ status: '1' }).then(res => {
        this.brands = res.data
      })
      service.chain.servShop.findbranchs({ status: '1' }).then(res => {
        this.branchs = res.data
      })
      service.chain.region.treeAll({ status: '1' }).then(res => {
        this.regions = res.data
      })
    },
    addShopPriceContr() {
      this.type = '1'
      this.flag = false
      isClear(this.shopDialog)
      this.shopDialog.visible = true
      this.shopDialog.title = '选择门店'
      // this.shopDialog.shoplist=this.addDialog.shoplist
      // this.shopDialog.shoplist.forEach(each =>{
      //   each.pricename=this.spname;
      // })
      // this.shopDialog.id=this.addDialog.id
      // this.$refs.templateRegionTree.setCheckedKeys([]);
      this.queryShop()
    },
    queryShop() {
      if (this.shopDialog.region && this.shopDialog.region.id) {
        //大区及以内区域都保存进去
        this.shopDialog.region.childrenIds.push(this.shopDialog.region.id)
        this.shopDialog.regionIds =
          this.shopDialog.region.childrenIds.toString()
      } else {
        this.shopDialog.regionIds = ''
      }
      const fetch = service.chain.shop.shopListWithPage
      const params = {
        shop: this.shopDialog.shop,
        type: this.shopDialog.type,
        brandId: this.shopDialog.brand,
        regionIds: this.shopDialog.regionIds,
        isptid: this.shopDialog.isptid,
        page: 1,
        limit: 10,
        count: 0
      }
      this.$refs.table1.reloadData({
        fetch,
        params
      })
    },
    addShop() {
      this.selectShops.map(m => {
        let flag = true
        this.shopDialog.shoplist.forEach(p => {
          if (p.shopid == m.id) {
            flag = false
          }
        })
        if (flag) {
          if (m.pricename) {
            this.flag = true
          }
          this.shopDialog.shoplist.push({
            shopid: m.id,
            shopcode: m.shopcode,
            shopname: m.shopname,
            pricename: m.pricename,
            type: m.type
          })
          this.dataList.forEach(item => {
            this.shopDialog.shoplist.forEach(obj => {
              if (obj.shopcode == item.shopcode) {
                obj.id = item.id
              }
            })
          })
        }
      })
    },
    deleteShop(row) {
      let i = -1
      this.shopDialog.shoplist.forEach((p, index) => {
        if (p.shopid == row.shopid) {
          i = index
        }
      })
      this.shopDialog.shoplist.splice(i, 1)
    },
    handleNodeClick(data, checked) {
      if (checked == true) {
        let id = data.id
        let valueObj = {}
        valueObj.id = id
        valueObj.name = data.name
        this.shopDialog.region = valueObj
        this.shopDialog.region.childrenIds = []
        this.getSelectAllRegion(data, this.shopDialog.region.childrenIds)
        // this.$refs.templateRegionTree.setCheckedKeys([id]);
      } else {
        if (this.shopDialog.region.id == data.id) {
          // this.$refs.templateRegionTree.setCheckedKeys([data.id]);
        }
      }
      this.$refs.selectRegionRef.blur()
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
    clearSelectRegion() {
      this.shopDialog.region = {}
      // this.$refs.templateRegionTree.setCheckedKeys([]);
    },
    handleSelectionChange(rows) {
      if (rows.size > 0) {
        this.rows.forEach(obj => {
          this.dataList.forEach(item => {
            if (item.shopcode == obj.shopcode) {
              yid.util.warning('111111')
              return
            }
          })
        })
      }
      this.selectShops = rows
    },
    setShop() {
      if (this.shopDialog.shoplist.length == 0) {
        yid.util.warning('请选择门店!')
        return
      }
      this.shopNum = this.shopDialog.shoplist.length
      this.priceControlData.visible = true
      this.priceControlData.title = '调价控制'
      this.isShow = true
    },
    editShopPriceContr() {
      if (this.priceControlList.length == 0) {
        yid.util.warning('请选择门店再进行编辑!')
      } else {
        this.priceControlData.visible = true
        this.priceControlData.title = '编辑调价控制'
        this.isShow = true
        this.shopNum = this.priceControlList.length
        this.shopDialog.shoplist = this.priceControlList
      }
    },
    deleteShopPriceContr() {
      if (this.priceControlList.length == 0) {
        yid.util.warning('请选择门店再进行移除!')
      } else {
        this.shopNum = this.priceControlList.length
        this.priceControlData.visible = true
        this.priceControlData.title = '移除调价控制'
        this.isShow = false
      }
    },
    queryShopPriceControl() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.tableService.Pagination.internalPageSize
      const fetch = service.chain.servShop.findlistPage
      const params = { ...this.pageInfo, ...this.form }
      this.$refs.tableService.reloadData({
        fetch,
        params
      })
    },
    queryData() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.tableService.Pagination.internalPageSize
      const params = { ...this.pageInfo, ...this.form }
      service.chain.servShop.findlistPage(params).then(res => {
        this.dataList = res.data
      })
    },
    selectionData(val) {
      this.priceControlList = val
    },
    save() {
      if (this.isShow) {
        if (this.priceControlData.priceControl) {
          this.shopDialog.shoplist.forEach(each => {
            each.priceControl = this.priceControlData.priceControl
          })
          service.chain.servShop
            .saveOrUpdate(this.shopDialog.shoplist)
            .then(res => {
              if (res.resp_code == '200') {
                this.shopDialog.visible = false
                this.priceControlData.visible = false
                this.queryShopPriceControl()
                yid.util.success(res.resp_msg)
              } else {
                yid.util.error(res.resp_msg)
              }
            })
        } else {
          yid.util.warning('请设置调价的状态!')
          return
        }
      } else {
        service.chain.servShop.deleteData(this.priceControlList).then(res => {
          if (res.resp_code == '200') {
            this.priceControlData.visible = false
            this.queryShopPriceControl()
            yid.util.success(res.resp_msg)
          } else {
            yid.util.error(res.resp_msg)
          }
        })
      }
    },
    levelCancel() {
      this.priceControlData.visible = false
    }
  }
}
</script>

<style scoped></style>
