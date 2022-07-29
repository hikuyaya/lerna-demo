<!--
 * @Author: wqy
 * @Date: 2022-07-22 14:38:14
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-29 09:32:05
 * @FilePath: \personnelweb\src\views\salary-setting\special\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="speName">
            <el-input v-model="info.speName" class="w100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="适用门店" prop="type">
            <el-select v-model="info.type" class="w100">
              <el-option label="美容门店" :value="1"></el-option>
              <el-option label="美发门店" :value="2"></el-option>
              <el-option label="所有门店" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="info.remark" class="w100" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="operateType === 'edit'">
          <el-form-item label="状态" prop="status">
            <el-select v-model="info.status">
              <el-option label="正常" value="1"></el-option>
              <el-option label="停用" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
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
  data() {
    return {
      info: {},
      chooseMultipleVisible: false,
      rules: {
        speName: [{ required: true, message: '请输入特殊工资名称' }],
        type: [{ required: true, message: '请选择适用门店' }]
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
        const status = this.info.status ? this.info.status : 1
        return {
          ...this.info,
          status
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
    }
  }
}
</script>
