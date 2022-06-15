<template>
  <div class="appoint-list">
    <el-form inline v-model="form">
      <el-form-item
        label="门店："
        prop="shop"
        :rules="[{ required: true, message: ' ' }]">
        <el-select
          clearable
          v-model="form.shop"
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
      <el-form-item label="套餐：">
        <el-input
          clearable
          v-model.trim="form.package"
          placeholder="套餐编码/名称"
          style="width: 180px"></el-input>
      </el-form-item>
      <el-button type="primary" @click="querylist()">查询</el-button>
    </el-form>

    <yid-table
      pagination
      ref="tableData"
      @selection-change="handleServicesChange">
      <yid-table-column
        label="编号"
        min-width="60"
        prop="spcode"></yid-table-column>
      <yid-table-column
        label="套餐名称"
        min-width="160"
        prop="spname"></yid-table-column>
      <yid-table-column
        label="可售时间"
        min-width="180"
        prop="date"
        :formatter="dateFormat"></yid-table-column>
      <yid-table-column
        label="有效期"
        min-width="100"
        prop="expiryType"
        :formatter="dateFormat1"></yid-table-column>
      <yid-table-column
        label="套餐价"
        min-width="70"
        prop="totalprice"></yid-table-column>
      <yid-table-column
        label="成本价"
        min-width="70"
        prop="cost"></yid-table-column>
      <yid-table-column
        label="套餐内容"
        min-width="240"
        prop="content"
        align="left">
        <template slot-scope="scope">
          <el-row
            type="flex"
            :key="item.id"
            v-for="item in scope.row.servs"
            justify="space-between">
            <el-col :span="22">
              <div v-if="scope.row.isMultiple == '0'">
                {{ item.typename }}-{{ item.sdname }}, {{ item.num }}次, 总价:{{
                  item.pprice
                }}
                {{ item.isGift == '1' ? '赠' : '' }}
              </div>
              <div v-if="scope.row.isMultiple == '1'">
                {{ item.sdname }}, {{ item.num }}次, 总价:{{ item.pprice }}
                {{ item.isGift == '1' ? '赠' : '' }}
              </div>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            :key="item.id"
            v-for="item in scope.row.products"
            justify="space-between">
            <el-col :span="22">
              <div v-if="scope.row.isMultiple == '0'">
                {{ item.typename }}-{{ item.sdname }}, {{ item.num }}次, 总价:{{
                  item.pprice
                }}
                {{ item.isGift == '1' ? '赠' : '' }}
              </div>
              <div v-if="scope.row.isMultiple == '1'">
                {{ item.sdname }}, {{ item.num }}次, 总价:{{ item.pprice }}
                {{ item.isGift == '1' ? '赠' : '' }}
              </div>
            </el-col>
          </el-row>
        </template>
      </yid-table-column>
      <yid-table-column label="异店划套餐规则" prop="shopNum" width="120">
        <template slot-scope="scope">
          <el-link @click="lookupRule(scope.row)" type="primary"
            >查看规则</el-link
          >
        </template>
      </yid-table-column>
      <yid-table-column label="状态" min-width="80" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status == '1' ? '正常' : '停用' }}
        </template>
      </yid-table-column>
      <yid-table-column label="展开" width="60" type="expand">
        <template slot-scope="scope">
          <div style="padding: 20px 50px">
            <h4>
              项目明细<el-link
                type="primary"
                style="margin-left: 20px"></el-link>
            </h4>
            <yid-table
              ref="table1"
              style="margin-top: 15px"
              :data="scope.row.servs">
              <yid-table-column
                label="项目编码"
                min-width="50"
                prop="sdcode"></yid-table-column>
              <yid-table-column
                label="项目名称"
                min-width="100"
                prop="sdname"></yid-table-column>
              <yid-table-column
                label="次数"
                min-width="50"
                prop="num"></yid-table-column>
              <yid-table-column
                label="单价"
                min-width="50"
                prop="price"></yid-table-column>
              <yid-table-column
                label="套餐价"
                min-width="50"
                prop="pprice"></yid-table-column>
              <yid-table-column label="是否赠送" min-width="50" prop="isGift">
                <template slot-scope="scope">
                  <div>{{ scope.row.isGift == '0' ? '否' : '是' }}</div>
                </template>
              </yid-table-column>
            </yid-table>
            <h4 style="margin-top: 20px">
              产品明细<el-link
                type="primary"
                style="margin-left: 20px"></el-link>
            </h4>
            <yid-table
              ref="table2"
              style="margin-top: 15px"
              :data="scope.row.products">
              <yid-table-column
                label="产品编码"
                min-width="50"
                prop="sdcode"></yid-table-column>
              <yid-table-column
                label="产品名称"
                min-width="100"
                prop="sdname"></yid-table-column>
              <yid-table-column
                label="次数"
                min-width="50"
                prop="num"></yid-table-column>
              <yid-table-column
                label="单价"
                min-width="50"
                prop="price"></yid-table-column>
              <yid-table-column
                label="套餐价"
                min-width="50"
                prop="pprice"></yid-table-column>
              <yid-table-column label="是否赠送" min-width="50" prop="isGift">
                <template slot-scope="scope">
                  <div>{{ scope.row.isGift == '0' ? '否' : '是' }}</div>
                </template>
              </yid-table-column>
            </yid-table>
          </div>
        </template>
      </yid-table-column>
    </yid-table>

    <yid-dialog
      :title="lookupDialog.title"
      :visible.sync="lookupDialog.visible"
      @close="lookupDialog.visible = false"
      width="500px">
      <el-form :model="lookupDialog" label-width="150px" ref="copyForm">
        <el-form-item label="套餐名称：">
          {{ lookupDialog.spname }}
        </el-form-item>
        <el-form-item label="是否允许跨店消费: ">
          {{ lookupDialog.isDiffshop == '1' ? '允许' : '不允许' }}
          <div v-show="lookupDialog.isDiffshop == '1'">
            套餐内容：{{ lookupDialog.dsAllowPackage == '1' ? '项目' : '' }}
            {{ lookupDialog.dsAllowProduct == '1' ? '产品' : '' }}
          </div>
        </el-form-item>
        <el-form-item label="是否允许跨品牌消费: ">
          {{ lookupDialog.isDiffbrand == '1' ? '允许' : '不允许' }}
          <div v-show="lookupDialog.isDiffbrand == '1'">
            套餐内容：{{ lookupDialog.dbAllowPackage == '1' ? '项目' : '' }}
            {{ lookupDialog.dbAllowProduct == '1' ? '产品' : '' }}<br />
            门店品牌：<label v-for="brand in lookupDialog.dbBrands"
              >{{ brand }};
            </label>
          </div>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'

