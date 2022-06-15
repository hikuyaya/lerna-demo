<template>
  <div>
    <el-tree
      :data="treeData"
      show-checkbox
      default-expand-all
      node-key="prnid"
      ref="tree"
      highlight-current
      :props="{ label: 'prnname' }">
    </el-tree>
  </div>
</template>

<script>
import service from '@src/service'

export default {
  name: 'treeRoyaltyNorm',
  props: ['prtcode', 'defaultCheckedKeys', 'itemtype', 'type', 'normList'],
  data: function () {
    return {}
  },
  watch: {
    defaultCheckedKeys(v) {
      this.set()
    }
  },
  computed: {
    treeData: function () {
      return this.normList.filter(
        norm => norm.prtcode == this.prtcode && norm.prnunit == '1'
      )
    }
  },
  mounted() {},
  methods: {
    submit() {
      if (this.func instanceof Function)
        this.func(this.$refs.payTree.getCheckedNodes())
    },
    set() {
      if (
        this.type == '1' ||
        this.type == '3' ||
        this.type == '5' ||
        this.type == '7' ||
        this.type == '9' ||
        this.type == '11'
      ) {
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
