<template>
    <el-row>
        <el-col :span=12 style="display: inline-block;padding-left: 8px">
            <div background-color="#ffffff">
                <p>
                    <img src="/images/corp_01.png">
                    <img src="/images/corp_02.png">
                </p>
            </div>
        </el-col>
        <el-col :span=12 style="display: inline-block;padding-left: 8px">
            <p>
                <img src="/images/product_00.png">
            </p>
            <div background-color="#ffffff" style="padding: 10px">
                <el-collapse accordion>
                    <el-collapse-item v-for="(item, index) in device" :key="index" :title="item.name">
                        <div v-html="item.content"></div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-col>
    </el-row>
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