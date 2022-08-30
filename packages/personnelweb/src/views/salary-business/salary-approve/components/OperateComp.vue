<!--
 * @Author: wqy
 * @Date: 2022-08-10 11:34:01
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-30 09:42:03
 * @FilePath: \personnelweb\src\views\salary-business\salary-approve\components\OperateComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请月份">
            {{ info.year }}-{{ info.month }}
          </el-form-item>
        </el-col>
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
                : ''
            }}
          </p>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    type: {
      type: String
    }
  },
  computed: {
    maxYear: function () {
      return new Date().getFullYear()
    }
  },
  data() {
    return {
      info: {},
      rules: {
        shopType: [{ required: true, message: '请选择门店类型' }],
        message: [{ required: true, message: '请输入驳回原因' }]
      },
      tableData: []
    }
  },
  methods: {
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
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    }
  }
}
</script>
