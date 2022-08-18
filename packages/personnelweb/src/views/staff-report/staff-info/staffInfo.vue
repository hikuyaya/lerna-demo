<!--
 * @Author: wqy
 * @Date: 2022-08-12 11:32:53
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-18 17:50:49
 * @FilePath: \personnelweb\src\views\staff-report\staff-info\staffInfo.vue
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
          label="职务"
          prop="positionName"
          width="100px"
          fixed></yid-table-column>
        <yid-table-column
          label="级别"
          prop="positionLevelName"
          width="100px"></yid-table-column>
        <yid-table-column
          label="级别1"
          prop="level1Name"
          width="100px"></yid-table-column>

        <yid-table-column
          label="编码"
          prop="bbCode"
          width="100px"></yid-table-column>
        <yid-table-column
          label="名称"
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
        <yid-table-column label="离职原因" prop="resignationCode" width="100px">
          <template slot-scope="scope">
            {{
              scope.row.resignationCode == '01'
                ? '正常离职'
                : scope.row.resignationCode == '02'
                ? '无业绩离职'
                : scope.row.resignationCode == '03'
                ? '分店报离'
                : scope.row.resignationCode
            }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="离职日期"
          prop="resignationDate"
          width="180px"></yid-table-column>
        <yid-table-column
          label="籍贯"
          prop="origin"
          width="100px"></yid-table-column>
        <yid-table-column
          label="学历"
          prop="eduname"
          width="100px"></yid-table-column>
        <yid-table-column
          label="毕业院校"
          prop="graduated"
          width="100px"></yid-table-column>
        <yid-table-column
          label="专业"
          prop="professional"
          width="100px"></yid-table-column>
        <yid-table-column
          label="资格证书"
          prop="certificate"
          width="100px"></yid-table-column>
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
          width="120px"></yid-table-column>
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
          label="标签"
          prop="inductionwayName"
          width="100px"></yid-table-column>

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
import moment from 'moment'
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
          label: '机构类型',
          prop: 'orgtype',
          type: 'select',
          width: '20%',
          options: [
            { label: '管理处', value: 0 },
            { label: '美发门店', value: 1 },
            { label: '美容门店', value: 2 }
          ]
        },
        {
          label: '编码',
          prop: 'bbCode',
          type: 'input',
          width: '20%',
          placeholder: '机构编码/门店编码'
        },
        {
          label: '名称',
          prop: 'bbName',
          type: 'input',
          width: '20%',
          placeholder: '机构名称/门店名称'
        },
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
          label: '入职日期',
          prop: 'entryDate',
          type: 'daterange',
          width: '30%'
        },
        {
          label: '离职日期',
          prop: 'resignationDate',
          type: 'daterange',
          width: '30%'
        },
        {
          label: '离职原因',
          prop: 'resignationCode',
          type: 'select',
          width: '20%',
          options: [
            { label: '正常离职', value: '01' },
            { label: '无业绩离职', value: '02' },
            { label: '分店报离', value: '03' }
          ]
        },
        {
          label: '标签',
          prop: 'inductionwayCode',
          type: 'select',
          width: '20%',
          options: []
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
          label: '性别',
          prop: 'sex',
          type: 'select', // 搜索类型
          width: '20%',
          options: [
            { label: '男', value: 1 },
            { label: '女', value: 2 }
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
    this.queryTag()
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.onSearch()
    },
    async queryTag() {
      const { data } = await service.studyFund.tag.all()
      this.buildConditionSelectOptions(
        this.advanceConditions,
        'inductionwayCode',
        data,
        {
          label: 'name',
          value: 'code'
        }
      )
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
      const dateInThreeMonth = function (date) {
        const [start, end] = date
        const days = moment(end).diff(moment(start), 'day')
        if (days > 90) {
          return false
        }
        return true
      }
      if (
        params.bbCode ||
        (params.entryDate?.length && dateInThreeMonth(params.entryDate)) ||
        (params.resignationDate?.length &&
          dateInThreeMonth(params.resignationDate))
      ) {
        params = this.buildParams()
        download(
          `${this.$yid.config.API.BASE}api-pers/employeeotherinfo/expHemployeeInfos`,
          params
        )
      } else {
        this.$message.error(
          '导出时门店编码、入职日期区间、离职日期区间三个条件必须输入一个，且日期区间不得超过3个月！'
        )
      }
    },
    buildParams() {
      let params = this.$refs.searchTop.getSearchParams()
      params.limit = this.$refs.table.Pagination.internalPageSize
      if (params.entryDate && params.entryDate.length) {
        const [entrydateStart, entrydateEnd] = params.entryDate
        params.entrydateStart = entrydateStart
        params.entrydateEnd = entrydateEnd
      }
      delete params.entryDate
      if (params.resignationDate && params.resignationDate.length) {
        const [resignationStart, resignationEnd] = params.resignationDate
        params.resignationStart = resignationStart
        params.resignationEnd = resignationEnd
      }
      delete params.resignationDate
      return params
    },
    onSearch() {
      let params = this.buildParams()
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
