<!--
 * @Author: wqy
 * @Date: 2022-05-13 10:00:15
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-16 16:59:59
 * @FilePath: \personnelweb\src\components\base\TreeSelect.vue
 * @Description: 
-->
<template>
  <div class="form-query-item">
    <div
      :style="{ width, 'text-align': align, margin: '8px 0' }"
      :class="required ? 'required' : ''">
      {{ label }}<span v-if="prefix">{{ prefix }}</span>
    </div>
    <div class="item-slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    required: {
      type: Boolean,
      default() {
        return false
      }
    },
    label: {
      type: String,
      default() {
        return ''
      }
    },
    width: {
      type: String || Number,
      default() {
        return '80px'
      }
    },
    align: {
      type: String,
      default() {
        return 'right'
      }
    },
    prefix: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.form-query-item {
  display: flex;
  align-items: center;
  .required {
    &::before {
      content: '*';
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      vertical-align: middle;
    }
  }
  .item-slot {
    margin-left: 12px;
  }
}
</style>

<template>
  <el-select
    ref="select"
    :value="value"
    placeholder="请选择"
    size="mini"
    @visible-change="visibleChange"
    clearable
    :disabled="disabled"
    style="width: 100%"
    @clear="clear">
    <el-option
      ref="option"
      class="option"
      :value="optionData.id"
      :label="optionData.name">
      <el-tree
        ref="tree"
        class="tree"
        :node-key="nodeKey"
        :data="data"
        :props="props"
        :default-expand-all="defaultExpand"
        highlight-current
        :expand-on-click-node="false"
        @node-click="handleNodeClick"></el-tree>
      <!-- <el-tree
        ref="tree"
        class="tree"
        :node-key="nodeKey"
        :data="data"
        :props="props"
        :default-expand-all="defaultExpand"
        :default-expanded-keys="[value]"
        highlight-current
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      ></el-tree> -->
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'TreeSelect',
  props: {
    // v-model绑定
    value: {
      type: [String, Number],
      default: ''
    },
    // 树形的数据
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 每个树节点用来作为唯一标识的属性
    nodeKey: {
      type: [String, Number],
      default: 'id'
    },
    // tree的props配置
    props: {
      type: Object,
      default: function () {
        return {
          label: 'label',
          children: 'children'
        }
      }
    },
    defaultExpand: Boolean,
    disabled: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data() {
    return {
      optionData: {
        id: '',
        name: ''
      }
    }
  },
  watch: {
    value: function (val) {
      if (!this.isEmpty(this.data)) {
        this.init(val)
      }
    },
    data: function (val) {
      if (!this.isEmpty(val)) {
        this.init(this.value)
      }
    }
  },
  mounted() {
    if (!this.isEmpty(this.data)) {
      this.init(this.value)
    }
  },
  methods: {
    // 是否为空
    isEmpty(val) {
      for (let key in val) {
        return false
      }
      return true
    },
    handleNodeClick(data) {
      let label = this.props.label || 'name'
      this.$emit('input', data[this.nodeKey])
      this.optionData.id = data[this.nodeKey]
      this.optionData.name = data[label]
      this.$refs.select.visible = false
    },
    init(val) {
      if (val) {
        this.$nextTick(() => {
          let label = this.props.label || 'name'
          this.$refs.tree.setCurrentKey(val)
          let node = this.$refs.tree.getNode(val)
          this.optionData.id = val
          this.optionData.name = node.label
        })
      } else {
        this.$refs.tree.setCurrentKey(null)
      }
    },
    visibleChange(e) {
      if (e) {
        let selectDom = document.querySelector('.is-current')
        setTimeout(() => {
          this.$refs.select.scrollToOption({ $el: selectDom })
        }, 0)
      }
    },
    clear() {
      this.$emit('input', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.option {
  height: auto;
  line-height: 1;
  padding: 0;
  background-color: #fff;
}

.tree {
  padding: 4px 20px;
  font-weight: 400;
}
</style>
