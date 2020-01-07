<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <Card class="login-con">
            <div style="display: flex;justify-content: center;margin-bottom:20px">
                <h3>登录</h3>
            </div>
            <Form ref="formInline" :model="formInline" :rules="ruleInline">
                <FormItem prop="user">
                    <Input type="text" v-model="formInline.user" placeholder="邮箱">
                        <Icon style="height: 14px" type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="formInline.password" placeholder="密码">
                        <Icon style="height: 14px" type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" long @click="handleSubmit('formInline')">验证</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {login} from '@/api/user'

    export default {
        name: 'login',

        data() {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {
                            type: 'string',
                            min: 6,
                            message: '密码长度不能小于6位',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            ...mapActions([
                'handleLogin'
            ]),
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const param = new FormData();
                        param.append('mobilephone', this.formInline.user);
                        param.append('password', btoa(this.formInline.password));
                        login(param).then(res => {
                            if (res.data.code === 200) {
                                this.handleLogin(res.data.data).then(() => {
                                    this.$router.push({
                                        name: this.$config.homeName
                                    })
                                });
                            } else if (res.data.code === 300) {
                                this.$Message.error('账号或密码错误');
                            }
                        });
                    } else {
                        this.$Message.error('请填写账号密码!!');
                    }
                })
            },
        }
    }
</script>

<style>

</style>
