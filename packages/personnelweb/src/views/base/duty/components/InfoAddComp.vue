<!--
 * @Author: wqy
 * @Date: 2022-06-22 17:45:13
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-30 15:19:02
 * @FilePath: \personnelweb\src\views\base\duty\components\InfoAddComp.vue
 * @Description: 
-->
<template>
  <div>
    <el-form :model="info" inline :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="职务编码" prop="name">
            <el-input
              clearable
              v-model="info.name"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务名称" prop="date">
            <el-input
              clearable
              v-model="info.date"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="同步分发" prop="address">
            <el-select
              v-model="info.address"
              :disabled="operateType === 'detail'">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="operateType !== 'add'">
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
        </el-col>
      </el-row>
      <!-- <el-form-item label="机构编码" prop="shopid">
        <el-input clearable v-model="info.shopid"></el-input>
      </el-form-item>
      <el-form-item label="机构编码" prop="shopid">
        <el-input clearable v-model="info.shopid"></el-input>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
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
  data() {
    return {
      info: {},
      rules: {
        shopid: [{ required: true, message: '请输入机构编码' }],
        shopname: [{ required: true, message: '请输入机构名称' }]
      },
      options: [
        { label: '美容', value: '' },
        { label: '美发', value: '' },
        { label: '美容 + 美发', value: '' }
      ],
      statusOptions: [
        { label: '正常', value: '1' },
        { label: '停用', value: '2' }
      ]
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
