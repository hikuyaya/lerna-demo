<!--
 * @Author: wqy
 * @Date: 2022-06-20 16:14:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-20 17:25:04
 * @FilePath: \personnelweb\src\views\base\test\components\LeftTree.vue
 * @Description: 
-->
<template>
  <div>
    <div class="search-input-box">
      <el-input placeholder="输入名称搜索" v-model="filterText"> </el-input>
    </div>
    <el-tree
      class="filter-tree"
      :data="treeData"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @node-click="onTreeNodeClick"
      ref="tree">
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    onTreeNodeClick(data, node, comp) {},
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
