<template>
    <div>
        <simpletable ref="st" :props="props" @refresh="refresh" @dtc="dtc" @search="server_search" @select="spec_select" @select_ppb="ppb_select" @analysis="Analysis"></simpletable>
        <el-dialog
            title="因子选择"
            :visible.sync="centerDialogVisible"
            width="80%"
            center
        >
        <checkboxes ref="cbs" :props="cbs" @event="checkboxes_event"></checkboxes>
        </el-dialog>
        <el-dialog
            title="提交源解析申请"
            :visible.sync="analysisDialogVisible"
            width="40%"
            center
        >
            <el-form ref="form" :model="form" ret="form" label-width="80px" label-position="left">
                <el-form-item label="输入名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="解析因子">
                    <el-slider v-model="form.factors" show-input :min="1" :max="20"></el-slider>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Source_Analysis">确定</el-button>
                    <el-button @click="analysisDialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
            title="单位选择"
            :visible.sync="ppbDialogVisible"
            width="20%"
            center
        >
        <el-switch
            v-model="noppb"
            active-text="μg/m³"
            inactive-text="ppb"
            @change="ppb_click">
        </el-switch>
        </el-dialog>
    </div>
</template>
<style>
    .el-table__footer{
        background-color:#9ae2f4;
    }
</style>
<script>
import simpletable from '~/components/util/simpletable';
import checkboxes from '~/components/util/checkboxes';
import hosts from '~/assets/config/hosts'
import rpc from '~/assets/js/rpc'
import NP from 'number-precision';
NP.enableBoundaryChecking(false);

const tbBtns = [
    {
        key: 'select',
        content: '因子选择',
        place: 'top-end',
        btntype: 'warning',
        btnicon: 'document-add'
    },
    {
        key: 'select_ppb',
        content: '单位选择',
        place: 'top-end',
        btntype: 'primary',
        btnicon: 'set-up'
    },
    {
        key: 'analysis',
        content: '提交源解析',
        place: 'top-end',
        btntype: 'primary',
        btnicon: 'data-analysis'
    },
    {
        key: 'refresh',
        content: '刷新',
        place: 'top-end',
        btntype: 'primary',
        btnicon: 'refresh'
    }
];

let tableData = [];


