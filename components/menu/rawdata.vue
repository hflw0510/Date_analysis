<template>
    <div>
        <simpletable ref="st" :props="props" @refresh="refresh" @tts="tts" @search="server_search" @select="spec_select"></simpletable>
        <el-dialog
            title="因子选择"
            :visible.sync="centerDialogVisible"
            width="80%"
            center
        >
        <checkboxes ref="cbs" :props="cbs" @event="checkboxes_event"></checkboxes>
        </el-dialog>
    </div>
</template>
<script>
import simpletable from '~/components/util/simpletable';
import checkboxes from '~/components/util/checkboxes';
import hosts from '~/assets/config/hosts'
import rpc from '~/assets/js/rpc'

const tbBtns = [
    {
        key: 'select',
        content: '因子选择',
        place: 'top-end',
        btntype: 'warning',
        btnicon: 'document-add'
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
                tbCols: [
                    {
                        colname: '0',
                        title: '时间',
                        searchable: false,
                        sortable: false,
                        width: '160'
                    }
                ],
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
            cbsgroups:{},
            specs:{},
            spec_selects: [],
            spec_position: {},
            centerDialogVisible : false,
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
        tts(params) {
            console.log(params);
        },
        spec_select(){
            this.centerDialogVisible = true;
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
                    title: this.specs[v],
                    searchable: false,
                    sortable: false,
                    width: i==this.spec_selects.length?'':'100'
                }); 
            });
            this.centerDialogVisible = false;
        },
        server_search(params){
            if (params){
                if (this.spec_selects.length > 0){
                    rpc(hosts.baseHost, 'Search.Get_data', params, {spec_id: this.spec_selects}, (d) => {
                        if(d.result){
                            tableData.length = 0;
                            let current_date, i, x = [];
                            d.result.forEach(v => {
                                if (current_date != v[1]) {
                                    if (x.length) {
                                        x.unshift(this.dateFormat("YYYY-mm-dd HH:MM", current_date));
                                        tableData.push(x);
                                    }
                                    for (i=-1;i>this.dateCheck(current_date, v[1]);i--) {
                                        let c_d = current_date;
                                        if (c_d.length==10) c_d = c_d + " 00:00:00";
                                        c_d = new Date(c_d);
                                        c_d.setHours(i);
                                        x = Array(this.spec_selects.length).fill(0);
                                        x.unshift(this.dateFormat("YYYY-mm-dd HH:MM", c_d));
                                        tableData.push(x);
                                    }
                                    current_date = v[1];
                                    x = Array(this.spec_selects.length).fill(0);
                                    x[this.spec_position[v[2]]] = v[3];
                                }
                                else  {
                                    x[this.spec_position[v[2]]] = v[3];
                                }
                            });
                            if (tableData[tableData.length - 1][0] != current_date){
                                if (x.length) {
                                    x.unshift(this.dateFormat("YYYY-mm-dd HH:MM", current_date));
                                    tableData.push(x);
                                }
                            };
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
        spec_type_load(){
            rpc(hosts.baseHost, 'bi.list', 'spec_type', '', (d) => {
                if(d.result){
                    this.cbs.dataGroups.length = 0;
                    d.result.forEach((v, i) => {
                        this.cbs.dataGroups.push(
                            {
                                id: v[0],
                                checkAll: false,
                                isIndeterminate: false,
                                title: v[3]
                            }
                        );
                        this.cbsgroups[v[0]] = i;
                        this.cbs.dataOptions.push([]);
                    });
                    this.spec_load();
                }
            })
        },
        spec_load(){
            rpc(hosts.baseHost, 'bi.list', 'species', '', (d) => {
                if(d.result){
                    d.result.forEach(v => {
                        this.cbs.dataOptions[this.cbsgroups[v[3]]].push(
                            {
                                id: v[0],
                                value: v[0],
                                title: v[5]
                            }
                        );
                        this.specs[v[0]] = v[5];
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