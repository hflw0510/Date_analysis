<template>
    <div>
        <simpletable ref="st" :props="props" @refresh="refresh" @bclick="btnClick" @search="server_search"></simpletable>
        <el-dialog
            title="日志"
            :visible.sync="centerDialogVisible"
            width="40%"
            center
        >
            <el-form ref="form" :model="form" ret="form" label-width="10px" label-position="left">
                <el-form-item>
                    <el-input type="textarea" autosize v-model="form.memo"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import hosts from '~/assets/config/hosts'
import method_name from '~/assets/config/method'
import simpletable from '~/components/util/simpletable';
import rpc from '~/assets/js/rpc'

let tableData = [];

const tbCols = [
    {
        colname: '1',
        title: '创建时间',
        searchable: false,
        sortable: false,
        align: 'center',
        width: '280'
    },
    {
        colname: '2',
        title: '用户名',
        searchable: false,
        sortable: false,
        align: 'center',
        width: '200'
    },
    {
        colname: '3',
        title: '操作功能',
        searchable: false,
        sortable: false,
        width: ''
    },
    {
        colname: '',
        title: '操作',
        sortable: false,
        width: '280',
        align: 'center',
        buttons:[
            {
                key: 'edit',
                text: 'table.edit',
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
            form: {
                memo: ''
            },
            props : {
                title: 'input_log',
                isDown: true,
                isInfo: '导入日志',
                isSinglepage: true,
                tbCols,
                tbBtns,
                tbData: tableData,
                noSelect: true,
                isSearch: true
            },
            tableData,
            centerDialogVisible: false
        }
    },
    created() {

	},
    methods: {
        server_search (params){
            if (params){
                rpc(hosts.baseHost, 'Search.Get_Log', params, 'error', (d) => {
                    if(d.result){
                        this.tableData.length = 0;
                        d.result.forEach(v => this.tableData.push(this.dataRender(v)));
                        this.$refs.st.searchReset();
                    }
                })
            }
            else{
                this.$message({
                    message: '请选择时间！',
                    type: 'warning'
                });
            }
        },
        refresh () {
            this.tableData.length = 0;
            this.$refs.st.searchReset();
        },
        btnClick(params) {
            switch (params[0]){
                case 'edit' :
                    this.form.memo = params[1].join('\n');
                    this.centerDialogVisible = true;
                    break;
            }

        },
        dataRender(d) {
            if (d[3].toLowerCase() in method_name){
                d[3] = method_name[d[3].toLowerCase()];
            }
            return d;
        }
    },
    components: {
        simpletable
    }
};
</script>