export default {
    data() {
        return {
            props : {
                title: 'search',
                isDown: true,
                isInfo: '请先选择因子，再选择日期查询。',
                isSinglepage: true,
                isSum: true,
                tbCols: [
                    {
                        colname: '0',
                        title: '时间',
                        searchable: false,
                        sortable: false,
                        width: '160'
                    }
                ],
                row_color: ['#ffffff','#989797'],
                tbBtns,
                tbData: tableData,
                noSelect: true,
                isSearch: true
            },
            cbs: {
                data: '',
                dataGroups: [],
                dataOptions: []
            },
            form: {
                name: '',
                factors: 4
            },
            noppb: false,
            cbsgroups:{},
            search_date: '',
            specs:{},
            spec_selects: [],
            spec_position: {},
            centerDialogVisible : false,
            analysisDialogVisible: false,
            ppbDialogVisible: false,
            spec_type_data: {},
            tableData
        }
    },
    mounted() {
        this.spec_type_load();
    },
    methods: {
        refresh () {
            this.tableData.length = 0;
            this.$refs.st.searchReset();
        },
        dtc(params) {
            this.search_date = params;
        },
        spec_select(){
            this.centerDialogVisible = true;
        },
        ppb_select(){
            this.ppbDialogVisible = true;
        },
        ppb_click(){
            this.ppbDialogVisible = false;
            this.server_search(this.search_date);
        },
        checkboxes_event(d){
            this.spec_selects = [];
            d.forEach(v => {
                if (v.length){
                    this.spec_selects = this.spec_selects.concat(v);
                }
            });
            this.props.tbCols.length = 1;
            this.spec_selects.forEach((v, i) => {
                this.spec_position[v] = i;
                this.props.tbCols.push({
                    colname:  (++i).toString(),
                    title: this.specs[v][13] + ') ' + this.specs[v][7],
                    searchable: false,
                    sortable: false,
                    width: i==this.spec_selects.length?'':'100'
                }); 
            });
            this.tableData.length = 0;
            this.$refs.st.searchReset();
            this.centerDialogVisible = false;
        },
        get_tableData(search_date, d){
            let i, data={};
            d.forEach(v => {
                if (v[1].length==10) v[1] = v[1] + " 00:00:00";
                if (this.noppb) v[3] = this.get_μg(v[2], v[3]);
                if (!data.hasOwnProperty(v[1])){
                    data[v[1]] = {};
                }
                if (!data[v[1]].hasOwnProperty(v[2])){
                    data[v[1]][v[2]] = v[3];
                }
            });
            for (i=0;i<this.dateCheck(search_date[0], search_date[1])+1;i++) {
                let st = search_date[0], x = [], k, ct, y;
                if (st.length==10) st = st + " 00:00:00";
                st = new Date(st);
                st.setHours(i);
                ct = this.dateFormat("YYYY-mm-dd HH:MM:SS", st)
                if (ct in data){
                    x.push(this.dateFormat("YYYY-mm-dd HH:MM", st));
                    this.spec_selects.forEach(v =>{
                        if (v in data[ct]){
                            x.push(data[ct][v]);
                        }
                        else{
                            x.push(0);
                        }
                    });
                tableData.unshift(x);
                }
            }
        },
        Analysis(){
            this.analysisDialogVisible = true;
        },
        Source_Analysis(){
            if (this.search_date){
                if (this.spec_selects.length > 0){
                    rpc(hosts.baseHost, 'Search.Source_Analysis', this.form.name, this.form.factors, this.search_date, {spec_id: this.spec_selects}, (d) => {
                        if(d.result){
                            this.$message({
                                message: '源解析提交成功，ID：' + d.result + '请在源解析功能里查看结果。',
                                type: 'success'
                            });
                            this.form.name = '';
                            this.form.factors = 4;
                        }
                        else if(d.error){
                            this.$message({
                                message: d.error,
                                type: 'warning'
                            });
                        }
                    });
                }
                else{
                    this.$message({
                        message: '请选择因子！',
                        type: 'warning'
                    });
                }
            }
            else{
                this.$message({
                    message: '请选择时间！',
                    type: 'warning'
                });
            }
            this.analysisDialogVisible = false;
        },
        server_search(params){
            if (params){
                this.search_date = params;
                if (this.spec_selects.length > 0){
                    rpc(hosts.baseHost, 'Search.Get_data', params, {spec_id: this.spec_selects}, (d) => {
                        if(d.result){
                            tableData.length = 0;
                            let current_date, i, x = [];
                            this.get_tableData(params, d.result);
                            this.$refs.st.searchReset();
                        }
                        else if(d.error){
                            this.$message({
                                message: d.error,
                                type: 'warning'
                            })
                        }
                    });
                }
                else{
                    this.$message({
                        message: '请选择因子！',
                        type: 'warning'
                    }) 
                }
            }
            else{
                this.$message({
                    message: '请选择时间！',
                    type: 'warning'
                })
            }
        },
        get_μg(spec_id, value){
            return NP.divide(NP.times(value, this.specs[spec_id][9]), 22.4).toFixed(4);
        },
        spec_type_load(){
            rpc(hosts.baseHost, 'bi.list', 'spec_type', '', (d) => {
                if(d.result){
                    this.cbs.dataGroups.length = 0;
                    d.result.forEach(v => {
                        this.spec_type_data[v[0]] = v[3];
                    });
                    this.spec_load();
                }
            })
        },
        spec_load(){
            rpc(hosts.baseHost, 'bi.list', 'species', '', (d) => {
                if(d.result){
                    let spec_type = {}, i = 0;
                    d.result.forEach(v => {
                        if (!spec_type.hasOwnProperty(v[3])){
                            this.cbs.dataGroups.push(
                                {
                                    id: v[3],
                                    checkAll: false,
                                    isIndeterminate: false,
                                    title: this.spec_type_data[v[3]]
                                }
                            );
                            this.cbsgroups[v[3]] = i++;
                            this.cbs.dataOptions.push([]);
                            spec_type[v[3]] = '';
                        }

                        this.cbs.dataOptions[this.cbsgroups[v[3]]].push(
                            {
                                id: v[0],
                                value: v[0],
                                title: v[7]
                            }
                        );
                        this.specs[v[0]] = v;
                    });
                }
            })
        },
        dateFormat(fmt, date) {
            let ret;
            if (!(date instanceof Date)) {
                if (date.length==10) date = date + " 00:00:00";
                date = new Date(date)
            }
            const opt = {
                "Y+": date.getFullYear().toString(),        // 年
                "m+": (date.getMonth() + 1).toString(),     // 月
                "d+": date.getDate().toString(),            // 日
                "H+": date.getHours().toString(),           // 时
                "M+": date.getMinutes().toString(),         // 分
                "S+": date.getSeconds().toString()          // 秒
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
        },
        dateCheck(d1, d2) {
            if (typeof(d1) == 'undefined') return -1;
            if (!(d1 instanceof Date)){
                if (d1.length==10) d1 = d1 + " 00:00:00";
                d1 = new Date(d1)
            };
            if (!(d2 instanceof Date)){
                if (d2.length==10) d2 = d2 + " 00:00:00";
                d2 = new Date(d2)
            };
            return parseInt((d2.getTime() - d1.getTime())/(3600*1000))
        }
    },
    components: {
        simpletable,
        checkboxes
    }
};
</script>