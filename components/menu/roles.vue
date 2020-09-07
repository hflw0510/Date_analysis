<template>
    <div>
        <simpletable ref="st" :props="props" @refresh="refresh" @bclick="btnClick" @create="create"></simpletable>
        <el-dialog
            title="角色管理"
            :visible.sync="centerDialogVisible"
            width="40%"
            center
        >
            <el-form ref="form" :model="form" :rules="rules" ret="form" label-width="80px" label-position="left">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-input v-model="form.createtime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-input v-model="form.updatetime" disabled></el-input>
                </el-form-item>
                <el-form-item label="授权">
                    <el-transfer v-model="value" :data="data"></el-transfer>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.memo"></el-input>
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
        title: '角色名称',
        searchable: true,
        sortable: true,
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
            },
            {
                key: 'delete',
                text: 'table.delete',
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
                memo: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
                ]
            },
            props : {
                title: 'department',
                isDown: true,
                isInfo: '角色列表',
                isSinglepage: true,
                tbCols,
                tbBtns,
                tbData: tableData
            },
            data:[],
            value: [],
            tableData,
            centerDialogVisible: false
        }
    },
    created() {
        this.load();

        let bi, bs, i, s;
        bi = {
            device: '设备',
            department: '部门',
            roles: '角色',
            users: '用户',
            species: '物种库',
            spec_type: '物种类型'
        };
        bs = {

        };
        for (i in bi){
            this.data.push({
                key: i + '.Create',
                label: bi[i] + '-新建'
            });
            this.data.push({
                key: i + '.Modify',
                label: bi[i] + '-编辑'
            });
            this.data.push({
                key: i + '.List',
                label: bi[i] + '-读取'
            });
            this.data.push({
                key: i + '.Delete',
                label: bi[i] + '-删除'
            });
        }
        for (s in bs){
            this.data.push({
                key: s,
                label: bs[s]
            });
        }
	},
    methods: {
        load (){
            rpc(hosts.baseHost, 'bi.list', 'roles', '', (d) => {
                if(d.result){
                    this.tableData.length = 0;
                    d.result.forEach(v => this.tableData.push(this.dataRender(v)));
                    this.$refs.st.searchReset();
                }
            })
        },
        delete(id) {
            if (!id) return 
            rpc(hosts.baseHost, 'bi.delete', 'roles', id, (d) => {
                if(d.result){
                    this.$message({
                        message: '角色信息删除成功',
                        type: 'warning'
                    });
                    this.load();
                }
                else {
                    this.$message.error('角色信息删除失败');
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
                    this.form.memo = params[1][4];
                    this.value = JSON.parse(params[1][5]);
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
                memo: ''
            };
            this.value = [];
        },
        form_submit() {
            let data, check=true;
            this.$refs['form'].validate((valid) => {
                if (!valid){
                    check = false;
                    return false;
                }
            });
            if (!check) return;
            data = {
                name: this.form.name,
                memo: this.form.memo,
                privileges: JSON.stringify(this.value)
            }
            rpc(hosts.baseHost, 'bi.Save', 'roles', this.form.id, data, (d) => {
                if(d.result){
                    this.$message({
                        message: '角色信息保存成功',
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
            return d;
        }
    },
    components: {
        simpletable
    }
};
</script>