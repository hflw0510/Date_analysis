<template> 
    <div>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div v-for="(item, index) in divs" :key="index">
                    <div :id="item" class=charts7_2></div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div :id="'myChart7_'+props[0]+'_2'" class=charts7_1></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div :id="'myChart7_'+props[0]+'_3'" class=charts7_1></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div :id="'myChart7_'+props[0]+'_4'" class=charts7_1></div>
            </el-col>
        </el-row>
    </div>
</template>

<style>
  .charts7_1 {
    width: 1400px;
    height: 480px;
    margin-left: auto;
    margin-right: auto;
    float: left;
  }

  .charts7_2 {
    width: 1400px;
    height: 280px;
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
    props: ['props'],
    data () {
        return {
            search_date: '',
            noppb: false,
            fullscreenLoading: false,
            specs:{},
            spec_selects: [],
            centerDialogVisible : false,
            spec_types: [],
            datelist: [],
            chartData1: [],
            divs: [],
            color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
            chartData2: {
                legend: [],
                xAxis: [],
                series: []
            },
            chartData3: {
                legend: [],
                xAxis: [],
                series: []
            },
            chartData4: {
                legend: [],
                data: []
            }
        }
    },
    mounted() {
        //this.spec_type_load();
        this.spec_load();
    },
    methods: {
        searchClick() {
            this.fullscreenLoading = false;
            let id = this.props[0];
            console.log(this.divs)
            rpc(hosts.baseHost, 'Bi.Load', 'source_analysis', id, (d) => {
                if(d.result){
                    if(Object.keys(d.result).length){
                        //this.get_datelist(JSON.parse(d.result['date_range']));
                        this.get_datelist_data(JSON.parse(d.result['data'])['result']);
                        this.get_chartData1(JSON.parse(d.result['spec_id']), JSON.parse(d.result['F_FACTOR']));
                        this.get_chartData2(JSON.parse(d.result['G_FACTOR']));
                        this.get_chartData3(JSON.parse(d.result['G_FACTOR']));
                        this.get_chartData4(JSON.parse(d.result['G_FACTOR']));
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
        },
        get_datelist(d){
            let i;
            this.datelist = [];
            for (i=0;i<this.dateCheck(d[0], d[1])+24;i++) {
                let st = d[0];
                if (st.length==10) st = st + " 00:00:00";
                st = new Date(st);
                st.setHours(i);
                this.datelist.push(this.dateFormat("YYYY-mm-dd HH:MM:SS", st));
            }
        },
        get_datelist_data(d){
            let dt={};
            this.datelist = [];
            d.forEach(v => {
                if (!dt.hasOwnProperty(v[0]))
                    dt[v[0]] = '';

            })
            this.datelist = Object.keys(dt);
        },
        get_chartData1(spec_id, data) {
            let k, d, divid;
            this.divs = [];
            this.chartData1 = [];

            data.forEach((v, index) => {
                divid = 'myChart7_'+this.props[0]+'_1_' + index;
                this.divs.push(divid);
                d = {
                    title : '因子' + (index+1),
                    xAxis : spec_id.map(v => this.specs[v]),
                    series : [{
                        name: '因子' + (index+1),
                        type: 'bar',
                        showSymbol: false,
                        areaStyle: {},
                        data: v,
                        itemStyle: {
                            normal: {
                                color: this.color[index]
                            }
                        }
                    }]
                };
                this.chartData1.push(d);
            });
            console.log(this.chartData1);
            this.$nextTick(() => {
                this.divs.forEach((v, i) => {
                    this.chart1(v, this.chartData1[i]);
                })
            });
            
        },
        get_chartData2(data) {
            let k;
            this.chartData2.legend = [];
            this.chartData2.xAxis = this.datelist;
            this.chartData2.series = [];

            data[0].forEach((v, index) => {
                this.chartData2.legend.push('因子' + (index+1));
                this.chartData2.series.push({
                    name: '因子' + (index+1),
                    type: 'line',
                    stack: 'total',
                    showSymbol: false,
                    areaStyle: {},
                    data: data.map(x => x[index])
                })
            });

            this.chart2();
        },
        get_chartData3(data) {
            let data1;
            this.chartData3.legend = [];
            this.chartData3.xAxis = this.datelist;
            this.chartData3.series = [];

            data1 = data.map(v => {
                let total = v.reduce((x, y) => NP.plus(x, y));
                return v.map(w => this.get_percent(w, total));
            });

            data1[0].forEach((v, index) => {
                this.chartData3.legend.push('因子' + (index+1));
                this.chartData3.series.push({
                    name: '因子' + (index+1),
                    type: 'line',
                    stack: 'total',
                    showSymbol: false,
                    areaStyle: {},
                    data: data1.map(x => x[index])
                })
            });

            this.chart3();
        },
        get_chartData4(data) {
            this.chartData4.data = [];
            this.chartData4.legend = [];

            data[0].forEach((v, index) => {
                this.chartData4.legend.push('因子' + (index+1));
                this.chartData4.data.push({
                    name: '因子' + (index+1),
                    value: data.map(w => w[index]).reduce((x, y) => NP.plus(x, y))
                })
            });
            this.chart4();
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
                    d.result.forEach((v, i) => {
                        this.spec_types.push(v[3]);
                    });
                }
            })
        },
        spec_load(){
            rpc(hosts.baseHost, 'bi.list', 'species', '', (d) => {
                if(d.result){
                    d.result.forEach(v => {
                        this.specs[v[0]] = v[7];
                    });
                    this.searchClick();
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
                toolbox:{
                    feature:{
                        saveAsImage: {}
                    }
                },
                grid:{
                    left: '4%',
                    right: '4%',
                    bottom: '20%'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: data.xAxis,
                        axisLabel: {
                            interval: 0,
                            rotate: 35,
                            fontSize: 10
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: data.series
            };
            console.log()
            myChart.setOption(aa)
        },
        chart2(){
            let myChart = this.$echarts.init(document.getElementById('myChart7_'+this.props[0]+'_2'));
            let aa = {
                tooltip: {
                    trigger: 'axis'
                },
                legend:{
                    icon: 'rect',
                    data: this.chartData2.legend
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
                        data: this.chartData2.xAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: this.chartData2.series
            };
            myChart.setOption(aa)
        },
        chart3() {
            let myChart = this.$echarts.init(document.getElementById('myChart7_'+this.props[0]+'_3'));
            myChart.setOption({
                tooltip: {
                    trigger: 'axis'
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
                        data: this.chartData3.xAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        max: 100,
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: this.chartData3.series
            });
        },
        chart4() {
            let myChart = this.$echarts.init(document.getElementById('myChart7_'+this.props[0]+'_4'));
            myChart.setOption({
                title: {
                    text: '因子占比关系',
                    left: 'center'
                },
                tooltip:{
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                toolbox:{
                    feature:{
                        saveAsImage: {}
                    }
                },
                legend:{
                    bottom: 'bottom',
                    data: this.chartData4.legend
                },
                label:{
                    formatter: '{b}: {d}%'
                },
                series:[
                    {
                        name: '因子占比',
                        type: 'pie',
                        radius: '55%',
                        data: this.chartData4.data
                    }
                ]
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