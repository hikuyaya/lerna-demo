<!--
 * @Author: wqy
 * @Date: 2022-06-17 17:42:27
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-22 11:35:21
 * @FilePath: \personnelweb\src\components\base\FormArea.vue
 * @Description: 
-->
<template>
  <div class="w100 flex">
    <form-item
      v-for="option in options"
      :key="option.prop"
      :label="option.label"
      prefix="："
      :width="option.width"
      :labelWidth="option.labelWidth || '0.8rem'">
      <el-select
        v-if="option.type === 'select'"
        v-model="params[option.prop]"
        :style="{
          width: option.widgetWidth ? option.widgetWidth : 'auto'
        }">
        <el-option v-for="(item, index) in option.options" :key="index">
        </el-option>
      </el-select>

      <el-input
        v-else
        v-model="params[option.prop]"
        :placeholder="
          option.placeholder
            ? `请输入${option.placeholder}`
            : `请输入${option.label}`
        "
        :style="{
          width: option.widgetWidth ? option.widgetWidth : '100%'
        }"></el-input>
    </form-item>
  </div>
</template>

<script>
import FormItem from '@src/components/base/FormItem.vue'
export default {
  name: 'form-area',
  components: { FormItem },
  props: {
    options: {
      type: Array
    },
    advance: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data() {
    return {
      params: {}
    }
  },
  watch: {
    options: {
      handler: function (val) {
        if (!val) {
          return
        }
        this.params = deepClone(val)
      }
    }
  }
}
</script>
