<template>
    <el-container style="height: 100%">
        <el-header class="console-header" height="56px">
            <cheader class="console-header-cheader"></cheader>
        </el-header>

        <el-container v-bind:style="{'height': mainHeight + 'px'}">
            <el-aside class="console-side" :width="sideWidth + 'px'">
                <cmenu class="console-side-menu" ref="menu" @menuto="rt" @menuSwitch="menuSwitch"></cmenu>
            </el-aside>

            <el-main class="console-main">
                <cmain class="console-main-tabs" ref="main" @newTab="childNewTab"></cmain>
            </el-main>
        </el-container>
    </el-container>
</template>

<style>
    body {
        margin: 0px;
        background: #fefefe;
        height: 100%;
        overflow: hidden;
    }

    .console-header {
        background-color: #36a9e1;
        margin: 0px;
    }

    .console-side{
        margin: 0px;
        background-color: #383e4b;
        overflow-x: hidden;
    }

    .console-side-menu{
        margin: 0px;
        border: none;
    }

    .console-main{
        margin: 0px;
        background-color: #e8eeeb;
        padding: 2px 0px 0px 2px;
    }

    .console-main-tabs{
        margin: 0px;
        background-color: #fff;
    }
</style>

<script>
import cheader from '~/components/console/console-header';
import cmenu from '~/components/console/console-menu';
import cmain from '~/components/console/console-main';
import { Base64 } from 'js-base64';
import jsCookie from 'js-cookie'
import session from '~/assets/js/session'
import request from '~/assets/js/request'

export default {
    head () {
        return {
            title: this.$t('console.title')
        }
    },
    data() {
        return {
            mainHeight: 600,
            sideWidth: 208,
            hashDatas: [],
            isHashUnique: true
        }
    },
    mounted(){
        let defMenu = this.$refs.menu.menus[0]
        if (Object.keys(defMenu.sub).length == 0)
            this.$refs.main.addTab(defMenu.props, defMenu.index);

        try {


            if (window.location.hash) {
                jsCookie.set('console-hash', window.location.hash);
                this.hashDatas = JSON.parse(Base64.decode(window.location.hash));
                this.formatTabs();
            }
            else {
                if(jsCookie.get('console-hash')) {
                    window.location.hash = jsCookie.get('console-hash');
                    this.hashDatas = JSON.parse(Base64.decode(window.location.hash));
                    this.formatTabs();
                }
            }
        } catch(e) {
            console.log(e);
        }
        this.logon();

        this.$nextTick(() => this.mainSetHeight());
        window.addEventListener('resize', () => this.mainSetHeight());
    },
    methods:{
        logon(){
            session.logon('', '', d => {
                //if (jsCookie.get('console-hash'))
                //    location = location.pathname + jsCookie.get('console-hash');
                //else
                //    location = location.pathname;
            }, d => {
                //if (d.error.code == 10086) return session.passport.logon();

                this.$confirm('登录失效，是否重新登录？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    session.passport.logon(encodeURI(location.href));
                }).catch(() => {

                });
            });
        },
        mainSetHeight(){
            this.mainHeight = window.innerHeight - 56;
        },
        rt(el) {
            this.changeHash(el.$attrs.val, el.index);

            this.$refs.main.addTab(el.$attrs.val, el.index);
        },
        menuSwitch(isCollapse) {
            if (isCollapse)
                this.sideWidth = 64;
            else
                this.sideWidth = 208;
        },
        changeHash(props, index) {
            let hds = this.hashDatas,
                ud = {
                    index,
                    props
                };

            if(Base64.encode(JSON.stringify(ud)).length < 1024) {
                if (this.isHashUnique)
                    hds.length = 0;
                hds.push(ud);
                let hashData = Base64.encode(JSON.stringify(this.hashDatas));
                window.location.hash = hashData;
                jsCookie.set('console-hash', hashData);
            }
        },
        formatTabs() {
            this.hashDatas.forEach(hd => {
                 this.$refs.main.addTab(hd.props, hd.index);
            });
        },
        childNewTab(props, index){
            this.changeHash(props, index);
        }
    },
    components:{
        cheader,
        cmenu,
        cmain
    }
};


</script>