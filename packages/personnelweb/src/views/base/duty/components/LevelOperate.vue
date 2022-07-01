<!--
 * @Author: wqy
 * @Date: 2022-06-30 16:18:59
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-01 09:12:32
 * @FilePath: \personnelweb\src\views\base\duty\components\LevelOperate.vue
 * @Description: 
-->
<template>
  <div class="part">
    <ul class="head">
      <li>级别等级</li>
      <li>级别名称</li>
      <li>备注</li>
      <li>
        <i @click="onAddRow" class="el-icon-circle-plus-outline c-pointer"></i>
      </li>
    </ul>
    <ul class="body" v-for="(item, index) in items" :key="item.id">
      <li>
        <el-input-number
          controls-position="right"
          v-model="item.clevel"
          :min="0"
          :controls="false"
          style="width: 80px" />
      </li>
      <li><el-input v-model="item.pslname" /></li>
      <li><el-input v-model="item.remark" /></li>
      <li>
        <el-popconfirm title="确定删除吗？" @confirm="onDeleteRow(item, index)">
          <i slot="reference" class="el-icon-remove-outline c-pointer"></i>
        </el-popconfirm>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    },
    position: {
      type: Object
    }
  },
  data() {
    return {
      items: []
    }
  },
  methods: {
    onAddRow() {
      const copyItems = [...this.items]
      copyItems.push({
        pslname: '',
        bbids: this.position.bbids,
        bbnames: this.position.bbnames,
        btype: 1,
        psid: this.position.psid,
        pscode: this.position.pscode,
        clevel: undefined,
        remark: ''
      })
      this.items = copyItems
    },
    onDeleteRow(item, index) {
      const copyItems = [...this.items]
      copyItems.splice(index, 1)
      this.items = copyItems
    }
  },
  watch: {
    list: {
      immediate: true,
      handler: function (val) {
        this.items = JSON.parse(JSON.stringify(val))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.part {
  flex: 1;
  margin: 0 4px;
  ul {
    display: flex;
    li {
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        width: 30%;
      }
      &:nth-child(4) {
        width: 10%;
        font-size: 22px;
      }
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-bottom: 1px solid #f2f2f2;
    }
  }
  .head {
    background: #f5f7fa;
  }
  .body {
    li {
      &:nth-child(2) {
        padding-right: 12px;
      }
    }
  }
}
</style>
