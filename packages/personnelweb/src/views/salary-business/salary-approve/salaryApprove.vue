<!--
 * @Author: wqy
 * @Date: 2022-07-21 14:35:08
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-30 16:52:41
 * @FilePath: \lerna-demod:\project\personnelweb\src\views\salary-business\salary-approve\salaryApprove.vue
 * @Description: 
-->

<template>
  <div class="container">
    <div class="content">
      <search-top ref="searchTop" :options="conditions">
        <template #inlineBtn>
          <div class="flex flex-alignitems__center mg-l-12">
            <el-button type="primary" @click="queryList">查询</el-button>
            <template v-if="info.approvalStatus == 2">
              <el-button
                type="primary"
                @click="onBatchOperate('lockApprove', '一键审核锁定')"
                >一键审核锁定</el-button
              >
              <el-button
                type="primary"
                @click="onBatchOperate('unLockApprove', '一键审核解锁')"
                >一键审核解锁</el-button
              >
              <el-button
                type="primary"
                @click="onBatchOperate('lockCalculate', '一键计算锁定')"
                >一键计算锁定</el-button
              >
              <el-button
                type="primary"
                @click="onBatchOperate('unLockCalculate', '一键计算解锁')"
                >一键计算解锁</el-button
              >
              <el-button
                type="primary"
                @click="onBatchOperate('reject', '一键驳回')"
                >一键驳回</el-button
              >
            </template>
          </div>
        </template>
      </search-top>

      <template v-if="info.id">
        <div class="flex info-row">
          <div class="w20"><span>门店名称：</span> {{ info.shopName }}</div>
          <div class="w20">
            <span>申请月份：</span> {{ info.year }}-{{ info.month }}
          </div>
          <div class="w20">
            <span>审核锁定：</span>
            <span class="red bold">
              {{
                info.approvalLockStatus == 1
                  ? '已锁定'
                  : info.approvalLockStatus == 0
                  ? '未锁定'
                  : info.approvalLockStatus
              }}</span
            >
          </div>
          <div class="w20">
            <span>审核状态：</span>
            <span
              class="bold"
              :class="info.approvalStatus == 3 ? 'green' : 'red'"
              >{{
                info.approvalStatus == 1
                  ? '待提交'
                  : info.approvalStatus == 2
                  ? '待审核'
                  : info.approvalStatus == 3
                  ? '已审核'
                  : info.approvalStatus == 0
                  ? '已驳回'
                  : info.approvalStatus
              }}</span
            >
          </div>
        </div>
        <div class="flex info-row">
          <div class="w20"><span>门店编码：</span>{{ info.shopCode }}</div>
          <div class="w20"><span>创建人：</span>{{ info.createdBy }}</div>
          <div class="w20"><span>创建时间：</span>{{ info.createdTime }}</div>
          <div class="w20"><span>审核人：</span>{{ info.approvalEename }}</div>
          <div class="w20"><span>审核时间：</span>{{ info.approvalTime }}</div>
        </div>

        <div
          v-if="info.approvalStatus == 2"
          class="flex flex-alignitems__center mg-l-12">
          <el-button
            type="primary"
            @click="
              onOperate(
                'lockApprove',
                '审核锁定',
                '您是否确认对此门店进行审核锁定？'
              )
            "
            >审核锁定</el-button
          >
          <el-button
            type="primary"
            @click="
              onOperate(
                'lockCalculate',
                '计算锁定',
                '您是否确认对此门店进行计算锁定？'
              )
            "
            >计算锁定</el-button
          >
          <el-button
            type="primary"
            @click="
              onOperate(
                'unLockCalculate',
                '计算解锁',
                '您是否要对此门店进行计算解锁？'
              )
            "
            >计算解锁</el-button
          >
          <el-button
            type="primary"
            @click="
              onOperate(
                'pushSalary',
                '确认公布工资',
                '您确认要公布工资吗？公布工资后门店可查看核对'
              )
            "
            >公布工资</el-button
          >
          <el-button
            type="primary"
            @click="
              onOperate('approve', '确认审核', '您是否要审核此门店的薪酬申请？')
            "
            >审核</el-button
          >
          <el-button type="primary" @click="onReject('reject', '驳回')"
            >驳回</el-button
          >
        </div>

        <yid-table
          :data="tableData"
          ref="table"
          class="mg-t-12"
          :height="tableData.length ? 'calc(100% - 140px)' : ''"
          show-summary
          :summary-method="getSummaries">
          <yid-table-column label="序号" type="index" fixed> </yid-table-column>
          <yid-table-column
            label="员工姓名"
            prop="eeName"
            width="80px"
            fixed></yid-table-column>
          <yid-table-column
            label="员工编码"
            prop="eeCode"
            width="80px"
            fixed></yid-table-column>
          <yid-table-column
            label="职务"
            prop="psName"
            width="100px"
            fixed></yid-table-column>
          <yid-table-column
            label="审核状态"
            prop="approvalStatus"
            width="80px"
            fixed>
            <template slot-scope="scope">
              {{
                scope.row.approvalStatus == 1
                  ? '待提交'
                  : scope.row.approvalStatus == 2
                  ? '待审核'
                  : scope.row.approvalStatus == 3
                  ? '已审核'
                  : scope.row.approvalStatus == 0
                  ? '已驳回'
                  : scope.row.approvalStatus
              }}
            </template>
          </yid-table-column>
          <yid-table-column label="计算状态" prop="isCalc" width="80px" fixed>
            <template slot-scope="scope">
              {{ scope.row.isCalc == 1 ? '已计算' : '未计算' }}
            </template>
          </yid-table-column>

          <yid-table-column
            label="增项工资"
            prop="addMoney"
            width="80px"
            fixed></yid-table-column>
          <yid-table-column
            label="减项工资"
            prop="subMoney"
            width="80px"
            fixed></yid-table-column>
          <yid-table-column
            label="应付工资"
            prop="actualMoney"
            width="80px"
            fixed>
            <template slot-scope="scope">
              <el-link type="primary" @click="onShowDetail(scope.row)">{{
                scope.row.actualMoney
              }}</el-link>
            </template>
          </yid-table-column>

          <yid-table-column
            v-for="column in dynamicColumns"
            :key="column.eeCode"
            :label="column.label"
            :prop="column.code">
            <template slot-scope="scope">
              {{ scope.row[column.label] }}
            </template>
          </yid-table-column>
        </yid-table>
      </template>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="operateCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="500px">
      <operate-comp
        v-if="operateCompVisible"
        ref="operateCompRef"
        :value="{
          year: info.year,
          month: info.month
        }"
        :type="batchOperateType" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">{{ title }}</el-button>
        <el-button @click="operateCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="确认驳回"
      :visible.sync="rejectCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="400px">
      <reject-comp v-if="rejectCompVisible" ref="rejectCompRef" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onRejectSubmit">确 定</el-button>
        <el-button @click="rejectCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="工资条明细"
      :visible.sync="detailCompVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <detail-comp
        v-if="detailCompVisible"
        ref="detailCompRef"
        :content="`您是否要驳回此门店薪酬申请？`"
        :value="selectRow" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailCompVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchTop from '@src/components/base/SearchTop'
