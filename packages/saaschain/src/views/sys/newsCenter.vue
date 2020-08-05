<template>
  <div class="sys-news">
    <el-tabs v-model="activeName">
      <el-tab-pane label="系统消息" name="first">
        <sysNews />
      </el-tab-pane>
      <el-tab-pane label="系统公告 " name="second">
        <sysAnouncement />
      </el-tab-pane>
      <el-tab-pane label="内部通知" name="third">
        <sysNotice />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import sysNews from "./components/sysNews";
import sysNotice from "./components/sysNotice";
import sysAnouncement from "./components/sysAnouncement";

export default {
  components: {
    sysNews,
    sysNotice,
    sysAnouncement
  },
  data() {
    return {
      activeName: 'first',
    }
  },

  created() {

  },
}
</script>

<style lang="scss" scoped>
 .sys-news {

 }
</style>
