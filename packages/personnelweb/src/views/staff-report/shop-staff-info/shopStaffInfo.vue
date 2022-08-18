<!--
 * @Author: wqy
 * @Date: 2022-08-12 11:32:41
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-18 17:50:35
 * @FilePath: \personnelweb\src\views\staff-report\shop-staff-info\shopStaffInfo.vue
 * @Description: 
-->
<template>
  <div class="container">
    <div class="content">
      <search-top
        ref="searchTop"
        :options="conditions"
        :advanceOptions="advanceConditions"
        @paramsChange="handleParamsChange">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
            <el-button type="primary" @click="onExport">导出</el-button>
          </div>
        </template>
      </search-top>
      <yid-table pagination :data="tableData" ref="table" class="mg-t-12">
        <yid-table-column
          label="员工姓名"
          prop="eeName"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="员工编码"
          prop="eeCode"
          width="120px"
          fixed></yid-table-column>
        <yid-table-column label="性别" prop="sex" width="80px" fixed>
          <template slot-scope="scope">
            {{
              scope.row.sex === 1
                ? '男'
                : scope.row.sex === 2
                ? '女'
                : scope.row.sex
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="年龄"
          prop="age"
          width="80px"
          fixed></yid-table-column>
        <yid-table-column
          label="出生年月"
          prop="birthday"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="手机号"
          prop="mobile"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="学历"
          prop="eduname"
          width="100px"></yid-table-column>
        <yid-table-column
          label="职务"
          prop="positionName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="级别"
          prop="positionLevelName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="级别1"
          prop="level1Name"
          width="100px"></yid-table-column>
        <yid-table-column label="是否股东" prop="shareholder" width="100px">
          <template slot-scope="scope">
            {{
              scope.row.shareholder == 1
                ? '是'
                : scope.row.shareholder == 0
                ? '否'
                : scope.row.shareholder
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="门店编码"
          prop="bbCode"
          width="100px"></yid-table-column>
        <yid-table-column
          label="门店名称"
          prop="bbName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="区"
          prop="areaName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="部"
          prop="deptName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="处"
          prop="regionName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="证件号"
          prop="cardNumber"
          width="100px"></yid-table-column>
        <yid-table-column
          label="证件有效期"
          prop="cardTermValidity"
          width="100px"></yid-table-column>
        <yid-table-column
          label="入职日期"
          prop="entrydate"
          width="100px"></yid-table-column>
        <yid-table-column label="状态" prop="status" width="100px">
          <template slot-scope="scope">
            {{
              scope.row.status == 1
                ? '在职'
                : scope.row.status == 2
                ? '离职'
                : scope.row.status == 3
                ? '长假'
                : scope.row.status
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="试用期结束日期"
          prop="trainingdate"
          width="180px"></yid-table-column>
        <yid-table-column label="合同状态" prop="contractStatus" width="100px">
          <template slot-scope="scope">
            {{
              scope.row.contractStatus == 1
                ? '有效'
                : scope.row.contractStatus == 2
                ? '无效'
                : scope.row.contractStatus == 3
                ? '到期'
                : scope.row.contractStatus == 4
                ? '其它'
                : scope.row.contractStatus
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="合同截止日期"
          prop="htdate"
          width="150px"></yid-table-column>
        <yid-table-column
          label="健康证有效期"
          prop="healthdate"
          width="150px"></yid-table-column>
        <yid-table-column
          label="连续工龄"
          prop="servyear"
          width="100px"></yid-table-column>
        <yid-table-column
          label="延续工龄"
          prop="curservyear"
          width="100px"></yid-table-column>
        <yid-table-column
          label="总工龄"
          prop="sumyear"
          width="100px"></yid-table-column>
        <yid-table-column
          label="紧急联系人"
          prop="emcontacts"
          width="100px"></yid-table-column>
        <yid-table-column
          label="紧急联系人电话"
          prop="emtel"
          width="180px"></yid-table-column>
        <yid-table-column
          label="工资账号"
          prop="bankAccount"
          width="100px"></yid-table-column>
        <yid-table-column
          label="开户银行"
          prop="bankName"
          width="100px"></yid-table-column>
        <yid-table-column label="是否股东" prop="shareholder" width="100px">
          <template slot-scope="scope">
            {{
              scope.row.shareholder == 1
                ? '是'
                : scope.row.shareholder == 0
                ? '否'
                : scope.row.shareholder
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="分红账户"
          prop="fhaccount"
          width="100px"></yid-table-column>
        <yid-table-column label="是否兼职" prop="type" width="80px">
          <template slot-scope="scope">
            {{
              scope.row.type == 1
                ? '正式'
                : scope.row.type == 0
                ? '兼职'
                : scope.row.type
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="家庭住址"
          prop="address"
          width="180px"></yid-table-column>
      </yid-table>
    </div>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import download from '@src/library/http/download'
import service from '@src/service'
import { mapGetters } from 'vuex'
export default {
  components: { SearchTop },
  data() {
    return {
      type: '', // remove or approve
      operateType: 'add',
      selectRow: {},
      conditions: [
        {
          label: '员工姓名',
          prop: 'eeName',
          type: 'input',
          width: '20%'
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input',
          width: '20%'
        }
      ],
      advanceConditions: [
        {
          label: '手机号',
          prop: 'mobile',
          type: 'input',
          width: '20%'
        },
        {
          label: '证件号',
          prop: 'cardNumber',
          type: 'input',
          width: '20%'
        },
        {
          label: '状态',
          prop: 'status',
          type: 'select', // 搜索类型
          width: '20%',
          options: [
            { label: '在职', value: 1 },
            { label: '离职', value: 2 },
            { label: '长假', value: 3 }
          ]
        },
        {
          label: '年龄>',
          prop: 'age',
          type: 'input',
          width: '20%'
        },
        {
          label: '连续工龄>',
          prop: 'servyear',
          type: 'input',
          width: '20%'
        },
        {
          label: '延续工龄>',
          prop: 'curservyear',
          type: 'input',
          width: '20%'
        },
        {
          label: '合同状态',
          prop: 'contractStatus',
          type: 'select', // 搜索类型
          width: '20%',
          options: [
            { label: '有效', value: 1 },
            { label: '无效', value: 2 },
            { label: '到期', value: 3 },
            { label: '其他', value: 4 }
          ]
        },
        {
          label: '职务',
          prop: 'pscode',
          type: 'select', // 搜索类型
          width: '20%',
          options: [],
          emit: true // 需要派发出事件
        },
        {
          label: '级别',
          prop: 'pslcode',
          type: 'select',
          width: '20%',
          options: []
        },
        {
          label: '级别1',
          prop: 'pslcode1',
          type: 'select', // 搜索类型
          width: '20%',
          options: []
        },
        {
          label: '是否股东',
          prop: 'shareholder',
          type: 'select', // 搜索类型
          width: '20%',
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ]
        }
      ],
      tableData: [],
      positionList: [],
      positionLevelList: [],
      positionLevel1List: []
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
      salCompMenus: 'user/salaryBusinessMenu'
    })
  },
  created() {
    this.queryPosition()
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    async queryPosition() {
      const { data } = await service.base.duty.listAll()
      this.positionList = data
      this.buildConditionSelectOptions(this.advanceConditions, 'pscode', data, {
        label: 'psname',
        value: 'pscode'
      })
    },
    async queryLevel(pscode) {
      const { data } = await service.base.duty.positionLevelList({
        pscode,
        page: 1,
        limit: 1000
      })
      this.positionLevelList = data

      this.buildConditionSelectOptions(
        this.advanceConditions,
        'pslcode',
        data,
        {
          label: 'pslname',
          value: 'pslcode'
        }
      )
    },
    async queryLevel1(psCode) {
      const { data } = await service.base.duty.positionLevel1List({
        psCode,
        page: 1,
        limit: 1000
      })
      this.positionLevel1List = data

      this.buildConditionSelectOptions(
        this.advanceConditions,
        'pslcode1',
        data,
        {
          label: 'pslname',
          value: 'pslcode'
        }
      )
    },
    buildConditionSelectOptions(searchConditions, field, data, property) {
      const conditions = searchConditions.find(v => v.prop === field)
      const conditionsIndex = searchConditions.findIndex(v => v.prop === field)
      this.$set(searchConditions, conditionsIndex, {
        ...conditions,
        options: data.map(v => {
          return {
            label: v[property.label],
            value: v[property.value]
          }
        })
      })
    },
    handleParamsChange(val, field) {
      console.log(val, field)
      if (field === 'pscode') {
        if (val) {
          this.queryLevel(val)
          this.queryLevel1(val)
        } else {
          // 清空level和level1
          this.buildConditionSelectOptions(
            this.advanceConditions,
            'pslcode1',
            [],
            {
              label: 'pslname',
              value: 'pslcode'
            }
          )
          this.buildConditionSelectOptions(
            this.advanceConditions,
            'pslcode',
            [],
            {
              label: 'pslname',
              value: 'pslcode'
            }
          )
        }
      }
    },
    onExport() {
      const data = this.$refs.table.getCurData()
      if (!data.length) {
        this.$message.error('暂无数据可以导出')
        return
      }
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      params.bbCode = this.userInfo.shopcode
      download(
        `${this.$yid.config.API.BASE}api-pers/employeeotherinfo/expHemployeeInfos`,
        params
      )
    },
    onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      params.bbCode = this.userInfo.shopcode
      const fetch = service.staffReport.shopStaffInfo.list
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    async onReset() {
      this.$refs.searchTop.reset()
      this.onSearch()
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  // display: flex;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .content {
    // flex: 1;
  }
}
</style>
