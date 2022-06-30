<!--
 * @Author: wqy
 * @Date: 2022-06-22 14:26:01
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-30 14:14:26
 * @FilePath: \personnelweb\src\views\base\station\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="组织" prop="code">
            <!-- <tree-select
              v-model="info.parentCode"
              :props="defaultProps"
              :data="treeData"
              :defaultExpand="false"></tree-select> -->
            <treeselect
              v-model="info.code"
              :options="treeData"
              :multiple="false"
              :normalizer="normalizer"
              :clearable="false"
              @select="handleTreeSelect"
              placeholder="请选择"
              noResultsText="查无数据"
              noChildrenText="无子节点" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务" prop="duty">
            <el-select v-model="info.duty" @change="handleSelect">
              <el-option
                v-for="(item, index) in dutyOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位名称" prop="stationName">
            <el-input v-model="info.stationName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位编码" prop="date">
            <el-input clearable v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

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
    },
    treeData: Array
  },
  components: {
    Treeselect
  },
  data() {
    return {
      info: {},
      rules: {
        code: [{ required: true, message: '请输入机构编码' }],
        name: [{ required: true, message: '请输入机构名称' }],
        duty: [{ required: true, message: '请选择职务' }]
      },
      dutyOptions: [
        { label: '正常', value: 1 },
        { label: '停用', value: 0 }
      ],
      defaultProps: {
        children: 'children',
        label: 'oname'
      },
      treeSelectNode: null,
      normalizer(node) {
        return {
          id: node.id,
          label: node.oname,
          children: node.children
        }
      }
    }
  },
  methods: {
    handleSelect(selectedValue) {
      console.log('changes', selectedValue)
    },
    // stationNameChange(val) {
    //   console.log(val)
    //   this.info.
    // }
    handleTreeSelect(node, instanceId) {
      console.log(node, instanceId)
      this.treeSelectNode = node
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    },
    'info.code': {
      handler: function (val) {
        console.log(val, this.treeSelectNode)
        this.info.stationName = `${this.treeSelectNode.oname}${
          this.info.duty || ''
        }`
      }
    },
    'info.duty': {
      handler: function (val) {
        this.info.stationName = `${this.treeSelectNode.oname || ''}${val}`
      }
    }
  }
}
</script>
