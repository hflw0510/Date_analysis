<template>
    <div>
        <simpletable ref="st" :props="props" @refresh="refresh" @bclick="btnClick" @create="create"></simpletable>
        <el-dialog
            title="物种库"
            :visible.sync="centerDialogVisible"
            width="40%"
            center
        >
            <el-form ref="form" :model="form" :rules="rules" ret="form" label-width="100px" label-position="left">
                <el-form-item label="物种名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-input v-model="form.createtime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-input v-model="form.updatetime" disabled></el-input>
                </el-form-item>
                <el-form-item label="物种分类">
                    <el-select v-model="form.spec_type" clearable placeholder="请选择">
                        <el-option
                            v-for="item in spec_type_item"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="CAS号">
                    <el-input v-model="form.cas"></el-input>
                </el-form-item>
                <el-form-item label="分子量(M值)">
                    <el-input v-model="form.m_value"></el-input>
                </el-form-item>
                <el-form-item label="MIR">
                    <el-input v-model="form.mir"></el-input>
                </el-form-item>
                <el-form-item label="因子字段">
                    <el-input v-model="form.fac1"></el-input>
                </el-form-item>
                <el-form-item label="因子小数">
                    <el-input v-model="form.fac2"></el-input>
                </el-form-item>
                <el-form-item label="因子序列号">
                    <el-input v-model="form.fac3"></el-input>
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

let tableData = [];

const tbCols = [
    {
        colname: '1',
        title: '创建时间',
        searchable: false,
        sortable: false,
        align: 'center',
        width: '220'
    },
    {
        colname: '2',
        title: '更新时间',
        searchable: false,
        sortable: false,
        align: 'center',
        width: '220'
    },
    {
        colname: '13',
        title: '物种类别',
        searchable: true,
        sortable: true,
        width: ''
    },
    {
        colname: '5',
        title: '物种名称',
        searchable: true,
        sortable: true,
        width: ''
    },
    {
        colname: '4',
        title: 'CAS号',
        searchable: true,
        sortable: true,
        width: ''
    },
    {
        colname: '6',
        title: '分子量（M值）',
        searchable: true,
        sortable: true,
        width: ''
    },
    {
        colname: '11',
        title: '状态',
        searchable: true,
        sortable: true,
        align: 'center',
        width: '100'
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
                spec_type: '',
                createtime: '',
                updatetime: '',
                cas: '',
                name: '',
                m_value: '',
                mir: '',
                fac1: '',
                fac2: '',
                fac3: '',
                status: true
            },
            rules: {
                name: [
                    { required: true, message: '请输入物种名称', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ]
            },
            props : {
                title: 'species',
                isDown: true,
                isInfo: '物种列表',
                isSinglepage: true,
                tbCols,
                tbBtns,
                tbData: tableData
            },
            spec_type_item: [],
            spec_type_data:{},
            tableData,
            centerDialogVisible: false
        }
    },
    created() {
        this.spec_type();
	},
    methods: {
        spec_type() {
            rpc(hosts.baseHost, 'bi.list', 'spec_type', '', (d) => {
                if(d.result){
                    d.result.forEach(v => {
                        this.spec_type_item.push({
                            value: v[0],
                            label: v[3]
                        });
                        this.spec_type_data[v[0]] = v[3];
                    });
                    this.load();
                }
            })
        },
        load (){
            rpc(hosts.baseHost, 'bi.list', 'species', '', (d) => {
                if(d.result){
                    this.tableData.length = 0;
                    d.result.forEach(v => this.tableData.push(this.dataRender(v)));
                    this.$refs.st.searchReset();
                }
            })
        },
        delete(id) {
            if (!id) return 
            rpc(hosts.baseHost, 'bi.delete', 'species', id, (d) => {
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
                    this.form.spec_type = params[1][3];
                    this.form.name = params[1][5];
                    this.form.cas = params[1][4];
                    this.form.m_value = params[1][6];
                    this.form.mir = params[1][7];
                    this.form.fac1 = params[1][8];
                    this.form.fac2 = params[1][9];
                    this.form.fac3 = params[1][10];
                    this.form.status = (params[1][11]=='启用')?true:false;
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
                spec_type: '',
                createtime: '',
                updatetime: '',
                cas: '',
                name: '',
                m_value: '',
                mir: '',
                fac1: '',
                fac2: '',
                fac3: '',
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
            if (!check) return;
            data = {
                name: this.form.name,
                spec_type: this.form.spec_type,
                CAS: this.form.cas,
                M_Value: this.form.m_value,
                MIR: this.form.mir,
                Factor1: this.form.fac1,
                Factor2: this.form.fac2,
                Factor3: this.form.fac3,
                isdisabled: this.form.status?0:1
            }
            rpc(hosts.baseHost, 'bi.Save', 'species', this.form.id, data, (d) => {
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
            if (d[11] == 0)
                d[11] = '启用';
            else
                d[11] = '禁用';
            let std = this.spec_type_data
            d[13] = std[d[3]];
            return d;
        }
    },
    components: {
        simpletable
    }
};
</script>