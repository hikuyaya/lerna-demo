<template>
  <div class="layout-nav">
    <div class="layout-nav-menu">
      <el-menu :default-active="$route.path" router unique-opened>
        <div :key="menu.id" v-for="menu in menuTree">
          <template v-if="menu.subMenus">
            <el-submenu :index="menu.id.toString()">
              <template slot="title">
                <i :class="menu.css" class="nav-icon"></i>
                <span style="font-weight: bold">{{ menu.name }}</span>
              </template>

              <el-menu-item-group>
                <div :key="subMenu.id" v-for="subMenu in menu.subMenus">
                  <template
                    v-if="
                      subMenu.subMenus && getValidMenu(subMenu.subMenus, 'menu')
                    ">
                    <span
                      :class="[
                        'threemenu',
                        {
                          'is-active': getValidMenu(
                            subMenu.subMenus,
                            'active',
                            $route.path
                          )
                        }
                      ]"
                      @click="showMenu(subMenu)">
                      <i :class="subMenu.css" class="nav-icon"></i>
                      <label>{{ subMenu.name }}</label>
                      <i class="icon iconfont el-icon-arrow-right"></i>
                    </span>
                  </template>
                  <template v-else>
                    <el-menu-item :index="subMenu.url" @click="showOrgMenu">
                      <i :class="subMenu.css" class="nav-icon"></i>
                      <span>{{ subMenu.name }}</span>
                    </el-menu-item>
                  </template>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="menu.url">
              <i :class="menu.css" class="nav-icon"></i>
              <span style="font-weight: bold">{{ menu.name }}</span>
            </el-menu-item>
          </template>
        </div>
      </el-menu>
      <!--三级菜单-->
      <el-drawer
        :visible.sync="showSjMenu"
        :direction="direction"
        class="sjdrawer"
        :modal="false"
        size="180"
        :show-close="false"
        :withHeader="false">
        <div class="menucon">
          <span
            :class="{ 'is-active': sjmenu.url == $route.path }"
            v-for="sjmenu in sjMenuLists"
            @click="openPath(sjmenu.url)"
            >{{ sjmenu.name }}</span
          >
        </div>
      </el-drawer>
    </div>
    <el-input
      class="layout-nav-search"
      placeholder="搜索菜单"
      clearable
      prefix-icon="el-icon-search"
      @change="change"
      v-model="filter">
    </el-input>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'

