<!--
 * @Author: wqy
 * @Date: 2022-06-30 16:18:59
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-21 13:58:18
 * @FilePath: \personnelweb\src\views\base\position\components\LevelOperate.vue
 * @Description: 
-->
<template>
  <div class="part">
    <ul class="head">
      <li>级别等级</li>
      <li>级别名称</li>
      <li>备注</li>
      <li>
        <i
          @click="onAddRow"
          class="el-icon-circle-plus-outline c-pointer"
          :class="{ hide: operateType === 'detail' }"></i>
      </li>
    </ul>
    <template v-if="items.length">
      <ul class="body" v-for="(item, index) in items" :key="item.id">
        <li>
          <el-input-number
            controls-position="right"
            v-model="item.clevel"
            :min="0"
            :controls="false"
            style="width: 80px"
            :disabled="operateType === 'detail'" />
        </li>
        <li>
          <el-input
            v-model="item.pslname"
            :disabled="operateType === 'detail'" />
        </li>
        <li>
          <el-input
            v-model="item.remark"
            :disabled="operateType === 'detail'" />
        </li>
        <li>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="onDeleteRow(item, index)"
            :class="{ hide: operateType === 'detail' }">
            <i slot="reference" class="el-icon-remove-outline c-pointer"></i>
          </el-popconfirm>
        </li>
      </ul>
    </template>
    <template v-else>
      <el-empty />
    </template>
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
    },
    operateType: {
      type: String
    }
  },
  data() {
    return {
      items: []
    }
  },
  created() {
    console.log('position', this.position)
  },
  methods: {
    onAddRow() {
      const copyItems = [...this.items]
      const flag = this.validate(copyItems)
      if (!flag) {
        return
      }
      copyItems.push({
        pslname: '',
        bbids: this.position.bbids,
        bbnames: this.position.bbnames,
        btype: this.position.btype,
        psid: this.position.id,
        pscode: this.position.pscode,
        clevel: undefined,
        remark: ''
      })
      this.items = copyItems
    },
    validate(copyItems) {
      let flag = true
      for (const key in copyItems) {
        if (Object.hasOwnProperty.call(copyItems, key)) {
          const element = copyItems[key]
          if (element.clevel === undefined || !element.pslname) {
            flag = false
            this.$message.error('请先完成上一行数据')
            return
          }
        }
      }
      return flag
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
        this.items = val
      }
    },
    items: {
      immediate: true,
      handler: function (val) {
        this.$emit('update:list', val)
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
        color: #409eff;
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
