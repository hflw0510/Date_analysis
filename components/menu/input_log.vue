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
        title: '文件名',
        searchable: false,
        sortable: false,
        align: 'center',
        width: ''
    },
    {
        colname: '3',
        title: '来源类型',
        searchable: false,
        sortable: false,
        width: 80
    },
    {
        colname: '4',
        title: '数据类型',
        searchable: false,
        sortable: false,
        width: 80
    },
    {
        colname: '5',
        title: '条数',
        searchable: false,
        sortable: false,
        width: 60
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
                rpc(hosts.baseHost, 'Search.Get_Log', params, 'input', (d) => {
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
            switch (d[3]){
                case 'ajl':
                    d[3] = '安捷伦';
                    break;
                case 'rd':
                    d[3] = '热电';
                    break;
            }
            switch (d[4]){
                case 'type_a':
                    d[4] = '正常数据';
                    break;
                case 'type_b':
                    d[4] = '内标数据';
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