<template>
  <div class="login">
    <div class="login-header">
      <div class="header-left">
        <span class="header-left-title">{{ $yid.config.SYSTEM.TITLE }}</span>
      </div>
      <div class="header-right">
        <span class="header-right-title">您好！请登录</span>
      </div>
    </div>

    <div class="login-content">
      <div class="login-form">
        <div class="login-form-left">
          <div class="circle circle-one"></div>
          <div class="circle circle-two"></div>
          <div class="circle circle-three"></div>
          <div class="login-form-bg"></div>
        </div>
        <div class="login-form-right">
          <el-form @keyup.enter.native="signIn" @submit.native.prevent>
            <el-form-item label=" ">
              <el-input
                placeholder="请输入登录账号"
                prefix-icon="el-icon-user"
                ref="username"
                size="large"
                v-model.trim="model.username">
                <transition name="bounceRight" slot="suffix">
                  <i
                    :title="warning.message"
                    class="warning el-input__icon el-icon-warning"
                    v-show="warning.type === 'username'"></i>
                </transition>
              </el-input>
            </el-form-item>
            <el-form-item label=" ">
              <el-input
                placeholder="请输入登录密码"
                prefix-icon="el-icon-unlock"
                ref="password"
                size="large"
                type="password"
                v-model.trim="model.password">
                <transition name="bounceRight" slot="suffix">
                  <i
                    :title="warning.message"
                    class="warning el-input__icon el-icon-warning"
                    v-show="warning.type === 'password'"></i>
                </transition>
              </el-input>
            </el-form-item>
            <el-form-item label=" ">
              <el-input
                placeholder="请输入登录验证码"
                prefix-icon="el-icon-unlock"
                ref="validCode"
                size="large"
                v-model.trim="model.validCode">
                <transition name="bounceRight" slot="suffix">
                  <!--                  <i :title="warning.message" class="warning el-input__icon el-icon-warning" v-show="warning.type === 'password'"></i>-->
                </transition>
              </el-input>
            </el-form-item>

            <img
              class="login-captcha"
              :src="config.API.BASE + 'api-uaa/validata/code/' + this.deviceId"
              style=""
              @click="changeCode()" />
            <el-form-item label=" ">
              <el-button @click="signIn" size="large" type="primary"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import yid from '@src/library'
import { error } from '../../library/helper/util'
import service from '../../service'
import config from '@src/config'
export default {
  data() {
    return {
      config: config,
      model: {
        username: '',
        password: '',
        validCode: ''
      },
      deviceId: '',
      warning: {
        type: '',
        message: ''
      }
    }
  },
  created() {
    //console.log("enter");
    if (yid.cache.get(yid.type.USER.TOKEN)) {
      this.$router.push(yid.config.SYSTEM.DIRECT_HOME)
    }
  },
  mounted() {
    this.$refs.username.focus()
    this.deviceId = Math.uuid()
  },

  methods: {
    changeCode() {
      this.deviceId = Math.uuid()
    },
    async signIn() {
      if (this.validateForm()) {
        const params = this.model
        params.deviceId = this.deviceId
        let promise = await this.$yid.service.icdriver.getMac()
        params.mac = promise
        yid.service.auth
          .login(params)
          .then(res => {
            // 存储登录信息到本地缓存
            yid.cache.set(
              yid.type.USER.TOKEN,
              res.data.access_token,
              yid.type.SYSTEM.CACHE.LOCAL_STORAGE
            )
            yid.cache.set(
              yid.type.USER.APPID,
              process.env.VUE_APP_CLIENTID,
              yid.type.SYSTEM.CACHE.LOCAL_STORAGE
            )
            yid.cache.set(
              yid.type.USER.TENANTID,
              res.data.tenantId,
              yid.type.SYSTEM.CACHE.LOCAL_STORAGE
            )

            // 跳转登录后首页
            this.$router.push(yid.config.SYSTEM.DIRECT_HOME)
          })
          .catch(res => {
            // yid.util.error("用户名或密码错误");
            this.deviceId = Math.uuid()
            yid.util.error(res.data.resp_msg)
          })
      }
    },

    validateForm() {
      this.warning.type = ''
      this.warning.message = ''

      if (!this.model.username) {
        this.warning.type = 'username'
        this.warning.message = '请输入账户名'
        this.$refs.username.focus()
        return false
      }

      if (!this.model.password) {
        this.warning.type = 'password'
        this.warning.message = '请输入密码'
        this.$refs.password.focus()
        return false
      }

      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  transition: width 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;

  .login-header {
    width: 100%;
    min-height: 55px;
    height: 55px;
    background: #00c6ae;
    margin: 0 auto;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left {
      display: flex;
      align-items: center;
      margin: 0 0 0 10px;

      .header-left-title {
        font-size: 22px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;

        &:before {
          content: '';
          margin: 0 16px 0 4px;
          width: 30px;
          height: 26px;
          background-image: url('~@src/assets/images/logo.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: inline-block;
          vertical-align: bottom;
        }

        i {
          margin-right: 16px;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      margin: 0 30px 0 0;

      .header-right-title {
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;
      }
    }
  }

  .login-content {
    flex: 1;

    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('~@src/assets/images/login-bg.png');
    background-repeat: round;

    .login-form {
      width: 940px;
      height: 446px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 16px 0px rgba(0, 192, 168, 1);
      border-radius: 8px;
      display: inline-flex;

      .login-form-left,
      .login-form-right {
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
      }

      .login-form-left {
        display: flex;
        justify-content: center;
        align-items: center;

        .login-form-bg {
          width: 369px;
          height: 314px;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url('~@src/assets/images/login-form-bg.png');
        }
      }

      .login-form-right {
        width: 310px;
        margin: 0 auto;

        .el-form {
          width: 100%;

          .el-input {
            margin: 0 0 10px 0;
            width: 90%;
          }

          .el-button {
            margin: 10px 0 0 0;
            width: 90%;
          }

          .warning {
            position: relative;
            right: -40px;
            color: #ff6363;
            font-size: 20px;

            cursor: pointer;
          }
        }
      }
    }
  }

  .circle {
    display: inline-block;
    border-radius: 50%;
    margin: 0;
    background: #00c6ae;

    &.circle-one {
      position: relative;
      top: 50px;
      left: -70px;
      width: 24px;
      height: 24px;
      -webkit-animation: gogogo 2s infinite linear;
    }
    &.circle-two {
      position: relative;
      top: 50px;
      left: -105px;
      width: 18px;
      height: 18px;
      -webkit-animation: gogogo 2s infinite linear;
    }
    &.circle-three {
      position: relative;
      top: -10px;
      left: -140px;
      width: 12px;
      height: 12px;
      -webkit-animation: gogogo2 2s infinite linear;
    }
  }

  @-webkit-keyframes gogogo {
    0% {
      -webkit-transform: rotate(0deg);
      background: #00c6ae;
    }
    50% {
      -webkit-transform: rotate(180deg);
      background: #fff;
    }
    100% {
      -webkit-transform: rotate(360deg);
      background: #00c6ae;
    }
  }

  @-webkit-keyframes gogogo2 {
    0% {
      -webkit-transform: rotate(0deg);
      background: #fff;
    }
    50% {
      -webkit-transform: rotate(180deg);
      background: #00c6ae;
    }
    100% {
      -webkit-transform: rotate(360deg);
      background: #fff;
    }
  }
}
</style>
