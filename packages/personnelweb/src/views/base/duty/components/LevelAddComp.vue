<!--
 * @Author: wqy
 * @Date: 2022-06-30 15:28:58
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-30 17:01:45
 * @FilePath: \personnelweb\src\views\base\duty\components\LevelAddComp.vue
 * @Description: 
-->
<template>
  <div class="level-add-container">
    <h4>职务：{{ value.psname }}</h4>
    <div class="box mg-t-12">
      <level-operate :list.sync="levels" :position="value" />
      <level-operate :list.sync="level1s" :position="value" />
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
        pscode: this.value.pscode,
        page: 1,
        limit: 100
      })
      this.levels = data?.sort((a, b) => a.clevel - b.clevel)
    },
    async queryLevel1() {
      const { data } = await service.base.duty.positionLevel1List({
        psCode: this.value.pscode,
        page: 1,
        limit: 100
      })
      this.level1s = data
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
