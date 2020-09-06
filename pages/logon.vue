<template>
    <el-container style="height: 100%">
        <el-header class="logon-header" height="56px">
            
        </el-header>

        <el-container>
            <el-main class="logon-main">
                <div class="logon-main-logo">
                    <img src="/images/logo.png" alt="logo">
                </div>
                <div class="logon-main-title">Admin Pro 在线源数据分析系统</div>
                <div class="logon-main-user">
                    <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="user"></el-input>
                </div>
                <div class="logon-main-pwd">
                    <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="pwd" show-password @keyup.enter.native="logon"></el-input>
                </div>
                <div class="logon-main-submit">
                    <el-button type="primary" @click="logon">登录</el-button>
                </div>
            </el-main>
        </el-container>

        <el-footer class="logon-footer" height="56px">
            Copyright © 2020 北京AdminPro科技有限公司
        </el-footer>
    </el-container>
</template>

<style>
    body {
        margin: 0px;
        background-color: #f7f7f7;
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
        background-image: url('/images/bg.svg');
        margin: 0px;
        height: 768px;
        color: #808695;
        padding: 2px 0px 0px 2px;
    }

    .logon-main-logo img {
        height: 75px;
    }

    .logon-main-user {
        flex: 1;
        padding: 28px 0;
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
        color: #808695;
        text-align: center;
        margin: 0 auto;
    }

</style>

<script>

import session from '~/assets/js/session'

export default {
    head() {
        return {
        }
    },
    data () {
        return {
            user: '',
            pwd: ''
        }
    },
    mounted(){

    },
    methods: {
        logon(){
            session.logon(this.user, this.pwd, d => {
                location = '/console';
            }, d => {
                this.$message.error('用户名密码错误，请重新登录');
            });
        }
    }
};
</script>