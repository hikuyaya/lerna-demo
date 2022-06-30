<!--
 * @Author: wqy
 * @Date: 2022-06-20 17:37:43
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-30 14:26:15
 * @FilePath: \personnelweb\src\views\base\group\components\AddComp.vue
 * @Description: 组织架构 —— 新增、编辑
-->
<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="机构编码" prop="code">
            <el-input
              clearable
              :disabled="operateType === 'edit' || operateType === 'detail'"
              v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级机构" prop="parentCode">
            <!-- <tree-select
              v-model="info.parentCode"
              :props="defaultProps"
              :data="treeData"
              :defaultExpand="false"></tree-select> -->

            <treeselect
              v-model="info.parentId"
              :options="treeData"
              :multiple="false"
              :normalizer="normalizer"
              :clearable="false"
              :disabled="operateType === 'edit' || operateType === 'detail'"
              @select="handleTreeSelect"
              placeholder="请选择"
              noResultsText="查无数据"
              noChildrenText="无子节点" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机构名称" prop="name">
            <el-input
              clearable
              v-model="info.name"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="负责人" prop="director">
            <el-input
              clearable
              v-model="info.director"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人电话" prop="telephone">
            <el-input
              clearable
              v-model="info.telephone"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="info.status"
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
      <el-row>
        <el-col :span="16">
          <el-form-item label="备注" prop="remark">
            <el-input
              clearable
              v-model="info.remark"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="路径编码" prop="date">
            <el-input clearable v-model="info.date"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="是否子公司" prop="isCompany">
            <el-radio
              v-model="info.isCompany"
              :label="1"
              :disabled="operateType === 'detail'"
              >是</el-radio
            >
            <el-radio
              v-model="info.isCompany"
              :label="0"
              :disabled="operateType === 'detail'"
              >否</el-radio
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="地址" prop="address">
            <el-input
              clearable
              v-model="info.address"
              style="width: 100%"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// import TreeSelect from '@src/components/base/TreeSelect.vue'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
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
  created() {
    console.log(this.operateType)
  },
  data() {
    return {
      info: {},
      rules: {
        code: [{ required: true, message: '请输入机构编码' }],
        name: [{ required: true, message: '请输入机构名称' }],
        director: [{ required: true, message: '请输入负责人' }],
        telephone: [{ required: true, message: '请输入负责人电话' }],
        status: [{ required: true, message: '请选择状态' }]
      },
      statusOptions: [
        { label: '正常', value: '1' },
        { label: '停用', value: '2' }
      ],
      defaultProps: {
        children: 'children',
        label: 'oname'
      },
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
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        if (this.treeSelectNode) {
          return {
            ...this.info,
            parentCode: this.treeSelectNode.code
          }
        } else {
          return this.info
        }
      }
    },
    handleTreeSelect(node, instanceId) {
      console.log(node, instanceId)
      this.treeSelectNode = node
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        if (val.parentId === -1) {
          val.parentId = null
        }
        this.info = JSON.parse(JSON.stringify(val))
      }
    }
  }
}
</script>
