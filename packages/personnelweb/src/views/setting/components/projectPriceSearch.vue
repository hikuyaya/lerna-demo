<template>
  <div>
    <el-form ref="searchForm" inline :model="searchForm">
      <el-form-item
        label="门店："
        prop="shopid"
        :rules="[{ required: true, message: '必须选择一个门店' }]">
        <el-select
          @clear="clearFormShop"
          @blur="clearFormShop"
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
      <el-form-item label="部门">
        <el-select
          clearable
          filterable
          v-model="searchForm.branch"
          @change="changeBranch"
          placeholder="请选择部门"
          style="width: 160px">
          <el-option
            v-for="item in branchList"
            :key="item.id"
            :label="item.bname"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          clearable
          filterable
          v-model="searchForm.servtid"
          placeholder="请选择分类"
          style="width: 160px">
          <el-option
            v-for="item in serviceFilterList"
            :key="item.id"
            :label="item.sname"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button @click="search" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <yid-table pagination ref="table" :data="tableData">
      <yid-table-column
        label="编号"
        prop="servcode"
        width="60"></yid-table-column>
      <yid-table-column
        label="名称"
        prop="servname"
        width="120"></yid-table-column>
      <yid-table-column
        label="所属部门"
        prop="bname"
        width="80"></yid-table-column>
      <yid-table-column label="分类" prop="sname" width="70"></yid-table-column>
      <yid-table-column label="类别" prop="sertype" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sertype == '1'">大项目</span>
          <span v-if="scope.row.sertype == '2'">小项目</span>
          <span v-if="scope.row.sertype == '3'">不计服务业绩</span>
        </template>
      </yid-table-column>
      <yid-table-column label="基础定价" prop="price" width="140">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-between">
            <el-col :span="22">
              <div>{{ scope.row.price ? '￥' + scope.row.price : '' }}</div>
              <div>
                {{
                  scope.row.minPrice
                    ? '最低价:' + scope.row.minPrice + '元'
                    : ''
                }}
              </div>
            </el-col>
          </el-row>
        </template>
      </yid-table-column>
      <yid-table-column label="会员卡折扣价设定" prop="discount" width="180">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-between">
            <el-col :span="22">
              <div :key="item.id" v-for="item in scope.row.servcards">
                {{ item.cardname }}
                {{ item.dtype == '1' ? item.value + '折' : item.value + '元' }}
              </div>
            </el-col>
          </el-row>
        </template>
      </yid-table-column>
      <yid-table-column label="员工级别价格设置" prop="special" width="180">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-between">
            <el-col :span="22">
              <div :key="item.id" v-for="item in scope.row.servspecs">
                {{ item.pslname }} {{ item.specialPrice + '元' }}
              </div>
            </el-col>
            <el-col :span="2"
              ><i
                class="el-icon-document"
                @click="showSpecialDialog(scope.row)"></i
            ></el-col>
          </el-row>
        </template>
      </yid-table-column>
      <yid-table-column label="状态" prop="isDel" width="120">
        <template slot-scope="scope">
          {{ scope.row.isDel == '1' ? '删除' : '正常' }}
        </template>
      </yid-table-column>
    </yid-table>

    <yid-dialog
      :title="specialDialog.title"
      :visible.sync="specialDialog.visible"
      @close="hideSpecialDialog"
      width="auto">
      <el-row type="flex" justify="space-between">
        项目名称：{{ specialDialog.servname }}
      </el-row>
      <yid-table
        ref="specialTable"
        style="margin-top: 15px"
        :data="specialDialog.specialRows">
        <yid-table-column
          label="名称"
          prop="pslname"
          width="120"></yid-table-column>
        <yid-table-column
          label="级别价格"
          prop="specialPrice"
          width="120"></yid-table-column>
        <yid-table-column
          label="最低价格"
          prop="minPrice"
          width="120"></yid-table-column>
        <yid-table-column label="会员卡折扣" width="120">
          <template slot-scope="scope">
            <el-row
              type="flex"
              justify="space-between"
              class="margin5"
              :key="item.cardid"
              v-for="item in scope.row.discounts">
              <el-col :span="8">{{ item.cardName }}</el-col>
              <el-col :span="8">
                {{ item.dtype == '1' ? '折扣' : '会员价' }}
              </el-col>
              <el-col :span="6">
                {{ item.value }}
              </el-col>
              <el-col :span="2"
                ><label-wrap
                  v-show="item.dtype"
                  v-text="item.dtype == '1' ? '折' : '元'"></label-wrap
              ></el-col>
            </el-row>
          </template>
        </yid-table-column>
      </yid-table>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
export default {
  name: 'projectPriceSearch',
  data() {
    return {
      searchForm: {
        shopid: '',
        servtid: '',
        branch: '',
        pcodename: ''
      },
      allShopList: [],
      filterShopList: [],
      branchList: [],
      serviceTypeList: [],
      serviceFilterList: [],
      tableData: [],
      pageInfo: { page: 1, limit: 10 },
      specialDialog: {
        servid: '',
        title: '',
        visible: false,
        type: '1',
        specialData: [],
        id: '',
        code: '',
        name: '',
        specialRows: [],
        cards: [],
        servname: ''
      }
    }
  },
  mounted() {
    this.getShopList({ status: '1' })
    this.getServiceTypeList()
    this.getBranchList()
  },
  methods: {
    getShopList(params) {
      service.chain.shop.shopList(params).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    getBranchList() {
      service.chain.branch.listAll({ status: '1', isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.branchList = res.data
        }
      })
    },
    getServiceTypeList() {
      service.serviceInfo.findServiceType().then(res => {
        this.serviceTypeList = res.data
      })
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    changeBranch(id) {
      this.searchForm.scode = ''
      this.serviceFilterList = []
      this.serviceTypeList.forEach(item => {
        if (id == item.branch) {
          this.serviceFilterList.push(item)
        }
      })
    },
    getProjectPriceList(reqParams) {
      const fetch = service.chain.servicePrice.searchList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      this.$refs['searchForm'].validate(valid => {
        if (!valid) {
          return
        }
        this.pageInfo = { page: 1, limit: 10 }
        this.getProjectPriceList(this.searchForm)
      })
    },
    showSpecialDialog(row) {
      this.specialDialog.title = '员工级别价格'
      this.specialDialog.visible = true
      this.specialDialog.servid = row.id
      this.specialDialog.servname = row.servname
      this.specialDialog.specialRows = []
      if (row.servspecs && row.servspecs.length > 0) {
        row.servspecs.filter(item => {
          this.specialDialog.specialRows.push({ ...item })
        })
      }
    },
    hideSpecialDialog() {
      this.specialDialog.visible = false
    },
    clearFormShop() {
      setTimeout(() => {
        if (this.searchForm.shopid == '') {
          this.searchForm.shopid = ''
          this.filterShopList = Object.assign(this.allShopList)
        }
      }, 300)
    }
  }
}
</script>

<style scoped></style>
