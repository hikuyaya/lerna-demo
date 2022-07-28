<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:55:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-28 10:35:10
 * @FilePath: \personnelweb\src\views\salary-plan\company-limit\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="员工姓名" prop="eeName">
            <el-input disabled v-model="info.eeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="operateType !== 'detail'" :span="1" class="pd-l-16">
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="chooseStaffVisible = true"></el-button>
        </el-col>
        <el-col :span="12">
          <el-form-item label="员工编码" prop="eeCode">
            <el-input disabled v-model="info.eeCode" class="w90"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择年月" prop="date">
            <el-date-picker
              v-model="info.date"
              type="month"
              format="yyyy年MM月"
              placement="bottom"
              value-format="yyyy-MM"
              class="w90">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对公打款" prop="money">
            <el-input-number
              v-model="info.money"
              :controls="false"
              :min="0"
              class="w90" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      title="选择人员"
      :visible.sync="chooseStaffVisible"
      :close-on-click-modal="false"
      append-to-body
      width="1200px">
      <choose-single-item
        v-if="chooseStaffVisible"
        :columns="chooseStaffColumns"
        :actionUrl="chooseSingleStaffActionUrl"
        :conditions="chooseStaffConditions"
        :defaultParams="defaultParams"
        @select="handleSelectStaff"></choose-single-item>
    </el-dialog>
  </div>
</template>

<script>
import ChooseSingleItem from '@src/components/business/ChooseSingleItem.vue'
import service from '@src/service'
export default {
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    operateType: {
      type: String
    }
  },
  components: {
    ChooseSingleItem
  },
  computed: {},
  data() {
    return {
      info: {},
      tableData: [],
      chooseStaffVisible: false,
      defaultParams: {
        searchType: 2
      },
      rules: {
        eeName: [{ required: true, message: '请选择员工' }],
        eeCode: [{ required: true, message: '请选择员工' }],
        date: [{ required: true, message: '请选择年月' }],
        money: [{ required: true, message: '请输入对公款' }]
      },
      chooseStaffColumns: [
        { label: '员工姓名', prop: 'eeName' },
        { label: '员工编码', prop: 'eeCode' },
        { label: '岗位名称', prop: 'postName' },
        { label: '门店编码', prop: 'bbCode' },
        { label: '门店名称', prop: 'bbName' },
        { label: '职务', prop: 'positionName' },
        { label: '级别', prop: 'positionLevelName' },
        { label: '级别1', prop: 'level1Name' }
      ],
      chooseSingleStaffActionUrl: service.staff.level.getByEeCode,
      chooseStaffConditions: [
        {
          label: '门店编码',
          prop: 'bbCode',
          type: 'input',
          width: '30%'
        },
        {
          label: '门店名称',
          prop: 'bbName',
          type: 'input',
          width: '30%'
        }
      ]
    }
  },
  methods: {
    handleSelectStaff(item) {
      console.log(item)
      this.info = {
        shopName: item.bbName,
        shopCode: item.bbCode,
        eeName: item.eeName,
        eeCode: item.eeCode
      }
      this.chooseStaffVisible = false
    },
    handleAfStatusChange(val) {
      const copy = this.tableData[0]
      if ([1, 3].includes(val)) {
        // 在职、长假 清空离职原因
        copy.maintenanceLeave = ''
      }
      this.tableData = [copy]
    },
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        const [effectYear, effectMonth] = this.info.date.split('-')
        return {
          ...this.info,
          effectYear,
          effectMonth
        }
      }
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    },
    'info.sx': {
      handler: function (val) {
        if (val == 1) {
          //
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.font-size-22px {
  font-size: 22px;
}
</style>
