<!--
 * @Author: wqy
 * @Date: 2022-06-20 17:37:43
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-22 14:23:07
 * @FilePath: \personnelweb\src\views\base\group\components\AddComp.vue
 * @Description: 组织架构 —— 新增、编辑
-->
<template>
  <div>
    <el-form :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="机构编码" prop="code">
            <el-input clearable v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级机构" prop="parentCode">
            <tree-select
              v-model="info.parentCode"
              :props="defaultProps"
              :data="treeData"
              :defaultExpand="false"></tree-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机构名称" prop="name">
            <el-input clearable v-model="info.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="负责人" prop="name">
            <el-input clearable v-model="info.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人电话" prop="date">
            <el-input clearable v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="address">
            <el-select v-model="info.date">
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
      <el-row>
        <el-col :span="8">
          <el-form-item label="备注" prop="name">
            <el-input clearable v-model="info.name"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="路径编码" prop="date">
            <el-input clearable v-model="info.date"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="是否子公司" prop="address">
            <el-radio v-model="info.name" label="1">是</el-radio>
            <el-radio v-model="info.name" label="0">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="地址" prop="name">
            <el-input
              clearable
              v-model="info.name"
              style="width: 100%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import TreeSelect from '@src/components/base/TreeSelect.vue'
export default {
  components: { TreeSelect },
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
    treeData: Array
  },
  data() {
    return {
      info: {},
      rules: {
        code: [{ required: true, message: '请输入机构编码' }],
        name: [{ required: true, message: '请输入机构名称' }]
      },
      statusOptions: [
        { label: '正常', value: 1 },
        { label: '停用', value: 0 }
      ],
      defaultProps: {
        children: 'children',
        label: 'oname'
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
