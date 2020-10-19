<template>
    <el-container style="height: 100%">
        <el-header class="logon-header" height="106px">
            
        </el-header>

        <el-container>
            <el-main class="logon-main">
                <div class="logon-main-logo">
                    <img src="/images/nlogo.png" alt="logo">
                </div>
                <div class="logon-main-title">北京鹏宇昌亚在线源解析系统</div>
                <div class="logon-main-title-1">Beijing PYCY online source apportionment system</div>
                <div class="logon-main-user">
                    <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="user" ref="user"></el-input>
                </div>
                <div class="logon-main-pwd">
                    <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="pwd" show-password @keyup.enter.native="logon"></el-input>
                </div>
                <div class="logon-main-submit">
                    <el-button type="primary" @click="logon" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                </div>
            </el-main>
        </el-container>

        <el-footer class="logon-footer" height="56px">
            Copyright © 2020 北京鹏宇昌亚环保科技有限公司
        </el-footer>
    </el-container>
</template>

<style>
    body {
        margin: 0px;
        background-image: url('/images/bg.png');
        background-repeat:no-repeat;
        background-size:100%;
        height: 100%;
        line-height: 1.5;
        font-size: 14px;
        background-repeat: no-repeat;
        background-size: 100%;
        overflow: hidden;
    }

    .logon-header {
        margin: 0px;
    }

    .logon-main{
        text-align: center;
        margin: 0px;
        height: 768px;
        color: #808695;
        padding: 2px 0px 0px 2px;
    }

    .logon-main-logo img {
        height: 90px;
        padding: 0px 0px 20px 0px;
    }

    .logon-main-title {
        font-size: 32px;
        color: #000000;
        font-weight:bold;
    }

    .logon-main-title-1 {
        font-size: 14px;
        color: #000000;
        font-weight:bold;
    }

    .logon-main-user {
        flex: 1;
        padding: 38px 0;
        text-align: center;
        width: 384px;
        margin: 0 auto;
    }

    .logon-main-pwd {
        flex: 1;
        padding: 0 0 28px 0;
        text-align: center;
        width: 384px;
        margin: 0 auto;
    }

    .logon-main-submit {
        flex: 1;
        text-align: center;
        width: 384px;
        margin: 0 auto;
    }

    .logon-main-submit button{
        width: 100%
    }

    .logon-footer {
        flex: 1;
        color: #000000;
        text-align: center;
        margin: 0 auto;
    }

</style>

<script>

import session from '~/assets/js/session'

export default {
    head () {
        return {
            title: '北京鹏宇昌亚在线源解析系统'

        }
    },
    data () {
        return {
            user: '',
            pwd: '',
            fullscreenLoading: false
        }
    },
    mounted(){
        this.$refs.user.focus();
    },
    methods: {
        logon(){
            this.fullscreenLoading = true;
            session.logon(this.user, this.pwd, d => {
                this.fullscreenLoading = false;
                location = '/console';
            }, d => {
                this.$message.error('用户名密码错误，请重新登录');
                this.fullscreenLoading = false;
            });
        }
    }
};
</script>