<template>
  <div class="layout-content">
    <div class="top-menu">
<!--        {{msg}}-->
<!--        <button type="primary" @click="sendMsg">Send msg</button>-->
<!--        <button type="primary">Send notification</button>-->
<!--        <div class="name">YesIdo 椰岛美容美发</div>-->
        <el-badge is-dot class="message" style="margin-right: 10px;">
            <i class="el-icon-bell"></i>
        </el-badge>

        <el-dropdown>
            <img class="avatar" :src="headImgUrl? headImgUrl : require('../../assets/images/avatar.png')" style="display: inline-block; margin-right: 15px;vertical-align: middle;width: 40px;height:40px;border-radius: 50%">
            <span class="userName" style="display: inline-block;">{{userName}}</span>
            <el-dropdown-menu class="header-right-title-dropdown" slot="dropdown">
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
    <router-tab :tabs="tabs" ref="routerTab" />
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      user: {},
      tabs: [],
    }
  },
  computed: {
    ...mapGetters({
        userName: 'user/userName',
        nickName: 'user/nickName',
        headImgUrl: 'user/headImgUrl',
        msg: 'user/msg'
    })
   },
  mounted() {
    this.getUserInfo();
  },
    methods: {
    getUserInfo() {
        service.user.userInfo().then(res => {
           // yid.cache.set(yid.type.USER.APPID,  res.data.appId, yid.type.SYSTEM.CACHE.LOCAL_STORAGE)
            console.log('user', res.data)
            this.$store.commit('user/setUserInfo', res.data)
            //console.log('getters', this.$store.getters);
        });
    },
    signOut() {
        this.$confirm('确定要退出登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            service.auth.logout().then(res=> {
                // 清空 localstoreage
                yid.cache.remove(yid.type.USER.TOKEN, yid.type.SYSTEM.CACHE.LOCAL_STORAGE)
                yid.cache.remove(yid.type.USER.INFO, yid.type.SYSTEM.CACHE.LOCAL_STORAGE)

                // 跳转登录
                this.$router.push(yid.config.SYSTEM.ROUTER_LOGIN)
            });
        }).catch(() => {
        });
    },
    sendMsg() {
        yid.service.IM.sentMsg().then(res => {
            console.log(res);
        }).catch((res)=> {
            // yid.util.error("用户名或密码错误");
            this.deviceId = Math.uuid();
        });
    }
}
}
</script>

<style lang="scss" scoped>
.layout-content {
  padding: 0 2px;
  .top-menu {
    height:55px;
    background:rgba(255,255,255,1);
    padding: 0 50px;
    display: flex;
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
