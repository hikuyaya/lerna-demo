<!--
 * @Author: wqy
 * @Date: 2022-07-21 13:56:55
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-21 13:57:39
 * @FilePath: \personnelweb\src\views\base\position\position.vue
 * @Description: 职务管理
-->

<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="职务信息" name="info">
        <info />
      </el-tab-pane>
      <el-tab-pane label="员工级别 " name="level">
        <level />
      </el-tab-pane>
      <el-tab-pane label="员工级别1" name="levelOne">
        <level-one />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Info from './components/Info'
import Level from './components/Level'
import LevelOne from './components/LevelOne'

export default {
  components: {
    Info,
    Level,
    LevelOne
  },
  data() {
    return {
      activeName: 'info'
    }
  }
}
</script>
