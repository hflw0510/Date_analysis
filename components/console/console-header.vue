<template>
    <el-row>
        <el-col :span="8">
            <div class="header-left"><img src="/images/nlogo.png" alt="Admin Pro">北京鹏宇昌亚在线源解析系统</div>
        </el-col>
        <el-col :span="16">
            <div class="header-right">
            <el-dropdown :hide-timeout="ht" :show-timeout="st" @command="handleCommand">
                <i class="el-icon-user"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>  
                
            </div>
        </el-col>
    </el-row>
</template>

<style>
    .header-left {
        height: 60px;
        font-size: 20px;
        color: #000000;
        font-weight:bold;
    }

    .header-left img {
        height: 80%;
        padding: 0 10px 6px 20px;
        vertical-align: middle;
    }

    .header-right {
        text-align: right;
        padding: 0 20px;
        vertical-align: middle;
    }

    .header-right i{
        vertical-align: middle;
        margin: 10px
    }


</style>
<script>
//import zoneList from '~/components/console/zonelist';
import session from '~/assets/js/session'

export default {
    data() {
        return {
            ht: 500,
            st: 100

        }
    },
    methods:{
        handleCommand(command) {
            switch (command){
                case 'logout':
                    session.logoff();
                    break;

               }
           
        }
    },
    components:{

    }
}

</script>