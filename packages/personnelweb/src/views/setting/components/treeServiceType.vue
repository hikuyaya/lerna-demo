<template>
  <div>
    <el-tree
      :data="treeData"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="{ label: 'sname' }">
    </el-tree>
  </div>
</template>

<script>
import service from '@src/service'

export default {
  name: 'treeServiceType',
  props: ['prtcode', 'defaultCheckedKeys', 'itemtype', 'type'],
  data: function () {
    return {
      treeData: []
    }
  },
  watch: {
    defaultCheckedKeys(v) {
      this.set()
    }
  },
  computed: {},
  mounted() {
    service.fwbackConfig.getServiceType().then(res => {
      this.treeData = res.data
    })
  },
  methods: {
    submit() {
      if (this.func instanceof Function)
        this.func(this.$refs.payTree.getCheckedNodes())
    },
    set() {
      if (this.type == '12') {
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
