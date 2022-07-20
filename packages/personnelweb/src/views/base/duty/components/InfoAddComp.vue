<!--
 * @Author: wqy
 * @Date: 2022-06-22 17:45:13
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-20 10:45:40
 * @FilePath: \personnelweb\src\views\base\duty\components\InfoAddComp.vue
 * @Description: 
-->
<template>
  <div>
    <el-form ref="form" :model="info" inline :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="职务编码" prop="pscode">
            <el-input
              clearable
              v-model="info.pscode"
              :disabled="['detail', 'edit'].includes(operateType)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务名称" prop="psname">
            <el-input
              clearable
              v-model="info.psname"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="同步分发" prop="bbids">
            <el-select
              v-model="info.bbids"
              multiple
              :disabled="['detail', 'edit'].includes(operateType)"
              @change="onBbidsChange">
              <el-option
                v-for="item in deptDataOptions"
                :key="item.id"
                :value="item.id"
                :label="item.bname">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" v-if="operateType !== 'add'">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="info.address"
              :disabled="operateType === 'detail'">
              <el-option
                v-for="(item, index) in statusOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
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
      default: () => ({})
    },
    operateType: {
      type: String
    }
  },
  created() {
    // 获取同步业务组下拉选项
    this.getDeptDataOptions()
  },
  data() {
    const validatePscode = (rule, value, callback) => {
      // 只能输入
      if (!value) {
        callback(new Error('请输入职务编码'))
      } else if (value.length > 10) {
        callback(new Error('职务编码最大输入10位'))
      } else {
        const reg = new RegExp(/^(MF|MR|\d*)\d*$/)
        if (!reg.test(value)) {
          callback(new Error('以MF或MR或数字开头'))
        } else {
          callback()
        }
      }
    }
    return {
      info: {},
      rules: {
        pscode: [{ required: true, validator: validatePscode }],
        psname: [{ required: true, message: '请输入职务名称' }]
      },
      statusOptions: [
        { label: '正常', value: '1' },
        { label: '停用', value: '2' }
      ],
      deptDataOptions: []
    }
  },
  methods: {
    async getDeptDataOptions() {
      const { data, resp_code } = await service.dept.deptAll({
        isDel: '0',
        status: '1'
      })
      this.deptDataOptions = data
    },
    onBbidsChange(ids) {
      // 拼装bbnames
      let bbnames = []
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index]
        const item = this.deptDataOptions.find(d => d.id === id)
        bbnames.push(item.bname)
      }
      this.$set(this.info, 'bbnames', bbnames)
    },
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        let params = {}
        if (this.info.bbids.length) {
          params.bbids = this.info.bbids.join(',')
          params.bbnames = this.info.bbnames.join(',')
        } else {
          params.bbids = null
        }
        return {
          ...this.info,
          ...params
        }
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        const copy = JSON.parse(JSON.stringify(val))
        const info = {
          ...copy,
          bbids: copy.bbids?.split(','),
          bbnames: copy.bbnames?.split(',')
        }
        this.info = info
      }
    }
  }
}
</script>