export default {
  name: 'packLookup',
  data() {
    return {
      form: {
        package: '',
        shop: '',
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      filterShopList: [],
      allShopList: [],
      lookupDialog: {
        title: '异店划套餐规则',
        visible: false,
        spname: '',
        isDiffshop: '',
        dsAllowPackage: '',
        dsAllowProduct: '',
        isDiffbrand: '',
        dbAllowPackage: '',
        dbAllowProduct: '',
        dbBrands: []
      }
    }
  },
  methods: {
    dateFormat: function (row) {
      if (row.btype == '1') {
        return '长期'
      }
      const sdate = row.sdate
      const edate = row.edate
      if (!sdate || !edate) {
        return ''
      }
      return $yid.util.formatDate(sdate) + ' ~ ' + $yid.util.formatDate(edate)
    },
    dateFormat1: function (row) {
      if (row.expiryType == '1') {
        return row.expirtyMonth + '个月'
      } else {
        if (row.expirydate) {
          return $yid.util.formatDate(row.expirydate)
        } else {
          return '长期'
        }
      }
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    querylist() {
      if (!this.form.shop) {
        yid.util.error('门店必填')
        return
      }
      const fetch = service.servicepackage.findServPackList
      const params = this.form
      this.$refs.tableData.reloadData({
        fetch,
        params
      })
    },
    init() {
      service.chain.shop.shopList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    lookupRule(row) {
      this.lookupDialog.visible = true
      this.lookupDialog.spname = row.spname
      this.lookupDialog.isDiffshop = row.isDiffshop
      this.lookupDialog.dsAllowPackage = row.dsAllowPackage
      this.lookupDialog.dsAllowProduct = row.dsAllowProduct
      this.lookupDialog.isDiffbrand = row.isDiffbrand
      this.lookupDialog.dbAllowPackage = row.dbAllowPackage
      this.lookupDialog.dbAllowProduct = row.dbAllowProduct
      if (row.dbBrands) {
        this.lookupDialog.dbBrands = row.dbBrands.split(',')
      } else {
        this.lookupDialog.dbBrands = []
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped lang="scss">
.serve-table {
  th,
  td {
    padding-left: 10px;
    text-align: left;
  }
  .el-checkbox {
    margin-right: 15px;
  }
}
</style>
