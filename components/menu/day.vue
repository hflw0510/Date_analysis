<template> 
    <div>
        <el-row>
            <el-col :span=24 style="display: inline-block;padding-left: 8px">
                <el-date-picker
                    v-model="search_date"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
                <el-button-group>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.search')" placement="top">
                        <el-button type="primary" icon="el-icon-search" @click="searchClick('search')" v-loading.fullscreen.lock="fullscreenLoading"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.searchreset')" placement="top">
                        <el-button type="primary" icon="el-icon-delete" @click="search_date='';"></el-button>
                    </el-tooltip>
                </el-button-group>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart3_1" class=charts1></div>
                <div id="myChart3_2" class=charts2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart3_3" class=charts1></div>
                <div id="myChart3_4" class=charts2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart3_5" class=charts1></div>
                <div id="myChart3_6" class=charts2></div>
            </el-col>
        </el-row>
        <div>
            <el-dialog
                title="多选框"
                :visible.sync="centerDialogVisible"
                width="80%"
                center
            >
                <checkboxes ref="cbs" :props="cbs" @event="checkboxes_event"></checkboxes>
            </el-dialog>
        </div>
    </div>
</template>

<style>
  .charts1 {
    width: 700px;
    height: 480px;
    margin-left: auto;
    margin-right: auto;
    float: left;
  }

  .charts2 {
    width: 700px;
    height: 480px;
    margin-left: auto;
    margin-right: auto;
    float: right;
  }
</style>

<script>
import hosts from '~/assets/config/hosts'
import rpc from '~/assets/js/rpc'
import checkboxes from '~/components/util/checkboxes';
import NP from 'number-precision';
NP.enableBoundaryChecking(false);

export default {
    data () {
        return {
            search_date: '',
            fullscreenLoading: false,
            cbs: {
                data: '',
                dataGroups: [],
                dataOptions: []
            },
            cbsgroups:{},
            specs:{},
            spec_selects: [],
            centerDialogVisible : false,
            chartData: []
        }
    },
    mounted() {
        //this.echartsInit()
        //this.echartsInit2()
    },
    methods: {
        searchClick() {
            this.fullscreenLoading = true;
            if (this.search_date) {
                rpc(hosts.baseHost, 'Search.Get_data', this.search_date, {}, (d) => {
                    if(d.result){
                        let data={}, data1={}, data2={};
                        d.result.forEach(v => {
                            if (v[1].length==10) v[1] = v[1] + " 00:00:00";
                            if (!data.hasOwnProperty(v[10])){
                                data[v[10]] = {};
                            }
                            if (!data[v[10]].hasOwnProperty(v[1])){
                                data[v[10]][v[1]] = [];
                            }
                            data[v[10]][v[1]] = NP.plus(data[v[10]][v[1]], (v[3]));
                        });
                        console.log(data);
                        this.get_chartData1(data);
                    }
                    else if(d.error){
                        throw(d.error);
                        this.$message({
                            message: d.error,
                            type: 'warning'
                        })
                    }
                })
            }
            else{
                this.$message({
                    message: '请选择时间！',
                    type: 'warning'
                })
            }
        },
        get_chartData1(data) {
            let k, t, i;
            this.chartData = [];

            for (k in data) {
                let d = ({
                    title: k,
                    xAxis: Array(24).fill(0).map((v, i) => i),
                    line: [],
                    stdevp: []
                });

                let data1 = {};
                for (t in data[k]){
                    let st = t;
                    if (st.length==10) st = st + " 00:00:00";
                    st = new Date(st);
                    i = st.getHours();
                    if (!(i in data1))
                        data1[i] = [];

                    data1[i].push(data[k][t]);
                }

                for (i=0;i<24;i++) {
                    if (i in data1) {
                        d.line.push(this.get_average(data1[i]));
                        d.stdevp.push(this.get_stdevp(data1[i]));
                    }
                    else {
                        d.line.push(0);
                        d.stdevp.push(0);
                    }
                }
                console.log(d);
                this.chartData.push(d);
            }
            this.chartData.forEach((v, i) => {
                this.chart1('myChart3_'+ (i+1), v);
            });

        },
        get_average(arr){
            return NP.divide(arr.reduce((a, v) => NP.plus(a, v), 0), arr.length).toFixed(3);
        },
        get_stdevp(arr){
            let mean = this.get_average(arr);
            return Math.sqrt(
                NP.divide(arr.reduce((acc, val) => acc.concat(NP.minus(val, mean) ** 2), []).reduce((acc, val) => NP.plus(acc, val), 0), arr.length)
            ).toFixed(3);
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
            this.centerDialogVisible = false;
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
        chart1(divid, data){
            let myChart = this.$echarts.init(document.getElementById(divid));
            let aa = {
                title: {
                    text: data.title,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: data.xAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '浓度(ppb)'
                    }
                ],
                series: [
                    {
                        name: 'U',
                        type: 'line',
                        data: data.stdevp.map((v, i) => NP.plus(data.line[i], v)),
                        lineStyle: {
                            opacity: 0
                        },
                        smooth: true,
                        areaStyle:{
                            color: '#C0C0C0',
                            origin: 'start',
                            opacity: 0.5
                        },
                        symbol: 'none'
                    },
                    {
                        name: 'L',
                        type: 'line',
                        data: data.stdevp.map((v, i) => NP.minus(data.line[i], v)),
                        lineStyle: {
                            opacity: 0
                        },
                        smooth: true,
                        areaStyle:{
                            color: '#fff',
                            origin: 'start',
                            shadowColor: '#FFFFFF',
                            shadowOffsetX: 1
                        },
                        symbol: 'none'
                    },
                    {
                        name: '浓度',
                        type: 'line',
                        data: data.line,
                        symbolSize: 6,
                        itemStyle: {
                            color: '#c23531'
                        },
                        showSymbol: false
                    },
                ]
            };
            myChart.setOption(aa)

            if (divid == 'myChart3_6') {
                myChart.on('finished', (params) => {
                this.fullscreenLoading = false;
            });
            }
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
        }
    },
    components: {
        checkboxes
    }

}
</script>