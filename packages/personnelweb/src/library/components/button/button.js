import { Button } from 'element-ui'
import store from '@src/store'
const ExtendDialogProps = {
  pid: {
    type: String,
    default() {
      return ''
    }
  },

  ptype: {
    type: String,
    default() {
      return '1'
    }
  }
}

export default {
  name: 'el-button',

  props: {
    ...Button.props,

    ...ExtendDialogProps
  },
  mounted() {},
  render(h) {
    let Node = Button
    if (this.pid) {
      let permission = store.getters['user/permissions']
      if (!permission.includes(this.pid)) {
        this.disabled = true
      } else {
        if (this.ptype == '1') {
        } else {
          Node = null
        }
      }
    }

    return h(
      Node,
      {
        // 扩展 props
        props: this.$props,

        // 扩展 attrs
        attrs: this.$attrs,

        // 扩展 listeners
        on: this.$listeners

        // 扩展 slots
        // scopedSlots: this.$scopedSlots,
        // scopedSlots: this.$scopedSlots.default,

        //  slots: this.$slots
      },
      this.$slots.default
    )
  }
}
