<!--
 * @Author: wqy
 * @Date: 2022-08-10 10:57:37
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-10 11:16:51
 * @FilePath: \personnelweb\src\views\salary-business\special-approve\components\ApproveComp.vue
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
              :controls="false"
              :min="1970"
              :max="maxYear"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="月" prop="month">
            <el-input-number
              v-model="info.month"
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
      <el-row>
        <el-col :span="24">
          <p class="orange tac">
            *一键审核可将对应月份、门店类型下所有待审核门店进行审核*
          </p>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {},
  computed: {
    maxYear: function () {
      return new Date().getFullYear()
    }
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
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        return this.info
      }
    }
  }
}
</script>
