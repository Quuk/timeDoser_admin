<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <Card class="login-con" icon="log-in" title="欢迎登录" :bordered="false">
            <Form :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
                <FormItem prop="userName">
                    <Input v-model="form.userName" placeholder="请输入用户名">
                        <span slot="prepend">
                            <Icon :size="16" type="ios-person"></Icon>
                        </span>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="form.password" placeholder="请输入密码">
                        <span slot="prepend">
                          <Icon :size="14" type="md-lock"></Icon>
                        </span>
                    </Input>
                </FormItem>
                <FormItem>
                    <Button @click="handleSubmit" type="primary" long>登录</Button>
                </FormItem>
            </Form>
            <p v-if="accountError" prop="userName" class="login-tip">账号或密码错误,请重试!</p>
        </Card>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        name: 'login',
        props: {
            userNameRules: {
                default: () => {
                    return [{
                        required: true,
                        message: '账号不能为空',
                        trigger: 'blur'
                    }]
                }
            },
            passwordRules: {
                default: () => {
                    return [{
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }]
                }
            }
        },
        data() {
            return {
                accountError: false,
                form: {
                    userName: '',
                    password: ''
                }
            }
        },
        computed: {
            rules() {
                return {
                    userName: this.userNameRules,
                    password: this.passwordRules
                }
            }
        },
        methods: {
            ...mapActions([
                'handleLogin',
                'getUserInfo'
            ]),
            handleSubmit() {
                if (this.form.userName === '' || this.form.password === '') {
                    return;
                }

                console.log(this.form);
                this.accountError = true
                // this.handleLogin({userName, password}).then(() => {
                //     localStorage.setItem('token', '这是一个假的token');
                //     this.$router.push({
                //         name: this.$config.homeName
                //     })
                // });
                // setTimeout(() => {
                //     this.accountError = true
                // }, 500)
            }
        }
    }
</script>

<style>

</style>
