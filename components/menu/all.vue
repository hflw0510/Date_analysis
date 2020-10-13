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
                <div id="myChart1_1" class=charts1_1></div>
                <div id="myChart1_2" class=charts1_2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart1_3" class=charts1_1></div>
                <div id="myChart1_4" class=charts1_2></div>
            </el-col>
        </el-row>
    </div>
</template>

<style>
  .charts1_1 {
    width: 700px;
    height: 480px;
    margin-left: auto;
    margin-right: auto;
    float: left;
  }

  .charts1_2 {
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
            search_date: '',
            fullscreenLoading: false,
            specs_type: {},
            specs:{},
            spec_selects: [],
            centerDialogVisible : false,
            chartData1: {
                xAxis: [],
                bar: [],
                line: []
            },
            chartData2: [],
            chartData3:{
                xAxis: [],
                bar: []
            },
            chartData4:{
                xAxis: [],
                bar: []
            }
        }
    },
    mounted() {
        this.spec_type_load();
        //this.echartsInit2()
    },
    methods: {
        searchClick() {
            this.fullscreenLoading = true;
            if (this.search_date) {
                rpc(hosts.baseHost, 'Search.Get_data', this.search_date, {}, (d) => {
                    if(d.result){
                        if(d.result.length){
                            let data={}, data1={}, data2={};
                            d.result.forEach(v => {
                                if (this.noppb) v[3] = this.get_μg(v[2], v[3]);

                                if (!data.hasOwnProperty(v[10])){
                                    data[v[10]] = [];
                                }
                                data[v[10]].push(v[3]);

                                if (!data1.hasOwnProperty(v[5])){
                                    data1[v[5]] = {};
                                }
                                if (!data1[v[5]].hasOwnProperty(v[1])){
                                    data1[v[5]][v[1]] = 0;
                                }
                                data1[v[5]][v[1]] = NP.plus(data1[v[5]][v[1]], v[3]);

                                if (v[8] > 0) {
                                    if (!data2.hasOwnProperty(v[5])){
                                        data2[v[5]] = {};
                                    }
                                    if (!data2[v[5]].hasOwnProperty(v[1])){
                                        data2[v[5]][v[1]] = 0;
                                    }
                                    let val;
                                    if (this.noppb)
                                        val = v[3];
                                    else
                                        val = this.get_μg(v[2], v[3]);
                                    data2[v[5]][v[1]] = NP.plus(data2[v[5]][v[1]], NP.times(val, v[8]));
                                }
                            });

                            this.get_chartData1(data);
                            this.get_chartData2(data);
                            this.get_chartData3(data1);
                            this.get_chartData4(data2)
                        }
                        else{
                            this.fullscreenLoading = false;
                            this.$message.error('没有符合条件的数据！');
                        }
                    }
                    else if(d.error){
                        throw(d.error);
                        this.$message({
                            message: d.error,
                            type: 'warning'
                        });
                        this.fullscreenLoading = false;
                    }

                })
            }
            else{
                this.$message({
                    message: '请选择时间！',
                    type: 'warning'
                });
                this.fullscreenLoading = false;
            }
        },
        get_chartData1(data) {
            let k;
            this.chartData1.xAxis = [];
            this.chartData1.bar = [];
            this.chartData1.line = [];

            for (k in data) {
                this.chartData1.xAxis.push(k);
                this.chartData1.bar.push(this.get_average(Object.values(data[k])));
                this.chartData1.line.push(this.get_stdevp(Object.values(data[k])));
            }
            
            this.chart1();
        },
        get_chartData2(data) {
            let k;
            this.chartData2 = [];

            for (k in data) {
                this.chartData2.push({
                    name: k,
                    value: this.get_average(Object.values(data[k]))
                })
            }
            this.chart2();
        },
        get_chartData3(data){
            let k, d=[];
            this.chartData3.xAxis = [];
            this.chartData3.bar = [];

            for (k in data){
                d.push([
                    k,
                    this.get_average(Object.values(data[k]))
                ])
            }
            d.sort((x, y) => y[1] - x[1]);
            d.splice(0, 10).forEach(v => {
                this.chartData3.xAxis.push(v[0]);
                this.chartData3.bar.push(v[1]);
            });
            this.chart3();
        },
        get_chartData4(data){
            let k, d=[];
            this.chartData4.xAxis = [];
            this.chartData4.bar = [];

            for (k in data){
                d.push([
                    k,
                    this.get_average(Object.values(data[k]))
                ])
            }
            d.sort((x, y) => y[1] - x[1]);
            d.splice(0, 10).forEach(v => {
                this.chartData4.xAxis.push(v[0]);
                this.chartData4.bar.push(v[1]);
            });
            this.chart4();
        },
        get_μg(spec_id, value){
            return NP.divide(NP.times(value, this.specs[spec_id][9]), 22.4).toFixed(4);
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
        spec_select(){
            this.centerDialogVisible = true;
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
            let myChart = this.$echarts.init(document.getElementById('myChart1_1'));
            let aa = {
                title: {
                    text: 'VOCs体积分数平均',
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
                label:{
                    show: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.chartData1.xAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: this.noppb?'浓度(μg/m³)':'浓度(ppb)'
                    },
                    {
                        type: 'value',
                        name: '标准差'
                    }
                ],
                series: [
                    {
                        name: '浓度',
                        type: 'bar',
                        data: this.chartData1.bar,
                        itemStyle: {
                            normal: {
                                color: (params) => ['#5a9dd7','#ee751d','#ff339c','#9d78ff','#58ff25','#00fff7'][params.dataIndex]
                            }
                        }
                    },
                    {
                        name: '标准差',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.chartData1.line,
                        markPoint:{
                            data: [
                                {
                                    type: 'max', name: '最大值'
                                },
                                {
                                    type: 'min', name: '最小值'
                                }
                            ],
                            
                        }
                    }
                ]
            };
            myChart.setOption(aa);
        },
        chart2() {
            let myChart = this.$echarts.init(document.getElementById('myChart1_2'));
            myChart.setOption({
                title: {
                    text: 'VOCs组成特征',
                    left: 'center'
                },
                color: ['#5a9dd7','#ee751d','#ff339c','#9d78ff','#58ff25','#00fff7'],
                tooltip:{
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                toolbox:{
                    feature:{
                        saveAsImage: {}
                    }
                },
                label:{
                    formatter: '{b}: {d}%'
                },
                series:[
                    {
                        name: 'VOCs组成特征',
                        type: 'pie',
                        radius: '55%',
                        data: this.chartData2
                    }
                ]
            });
        },
        chart3 () {
            let myChart = this.$echarts.init(document.getElementById('myChart1_3'))
            myChart.setOption({
                title: {
                    text: '体积分数前10种VOCs物种',
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
                label:{
                    show: true
                },
                xAxis: {
                    data: this.chartData3.xAxis,
                    axisLabel: {
                        interval: 0,
                        rotate: 35,
                        fontSize: 10
                    }
                },
                yAxis: {
                        type: 'value',
                        name: this.noppb?'物种浓度(μg/m³)':'物种浓度(ppb)'
                    },
                series: [{
                    name: '浓度',
                    type: 'bar',
                    data: this.chartData3.bar,
                    itemStyle: {
                        normal: {
                            color: (params) => ['#0100fe','#03ffff','#ec7c31','#7501e8','#9c007a','#c1c1ff','#86e3bf','#f6f784','#ceccce','#ffc0db'][params.dataIndex]
                        }
                    }
                }]
            });
        },
        chart4() {
            let myChart = this.$echarts.init(document.getElementById('myChart1_4'))
            myChart.setOption({
                title: {
                    text: 'OFP前10种VOCs物种',
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
                label:{
                    show: true
                },
                xAxis: {
                    data: this.chartData4.xAxis,
                    axisLabel: {
                        interval: 0,
                        rotate: 35,
                        fontSize: 10
                    }
                },
                yAxis: {
                        type: 'value',
                        name: '物种浓度(μg/m³)'
                    },
                series: [{
                    name: '浓度',
                    type: 'bar',
                    data: this.chartData4.bar,
                    itemStyle: {
                        normal: {
                            color: (params) => ['#0100fe','#03ffff','#ec7c31','#7501e8','#9c007a','#c1c1ff','#86e3bf','#f6f784','#ceccce','#ffc0db'][params.dataIndex]
                        }
                    }
                }]
            });
            myChart.on('finished', (params) => {
                this.fullscreenLoading = false;
            });
        }
    },
    components: {
        checkboxes
    }

}
</script>