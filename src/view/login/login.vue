<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p v-if="!accountError" class="login-tip">账号密码请联系管理员获取</p>
          <p v-if="accountError" class="login-tip" style="color: red">账号或密码错误,请重试!</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
    import LoginForm from '_c/login-form'
    import {mapActions} from 'vuex'

    export default {
        components: {
            LoginForm
        },
        data() {
            return {
                accountError: false,
            }
        },
        methods: {
            ...mapActions([
                'handleLogin',
                'getUserInfo'
            ]),
            handleSubmit({userName, password}) {
                this.handleLogin({userName, password}).then(() => {
                    localStorage.setItem('token','这是一个假的token');
                    this.$router.push({
                        name: this.$config.homeName
                    })
                })
                setTimeout(() => {
                    this.accountError = true
                }, 500)
            }
        }
    }
</script>

<style>

</style>
