<template>
  <div>
    <el-tree
      :data="treeData"
      show-checkbox
      default-expand-all
      node-key="treekey"
      ref="tree"
      highlight-current>
    </el-tree>
  </div>
</template>

<script>
import service from '@src/service'

export default {
  name: 'treeProduct',
  props: ['defaultCheckedKeys', 'type'],
  data: function () {
    return {
      treeData: [],
      productList: [],
      Category: []
    }
  },
  watch: {
    defaultCheckedKeys() {
      this.set()
    }
  },
  mounted() {
    service.chain.productCategory
      .alllist({ level: 2 })
      .then(pc => {
        this.Category = pc.data
        return this.Category
      })
      .then(categorys => {
        service.chain.product.listAll().then(p => {
          let products = p.data
          this.productList = p.data
          categorys.map(c => {
            c.children = []
            c.label = c.cname
            c.treekey = 'categrory' + c.id
            products.map(p => {
              p.label = p.pname
              p.treekey = p.id
              if (c.id == p.categrory) c.children.push(p)
            })
          })
          this.treeData = categorys.filter(
            category => category.children.length > 0
          )
          this.set()
        })
      })
  },
  methods: {
    set() {
      if (this.type == '4') {
        this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    get() {
      return this.$refs.tree.getCheckedNodes(true)
    }
  }
}
</script>
