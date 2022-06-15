<template>
  <div class="checkProducts">
    <el-form :model="searchForm" inline ref="searchForm">
      <el-form-item label="产品编码：" prop="pcode">
        <el-input
          clearable
          autofocus
          placeholder="产品编码"
          v-model.trim="searchForm.pcode"
          style="width: 130px"></el-input>
      </el-form-item>
      <el-form-item label="产品品牌：" prop="brand">
        <el-select
          clearable
          filterable
          placeholder="请选择产品品牌"
          style="width: 140px"
          v-model.trim="searchForm.brand">
          <el-option
            v-for="item in branList"
            :key="item.id"
            :label="item.bname"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品品类：" prop="categrory">
        <el-select
          clearable
          value-key="id"
          filterable
          placeholder="请选择"
          v-model.trim="searchForm.categrory">
          <el-option-group
            v-for="group in categroryList"
            :key="group.id"
            :label="group.cname">
            <el-option
              v-for="item in group.categroryListz"
              :key="item.id"
              :label="item.cname"
              :value="item.id"></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="search" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <yid-table
      pagination
      ref="table"
      style="margin-top: 15px"
      @selection-change="handleSelectionChange">
      <yid-table-column type="selection" width="55"></yid-table-column>
      <yid-table-column
        label="产品编码"
        width="100"
        prop="pcode"></yid-table-column>
      <yid-table-column label="产品名称" prop="pname"></yid-table-column>
      <yid-table-column label="品牌" prop="bname"> </yid-table-column>
      <yid-table-column label="类别" prop="cname"> </yid-table-column>
      <yid-table-column label="规格" prop="norms"></yid-table-column>
      <yid-table-column label="库存数量" min-width="80" prop="total">
        <template slot-scope="scope">
          {{ getStock(scope.row) }}
        </template>
      </yid-table-column>
    </yid-table>
    <el-row style="text-align: center">
      <el-button type="primary" @click="closedialogProduct">确定</el-button>
    </el-row>
  </div>
</template>
<script>
import service from '@src/service'
export default {
  name: 'checkProducts',
  data: function () {
    return {
      searchForm: {
        pcode: '',
        brand: '',
        categrory: ''
      },
      pageInfo: { page: 0, limit: 10 },
      branList: [],
      categoryList: [],
      categroryList: [],
      selectProducts: [],
      fromType: '',
      productList: [] //入库的时候用
    }
  },
  mounted() {
    this.getData()
    this.getBrandList()
    this.getCategroryList()
  },

  methods: {
    async initData(type) {
      this.fromType = type
      this.searchForm = {
        pcode: '',
        brand: '',
        categrory: ''
      }
      ;(this.pageInfo = { page: 0, limit: 10 }),
        (this.branList = []),
        (this.selectProducts = [])

      if (this.fromType == service.stock.dictInout.inType) {
        await this.getProductListFromStock()
      }

      this.getData()
    },
    closedialogProduct() {
      // this.$refs.table.clearSelection();
      this.$emit('onClose', this.selectProducts)
    },
    getData(reqParams) {
      if (this.fromType == service.stock.dictInout.outType) {
        //出库
        const fetch = service.stock.product.list
        const params = { ...this.pageInfo, ...reqParams, status: '1' }
        this.$refs.table.reloadData({
          fetch,
          params
        })
      } else {
        //入库 请求的是base product
        const fetch = service.base.product.productInList
        const params = { ...this.pageInfo, ...reqParams, status: '1' }
        this.$refs.table.reloadData({
          fetch,
          params
        })
      }
    },
    getBrandList() {
      service.productBrand.alllist({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.branList = res.data
        }
      })
    },
    getCategroryList() {
      service.productCategory.allfz({ level: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.categroryList = res.data
        }
      })
    },
    getProductListFromStock() {
      service.stock.product.allList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.productList = res.data
        }
      })
    },
    search() {
      this.pageInfo.page = 0
      this.getData(this.searchForm)
    },
    handleSelectionChange(rows) {
      this.selectProducts = rows
    },
    getStock(row) {
      if (this.fromType == service.stock.dictInout.outType) {
        return row.stock
      }

      for (let i = 0; i < this.productList.length; i++) {
        let obj = this.productList[i]
        if (obj.pid == row.id) {
          row.stock = obj.stock
          return obj.stock
        }
      }
      return '0'
    }
  }
}
</script>
<style></style>
