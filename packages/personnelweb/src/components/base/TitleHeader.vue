<!--
 * @Author: wqy
 * @Date: 2022-06-23 13:44:11
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-23 16:02:28
 * @FilePath: \personnelweb\src\components\base\TitleHeader.vue
 * @Description: 
-->
<template>
  <div class="title-header">{{ title }}</div>
</template>

<script>
export default {
  props: ['title'],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.title-header {
  position: relative;
  padding-left: 12px;
  font-weight: bold;
  font-size: 14px;
  &::before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 3px;
    width: 6px;
    height: 16px;
    background: #00aaee;
    border-radius: 4px;
  }
}
</style>