import OperateComp from './components/OperateComp'
import RejectComp from '@src/components/business/RejectComp'
import DetailComp from './components/DetailComp'
import service from '@src/service'
import { mapGetters } from 'vuex'
export default {
  components: { SearchTop, OperateComp, RejectComp, DetailComp },
  data() {
    return {
      operateCompVisible: false,
      rejectCompVisible: false,
      detailCompVisible: false,
      batchOperateType: '', // 批量操作时类型
      singleOperateType: '', // 单个操作时类型
      info: {},
      title: '',
      type: '', // approve 或者 remove
      selectRow: {},
      menuId: '',
      conditions: [
        {
          label: '年',
          prop: 'year',
          type: 'input-number',
          labelWidth: '0.8rem',
          controls: false,
          min: 1970,
          max: new Date().getFullYear(),
          width: '15%',
          required: true
        },
        {
          label: '月',
          prop: 'month',
          type: 'input-number',
          labelWidth: '0.8rem',
          width: '15%',
          controls: false,
          min: 1,
          max: 12,
          required: true
        },
        {
          label: '门店编码',
          prop: 'shopCode',
          type: 'input',
          width: '18%',
          placeholder: '门店编码',
          required: true,
          labelWidth: '1.2rem'
        }
      ],
      tableData: [],
      dynamicColumns: [],
      sum: {}, // 合计的数据
      scCodeMoneyTotal: {} // 动态列合计的数据
    }
  },
  computed: {
    ...mapGetters({
      salCompMenus: 'user/salaryBusinessMenu'
    })
  },
  created() {
    const menu = this.salCompMenus.find(
      v => window.location.href.indexOf(v.url) !== -1
    )
    if (!menu) {
      this.$message.error('无对应菜单信息')
      return
    }
    this.menuId = menu.id
  },
  mounted() {},
  methods: {
    queryList() {
      const params = this.$refs.searchTop.getSearchParams()
      let errMsg = ''
      if (!params.year) {
        errMsg = '请输入年'
      } else if (!params.month) {
        errMsg = '请输入月'
      } else if (!params.shopCode) {
        errMsg = '请输入门店编码'
      }
      if (errMsg) {
        this.$message.error(errMsg)
      } else {
        this.onSearch()
      }
    },
    async onSearch() {
      let params = this.$refs.searchTop.getSearchParams()
      delete params.page
      delete params.limit
      const { data } = await service.salaryBusiness.salaryApprove.detail({
        ...params,
        menuId: this.menuId
      })
      const {
        actualMoneyTotal,
        addMoneyTotal,
        subMoneyTotal,
        scCodeMoneyTotal,
        approvalSalaryVO
      } = data
      this.info = approvalSalaryVO
      const { data: tableData, columns } = this.buildDynamic(
        approvalSalaryVO?.salaryList || [],
        'salaryItemVOList'
      )

      this.sum = {
        actualMoneyTotal,
        addMoneyTotal,
        subMoneyTotal
      }
      this.scCodeMoneyTotal = scCodeMoneyTotal

      this.tableData = tableData
      this.dynamicColumns = columns
      console.log(tableData, JSON.parse(JSON.stringify(columns)))
    },
    // 构造动态数据、列
    buildDynamic(data, key) {
      let columns = []
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        for (let j = 0; j < d[key].length; j++) {
          const salItem = d[key][j]
          const label = salItem.scName
          const value = salItem.money || undefined
          const code = salItem.scCode
          d[label] = value
          if (i === 0) {
            columns.push({
              label,
              value,
              inputType: salItem.inputtype,
              signType: salItem.signtype,
              code
            })
          }
        }
      }
      columns.sort((prev, next) => prev.inputType - next.inputType)
      const inputType1 = this.sortSignType(
        columns.filter(v => v.inputType === 1)
      )
      const inputType2 = this.sortSignType(
        columns.filter(v => v.inputType === 2)
      )
      const inputType3 = this.sortSignType(
        columns.filter(v => v.inputType === 3)
      )

      return {
        columns: [...inputType1, ...inputType2, ...inputType3],
        data
      }
    },
    sortSignType(columns) {
      return columns.sort((prev, next) => next.signType - prev.signType)
    },
    // getSummaries(param) {
    //   const { columns, data } = param
    //   const sums = []
    //   columns.forEach((column, index) => {
    //     if (index <= 4) {
    //       sums[index] = ''
    //       return
    //     } else if (index === 5) {
    //       sums[index] = '合计'
    //       return
    //     }
    //     const values = data.map(item => Number(item[column.property]))
    //     if (!values.every(value => isNaN(value))) {
    //       sums[index] = values.reduce((prev, curr) => {
    //         const value = Number(curr)
    //         if (!isNaN(value)) {
    //           return prev + curr
    //         } else {
    //           return prev
    //         }
    //       }, 0)
    //       //   sums[index] += ' 元'
    //     } else {
    //       sums[index] = ''
    //     }
    //   })
    //   return sums
    // },
    getSummaries(param) {
      const that = this
      const { columns } = param
      const map = {
        5: '合计',
        6: this.sum.addMoneyTotal,
        7: this.sum.subMoneyTotal,
        8: this.sum.actualMoneyTotal
      }
      const sums = []
      columns.forEach((column, index) => {
        if (index < 5) {
          sums[index] = ''
          return
        } else if ([5, 6, 7, 8].includes(index)) {
          sums[index] = map[index]
          return
        }
        sums[index] = that.scCodeMoneyTotal[column.property]
      })

      return sums
    },
    onShowDetail(row) {
      this.selectRow = row
      this.detailCompVisible = true
    },
    // 计算锁定、计算解锁、驳回重新渲染数据
    onBatchOperate(type, title) {
      // lockApprove、unLockApprove、lockCalculate、unLockCalculate、reject
      this.title = title
      this.batchOperateType = type
      this.operateCompVisible = true
    },
    onOperate(type, title, content) {
      this.singleOperateType = type
      this.$confirm(content, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(async () => {
          if (type === 'lockApprove') {
            await service.salaryBusiness.salaryApprove.lockApprove(this.info.id)
          } else if (type === 'lockCalculate') {
            await service.salaryBusiness.salaryApprove.lockCalculate({
              id: this.info.id,
              menuId: this.menuId
            })
          } else if (type === 'unLockCalculate') {
            await service.salaryBusiness.salaryApprove.unLockCalculate({
              id: this.info.id,
              menuId: this.menuId
            })
          } else if (type === 'pushSalary') {
            await service.salaryBusiness.salaryApprove.pushSalary(this.info.id)
          } else if (type === 'approve') {
            await service.salaryBusiness.salaryApprove.approve(this.info.id)
          }
          this.$message.success('操作成功')
          await this.queryList()
        })
        .catch(() => {})
    },
    async onSubmit() {
      const result = await this.$refs.operateCompRef.getData()
      if (!result) {
        return
      }
      let count = 0
      if (this.batchOperateType === 'lockApprove') {
        const { data } =
          await service.salaryBusiness.salaryApprove.batchLockApprove(result)
        count = data
      } else if (this.batchOperateType === 'unLockApprove') {
        const { data } =
          await service.salaryBusiness.salaryApprove.batchUnLockApproval(result)
        count = data
      } else if (this.batchOperateType === 'lockCalculate') {
        const { data } =
          await service.salaryBusiness.salaryApprove.batchLockCalculate({
            ...result,
            menuId: this.menuId
          })
        count = data
        if (
          (result.shopType == 1 &&
            this.info.shopCode.toUpperCase().indexOf('MF') != -1) ||
          (result.shopType == 2 &&
            this.info.shopCode.toUpperCase().indexOf('MR') != -1)
        ) {
          for (const i in this.tableData) {
            if (Object.hasOwnProperty.call(this.tableData, i)) {
              this.$set(this.tableData[i], 'isCalc', 1)
            }
          }
        }
      } else if (this.batchOperateType === 'unLockCalculate') {
        const { data } =
          await service.salaryBusiness.salaryApprove.batchUnLockCalculate({
            ...result,
            menuId: this.menuId
          })
        count = data
        if (
          (result.shopType == 1 &&
            this.info.shopCode.toUpperCase().indexOf('MF') != -1) ||
          (result.shopType == 2 &&
            this.info.shopCode.toUpperCase().indexOf('MR') != -1)
        ) {
          for (const i in this.tableData) {
            if (Object.hasOwnProperty.call(this.tableData, i)) {
              this.$set(this.tableData[i], 'isCalc', 0)
            }
          }
        }
      } else if (this.batchOperateType === 'reject') {
        const { data } = await service.salaryBusiness.salaryApprove.batchBack({
          ...result,
          menuId: this.menuId
        })
        count = data
      }
      this.operateCompVisible = false
      await this.$alert(
        `您已成功对<span class="red"> ${count} </span>家门店进行${this.title.substr(
          2
        )}`,
        this.title.substr(2),
        {
          dangerouslyUseHTMLString: true
        }
      )
      // 一键计算锁定 和 一键计算解锁 两个操作不调用后端接口（后端异步操作 查不到最新结果）
      if (
        !['lockCalculate', 'unLockCalculate'].includes(this.batchOperateType)
      ) {
        await this.onSearch()
      }
    },
    onReject(row) {
      this.rejectCompVisible = true
    },
    async onRejectSubmit() {
      const result = await this.$refs.rejectCompRef.getData()
      if (!result) {
        return
      }
      await service.salaryBusiness.salaryApprove.reject({
        id: this.info.id,
        message: result.message
      })
      this.$message.success('操作成功')
      this.rejectCompVisible = false
      // 修改为已驳回状态
      this.info.approvalStatus = 0
      // 刷新列表
      // await this.queryList()
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
    height: 100%;
    .info-row {
      display: flex;
      margin: 12px 24px;
      span {
        text-align: right;
        width: 80px;
        display: inline-block;
      }
    }
  }
}
</style>
