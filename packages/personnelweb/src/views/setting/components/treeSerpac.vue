<template>
  <div>
    <el-tree
      :data="treeData"
      show-checkbox
      default-expand-all
      node-key="id"
      :props="{ label: 'spname' }"
      ref="tree"
      highlight-current>
    </el-tree>
  </div>
</template>

<script>
import service from '@src/service'

export default {
  name: 'treeSerpac',
  props: ['defaultCheckedKeys', 'type'],
  data: function () {
    return {
      treeData: [],
      // serviceList: [],
      serpacList: []
    }
  },
  watch: {
    defaultCheckedKeys() {
      this.set()
    }
  },
  mounted() {
    service.chain.servicepackage.findAll().then(res => {
      this.serpacList = res.data
      this.serpacList.map(e => {
        this.treeData.push(e)
      })
    })
  },
  methods: {
    set() {
      if (this.type == '6') {
        this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys, true)
      } else {
        this.$refs.tree.setCheckedKeys([], true)
      }
    },
    get() {
      return this.$refs.tree.getCheckedNodes()
    }
  }
}
</script>
