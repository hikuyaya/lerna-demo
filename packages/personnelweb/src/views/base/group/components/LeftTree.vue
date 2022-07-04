<!--
 * @Author: wqy
 * @Date: 2022-06-20 16:14:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-01 17:41:02
 * @FilePath: \personnelweb\src\views\base\group\components\LeftTree.vue
 * @Description: 组织机构树
-->
<template>
  <div>
    <div class="search-input-box">
      <el-input placeholder="输入组织名称/编码搜索" v-model="filterText">
      </el-input>
    </div>
    <el-tree
      class="filter-tree"
      :data="treeData"
      :props="defaultProps"
      :default-expand-all="false"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :render-content="renderContent"
      @node-click="onTreeNodeClick"
      ref="tree">
    </el-tree>
  </div>
</template>

<script>
import service from '@src/service'

export default {
  props: {
    treeData: Array
  },
  data() {
    return {
      filterText: '',
      nodeData: null,
      defaultProps: {
        children: 'children',
        label: 'oname'
      }
    }
  },
  created() {},
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span class="">
          [{data.code}]{node.label}
        </span>
      )
    },
    onTreeNodeClick(data, node, comp) {
      this.nodeData = data
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>
