<template>
    <div>
        <simpletable ref="st" :props="props" @refresh="refresh" @bclick="btnClick" @create="create" @upload="upload_excel"></simpletable>
        <el-dialog
            title="物种库"
            :visible.sync="centerDialogVisible"
            width="40%"
            center
        >
            <el-form ref="form" :model="form" ret="form" label-width="100px" label-position="left">
                <el-form-item label="序号">
                    <el-input v-model="form.no"></el-input>
                </el-form-item>
                <el-form-item label="物种名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="英文名称">
                    <el-input v-model="form.name_e"></el-input>
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
                <el-form-item label="物种细类">
                    <el-select v-model="form.spec_type_vice" clearable placeholder="请选择">
                        <el-option
                            v-for="item in spec_type_item"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="form.class"></el-input>
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
                <el-form-item label="因子小数">
                    <el-input v-model="form.fac"></el-input>
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
        colname: '13',
        title: '序号',
        searchable: true,
        sortable: true,
        width: '60'
    },
    {
        colname: '7',
        title: '物种名称',
        searchable: true,
        sortable: true,
        width: ''
    },
    {
        colname: '15',
        title: '物种分类',
        searchable: true,
        sortable: true,
        width: '120'
    },
    {
        colname: '16',
        title: '物种细类',
        searchable: true,
        sortable: true,
        width: '120'
    },
    {
        colname: '5',
        title: 'CAS号',
        searchable: false,
        sortable: false,
        width: '140'
    },
    {
        colname: '10',
        title: 'MIR',
        searchable: false,
        sortable: false,
        width: '100'
    },
    {
        colname: '9',
        title: '分子量（M值）',
        searchable: false,
        sortable: false,
        width: '120'
    },
    {
        colname: '11',
        title: '因子小数',
        searchable: false,
        sortable: false,
        width: '80'
    },
    {
        colname: '12',
        title: '状态',
        searchable: true,
        sortable: false,
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
        key: 'upload',
        content: '导入',
        place: 'top-end',
        btntype: 'primary',
        btnicon: 'upload'
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
                no: '',
                spec_type: '',
                spec_type_vice: '',
                createtime: '',
                updatetime: '',
                cas: '',
                name: '',
                name_e: '',
                class: '',
                m_value: '',
                mir: '',
                fac: '',
                status: true
            },
            props : {
                title: 'species',
                isDown: true,
                isInfo: '物种列表',
                isSinglepage: true,
                noSelect: true,
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
                    this.form.no = params[1][13];
                    this.form.createtime = params[1][1];
                    this.form.updatetime = params[1][2];
                    this.form.spec_type = params[1][3];
                    this.form.spec_type_vice = params[1][4];
                    this.form.name = params[1][7];
                    this.form.name_e = params[1][6];
                    this.form.cas = params[1][5];
                    this.form.class = params[1][8];
                    this.form.m_value = params[1][9];
                    this.form.mir = params[1][10];
                    this.form.fac = params[1][11];
                    this.form.status = (params[1][12]=='启用')?true:false;
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
                no: '',
                spec_type: '',
                spec_type_vice: '',
                createtime: '',
                updatetime: '',
                cas: '',
                name: '',
                m_value: '',
                mir: '',
                fac: '',
                name_e: '',
                class: '',
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
                no: this.form.no,
                spec_type: this.form.spec_type,
                spec_type_vice: this.form.spec_type_vice,
                CAS: this.form.cas,
                M_Value: this.form.m_value,
                MIR: this.form.mir,
                Factor: this.form.fac,
                Class: this.form.class,
                Name_English: this.form.name_e,
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
            if (d[12] == 0)
                d[12] = '启用';
            else
                d[12] = '禁用';
            let std = this.spec_type_data
            d[15] = std[d[3]];
            d[16] = std[d[4]];
            return d;
        },
        upload_excel() {
            this.$emit('newTab', '', 'menu.excel');
        }
    },
    components: {
        simpletable
    }
};
</script>