<template> 
    <div>
        <el-row>
            <el-col :span=4 style="display: inline-block;padding-left: 8px">
                <el-input
                    placeholder="请选择因子"
                    v-model="spec"
                    :disabled="true">
                </el-input>
            </el-col>
            <el-col :span=20 style="display: inline-block;padding-left: 8px">
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
                    <el-tooltip effect="dark" content="因子选择" placement="top">
                        <el-button type="primary" icon="el-icon-document-add" @click="spec_select()"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.search')" placement="top">
                        <el-button type="primary" icon="el-icon-search" @click="searchClick('search')" v-loading.fullscreen.lock="fullscreenLoading"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.searchreset')" placement="top">
                        <el-button type="primary" icon="el-icon-delete" @click="search_date='';spec='';"></el-button>
                    </el-tooltip>
                </el-button-group>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart5_1" class=charts5_1></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div id="myChart5_2" class=charts5_2></div>
            </el-col>
        </el-row>
        <div>
            <el-dialog
                title="物种选择"
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
  .charts5_1 {
    width: 1400px;
    height: 480px;
    margin-left: auto;
    margin-right: auto;
    float: left;
  }

  .charts5_2 {
    width: 1400px;
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
            search_date: [],
            fullscreenLoading: false,
            cbs: {
                limit: 2,
                data: '',
                dataGroups: [],
                dataOptions: []
            },
            cbsgroups:{},
            spec: '',
            specs: {},
            spec_selects: [],
            centerDialogVisible : false,
            chartData: [],
            datelist: [],
            chartData1: {
                data: [],
                xAxis: []
            },
            chartData2: {
                data: [],
                xAxis: []
            }
        }
    },
    mounted() {
        //this.echartsInit()
        //this.echartsInit2()
        this.spec_type_load();
    },
    methods: {
        searchClick() {
            this.fullscreenLoading = true;
            if (this.search_date && this.spec_selects.length==2) {
                this.get_datelist(this.search_date);
                rpc(hosts.baseHost, 'Search.Get_data', this.search_date, {spec_id: this.spec_selects}, (d) => {
                    if(d.result){
                        let data={};
                        d.result.forEach(v => {
                            if (v[1].length==10) v[1] = v[1] + " 00:00:00";
                            if (!data.hasOwnProperty(v[5])){
                                data[v[5]] = {};
                            }
                            if (!data[v[5]].hasOwnProperty(v[1])){
                                data[v[5]][v[1]] = [];
                            }
                            data[v[5]][v[1]] = NP.plus(data[v[5]][v[1]], (v[3]));
                        });
                        console.log(data)
                        this.get_chartData1(data);
                        this.get_chartData2(data);
                        this.fullscreenLoading = false;
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
                this.$message({
                    message: this.search_date?'请选择因子！':'请选择时间！',
                    type: 'warning'
                })
                this.fullscreenLoading = false;
            }
        },
        get_datelist(d){
            let i;
            for (i=0;i<this.dateCheck(d[0], d[1])+24;i++) {
                let st = d[0];
                if (st.length==10) st = st + " 00:00:00";
                st = new Date(st);
                st.setHours(i);
                this.datelist.push(this.dateFormat("YYYY-mm-dd HH:MM:SS", st));
            }
        },
        get_chartData1(data) {
            let k;
            this.chartData1.data = [];
            this.chartData1.xAxis = this.datelist;


            for (k in data) {
                let d = {
                    name: k,
                    data: []
                };

                this.datelist.forEach(v => {
                    if (v in data[k])
                        d.data.push(data[k][v]);
                    else
                        d.data.push(0);
                });
                this.chartData1.data.push(d);
            }
            console.log(this.chartData1);
            this.chart1();
        },
        get_chartData2(data){
            let k = Object.keys(data);
            this.chartData2.data = [];
            
            this.datelist.forEach(v => {
                this.chartData2.data.push([
                    (v in data[k[0]])?data[k[0]][v]:0,
                    (v in data[k[1]])?data[k[1]][v]:0,
                    v
                ])
            });

            console.log(this.chartData2.data);
            this.chart2();
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
            this.spec_selects = [];
            this.centerDialogVisible = true;
        },
        checkboxes_event(d){
            this.spec_selects = [];
            d.forEach(v => {
                if (v.length){
                    this.spec_selects = this.spec_selects.concat(v);
                }
            });
            if (this.spec_selects.length == 2)
                this.spec = this.specs[this.spec_selects[0]] + ' vs ' + this.specs[this.spec_selects[1]]
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
        chart2(){
            let myChart = this.$echarts.init(document.getElementById('myChart5_2'));
            let aa = {
                title: {
                    text: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: [
                    {
                        type: 'value'
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                visualMap:{
                    dimension: 2,
                    orient: 'vertical',
                    right: 10,
                    top: 'center',
                    text: ['HIGH', 'LOW'],
                    calculable: true,
                    inRange: {
                        color: ['#f2c31a', '#24b7f2']
                    }
                },
                series: [
                    {
                        name: 'scatter',
                        type: 'scatter',
                        data: this.chartData2.data
                    }
                ]
            };
            myChart.setOption(aa)
            myChart.on('finished', (params) => {
                this.fullscreenLoading = false;
            });
        },
        chart1(){
            let myChart = this.$echarts.init(document.getElementById('myChart5_1'));
            let aa = {
                title: {
                    text: 'VOCs体积分数平均',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
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
                        name: this.chartData1.data[0].name + '浓度(ppb)'
                    },
                    {
                        type: 'value',
                        name: this.chartData1.data[1].name + '浓度(ppb)'
                    }
                ],
                series: [
                    {
                        name: this.chartData1.data[0].name,
                        type: 'line',
                        data: this.chartData1.data[0].data
                    },
                    {
                        name: this.chartData1.data[1].name,
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.chartData1.data[1].data
                    }
                ]
            };
            myChart.setOption(aa);
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