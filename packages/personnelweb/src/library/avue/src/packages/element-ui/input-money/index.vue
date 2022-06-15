<template>
  <el-input v-model="text"
                   :class="b()"
                   @click.native="handleClick"
                   @focus="handleFocus"
                   @blur="handleBlur"
                    @input="check_price"
                   :precision="precision"
                   :placeholder="placeholder"
                   :size="size"
                   :min="minRows"
                   :max="maxRows"
                   :step="step"
                   :clearable="clearableVal"
                   :readonly="readonly"
                   :controls-position="controlsPosition"
                   :controls="controls"
                   :label="placeholder"
                   :disabled="disabled"></el-input>
</template>

<script>
import create from "../../../core/create";
import props from "../../core/common/props.js";
import event from "../../core/common/event.js";
export default create({
  name: "input-money",
  mixins: [props(), event()],
  data () {
    return {};
  },
  props: {
    controls: {
      type: Boolean,
      default: true
    },
    step: {
      type: Number,
      default: 1
    },
    controlsPosition: {
      type: String,
      default: "right"
    },
    precision: {
      type: Number
    },
    minRows: {
      type: Number,
      default: -Infinity
    },
    maxRows: {
      type: Number,
      default: Infinity
    }
  },
  created () { },
  mounted () { },
  methods: {
    check_price(){
      var price = '' + this.text;
      price = price
          .replace(/[^\d^\.]+/g,'') // 清除“数字”和“.”以外的字符
          .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          .replace(/^\./g, '')    //保证第一个为数字而不是.
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.')
          .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
      console.log(price)
      if (price.indexOf('.') < 0 && price != '') {
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          price = parseFloat(price);
      }
      this.text = price
    }
  }
});
</script>

