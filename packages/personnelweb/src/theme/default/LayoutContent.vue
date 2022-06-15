<template>
  <div class="layout-content">
    <router-tab :tabs="tabs" ref="routerTab">
      <template slot="header">
        <div class="top-menu">
          <!--        {{msg}}-->
          <!--        <button type="primary" @click="sendMsg">Send msg</button>-->
          <!--        <button type="primary">Send notification</button>-->
          <!--        <div class="name">YesIdo 椰岛美容美发</div>-->
          <!--          <el-badge is-dot class="message" style="margin-right: 10px;">-->
          <!--            <i class="el-icon-bell"></i>-->
          <!--          </el-badge>-->

          <el-dropdown>
            <img
              class="avatar"
              :src="
                headImgUrl
                  ? headImgUrl
                  : require('../../assets/images/avatar.png')
              "
              style="
                display: inline-block;
                margin-right: 15px;
                vertical-align: middle;
                width: 30px;
                height: 30px;
                border-radius: 50%;
              " />
            <span class="userName" style="display: inline-block">{{
              userInfo.eename
            }}</span>
            <el-dropdown-menu
              class="header-right-title-dropdown"
              slot="dropdown">
              <div class="header-right-title-dropdown-content">
                <el-dropdown-item @click.native="signOut" class="dropdown-item">
                  <div class="circle logout"></div>
                  <span>退出登录</span>
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <!--        <span class="username">{{userName}}</span>-->
        </div>
      </template>
    </router-tab>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import { mapGetters } from 'vuex'

const getQueryVariable = url => {
  if (!url) return {}
  let variable = {}
  var vars = url.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    variable[pair[0]] = pair[1]
  }
  return variable
}

export default {
  data() {
    return {
      user: {},
      tabs: []
    }
  },
  computed: {
    ...mapGetters({
      userName: 'user/userName',
      nickName: 'user/nickName',
      headImgUrl: 'user/headImgUrl',
      msg: 'user/msg',
      userInfo: 'user/userInfo'
    })
  },
  async mounted() {
    await this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      await service.user.userInfo().then(res => {
        // yid.cache.set(yid.type.USER.APPID,  res.data.appId, yid.type.SYSTEM.CACHE.LOCAL_STORAGE)
        this.$store.commit('user/setUserInfo', res.data)

        let filter = res.data.menus.filter(
          item => item.url.indexOf('/report/') != -1
        )
        filter.forEach(item => {
          let code = item.url.split('/report/')[1].split('?')[0]
          let split = item.url.split('?')[1]
          let queryVariable = getQueryVariable(split)
          queryVariable.code = code
          this.$router.$addRoutes({
            path:
              item.url.indexOf('?') != -1 ? item.url.split('?')[0] : item.url,
            name: item.name,
            meta: {
              title: item.name,
              closable: true,
              auth: true,
              params: queryVariable
            },
            component: () => import('@src/views/sys/ReportAutoList.vue')
          })
        })
        //console.log('getters', this.$store.getters);
      })
    },
    signOut() {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.auth.logout().then(res => {
            // 清空 localstoreage
            yid.cache.remove(
              yid.type.USER.TOKEN,
              yid.type.SYSTEM.CACHE.LOCAL_STORAGE
            )
            yid.cache.remove(
              yid.type.USER.INFO,
              yid.type.SYSTEM.CACHE.LOCAL_STORAGE
            )

            // 跳转登录
            this.$router.push(yid.config.SYSTEM.ROUTER_LOGIN)
          })
        })
        .catch(() => {})
    },
    sendMsg() {
      yid.service.IM.sentMsg()
        .then(res => {
          console.log(res)
        })
        .catch(res => {
          // yid.util.error("用户名或密码错误");
          this.deviceId = Math.uuid()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-content {
  padding: 0 2px;

  .top-menu {
    //position: absolute;
    //right: 0;
    //z-index: 999909;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    padding-right: 20px;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;

    .message {
      margin: 0 25px 0 25px;

      i {
        font-size: 20px;
      }
    }

    .avatar {
      margin-left: 20px;
    }

    .username {
      margin-left: 20px;
    }
  }
}
</style>
