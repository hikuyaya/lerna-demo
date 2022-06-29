<!--
 * @Author: wqy
 * @Date: 2022-06-22 17:45:13
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-27 10:58:20
 * @FilePath: \personnelweb\src\views\base\duty\components\InfoAddComp.vue
 * @Description: 
-->
<template>
  <div>
    <el-form :model="info" inline :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="职务编码" prop="name">
            <el-input clearable v-model="info.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="职务名称" prop="date">
            <el-input clearable v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="同步分发" prop="address">
            <el-select v-model="info.address">
              <el-option
                v-for="(item, index) in options"
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
