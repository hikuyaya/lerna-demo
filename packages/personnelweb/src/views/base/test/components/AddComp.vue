<!--
 * @Author: wqy
 * @Date: 2022-06-17 15:31:18
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-17 15:58:56
 * @FilePath: \personnelweb\src\views\base\test\components\AddComp.vue
 * @Description: 
-->
<template>
  <div>
    <el-form :model="info" inline :rules="rules">
      <el-row>
        <el-col :span="8">
          <el-form-item label="机构编码" prop="name">
            <el-input clearable v-model="info.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机构名称" prop="date">
            <el-input clearable v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机构编码" prop="address">
            <el-input clearable v-model="info.address"></el-input>
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
