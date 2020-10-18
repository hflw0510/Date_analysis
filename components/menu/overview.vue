<template>
    <div background-color="#ffffff" style="padding: 10px">
        <h1>公司简介</h1>
        <div>
            <el-collapse>
                <el-collapse-item v-for="(item, index) in device" :key="index" :title="item.name">
                    <div v-html="item.content"></div>
                </el-collapse-item>
            </el-collapse>
        </div>

    </div>
</template>

<script>
import hosts from '~/assets/config/hosts'
import rpc from '~/assets/js/rpc'

export default {
    data () {
        return {
            device: []
        }
    },
    mounted(){

    },
    created() {
        this.load();
	},
    methods: {
        load (){
            rpc(hosts.baseHost, 'bi.list', 'device', '', (d) => {
                if(d.result){
                    d.result.forEach(v => {
                        if (v[5] == 0){
                            this.device.push({
                                name: v[3],
                                content: v[4]
                            });
                        }
                    });
                }
            })
        },
    }
}
</script>