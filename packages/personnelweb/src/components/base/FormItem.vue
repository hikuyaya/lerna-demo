<!--
 * @Author: wqy
 * @Date: 2022-06-16 16:59:30
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-25 18:05:29
 * @FilePath: \personnelweb\src\components\base\FormItem.vue
 * @Description: 
-->
<template>
  <div class="form-query-item" :style="{ width: width ? width : 'auto' }">
    <div
      :style="{
        width: labelWidth,
        'text-align': align,
        margin: '8px 0',
        color: 'rgb(96, 98, 102)'
      }"
      :class="['label', { required: required }]">
      {{ label }}
      <span v-if="prefix">{{ prefix }}</span>
    </div>
    <div class="item-slot" :style="{ 'margin-left': margin ? '0.12rem' : '0' }">
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
    labelWidth: {
      type: String || Number,
      default() {
        return '0.8rem'
      }
    },
    width: {
      type: String
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
    },
    margin: {
      type: Boolean,
      default() {
        return false
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
  .label {
    font-size: 0.14rem;
  }
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
    flex: 1;
  }
}
</style>
