<template> 
    <div>
        <el-row>
            <el-col :span=14 style="display: inline-block;padding-left: 8px">

                <el-date-picker
                    v-model="search_date"
                    @change="date_change"
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
            <el-col :span=10>
                <el-switch
                    v-model="isday"
                    active-text="日均值"
                    inactive-text="小时均值"
                    @change="searchClick">
                </el-switch>&nbsp;&nbsp;
                <el-switch
                    v-model="noppb"
                    active-text="μg/m³"
                    inactive-text="ppb"
                    @change="searchClick">
                </el-switch>&nbsp;&nbsp;
                <el-switch
                    v-model="freon"
                    active-text="VOCs/氟利昂"
                    inactive-text="VOCs"
                    @change="searchClick">
                </el-switch>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart3_1" class=charts3_1></div>
                <div id="myChart3_2" class=charts3_2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart3_3" class=charts3_1></div>
                <div id="myChart3_4" class=charts3_2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart3_5" class=charts3_1></div>
                <div id="myChart3_6" class=charts3_2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart3_7" class=charts3_1></div>
                <div id="myChart3_8" class=charts3_2></div>
            </el-col>
        </el-row>
    </div>
</template>

<style>
  .charts3_1 {
    width: 700px;
    height: 480px;
    margin-left: auto;
    margin-right: auto;
    float: left;
  }

  .charts3_2 {
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
            freon: false,
            noppb: false,
            isday: false,
            search_date: '',
            fullscreenLoading: false,
            specs_type: {},
            specs:{},
            spec_selects: [],
            centerDialogVisible : false,
            chartData: []
        }
    },
    mounted() {
        this.spec_type_load();
        let d = sessionStorage.getItem('search_date');
        if (d) this.search_date = JSON.parse(d);
    },
    methods: {
        date_change(d){
            if (d){
                sessionStorage.setItem('search_date', JSON.stringify(d));
                console.log(sessionStorage.getItem('search_date'));
            }
        },
        searchClick() {
            this.fullscreenLoading = true;
            if (this.search_date) {
                rpc(hosts.baseHost, 'Search.Get_data', this.search_date, {}, (d) => {
                    if(d.result.length){
                        if(d.result.length){
                            let data={}, data1={}, data2={}, data3 = {};
                            d.result.forEach(v => {
                                if (this.noppb) v[3] = this.get_μg(v[2], v[3]);

                                if (v[1].length==10) v[1] = v[1] + " 00:00:00";
                                if (!data.hasOwnProperty(v[10])){
                                    data[v[10]] = {};
                                }
                                if (!data[v[10]].hasOwnProperty(v[1])){
                                    data[v[10]][v[1]] = 0;
                                }
                                data[v[10]][v[1]] = NP.plus(data[v[10]][v[1]], v[3]);

                                let day1 = this.dateFormat('YYYY-mm-dd', v[1]);
                                if (!data2.hasOwnProperty(v[10])){
                                    data2[v[10]] = {};
                                }
                                if (!data2[v[10]].hasOwnProperty(day1)){
                                    data2[v[10]][day1] = [];
                                }
                                data2[v[10]][day1].push(v[3]);

                                if (this.freon && v[5] == '氟利昂113'){
                                    if (!data1.hasOwnProperty(v[1])) data1[v[1]] = 0;
                                    data1[v[1]] = NP.plus(data1[v[1]], v[3]);
                                    if (!data3.hasOwnProperty(day1)) data3[day1] = [];
                                    data3[day1].push(v[3]);
                                }
                            });
                            if (this.isday)
                                this.get_chartData2(data2, data3);
                            else
                                this.get_chartData1(data, data1);

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
        get_chartData2(data, data_freon) {
            let k, t, i;
            let color = ['#5a9dd7', '#ee751d', '#ff339c', '#9d78ff', '#58ff25', '#00fff7', '#c1c1ff'];
            this.chartData = [];
            for (k in data) {
                let d = ({
                    title: k,
                    xAxis: [],
                    line: [],
                    stdevp: []
                });
                for (t in data[k]){
                    d.xAxis.unshift(t);
                    if (this.freon) {
                        if (t in data_freon)
                            d.line.unshift(NP.divide(this.get_average(data[k][t]), this.get_average(data_freon[t])).toFixed(4));
                        else
                            d.line.unshift(this.get_average(data[k][t]));
                    }
                    else {
                        d.line.unshift(this.get_average(data[k][t]));
                        d.stdevp.unshift(this.get_stdevp(data[k][t]));
                    }
                }
                this.chartData.push(d);
            }
            this.chartData.forEach((v, i) => {
                this.chart1('myChart3_'+ (i+1), v, color[i]);
            });

        },
        get_chartData1(data, data_freon) {
            let k, t, i;
            let color = ['#5a9dd7', '#ee751d', '#ff339c', '#9d78ff', '#58ff25', '#00fff7', '#c1c1ff'];
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

                    if (this.freon){
                        if (t in data_freon){
                            if (data_freon[t] > 0){
                                data1[i].push(NP.divide(data[k][t], data_freon[t]).toFixed(4));
                                continue;
                            }
                        }
                    }
                    data1[i].push(data[k][t]);
                }
                console.log(data1);
                for (i=0;i<24;i++) {
                    if (i in data1) {
                        if (this.freon) {
                            d.line.push(this.get_average(data1[i]));
                        }
                        else {
                            d.line.push(this.get_average(data1[i]));
                            d.stdevp.push(this.get_stdevp(data1[i]));
                        }
                    }
                    else {
                        if (this.freon) {
                            d.line.push('-');
                        }
                        else {
                            d.line.push('-');
                            d.stdevp.push('-');
                        }
                    }
                }
                this.chartData.push(d);
            }
            this.chartData.forEach((v, i) => {
                this.chart1('myChart3_'+ (i+1), v, color[i]);
            });

        },
        get_μg(spec_id, value){
            return NP.divide(NP.times(value, this.specs[spec_id][9]), 22.4).toFixed(4);
        },
        get_total(arr){
            return arr.reduce((a, v) => NP.plus(a, v), 0).toFixed(4);
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
        chart1(divid, data, color){
            let myChart = this.$echarts.init(document.getElementById(divid));
            let aa = {
                title: {
                    text: data.title,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox:{
                    feature:{
                        saveAsImage: {}
                    }
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
                        name: this.noppb?'浓度(μg/m³)':'浓度(ppb)',
                        splitLine: {
                            show: false
                        }
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
                            color: color,
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
                            color: color
                        },
                        markPoint:{
                            data: [
                                {
                                    type: 'max', name: '最大值'
                                },
                                {
                                    type: 'min', name: '最小值'
                                }
                            ]
                        },
                        showSymbol: false
                    },
                ]
            };
            myChart.setOption(aa)

            if (divid == 'myChart3_'+this.chartData.length) {
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