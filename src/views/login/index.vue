<template>
  <el-container class="login-container">
    <el-header>
      <div class="web-app"><a>物联卡管家</a></div>
    </el-header>
    <el-main>
      <div class="login-bg-div">
        <el-row>
          <el-col style="text-align: center;margin-top: 60px;">
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
          </el-col>
        </el-row>
      </div>
    </el-main>
    <el-footer>
      <div class="wrap">
        <div class="footer-service">
          <dl class="service-about">
            <dt>关于我们</dt>
            <dd>关于物联卡管家</dd>
            <dd>平台服务协议</dd>
            <dd>联系我们</dd>
          </dl>
          <dl class="service-support">
            <dt>服务支持</dt>
            <dd>开发文档</dd>
            <dd>合作洽谈</dd>
            <dd>帮助中心</dd>
          </dl>
          <dl class="service-support">
            <dt>法律信息</dt>
            <dd>使用协议</dd>
            <dd>私隐政策</dd>
            <dd>法律声明</dd>
          </dl>
          <dl class="service-help">
            <dt>客服帮助</dt>
            <dd>自助服务</dd>
            <dd>客服：0755-86221990</dd>
            <dd>（工作时间：09:00-22:00）</dd>
          </dl>
          <dl class="service-qrcode">
            <dt>扫码联系客服</dt>
            <dd>
              <img class="img-qrcode" src="https://image.wulianguanjia.cn/file/images/favicon/customer_servicer.jpg" alt="">
            </dd>
          </dl>
        </div>

        <div class="footer-copyright">
          <p><a href="https://beian.miit.gov.cn">粤ICP备09032741号</a></p>
          <p>Copyright © 2020-2022 物联卡管家. All rights reserved.</p>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { isLength } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isLength(value, 1, 32)) {
        callback(new Error('用户名不合法！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!isLength(value, 6, 32)) {
        callback(new Error('密码不合法！'))
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
              console.log(this.redirect)
              this.$router.push({ path: this.redirect || '/' })
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
  .el-header{
    height: 88px!important;
    padding: 22px 0;
  }
  .web-app{
    width: 1200px;
    margin: 0 auto;
    padding:.7rem 0 .7rem 3rem;
    background-image: url("https://www.wulianguanjia.cn/image/favicon/256.png");
    background-repeat: no-repeat;
    background-position: .5rem center;
    background-size: 32px 32px;
    a{
      color: #444;
    }
  }
  .el-main{
    width: 100%;
    position: relative;
    padding: 0;
    .login-bg-div{
      background-image: url("https://www.wulianguanjia.cn/image/welcome/bg-26.jpg");
      height: 100%;
    }
  }
  .el-footer{
    position: relative;
    margin:  0 auto;
    padding: 7px 0 9px;
    width: 1200px;
    .wrap{
      padding: 43px 0 23px;
      .footer-service{
        overflow: hidden;
        .service-about{
          padding-left: 0;
          margin-left: 0;
          border-left: none;
        }
        dt{
          margin-bottom: 21px;
        }
        dl{
          padding-left: 66px;
          margin-left: 66px;
          min-height: 155px;
          height: auto!important;
          float: left;
          font-size: 20px;
        }
        dd{
          margin-top: 7px;
          margin-left: 0;
          font-size: 16px;
          color: #9c9c9c;
        }
        .service-qrcode{
          float: right;
          margin-left: 0;
          border-left: 1px solid #484a4a;
          .img-qrcode{
            width: 129px;
            height: 129px;
          }
        }
      }
      .footer-copyright{
        margin-top: 30px;
        text-align: center;
        font: 12px/1.8 "Helvetica Neue","Hiragino Sans GB","Microsoft YaHei","\9ED1\4F53",Arial,sans-serif;
        p{
          margin: 0;
        }
      }
    }
  }
  .title {
    font-size: 54px;
    font-weight: 500;
    color: #fff;
  }
  .title-tips {
    margin-top: 29px;
    font-size: 26px;
    font-weight: 400;
    color: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .login-btn {
    display: inherit;
    width: 100%;
    height: 60px;
    margin-top: 5px;
    border: 0;
    &:hover {
      opacity: 0.9;
    }
  }
  .login-form {
    position: relative;
    width: 400px;
    margin: 0 auto;
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
}
</style>