export default {
  data() {
    return {
      menuTree: [],
      menuTreeData: [],
      showSjMenu: false,
      direction: 'ltr',
      sjMenuLists: [],
      filter: null
    }
  },

  created() {
    this.getMenu()
  },

  methods: {
    getValidMenu(menus, tag, path) {
      let sjvVlid = false
      menus.map((m, index) => {
        if (m.type != 1) {
          menus.splice(index, 1)
        }
      })
      if (tag == 'menu') {
        if (menus.length > 0) {
          sjvVlid = true
        } else {
          sjvVlid = false
        }
      } else if (tag == 'active') {
        let index = menus.findIndex(menu => menu.url == path)
        if (index > -1) {
          sjvVlid = true
        }
      }
      return sjvVlid
    },
    openPath(url) {
      if (url.indexOf('?') != -1 && url.indexOf('report/') != -1) {
        url = url.split('?')[0]
      }
      this.$router.push(url)
    },
    showOrgMenu() {
      this.showSjMenu = false
      this.sjMenuLists = []
    },
    showMenu(memulist) {
      this.sjMenuLists = memulist.subMenus.filter(sub => {
        return sub.type == 1
      })
      this.showSjMenu = true
    },
    getMenu() {
      console.log('menu', process.env.VUE_APP_ISCUSTOMMENU)
      if (process.env.VUE_APP_ISCUSTOMMENU == 0) {
        const menuList = yid.util.deepClone(yid.config.MENU.LIST)
        const menuListForShow = menuList.filter(menu => menu.canShow !== false)
        const menuTree = yid.util.toTree(
          menuListForShow,
          'id',
          'pid',
          'subMenus'
        )
        this.menuTree = menuTree
        //  console.log(this.menuTree);
      } else {
        service.user.menu().then(res => {
          let menu = res.data
          // this.menuTree = menu;
          this.menuTreeData = menu
          this.menuTree = this.menuTreeData
          // console.log('menu1', menu)
          // console.log('menu2', this.menuTree)
        })
      }
    },
    change(value) {
      if (value.length > 0) {
        this.menuTree = this.filterMenu(
          yid.util.deepClone(this.menuTreeData),
          value
        )
      } else {
        this.menuTree = this.menuTreeData
      }
    },
    filterMenu(data, name) {
      for (let index in data) {
        //一级菜单
        let item = data[index]
        if (item.subMenus) {
          for (let item2 in item.subMenus) {
            let subMenu = item.subMenus[item2]
            let flag = false
            if (this.findMenu(subMenu, name)) flag = true

            if (subMenu.subMenus && !flag) {
              for (let item3 in subMenu.subMenus) {
                if (this.findMenu(subMenu.subMenus[item3], name)) {
                  flag = true
                } else {
                  delete subMenu.subMenus[item3].name
                }
              }
              let filter = subMenu.subMenus.filter(item => item.name)
              subMenu.subMenus = filter
            }

            if (!flag) delete item.subMenus[item2].name
          }
          let filter = item.subMenus.filter(item => item.name)
          item.subMenus = filter
        }
      }
      let filter = data.filter(item => item.subMenus.length > 0)
      return filter
    },
    findMenu(item, name) {
      return item.name && item.name.indexOf(name) != -1
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-nav {
  display: flex;

  /deep/ .el-drawer {
    width: 190px;
  }

  .layout-nav-menu {
    flex: 1;
    margin-bottom: 40px;
    overflow-y: scroll;
    overflow-x: hidden;

    ul {
      padding: 0 !important;
      margin: 0 !important;
    }
  }

  .layout-nav-search {
    margin-bottom: 2px;
    border-bottom: 1px solid gray;
    background-color: transparent;
    padding: 0;
    height: 40px;
    line-height: 40px;
    width: 190px;
    border: none;
    background-color: transparent;
    position: fixed;
    bottom: 0;

    .el-input {
      background-color: transparent;
    }

    .el-input:focus {
      border: none;
    }

    .el-input__inner {
      height: 100%;
      padding: 0 10px;
    }
  }

  /deep/ .layout-nav-search .el-input__inner {
    border: none !important;
    color: white;
    background-color: transparent;
  }

  /deep/ .layout-nav-search .el-input__inner:focus {
    border: none !important;
    color: white;
    background-color: transparent;
  }

  .ejmenu {
    display: flex;
  }

  /deep/ .el-drawer__wrapper {
    &.sjdrawer {
      left: 190px;

      .el-drawer {
        background-color: rgba(0, 0, 0, 0.7);

        .menucon {
          display: flex;
          flex-direction: column;
          padding-top: 15px;

          span {
            padding-left: 20px;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            line-height: 40px;
            font-size: 13px;
            overflow: hidden;
            flex: 1;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
              background-color: #2e8ff4;
              color: #fff;
            }

            &.is-active {
              background-color: #2e8ff4;
              color: #fff;
            }
          }
        }
      }
    }
  }

  /deep/ .el-menu {
    border: none;
    background: #232938;
    overflow: visible;

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

    .threemenu {
      height: 40px;
      line-height: 40px;
      color: rgba(255, 255, 255, 0.4);
      margin-left: 10px;
      padding-left: 30px;
      padding-right: 20px;
      cursor: pointer;
      display: flex;
      justify-content: start;
      align-items: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: clip;
      animation: kf-marque-animation 12s infinite linear;

      &:hover {
        background-color: #272e3f;
        color: #fff;
      }

      &.is-active {
        background-color: #272e3f;
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
      color: rgba(255, 255, 255, 0.4);
      // margin-left: 10px;
    }

    .el-submenu__title {
      height: 40px;
      line-height: 40px;
      color: #fff;
      display: flex;
      align-items: center;
      padding-left: 10px !important;

      &:hover {
        background: #1e2332;
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
        background-color: #272e3f;
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
        background-color: #272e3f;
        color: #fff;
      }

      i {
        margin: 0 20px 0 0;
      }
    }
  }
}
</style>
