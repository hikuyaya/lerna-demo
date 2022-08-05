<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:55:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-04 15:13:51
 * @FilePath: \personnelweb\src\views\salary-plan\adjust\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="选择员工" prop="eeName">
            <el-input disabled v-model="info.eeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="operateType !== 'detail'" :span="1" class="pd-l-16">
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            :disabled="operateType !== 'add'"
            @click="chooseStaffVisible = true"></el-button>
        </el-col>
        <el-col :span="8">
          <el-form-item label="员工编码" prop="eeCode">
            <el-input disabled v-model="info.eeCode" class="w90"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="账套学习金" class="mg-b-16" />
      <el-row>
        <el-col :span="8">
          <el-form-item label="工资账套" prop="ssCode">
            <el-select
              v-model="info.ssCode"
              filterable
              :disabled="['detail'].includes(operateType)">
              <el-option
                v-for="item in asetofbooksData"
                :key="item.ssCode"
                :label="item.ssName"
                :value="item.ssCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学习金金额" prop="tutje">
            <el-input-number
              v-model="info.tutje"
              :controls="false"
              :min="0"
              class="w90"
              :disabled="['detail'].includes(operateType)" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="已缴纳学习金" prop="tutjeCom">
            <el-input-number
              v-model="info.tutjeCom"
              :controls="false"
              :min="0"
              class="w90"
              :disabled="['detail'].includes(operateType)" />
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="固定项" class="mg-b-16" />
      <el-row>
        <el-col :span="8">
          <el-form-item label="固定项" prop="scCode">
            <el-select
              v-model="info.scCode"
              filterable
              @change="handleScCodeChange"
              :disabled="['detail'].includes(operateType)">
              <el-option
                v-for="item in salcompData"
                :key="item.scCode"
                :label="item.scName"
                :value="item.scCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="固定项金额" prop="money">
            <el-input
              v-model="info.money"
              class="w90"
              :disabled="['detail'].includes(operateType)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="时效" prop="type">
            <el-radio-group
              v-model="info.type"
              :disabled="['detail'].includes(operateType)">
              <el-radio :label="1">临时</el-radio>
              <el-radio :label="2">长期</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            v-show="info.type == 1"
            label="执行开始"
            prop="startTime">
            <el-date-picker
              v-model="info.startTime"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              class="w90"
              :disabled="['detail'].includes(operateType)">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-show="info.type == 1" label="执行结束" prop="endTime">
            <el-date-picker
              v-model="info.endTime"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              class="w90"
              :disabled="['detail'].includes(operateType)">
            </el-date-picker>
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
        @select="handleSelectStaff"></choose-single-item>
    </el-dialog>
  </div>
</template>

<script>
import ChooseSingleItem from '@src/components/business/ChooseSingleItem.vue'
import TitleHeader from '@src/components/base/TitleHeader.vue'
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
    },
    salcompData: {
      type: Array,
      default: function () {
        return []
      }
    },
    asetofbooksData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    ChooseSingleItem,
    TitleHeader
  },
  computed: {},
  data() {
    const validateMoney = (rule, value, callback) => {
      if ('' === value || undefined === value || null === value) {
        callback()
      } else if (value >= 0) {
        callback()
      } else {
        callback(new Error('请输入合法固定项金额'))
      }
    }
    return {
      info: {},
      rules: {
        eeName: [{ required: true, message: '请选择员工' }],
        ssCode: [{ required: true, message: '请选择工资账套' }],
        tutje: [{ required: true, message: '请输入学习金金额' }],
        tutjeCom: [{ required: true, message: '请输入已缴纳学习金' }],
        money: [{ validator: validateMoney }]
      },
      tableData: [],
      chooseStaffVisible: false,
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
          label: '员工姓名', // 标签
          prop: 'eeName', // 绑定的字段
          // label宽度
          type: 'input',
          width: '20%' // 整个组件占的宽度
          // widgetWidth: '200px', // 控件的宽度
          // required: true // 是否必填
        },
        {
          label: '员工编码',
          prop: 'eeCode',
          type: 'input', // 搜索类型
          width: '20%'
        },
        {
          label: '机构编码',
          prop: 'bbCode',
          type: 'input',
          width: '20%'
        },
        {
          label: '机构名称',
          prop: 'bbName',
          type: 'input',
          width: '20%'
        }
      ],
      staffScCodeList: [] // 选择固定项时，到此列表中筛选出来对应对象，如果有则回填固定项金额、时效等
    }
  },
  methods: {
    async handleSelectStaff(staff) {
      console.log(staff)
      let copyStaff = JSON.parse(JSON.stringify(staff))
      const { data: sal } = await service.salaryPlan.adjust.queryEmployeesal({
        eeCode: copyStaff.eeCode,
        isDel: 0
      })

      const { data: staffScCodeList } =
        await service.salaryPlan.adjust.getEmployeesalItem({
          eeCode: copyStaff.eeCode
        })
      this.staffScCodeList = staffScCodeList
      const [eeSal = {}] = sal
      copyStaff.ssCode = eeSal.ssCode
      copyStaff.tutje = eeSal.tutje
      copyStaff.tutjeCom = eeSal.tutjeCom
      copyStaff.shopCode = copyStaff.bbCode
      copyStaff.shopName = copyStaff.bbName
      this.info = copyStaff
      this.chooseStaffVisible = false
    },
    handleScCodeChange(scCode) {
      const item = this.staffScCodeList.find(v => scCode === v.scCode)
      if (!item) {
        return
      }
      const { money, type, startTime, endTime } = item
      this.$set(this.info, 'money', money)
      this.$set(this.info, 'type', type)
      this.$set(this.info, 'startTime', startTime)
      this.$set(this.info, 'endTime', endTime)
    },
    async getData() {
      let result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      // 临时
      if (this.info.type === 1) {
        if (this.info.endTime < this.info.startTime) {
          this.$message.error('执行结束时间不能早于执行开始时间')
          return false
        }
        if (!this.info.endTime || !this.info.startTime) {
          this.$message.error('执行开始时间、执行结束时间不能为空')
          return false
        }
      }
      // 校验通过
      if (result) {
        // 选择长期 删除 开始时间、结束时间
        if (this.info.type === 2) {
          delete this.info.startTime
          delete this.info.endTime
        }
        const {
          eeCode,
          eeName,
          ssCode,
          scCode,
          shopCode,
          shopName,
          money,
          tutje,
          tutjeCom,
          type,
          startTime,
          endTime
        } = this.info
        const { ssName } =
          this.asetofbooksData.find(v => v.ssCode === ssCode) || {}
        const { scName } = this.salcompData.find(v => v.scCode === scCode) || {}
        let params = {
          eeCode,
          eeName,
          ssCode,
          ssName,
          scCode,
          scName,
          money,
          tutje,
          tutjeCom,
          type,
          startTime,
          endTime,
          shopCode,
          shopName
        }
        return this.operateType === 'edit'
          ? { ...params, id: this.info.id }
          : { ...params }
      }
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
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
