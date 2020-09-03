<template>
    <simpletable ref="st" :props="props" @refresh="refresh" @on-all="onAll"></simpletable>
</template>
<script>
import simpletable from '~/components/util/simpletable';
import rpc from '~/assets/js/rpc'
import aLink from '~/components/util/a-link';

let tableData = [];

const tbCols = [
    {
        colname: '2',
        title: '实例名称',
        searchable: false,
        sortable: true,
        width: ''
    },
    {
        colname: '5',
        title: 'IP地址',
        searchable: true,
        sortable: false,
        align: 'center',
        width: ''
    },
    {
        colname: '8',
        title: '镜像',
        searchable: false,
        sortable: false,
        align: 'center',
        width: '280'
    },
    {
        colname: '3',
        title: '状态',
        searchable: true,
        sortable: true,
        align: 'center',
        width: '160'
    },
    {
        colname: '7',
        title: '配置',
        searchable: false,
        sortable: true,
        align: 'center',
        width: '220'
    },
    {
        colname: '9',
        title: '带宽',
        searchable: false,
        sortable: true,
        align: 'center',
        width: '100'
    },
    {
        colname: '4',
        title: '到期时间',
        searchable: true,
        sortable: false,
        width: '120'
    },
    {
        colname: '',
        title: '操作',
        sortable: false,
        width: '280',
        align: 'center',
        render: (h, params) => {
            return h(aLink, {
                props:{
                    links:[
                        {
                            href: 'http://mutest.drcloud.cn/vnc.htm?id='+ params[1] +'&zone=bjsjs&name='+ params[2],
                            target: '_blank',
                            style: 'text-decoration: none;color: #0290cb',
                            text: 'consoleInstance.vnc'
                        },
                        {
                            href: 'http://mutest.drcloud.cn/upconfig.htm?instance'+ params[1] +'&zone=2&name='+ params[2] + '&orderid=' + params[13],
                            target: '_blank',
                            style: 'text-decoration: none;color: #0290cb',
                            text: 'consoleInstance.change'
                        },
                        {
                            href: 'http://mutest.drcloud.cn/upbandwidth.htm?instance'+ params[1] +'&zone=2&name='+ params[2] + '&orderid=' + params[13],
                            target: '_blank',
                            style: 'text-decoration: none;color: #0290cb',
                            text: 'consoleInstance.update'
                        },
                        {
                            href: 'http://mutest.drcloud.cn/renew.htm?instance'+ params[1] +'&zone=2&name='+ params[2] + '&orderid=' + params[13],
                            target: '_blank',
                            style: 'text-decoration: none;color: #0290cb',
                            text: 'consoleInstance.renew'
                        }
                    ]
                }
            }, '')
        }
    }
];

const tbBtns = [
    {
        key: 'on-all',
        content: '全部开机',
        place: 'top-end',
        btntype: 'primary',
        btnicon: 'check'
    },
    {
        key: 'refresh',
        content: '刷新',
        place: 'top-end',
        btntype: 'primary',
        btnicon: 'refresh'
    }
];

export default {
    data() {
        return {
            props : {
                title: 'instance',
                isDown: true,
                isInfo: '实例列表',
                isSinglepage: true,
                tbCols,
                tbBtns,
                tbData: tableData
            },
            tableData
        }
    },
    created() {
        this.load();
	},
    methods: {
        load (){
            rpc('http://mutest.drcloud.cn/api/v1.0/', 'instance.list', (d) => {
                if(d.result){
                    this.tableData.length = 0;
                    d.result.forEach(v => this.tableData.push(this.dataRender(v)));
                    this.$refs.st.searchReset();
                }
            })
        },
        refresh () {
            this.load();
        },
        onAll() {
            console.log(this.$refs.st.multipleSelection.map(v => v[2]));
        },
        dataRender (d) {
            let v = JSON.parse(d[5]);
            v = v.map(vd => vd + '(' + this.$t('consoleInstance.wan') + ')');
            let v1 = JSON.parse(d[6]);
            v1 = v1.map(vd => vd + '(' + this.$t('consoleInstance.lan') + ')');
            v.push(...v1);
            d[5] = v.join('<br>');
            return d;
        }
    },
    components: {
        simpletable,
        aLink
    }
};
</script>