<template>
    <div>
        <simpletable ref="st" :props="props" @refresh="refresh" @bclick="btnClick" @create="create"></simpletable>
    </div>
</template>
<script>
import hosts from '~/assets/config/hosts'
import simpletable from '~/components/util/simpletable';
import rpc from '~/assets/js/rpc'

let tableData = [];

const tbCols = [
    {
        colname: '1',
        title: '创建时间',
        searchable: false,
        sortable: true,
        align: 'center',
        width: '200'
    },
    {
        colname: '2',
        title: '更新时间',
        searchable: false,
        sortable: false,
        align: 'center',
        width: '200'
    },
    {
        colname: '3',
        title: '名称',
        searchable: true,
        sortable: true,
        width: ''
    },
    {
        colname: '4',
        title: '时间范围',
        searchable: false,
        sortable: false,
        width: ''
    },
    {
        colname: '6',
        title: '因子数',
        searchable: false,
        sortable: true,
        width: '100'
    },
    {
        colname: '7',
        title: '状态',
        searchable: false,
        sortable: true,
        width: '80'
    },
    {
        colname: '',
        title: '操作',
        sortable: false,
        width: '280',
        align: 'center',
        buttons:[
            {
                key: 'view',
                text: 'table.view',
                size: 'mini',
                type: 'primary',
                event: 'bclick'
            }
        ]
    }
];

const tbBtns = [
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
                title: 'analysis',
                isDown: true,
                isInfo: '源解析列表',
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
            rpc(hosts.baseHost, 'bi.list', 'source_analysis', {fields: ['id', 'createtime', 'updatetime', 'name', 'date_range', 'spec_id', 'Factors', 'status']}, (d) => {
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
        btnClick(params) {
            if (params[0] == 'view'){
                if (params[1][7]=='处理完成') {
                    this.$emit('newTab', params[1], 'menu.source_analysis');
                }
                else{
                    this.$message({
                        message: '只能查看处理完成的源解析！',
                        type: 'warning'
                    }) 
                }
            }

        },
        create() {
            this.form_refush();
            this.centerDialogVisible=true;
        },
        dataRender(d) {
            d[4] = JSON.parse(d[4]).join(',');
            switch (d[7]) {
                case -1:
                    d[7] = '处理失败';
                    break;
                case 0:
                    d[7] = '待处理';
                    break;
                case 1:
                    d[7] = '处理完成';
                    break;
            }
            return d;
        }
    },
    components: {
        simpletable
    }
};
</script>