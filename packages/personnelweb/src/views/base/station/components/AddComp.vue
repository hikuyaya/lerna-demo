<!--
 * @Author: wqy
 * @Date: 2022-06-22 14:26:01
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-31 10:45:25
 * @FilePath: \lerna-demod:\project\personnelweb\src\views\base\station\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="组织" prop="bbCode">
            <treeselect
              v-model="info.bbCode"
              :options="treeData"
              :multiple="false"
              :normalizer="normalizer"
              :clearable="false"
              @select="handleTreeSelect"
              placeholder="请选择"
              noResultsText="查无数据"
              noChildrenText="无子节点"
              :disabled="operateType !== 'add'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务" prop="positionCode">
            <el-select
              v-model="info.positionCode"
              @change="handleSelectPosition"
              filterable
              :disabled="operateType !== 'add'"
              class="w100">
              <el-option
                v-for="(item, index) in positionList"
                :key="index"
                :label="item.psname"
                :value="item.pscode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位名称" prop="postName">
            <el-input
              v-model="info.postName"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="operateType !== 'add'">
          <el-form-item label="岗位编码" prop="postCode">
            <el-input
              v-model="info.postCode"
              :disabled="operateType !== 'add'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="职务编码" v-if="operateType !== 'add'">
            <el-input
              v-model="info.positionCode"
              :disabled="operateType !== 'add'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="operateType !== 'add'">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="info.status"
              :disabled="operateType === 'detail'"
              class="w100">
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
    </el-form>
  </div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
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
    },
    allPositionList: {
      type: Array,
      default: function () {
        return []
      }
    },
    treeData: Array
  },
  components: {
    Treeselect
  },
  created() {
    if (this.operateType !== 'add') {
      this.positionList = this.allPositionList
    }
  },
  data() {
    return {
      info: {},
      rules: {
        bbCode: [{ required: true, message: '请选择组织' }],
        positionCode: [{ required: true, message: '请选择职务' }],
        postName: [{ required: true, message: '请输入岗位名称' }]
      },
      statusOptions: [
        { label: '正常', value: 1 },
        { label: '停用', value: 2 }
      ],
      treeSelectNode: {},
      positionList: [],
      normalizer(node) {
        return {
          id: node.code,
          label: node.name,
          children: node.children
        }
      }
    }
  },
  methods: {
    handleSelectPosition(selectedValue) {
      const positionItem = this.positionList.find(
        p => p.pscode === selectedValue
      )
      this.$set(this.info, 'positionName', positionItem.psname)
    },
    handleTreeSelect(node, instanceId) {
      console.log(node, instanceId)
      this.treeSelectNode = node
      this.$set(this.info, 'bbName', node.name)
      // 清空职务
      this.$set(this.info, 'positionCode', undefined)
      this.queryPosition(node.type)
    },
    async queryPosition(type) {
      const { data } = await service.base.station.listByType({
        page: 1,
        limit: 1000,
        type
      })
      this.positionList = data
    },
    async getData() {
      const result = await this.$refs.form
        .validate()
        .catch(err => console.error(err))
      if (result) {
        const otype = this.treeSelectNode.type === '0' ? 2 : 1
        return {
          ...this.info,
          otype
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
    },
    'info.bbCode': {
      handler: function (val) {
        console.log(val, this.treeSelectNode)
        this.$set(this.info, 'positionName', undefined)
        const postName = `${this.treeSelectNode.name}`
        this.$set(this.info, 'postName', postName)
      }
    },
    'info.positionCode': {
      handler: function (val) {
        console.log('info.positionCode', val)
        const positionItem = this.positionList.find(p => p.pscode === val)
        let postName
        if (val) {
          postName = `${this.treeSelectNode.name || ''}-${positionItem.psname}`
        } else {
          postName = `${this.treeSelectNode.name || ''}`
        }
        this.$set(this.info, 'postName', postName)
      }
    }
  }
}
</script>
