<!--
 * @Author: wqy
 * @Date: 2022-08-07 11:18:18
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-07 13:38:14
 * @FilePath: \personnelweb\src\views\study-fund\tag\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="info.name" class="w90"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计算学习金" prop="isxxj">
            <el-select v-model="info.isxxj">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="info.remark" class="w90"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="operateType !== 'add'">
          <el-form-item label="编码" prop="code">
            <el-input v-model="info.code" disabled></el-input>
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
  components: {},
  data() {
    return {
      info: {},
      rules: {
        name: [{ required: true, message: '请输入名称' }],
        isxxj: [{ required: true, message: '请选择' }]
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
        let copyVal = JSON.parse(JSON.stringify(val))
        this.info = copyVal
      }
    }
  }
}
</script>
