<template>
    <div>
        <simpletable ref="st" :props="props" @refresh="refresh" @bclick="btnClick" @create="create"></simpletable>
        <el-dialog
            title="设备管理"
            :visible.sync="centerDialogVisible"
            width="40%"
            center
        >
            <el-form ref="form" :model="form" :rules="rules" ret="form" label-width="80px" label-position="left">
                <el-form-item label="设备名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-input v-model="form.createtime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-input v-model="form.updatetime" disabled></el-input>
                </el-form-item>
                <el-form-item label="设备信息">
                    <el-input v-model="form.info" type="textarea" :autosize="{ minRows: 6, maxRows: 10}"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.status"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="form_submit">确定</el-button>
                    <el-button @click="centerDialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import hosts from '~/assets/config/hosts'
import simpletable from '~/components/util/simpletable';
import rpc from '~/assets/js/rpc'
import c_button from '~/components/util/button';

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
        title: '更新时间',
        searchable: false,
        sortable: false,
        align: 'center',
        width: '280'
    },
    {
        colname: '3',
        title: '设备名称',
        searchable: true,
        sortable: true,
        width: ''
    },
    {
        colname: '5',
        title: '状态',
        searchable: true,
        sortable: true,
        align: 'center',
        width: '160'
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
                text: '编辑',
                size: 'mini',
                type: 'primary',
                event: 'bclick'
            },
            {
                key: 'delete',
                text: '删除',
                size: 'mini',
                type: 'danger',
                event: 'bclick'
            }
        ]
    }
];

const tbBtns = [
    {
        key: 'create',
        content: '创建',
        place: 'top-end',
        btntype: 'primary',
        btnicon: 'circle-plus'
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
            form: {
                id: 0,
                name: '',
                createtime: '',
                updatetime: '',
                info: '',
                status: true
            },
            rules: {
                name: [
                    { required: true, message: '请输入设备名称', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ]
            },
            props : {
                title: 'device',
                isDown: true,
                isInfo: '设备列表',
                isSinglepage: true,
                tbCols,
                tbBtns,
                tbData: tableData
            },
            tableData,
            centerDialogVisible: false
        }
    },
    created() {
        this.load();
	},
    methods: {
        load (){
            rpc(hosts.baseHost, 'bi.list', 'device', '', (d) => {
                if(d.result){
                    this.tableData.length = 0;
                    d.result.forEach(v => this.tableData.push(this.dataRender(v)));
                    this.$refs.st.searchReset();
                }
            })
        },
        delete(id) {
            if (!id) return 
            rpc(hosts.baseHost, 'bi.delete', 'device', id, (d) => {
                if(d.result){
                    this.$message({
                        message: '设备信息删除成功',
                        type: 'warning'
                    });
                    this.load();
                }
                else {
                    this.$message.error('设备信息删除失败');
                }
            })
        },
        refresh () {
            this.load();
        },
        btnClick(params) {
            switch (params[0]){
                case 'edit' :
                    this.form.id = params[1][0];
                    this.form.createtime = params[1][1];
                    this.form.updatetime = params[1][2];
                    this.form.name = params[1][3];
                    this.form.info = params[1][4];
                    this.form.status = (params[1][5]=='启用')?true:false;
                    this.centerDialogVisible = true;
                    break;
                case 'delete':
                    this.$confirm('是否确定删除？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.delete(params[1][0])
                    }).catch(() => {

                    });
                    break;
            }

        },
        form_refush(){
            this.form = {
                id: 0,
                name: '',
                createtime: '',
                updatetime: '',
                info: '',
                status: true
            }
        },
        form_submit() {
            let data, check=true;
            this.$refs['form'].validate((valid) => {
                if (!valid){
                    check = false;
                    return false;
                }
            });
            console.log(check)
            if (!check) return;
            data = {
                name: this.form.name,
                centent: this.form.info,
                isdisabled: this.form.status?0:1
            }
            rpc(hosts.baseHost, 'bi.Save', 'device', this.form.id, data, (d) => {
                if(d.result){
                    this.$message({
                        message: '设备信息保存成功',
                        type: 'success'
                        });
                    this.load();
                }
            })
            this.centerDialogVisible=false;
        },
        create() {
            this.form_refush();
            this.centerDialogVisible=true;
        },
        dataRender(d) {
            if (d[5] == 0)
                d[5] = '启用';
            else
                d[5] = '禁用';
            return d;
        }
    },
    components: {
        simpletable,
        c_button
    }
};
</script>