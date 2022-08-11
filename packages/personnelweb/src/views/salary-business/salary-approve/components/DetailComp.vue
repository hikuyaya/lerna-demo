<!--
 * @Author: wqy
 * @Date: 2022-08-10 11:34:01
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-11 14:46:59
 * @FilePath: \personnelweb\src\views\salary-business\salary-approve\components\DetailComp.vue
 * @Description: 
-->

<template>
  <el-descriptions class="margin-top" title="" :column="3" size="small" border>
    <el-descriptions-item>
      <template slot="label">员工姓名</template>
      {{ info.eeName }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">员工编码</template>
      {{ info.eeCode }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">增项合计</template>
      {{ info.addMoney }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">减项合计</template>
      {{ info.subMoney }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">应付金额</template>
      {{ info.actualMoney }}
    </el-descriptions-item>
    <el-descriptions-item v-for="column in dynamicColumns" :key="column.label">
      <template slot="label">
        {{ column.label }}
      </template>
      {{ column.value }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import service from '@src/service'
export default {
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      info: {},
      dynamicColumns: []
    }
  },
  mounted() {},
  methods: {},
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        const copyVal = JSON.parse(JSON.stringify(val))
        const dynamicColumns = []
        for (const key in copyVal) {
          if (Object.hasOwnProperty.call(copyVal, key)) {
            const value = copyVal[key]
            let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
            if (reg.test(key)) {
              // 是汉字开头的
              dynamicColumns.push({
                label: key,
                value
              })
            }
          }
        }
        this.dynamicColumns = dynamicColumns
        this.info = copyVal
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.info-row {
  display: flex;
  margin: 12px 24px;
  & > div {
    margin-right: 48px;
  }
}
</style>
