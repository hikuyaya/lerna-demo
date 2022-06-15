import { TableColumn } from 'element-ui'

const ExtendTableColumnProps = {
  'header-align': {
    type: String,
    default() {
      return 'center'
    }
  },

  align: {
    type: String,
    default() {
      return 'center'
    }
  },

  'show-overflow-tooltip': {
    type: Boolean,
    default() {
      return true
    }
  }
}

export default {
  name: 'yid-table-column',

  props: {
    ...TableColumn.props,

    ...ExtendTableColumnProps
  },

  render(h) {
    return h(TableColumn, {
      // 扩展 props
      props: this.$props,

      // 扩展 attrs
      attrs: this.$attrs,

      // 扩展 listeners
      on: this.$listeners,

      // 扩展 slots
      scopedSlots: this.$scopedSlots
    })
  }
}
