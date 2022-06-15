<template>
  <div>
    <el-form ref="searchForm" inline :model="searchForm">
      <el-form-item label="单据编码：" prop="billcode" label-width="100px">
        <el-input
          clearable
          v-model="searchForm.billcode"
          placeholder="单据编码"
          style="width: 180px"></el-input>
      </el-form-item>
      <el-form-item label="审核人：" prop="code" label-width="100px">
        <el-input
          clearable
          v-model="searchForm.auditBy"
          placeholder="审核人"
          style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="审核日期：" prop="sTimeRange" label-width="100px">
        <div class="block">
          <el-date-picker
            :clearable="true"
            v-model="searchForm.auditTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="单据状态：" prop="status">
        <el-select
          style="width: 100px"
          v-model="searchForm.status"
          clearable
          placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="门店：" label-width="100px">
        <el-select
          @clear="clearFormSelect('shop', 'shopid')"
          clearable
          v-model.trim="searchForm.shopid"
          filterable
          :filter-method="dicList.shop.filterFunc"
          placeholder="请选择"
          style="width: 180px">
          <el-option
            :key="item.id"
            :label="item.shopname"
            :value="item.id"
            v-for="item in dicList.shop.filter">
            <span style="float: left">{{ item.shopcode }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.shopname
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年月：" prop="yearmonth" label-width="100px">
        <div class="block">
          <el-date-picker
            :clearable="true"
            style="width: 150px"
            v-model="searchForm.yearmonth"
            type="month"
            fromat="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="年月">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="项目：" label-width="100px">
        <el-select
          @clear="clearFormSelect('dj', 'djid')"
          clearable
          v-model.trim="searchForm.djid"
          filterable
          :filter-method="dicList.dj.filterFunc"
          placeholder="请选择"
          style="width: 220px">
          <el-option
            :key="item.id"
            :label="item.name"
            :value="item.id"
            v-for="item in dicList.dj.filter">
            <span style="float: left">{{ item.code }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.name
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="search" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import service from '@src/service'

export default {
  name: 'billSearchForm',
  props: { searchFunc: { type: Function, default: null } },
  data() {
    return {
      searchForm: {
        billcode: '',
        auditBy: '',
        status: '',
        auditTimeRange: [],
        shopid: '',
        yearmonth: '',
        djid: ''
      },
      statusList: [
        {
          value: '1',
          label: '未提交'
        },
        {
          value: '2',
          label: '已提交'
        },
        {
          value: '3',
          label: '已审批'
        },
        {
          value: '4',
          label: '已复核'
        },
        {
          value: '9',
          label: '已作废'
        },
        {
          value: '0',
          label: '已驳回'
        }
      ],
      dicList: {
        shop: {
          all: [],
          filter: [],
          filterFunc: v =>
            this.filterSelect(v, ['shopname', 'shopcode'], 'shop')
        },
        dj: {
          all: [],
          filter: [],
          filterFunc: v => this.filterSelect(v, ['code', 'name'], 'dj')
        }
      }
    }
  },
  mounted() {
    this.getShopList()
    this.getDicDjList()
  },
  computed: {
    searchFormReq: function () {
      let reqObj = Object.assign(this.searchForm)
      if (reqObj.auditTimeRange) {
        reqObj.auditTimeStart = reqObj.auditTimeRange[0]
        reqObj.auditTimeEnd = reqObj.auditTimeRange[1]
      } else {
        reqObj.auditTimeStart = ''
        reqObj.auditTimeEnd = ''
      }
      return reqObj
    }
  },
  methods: {
    search() {
      console.log('method:search', this.searchForm)
      this.searchFunc(this.searchForm)
    },
    clearFormSelect(dicname, colnum) {
      this.searchForm[colnum] = ''
      this.dicList[dicname].filter = Object.assign(this.dicList[dicname].all)
    },
    filterSelect(v, colnums, tableName) {
      this.dicList[tableName].filter = this.dicList[tableName].all.filter(
        item => {
          let flag = false
          colnums.forEach(colnum => {
            if (item[colnum].indexOf(v) !== -1) flag = true
          })
          return flag
        }
      )
    },
    getDicDjList() {
      service.finance.dicDjitem
        .listAll({ isDel: '0', isDkdj: '1' })
        .then(res => {
          if (res.resp_code == 200) {
            this.dicList.dj.filter = res.data
            this.dicList.dj.all = Object.assign(this.dicList.dj.filter) //保留原数据
          }
        })
    },
    getShopList() {
      service.chain.shop.shopList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.dicList.shop.filter = res.data
          this.dicList.shop.all = Object.assign(this.dicList.shop.filter) //保留原数据
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
