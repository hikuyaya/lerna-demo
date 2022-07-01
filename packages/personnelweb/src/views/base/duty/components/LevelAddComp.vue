<!--
 * @Author: wqy
 * @Date: 2022-06-30 15:28:58
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-01 13:56:24
 * @FilePath: \personnelweb\src\views\base\duty\components\LevelAddComp.vue
 * @Description: 
-->
<template>
  <div class="level-add-container">
    <h4>职务：{{ value.psname }}</h4>
    <div class="box mg-t-12">
      <level-operate
        :list.sync="levels"
        :position="value"
        :operateType="operateType" />
      <level-operate
        :list.sync="level1s"
        :position="value"
        :operateType="operateType" />
    </div>
  </div>
</template>

<script>
import service from '@src/service'
import LevelOperate from './LevelOperate.vue'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    operateType: {
      type: String
    }
  },
  components: { LevelOperate },
  created() {
    console.log('leveladdcomp', this.value)
    this.queryLevel()
    this.queryLevel1()
  },
  data() {
    return {
      info: {},
      levels: [],
      level1s: []
    }
  },
  methods: {
    async queryLevel() {
      const { data } = await service.base.duty.positionLevelList({
        // pscode: this.value.pscode,
        pscode: '0024',
        page: 1,
        limit: 100
      })
      this.levels = data?.sort((a, b) => a.clevel - b.clevel)
    },
    async queryLevel1() {
      const { data } = await service.base.duty.positionLevel1List({
        // psCode: this.value.pscode,
        psCode: '0024',
        page: 1,
        limit: 100
      })
      this.level1s = data
    },
    getData() {
      const flag = this.validate(this.levels) && this.validate(this.level1s)
      // 先校验数据
      return {
        success: flag,
        data: {
          positionLevel1List: this.level1s,
          positionLevelList: this.levels
        }
      }
    },
    validate(data) {
      let flag = true
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element.clevel) {
            flag = false
            this.$message.error('请填写级别等级或删除行')
            return
          }
          if (!element.pslname) {
            flag = false
            this.$message.error('请填写级别名称或删除行')
            return
          }
        }
      }
      return flag
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.level-add-container {
  .box {
    display: flex;
  }
}
</style>
