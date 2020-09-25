<template>
    <el-col>
        <el-menu class="console-side-menu" background-color="#383e4b">
            <el-menu-item class="console-side-menu-i" index="switch-button">
                <i :class="menuSwitchButton" @click="menuSwitch"></i>
                <span></span>
            </el-menu-item>
        </el-menu>
        <el-menu :default-active="active" :collapse="isCollapse" :collapse-transition="collapseTransition" :unique-opened="uniqueOpened" class="console-side-menu" background-color="#383e4b" text-color="#fff" active-text-color="#ffd04b">
                <el-menu-item class="console-side-menu-i" v-for="menu in menus" :key="menu.index" :val="menu.props" v-if="!Object.keys(menu.sub).length" :index="menu.index" @click="rt">
                    <i :class="menu.icon"></i>
                    <span slot="title">{{$t(menu.index)}}</span>
                </el-menu-item>
                <el-submenu class="console-side-menu-s" v-for="menu in menus" :key="menu.index" v-if="Object.keys(menu.sub).length" :index="menu.index">
                    <template slot="title">
                        <i :class="menu.icon"></i>
                        <span slot="title">{{$t(menu.index)}}</span>
                    </template>
                    <el-menu-item v-for="(v, k) in menu.sub" :index="k" :key="k" :val="v" @click="rt">{{$t(k)}}</el-menu-item>
                </el-submenu>
        </el-menu>
    </el-col>
</template>
<style>
    .console-side-menu{
        margin: 0px;
        border: none;
    }
    .console-side-menu-i{
        padding-left: 0px;
    }
    .console-side-menu-s{
        padding-left: 0px;
    }

</style>
<script>

import menus from '~/assets/config/console-menu'

export default {
    data () {
        return {
            'active': '',
            'collapseTransition': false,
            'uniqueOpened': true,
            'isCollapse': false,
            'menuSwitchButton': 'el-icon-d-arrow-left',
            menus
        }

    },
    methods: {
        rt: function(el) {
            this.$emit('menuto', el);
        },
        menuSwitch() {
            if (this.isCollapse)
                this.menuSwitchButton = 'el-icon-d-arrow-left'                
            else
                this.menuSwitchButton = 'el-icon-d-arrow-right'
            this.isCollapse = !this.isCollapse;
            this.$emit('menuSwitch', this.isCollapse);
        }
    }
}
</script>