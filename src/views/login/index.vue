<template>
  <div class="login-container">
    <el-container>
      <el-header>
        <div class="web-app">
          <span>物联卡管家</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="70%"></el-aside>
        <el-main>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            label-position="left"
          >
            <div class="title">hello !</div>
            <div class="title-tips">欢迎来到物联卡管家！</div>
            <el-form-item style="margin-top: 40px" prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model.trim="loginForm.username"
                placeholder="请输入用户名"
                tabindex="1"
                type="text"
              />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model.trim="loginForm.password"
                :type="passwordType"
                tabindex="2"
                placeholder="请输入密码"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <el-button
              :loading="loading"
              class="login-btn"
              type="primary"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form>
        </el-main>
      </el-container>
      <el-footer>
        <div class="footer">
          <div class="wrap">
            <div class="footer-service">
              <dl class="service-about">
                <dt>公司信息</dt>
                <dd><a target="_blank">公司简介</a></dd>
                <dd><a target="_blank">资讯动态</a></dd>
              </dl>
              <dl class="service-support">
                <dt>联系我们</dt>
                <dd><a target="_blank">客服服务</a></dd>
                <dd><a target="_blank">合作洽谈</a></dd>
                <dd><a target="_blank">帮助中心</a></dd>
              </dl>
              <dl class="service-friend">
                <dt>关于我们</dt>
                <dd><a target="_blank">官方微信</a></dd>
                <dd><a target="_blank">腾讯微博</a></dd>
                <dd><a target="_blank">新浪微博</a></dd>
              </dl>
              <dl class="service-help">
                <dt>法律信息</dt>
                <dd><a target="_blank">服务协议</a></dd>
                <dd><a target="_blank">私隐政策</a></dd>
                <dd><a target="_blank">法律声明</a></dd>
              </dl>
              <dl class="service-qrcode">
                <dt>扫码联系客服</dt>
                <dd>
                  <img class="img-qrcode"  src="https://image.wulianguanjia.cn/file/images/favicon/customer_servicer.jpg" alt="">
                </dd>
              </dl>
            </div>
            <div class="footer-copyright">
              <a id="beian" href="https://beian.miit.gov.cn">粤ICP备09032741号</a>
              <p>Copyright © 2020-2022 All rights reserved.</p>
            </div>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import store from '@/store'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // 带查询参数，类似变成 /register?plan=private
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  .web-app{
    padding: .7rem 0 .7rem 3rem;
    background-image: url('~@/assets/login_images/logo.png');
    background-repeat: no-repeat;
    background-position: .5rem center;
    background-size: 32px 32px;
  }
  .el-aside {
    height: 88vh;
    margin-bottom: 0;
    background: url('~@/assets/login_images/background2.jpg');
    background-size: cover;
  }
  .el-header {
    background-color: #fff;
    color: #333;
    line-height: 30px;
  }
  .title {
    font-size: 54px;
    font-weight: 500;
    color: rgba(14, 18, 26, 1);
  }
  .title-tips {
    margin-top: 29px;
    font-size: 26px;
    font-weight: 400;
    color: rgba(14, 18, 26, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .login-btn {
    display: inherit;
    width: 220px;
    height: 60px;
    margin-top: 5px;
    border: 0;
    &:hover {
      opacity: 0.9;
    }
  }
  .login-form {
    position: relative;
    max-width: 100%;
    margin: calc((100vh - 425px) / 2) 10% 10%;
    overflow: hidden;
    .forget-password {
      width: 100%;
      margin-top: 40px;
      text-align: left;
      .forget-pass {
        width: 129px;
        height: 19px;
        font-size: 20px;
        font-weight: 400;
        color: rgba(92, 102, 240, 1);
      }
    }
  }
  .tips {
    margin-bottom: 10px;
    font-size: $base-font-size-default;
    color: $light-blue;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .title-container {
    position: relative;
    .title {
      margin: 0 auto 40px auto;
      font-size: 34px;
      font-weight: bold;
      color: $base-color-blue;
      text-align: center;
    }
  }
  .svg-container {
    position: absolute;
    top: 14px;
    left: 15px;
    z-index: $base-z-index;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }
  .show-password {
    position: absolute;
    top: 14px;
    right: 25px;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }
  ::v-deep {
    .el-form-item {
      padding-right: 0;
      margin: 20px 0;
      color: #454545;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 2px;
      &__content {
          min-height: $base-input-height;
        line-height: $base-input-height;
      }
      &__error {
        position: absolute;
        top: 100%;
        left: 18px;
        font-size: $base-font-size-small;
        line-height: 18px;
        color: $base-color-red;
      }
    }
    .el-input {
      box-sizing: border-box;
      input {
        height: 58px;
        padding-left: 45px;
        font-size: $base-font-size-default;
        line-height: 58px;
        color: $base-font-color;
        background: #f6f4fc;
        border: 0;
        caret-color: $base-font-color;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 15px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
  .el-footer {
    background-color: #404343;
    color: #9D9D9D;
    height: 100%!important;
    font-size: 14px;
  }
  .footer .wrap{
    padding: 43px 0 23px;
  }
  .wrap{
    width: 1120px;
    margin: 0 auto;
  }
  .footer a{
    color: #9D9D9D !important;
  }
  a{
    text-decoration: none;
  }
  .footer .footer-service{
    overflow: hidden;
  }
  .footer .footer-service .service-about{
    padding-left: 0;
    margin-left: 0;
    border-left: none;
  }
  .footer .footer-service dl{
    float: left;
    padding-left: 43px;
    margin-left: 43px;
    min-height: 155px;
    height: auto!important;
    height: 155px;
  }
  .footer .footer-service .service-qrcode{
    float: right;
    margin-left: 0;
    border-left: 1px solid #484a4a;
  }
  .footer .footer-service .service-qrcode .img-qrcode{
    width: 129px;
    height: 129px;
  }
  .footer .footer-service .service-qrcode dt{
    font-size: 10px;
    margin-bottom: 12px;
  }
  .footer .footer-service dt{
    color: #fff;
    margin-bottom: 21px;
  }
  .footer .footer-service dd{
    margin-top: 7px;
  }
  dd{
    display: block;
    margin-inline-start: 40px;
    margin-left: 0px;
  }
  .footer .footer-copyright{
    margin-top: 30px;
    text-align: center;
    font-size: 12px;
  }
}
</style>
