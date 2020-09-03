<template>
    <div>
        <template v-for="(l, key) in ls">
            <span v-if="key>0" :key="'span_' + key"> | </span>
            <a :key="'a_' + key" :href="l.href" :target="l.target" :style="l.style">
                {{ $t(l.text) }} 
            </a>
        </template>
        <br>
        <el-dropdown
            split-button
            type="primary"
            size="mini"
        >
            编辑名称
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>重启实例</el-dropdown-item>
                <el-dropdown-item>关闭实例</el-dropdown-item>
                <el-dropdown-item>编辑安全组</el-dropdown-item>
                <el-dropdown-item>重置系统</el-dropdown-item>
                <el-dropdown-item>重置密码</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>

export default {
    props: ['links'],
    data () {
        return {
            ls: this.links
        }
    }
}
</script>
