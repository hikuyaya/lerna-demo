<!--
 * @Author: wqy
 * @Date: 2022-07-04 11:12:52
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-04 15:11:48
 * @FilePath: \personnelweb\src\views\staff\black\components\AddComp.vue
 * @Description: 
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="离职员工" prop="parentCode">
            <el-input disabled v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="mg-l-16">
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="chooseStaffVisible = true"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="postName">
            <el-input
              v-model="info.postName"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="postCode">
            <el-input v-model="info.postCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="报备原因">
            <el-input v-model="info.positionCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      title="选择人员"
      :visible.sync="chooseStaffVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <choose-staff
        v-if="chooseStaffVisible"
        @select="handleSelectStaff"></choose-staff>
    </el-dialog>
  </div>
</template>

<script>
import ChooseStaff from '@src/components/business/ChooseStaff'

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
    positionList: {
      type: Array,
      default: function () {
        return []
      }
    },
    treeData: Array
  },
  components: {
    ChooseStaff
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
      defaultProps: {
        children: 'children',
        label: 'oname'
      },
      treeSelectNode: null,
      chooseStaffVisible: true,
      normalizer(node) {
        return {
          id: node.code,
          label: node.oname,
          children: node.children
        }
      }
    }
  },
  methods: {
    handleSelectStaff(selectRow) {
      console.log(selectRow)
      this.chooseStaffVisible = false
    },
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
        this.info = JSON.parse(JSON.stringify(val))
      }
    },
    'info.bbCode': {
      handler: function (val) {
        console.log(val, this.treeSelectNode)
        const postName = `${this.treeSelectNode.oname}${
          this.info.positionName || ''
        }`
        this.$set(this.info, 'postName', postName)
      }
    },
    'info.positionCode': {
      handler: function (val) {
        const positionItem = this.positionList.find(p => p.pscode === val)
        const postName = `${this.treeSelectNode.oname || ''}${
          positionItem.psname
        }`
        this.$set(this.info, 'postName', postName)
      }
    }
  }
}
</script>
