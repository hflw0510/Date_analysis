<template> 
    <div>
        <el-row>
            <el-col :span=18 style="display: inline-block;padding-left: 8px">
                <el-date-picker
                    v-model="search_date"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:00:00"
                    :default-time="['00:00:00', '23:00:00']"
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
            <el-col :span=6>
                <el-switch
                    v-model="noppb"
                    active-text="μg/m³"
                    inactive-text="ppb"
                    @change="searchClick">
                </el-switch>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart2_1" class=charts2_1></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart2_2" class=charts2_2></div>
            </el-col>
        </el-row>
    </div>
</template>

<style>
  .charts2_1 {
    width: 1400px;
    height: 480px;
    margin-left: auto;
    margin-right: auto;
    float: left;
  }

  .charts2_2 {
    width: 1400px;
    height: 480px;
    margin-left: auto;
    margin-right: auto;
    float: left;
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
            noppb: false,
            fullscreenLoading: false,
            specs_type: {},
            specs:{},
            spec_types: [],
            datelist: [],
            chartData1: {
                legend: [],
                data: {},
                xAxis: [],
                series: []
            },
            chartData2: {
                data: {},
                xAxis: [],
                series: []
            }
        }
    },
    mounted() {
        this.spec_type_load();
    },
    methods: {
        searchClick() {
            this.fullscreenLoading = true;
            if (this.search_date.length == 2) {
                this.get_datelist(this.search_date);
                rpc(hosts.baseHost, 'Search.Get_data', this.search_date, {}, (d) => {
                    if(d.result){
                        if(d.result.length){
                            let data={}, data1={};
                            d.result.forEach(v => {
                                if (this.noppb) v[3] = this.get_μg(v[2], v[3]);

                                if (v[1].length==10) v[1] = v[1] + " 00:00:00";
                                if (!data.hasOwnProperty(v[1])){
                                    data[v[1]] = {};
                                }
                                if (!data[v[1]].hasOwnProperty(v[10])){
                                    data[v[1]][v[10]] = 0;
                                }
                                data[v[1]][v[10]] = NP.plus(data[v[1]][v[10]], v[3]);
                                if (!data1.hasOwnProperty(v[10])){
                                    data1[v[10]] = '';
                                }

                            });
                            this.spec_types = Object.keys(data1);
                            this.get_chartData1(data);
                            this.get_chartData2(data);
                        }
                        else{
                            this.fullscreenLoading = false;
                            this.$message.error('没有符合条件的数据！');
                        }
                    }
                    else if(d.error){
                        this.fullscreenLoading = false;
                        throw(d.error);
                        this.$message({
                            message: d.error,
                            type: 'warning'
                        })
                    }

                })
            }
            else{
                this.fullscreenLoading = false;
                this.$message({
                    message: '请选择时间！',
                    type: 'warning'
                })
            }
        },
        get_datelist(d){
            let i;
            this.datelist = [];
            for (i=0;i<this.dateCheck(d[0], d[1])+1;i++) {
                let st = d[0];
                if (st.length==10) st = st + " 00:00:00";
                st = new Date(st);
                st.setHours(i);
                this.datelist.push(this.dateFormat("YYYY-mm-dd HH:MM:SS", st));
            }
        },
        get_chartData1(data) {
            let k, dtlist = [];
            this.chartData1.data = {};
            this.chartData1.legend = this.spec_types.map(v => v);
            this.chartData1.xAxis = dtlist;
            this.chartData1.series = [];

            this.spec_types.forEach(v => {
                this.chartData1.data[v] = [];
                this.chartData1.series.push({
                    name: v,
                    type: 'line',
                    stack: 'total',
                    showSymbol: false,
                    areaStyle: {},
                    data: this.chartData1.data[v]
                })
            });
            this.chartData1.data['total'] = [];
            this.chartData1.series.push({
                name: 'VOCs总量',
                type: 'line',
                stack: 'total',
                showSymbol: false,
                areaStyle: {},
                data: this.chartData1.data['total']
            });
            this.chartData1.legend.push('VOCs总量');

            this.datelist.forEach(v => {
                let total = 0;
                this.spec_types.forEach(w => {
                    if (v in data) {
                        if (w in data[v]){
                            let val = data[v][w];
                            this.chartData1.data[w].push(val);
                            total = NP.plus(total, val);
                        }
                        else
                            this.chartData1.data[w].push(0);
                    }
                });
                if (total > 0){
                    dtlist.push(v);
                    this.chartData1.data['total'].push(total);
                }
            });
            this.chart1();
        },
        get_chartData2(data) {
            let k, dtlist = [];
            this.chartData2.data = {};
            this.chartData2.xAxis = dtlist;
            this.chartData2.series = [];

            this.spec_types.forEach(v => {
                this.chartData2.data[v] = [];
                this.chartData2.series.push({
                    name: v,
                    type: 'line',
                    stack: 'total',
                    showSymbol: false,
                    areaStyle: {},
                    data: this.chartData2.data[v]
                })
            });
            
            this.datelist.forEach(v => {
                let total = 0;
                this.spec_types.forEach(w => {
                    if (v in data) {
                        if (w in data[v]){
                            total = NP.plus(total, data[v][w]);
                        }
                    }
                });
                if (total > 0){
                    dtlist.push(v);
                    this.spec_types.forEach(w => {
                        if (v in data) {
                            if (w in data[v]){
                                this.chartData2.data[w].push(this.get_percent(data[v][w], total));
                            }
                            else
                                this.chartData2.data[w].push(0);
                        }
                    });
                }
            });
            this.chart2();
        },
        get_μg(spec_id, value){
            return NP.divide(NP.times(value, this.specs[spec_id][9]), 22.4).toFixed(4);
        },
        get_percent(n, t){
            return t<=0?0:Math.round(NP.divide(n, t) * 10000) / 100;
        },
        get_average(arr){
            return NP.divide(arr.reduce((a, v) => NP.plus(a, v), 0), arr.length).toFixed(4);
        },
        get_stdevp(arr){
            let mean = this.get_average(arr);
            return Math.sqrt(
                NP.divide(arr.reduce((acc, val) => acc.concat(NP.minus(val, mean) ** 2), []).reduce((acc, val) => NP.plus(acc, val), 0), arr.length)
            ).toFixed(4);
        },
        spec_type_load(){
            rpc(hosts.baseHost, 'bi.list', 'spec_type', '', (d) => {
                if(d.result){
                    d.result.forEach((v, i) => {
                        this.specs_type[v[0]] = v;
                    });
                    this.spec_load();
                }
            })
        },
        spec_load(){
            rpc(hosts.baseHost, 'bi.list', 'species', '', (d) => {
                if(d.result){
                    d.result.forEach(v => {
                        this.specs[v[0]] = v;
                    });
                }
            })
        },
        chart1(){
            let myChart = this.$echarts.init(document.getElementById('myChart2_1'));
            let aa = {
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#5d9cd3','#eb7b2e','#ff3299','#9369fe','#89fe66','#03ffff','#dfeb00','#ceccce'],
                legend:{
                    icon: 'rect',
                    data: this.chartData1.legend
                },
                toolbox:{
                    feature:{
                        saveAsImage: {}
                    }
                },
                grid:{
                    left: '4%',
                    right: '4%'
                },
                dataZoom:[{}],
                xAxis: [
                    {
                        type: 'category',
                        data: this.chartData1.xAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: this.noppb?'浓度累计(μg/m³)':'浓度累计(ppb)'
                    }
                ],
                series: this.chartData1.series
            };
            myChart.setOption(aa)
        },
        chart2() {
            let myChart = this.$echarts.init(document.getElementById('myChart2_2'));
            myChart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#5d9cd3','#eb7b2e','#ff3299','#9369fe','#9369fe','#03ffff','#dfeb00','#ceccce'],
                toolbox:{
                    feature:{
                        saveAsImage: {}
                    }
                },
                grid:{
                    left: '4%',
                    right: '4%'
                },
                dataZoom:[{}],
                xAxis: [
                    {
                        type: 'category',
                        data: this.chartData2.xAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '浓度占比(%)',
                        min: 0,
                        max: 100,
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: this.chartData2.series
            });
            myChart.on('finished', (params) => {
                this.fullscreenLoading = false;
            });
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
        checkboxes
    }

}
</script>