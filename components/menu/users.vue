<template>
    <div>
        <simpletable ref="st" :props="props" @refresh="refresh" @bclick="btnClick" @create="create"></simpletable>
        <el-dialog
            title="用户管理"
            :visible.sync="centerDialogVisible"
            width="40%"
            center
        >
            <el-form ref="form" :model="form" :rules="rules" ret="form" label-width="80px" label-position="left">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="user">
                    <el-input v-model="form.user"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="form.pwd"></el-input>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select v-model="form.dep" clearable placeholder="请选择">
                        <el-option
                            v-for="item in dep_item"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="form.role" clearable placeholder="请选择">
                        <el-option
                            v-for="item in role_item"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-input v-model="form.createtime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-input v-model="form.updatetime" disabled></el-input>
                </el-form-item>
                <el-form-item label="最后登录">
                    <el-input v-model="form.lastlogon" disabled></el-input>
                </el-form-item>
                <el-form-item label="管理员">
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
        title: '最后登录时间',
        searchable: false,
        sortable: false,
        width: '280'
    },
    {
        colname: '8',
        title: '姓名',
        searchable: true,
        sortable: false,
        width: ''
    },
    {
        colname: '6',
        title: '用户名',
        searchable: true,
        sortable: false,
        width: ''
    },
    {
        colname: '9',
        title: '管理员',
        searchable: false,
        sortable: false,
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
                user: '',
                pwd: '',
                createtime: '',
                updatetime: '',
                lastlogon: '',
                dep: '',
                role: '',
                status: false
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                user: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ]
            },
            props : {
                title: 'users',
                isDown: true,
                isInfo: '用户列表',
                isSinglepage: true,
                tbCols,
                tbBtns,
                tbData: tableData
            },
            dep_item: [],
            role_item: [],
            tableData,
            centerDialogVisible: false
        }
    },
    created() {
        this.load();
        this.dep();
        this.role();
	},
    methods: {
        dep() {
            rpc(hosts.baseHost, 'bi.list', 'department', '', (d) => {
                if(d.result){
                    d.result.forEach(v => this.dep_item.push({
                            value: v[0],
                            label: v[3]
                        }
                    ));
                }
            })
        },
        role() {
            rpc(hosts.baseHost, 'bi.list', 'roles', '', (d) => {
                if(d.result){
                    d.result.forEach(v => this.role_item.push({
                            value: v[0],
                            label: v[3]
                        }
                    ));
                }
            })
        },
        load (){
            rpc(hosts.baseHost, 'bi.list', 'users', '', (d) => {
                if(d.result){
                    this.tableData.length = 0;
                    d.result.forEach(v => this.tableData.push(this.dataRender(v)));
                    this.$refs.st.searchReset();
                }
            })
        },
        delete(id) {
            if (!id) return 
            rpc(hosts.baseHost, 'bi.delete', 'users', id, (d) => {
                if(d.result){
                    this.$message({
                        message: '用户删除成功',
                        type: 'warning'
                    });
                    this.load();
                }
                else {
                    this.$message.error('用户删除失败');
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
                    this.form.lastlogon = params[1][3];
                    this.form.dep = params[1][4];
                    this.form.role = params[1][5];
                    this.form.user = params[1][6];
                    this.form.pwd = params[1][7];
                    this.form.name = params[1][8];
                    this.form.status = (params[1][9]=='是')?true:false;
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
                user: '',
                pwd: '',
                createtime: '',
                updatetime: '',
                lastlogon: '',
                dep: '',
                role: '',
                status: false
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
                userid: this.form.user,
                pwd: this.form.pwd,
                dep_id: this.form.dep,
                roleid: this.form.role,
                IsAdmin: this.form.status?1:0
            }
            rpc(hosts.baseHost, 'bi.Save', 'users', this.form.id, data, (d) => {
                if(d.result){
                    this.$message({
                        message: '用户保存成功',
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
            if (d[9] == 1)
                d[9] = '是';
            else
                d[9] = '否';
            return d;
        }
    },
    components: {
        simpletable
    }
};
</script>