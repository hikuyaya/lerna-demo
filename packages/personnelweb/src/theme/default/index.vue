<template>
  <div class="layout">
    <!--    <LayoutHeader class="header"></LayoutHeader>-->
    <div class="content">
      <LayoutNav class="content-left"></LayoutNav>
      <LayoutContent class="content-right"></LayoutContent>
    </div>
  </div>
</template>

<script>
//import LayoutHeader from './LayoutHeader'
import LayoutNav from './LayoutNav'
import LayoutContent from './LayoutContent'

export default {
  components: {
    // LayoutHeader,
    LayoutNav,
    LayoutContent
  }
}
</script>

<style lang="scss" scoped>
.layout {
  background: #f1f2f7;
  height: 100vh;

  .header {
    min-height: 55px;
    height: 55px;
    background: $--color-primary;
  }

  .content {
    //height: calc(100vh - 55px);
    min-height: 100%;
    display: flex;

    .content-left {
      width: 190px;
      min-width: 190px;
      background: #232938;
      overflow-y: auto;
      height: 100vh;
    }

    .content-right {
      flex: 1;
      min-width: 1000px;

      /deep/ .router-tab {
        height: 100%;

        .router-tab-header {
          background: #fff;
          border-bottom: 0;
          //box-shadow: none;
        }

        .router-tab-item {
          border: 0;
          text-align: center;
          line-height: 42px;
          min-width: 80px;
          padding: 0 30px;
          box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.08);

          .tab-close {
            top: -2px;
            right: -17px;
          }

          &:not(.actived) {
            &:hover,
            &.contextmenu {
              background: #fff;
            }
          }

          &.actived {
            background: #fff;
            color: $--color-primary;
          }
        }

        .router-tab-container {
          background: #f1f2f7;
          overflow: auto;
          padding-top: 10px;
          height: calc(100vh - 52px);
          flex: none;
        }

        .router-tab-page {
          background: #fff;
          padding: 20px;
          height: 100%;
        }
      }
    }
  }
}
</style>
