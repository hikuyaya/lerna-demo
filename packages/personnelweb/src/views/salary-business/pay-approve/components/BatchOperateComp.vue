<!--
 * @Author: wqy
 * @Date: 2022-08-10 11:34:01
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-15 17:31:28
 * @FilePath: \personnelweb\src\views\salary-business\pay-approve\components\BatchOperateComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="年" prop="year">
            <el-input-number
              v-model="info.year"
              placeholder="请输入年"
              :controls="false"
              :min="1970"
              :max="maxYear"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="月" prop="month">
            <el-input-number
              v-model="info.month"
              placeholder="请输入月"
              :controls="false"
              :min="1"
              :max="12"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店类型" prop="shopType">
            <el-select v-model="info.shopType">
              <el-option label="美发门店" :value="1"></el-option>
              <el-option label="美容门店" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="type === 'reject'">
        <el-col :span="24">
          <el-form-item label="驳回原因" prop="message">
            <el-input
              v-model="info.message"
              class="w100"
              placeholder="输入驳回原因" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p class="orange tac">
            {{
              type === 'reject'
                ? '*一键驳回表示驳回选定的门店类型中所有待审核且计算锁定为未锁定的门店*'
                : type === 'lockApprove'
                ? '*一键审核锁定针对选定门店类型中所有提交申请的门店，但不包括驳回、未提交、已审核的门店*'
                : type === 'unLockApprove'
                ? '*一键审核解锁针对所有审核锁定的门店，但不包括驳回、未提交、已审核的门店*'
                : type === 'lockCalculate'
                ? '*一键计算锁定针对选定门店类型中所有提交申请状态为“待审核”的门店'
                : type === 'unLockCalculate'
                ? '*一键计算解锁针对所有选定门店类型下的所有计算锁定的门店，但不包括驳回未提交以及已审核的门店*'
                : type === 'lock' // 薪酬打款复核 —— 一键锁定
                ? '*一键锁定可将对应月份、门店类型下所有门店进行锁定，锁定后门店不可驳回*'
                : type === 'unLock' // 薪酬打款复核 —— 一键解锁
                ? '*一键解锁可将对应月份、门店类型下所有门店进行解锁，解锁后门店可进行驳回*'
                : ''
            }}
          </p>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    shopType: Number,
    type: {
      type: String
    }
  },
  computed: {
    maxYear: function () {
      return new Date().getFullYear()
    }
  },
  created() {
    this.initData()
  },
  data() {
    return {
      info: {},
      rules: {
        year: [{ required: true, message: '请输入年' }],
        month: [{ required: true, message: '请输入月' }],
        shopType: [{ required: true, message: '请选择门店类型' }]
      },
      tableData: []
    }
  },
  methods: {
    initData() {
      this.initDate()
      console.log('this.shopType', this.shopType)
      this.info.shopType = this.shopType
    },
    initDate() {
      let date = moment(new Date()).subtract(1, 'months').format('YYYY-M')
      const [year, month] = date.split('-')
      this.info = {
        year,
        month
      }
    },
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        return this.info
      }
    }
  },
  watch: {
    value: {
      //
    }
  }
}
</script>
