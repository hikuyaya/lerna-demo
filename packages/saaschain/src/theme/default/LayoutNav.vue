<template>
  <div class="layout-nav">
    <el-menu :default-active="$route.path" router unique-opened>
      <div :key="menu.id" v-for="menu in menuTree">
        <template v-if="menu.subMenus"> {{menu.id}}
          <el-submenu :index="menu.id.toString()">
            <template slot="title">
              <i :class="menu.icon" class="nav-icon"></i>
              <span style="font-weight:bold;">{{ menu.name }}</span>
            </template>

            <el-menu-item-group>
              <el-menu-item :index="subMenu.path" :key="subMenu.id" v-for="subMenu in menu.subMenus">
<!--                <i :class="subMenu.icon" class="submenu nav-icon"></i>-->
                <span>{{ subMenu.name }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </template>

        <template v-else>
          <el-menu-item :index="menu.path">
<!--            <i :class="menu.icon" class="nav-icon"></i>-->
            <span style="font-weight:bold;">{{ menu.name }}</span>
          </el-menu-item>
        </template>
      </div>
    </el-menu>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
export default {
  data() {
    return {
      menuTree: []
    }
  },

  created() {
    this.getMenu();

  },

  methods: {
      getMenu() {
          console.log('menu', process.env.VUE_APP_ISCUSTOMMENU)
          if(process.env.VUE_APP_ISCUSTOMMENU == 0) {
              const menuList = yid.util.deepClone(yid.config.MENU.LIST)
              const menuListForShow = menuList.filter(menu => menu.canShow !== false)
              const menuTree = yid.util.toTree(menuListForShow, 'id', 'pid', 'subMenus')
              this.menuTree = menuTree
              //  console.log(this.menuTree);
          } else  {
              debugger
              service.user.menu().then(res => {
                  let menu = res.data;
                  this.menuTree = menu;
                  // console.log('menu1', menu)
                  // console.log('menu2', this.menuTree)
              });
          }
      }
  }
}
</script>

<style lang="scss" scoped>
.layout-nav {
  /deep/ .el-menu {
    border: none;
    background: #232938;
    .el-submenu__icon-arrow {
      transform: rotateZ(270deg);
    }

    .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
      transform: rotateZ(360deg);
    }

    i {
      color: #4c5e5c;
    }

    .el-submenu.is-active .el-submenu__title {
      border-bottom-color: #fff;
      color: #fff;

      i {
        color: #fff;
      }
    }

    .el-menu-item-group__title {
      display: none;
    }

    .el-menu-item,
    .el-submenu .el-menu-item {
      height: 44px;
      line-height: 44px;
      color: rgba(255,255,255,.4);
      margin-left: 10px;
    }

    .el-submenu__title {
      height: 44px;
      line-height: 44px;
      color: #fff;
      display: flex;
      align-items: center;
      &:hover {
        background: #1E2332;
      }
    }

    .el-menu-item,
    .el-submenu {
      .nav-icon {
        width: 14px;
        text-align: center;
        margin: 0 10px 0 0;

        &.submenu {
          margin: 0 24px 0 0;
        }
      }
    }

    .el-menu-item {
      &.is-active {
        background-color: #272E3F;
        color: #fff;
        &:before {
          //content: ' ';
          //position: absolute;
         // display: inline-block;
         // left: 0;
         // width: 4px;
         // height: 100%;
         // background: $--color-primary;
        }
      }
      &:hover {
        background-color: #272E3F;
        color: #fff;
      }
      i {
        margin: 0 20px 0 0;
      }
    }
  }
}
</style>

