<template> 
    <div>
        <el-row>
            <el-col :span=2 style="display: inline-block;padding-left: 8px">
                <el-input
                    placeholder="请选择因子"
                    v-model="spec"
                    :disabled="true">
                </el-input>
            </el-col>
            <el-col :span=16 style="display: inline-block;padding-left: 8px">
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
                    <el-tooltip effect="dark" content="因子选择" placement="top">
                        <el-button type="primary" icon="el-icon-document-add" @click="spec_select()"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.search')" placement="top">
                        <el-button type="primary" icon="el-icon-search" @click="searchClick('search')" v-loading.fullscreen.lock="fullscreenLoading"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.searchreset')" placement="top">
                        <el-button type="primary" icon="el-icon-delete" @click="search_date='';spec='';spec_id=0;"></el-button>
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
                <div id="myChart4_1" class=charts4_1></div>
                <div id="myChart4_2" class=charts4_2></div>
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
  .charts4_1 {
    width: 700px;
    height: 480px;
    margin-left: auto;
    margin-right: auto;
    float: left;
  }

  .charts4_2 {
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
            freon: false,
            freonid: 0,
            noppb: false,
            fullscreenLoading: false,
            cbs: {
                limit: 1,
                data: '',
                dataGroups: [],
                dataOptions: []
            },
            cbsgroups:{},
            spec: '',
            spec_id: 0,
            specs_type: {},
            specs: {},
            spec_selects: [],
            spec_type_data: {},
            spec_type_iscalc: {},
            spec_iscalc: {},
            centerDialogVisible : false,
            chartData: []
        }
    },
    mounted() {
        //this.echartsInit()
        //this.echartsInit2()
        this.spec_type_load();
        let d = sessionStorage.getItem('search_date');
        if (d) this.search_date = JSON.parse(d);
    },
    methods: {
        date_change(d){
            if (d){
                sessionStorage.setItem('search_date', JSON.stringify(d));
            }
        },
        searchClick() {
            this.fullscreenLoading = true;
            if (this.search_date && this.spec_id) {
                let params;
                if (this.spec_iscalc[this.spec_id] == 1)
                    params = {spec_id:[this.spec_id, this.freon?this.freonid:0]};
                else{
                    params = {spec_type_iscalc0: this.spec_id};
                    this.freon = false;
                }
                rpc(hosts.baseHost, 'Search.Get_data', this.search_date, params, (d) => {
                    if(d.result){
                        if(d.result.length){
                            let data={}, data1={}, data2={}, data3={};
                            d.result.forEach(v => {
                                if (this.noppb && this.spec_iscalc[this.spec_id]) v[3] = this.get_μg(v[2], v[3]);

                                let day1 = this.dateFormat('YYYY-mm-dd', v[1]);
                                if (this.freon && v[5] == '氟利昂113'){
                                    if (!data1.hasOwnProperty(v[1])) data1[v[1]] = 0;
                                    data1[v[1]] = NP.plus(data1[v[1]], v[3]);
                                    if (!data3.hasOwnProperty(day1)) data3[day1] = [];
                                    data3[day1].push(v[3]);
                                }
                                else{
                                    if (v[1].length==10) v[1] = v[1] + " 00:00:00";
                                    if (!data.hasOwnProperty(v[5])){
                                        data[v[5]] = {};
                                    }
                                    if (!data[v[5]].hasOwnProperty(v[1])){
                                        data[v[5]][v[1]] = 0;
                                    }
                                    data[v[5]][v[1]] = NP.plus(data[v[5]][v[1]], (v[3]));

                                    if (!data2.hasOwnProperty(v[5])){
                                        data2[v[5]] = {};
                                    }
                                    if (!data2[v[5]].hasOwnProperty(day1)){
                                        data2[v[5]][day1] = [];
                                    }
                                    data2[v[5]][day1].push(v[3]);
                                }


                            });
                            if (Object.keys(data).length == 0){
                                this.fullscreenLoading = false;
                                this.$message.error('没有符合条件的数据！');
                            }
                            else{
                                this.get_chartData1(data, data1);
                                if (this.spec_iscalc[this.spec_id])
                                    this.get_chartData2(data2, data3);
                                else
                                    this.chart2_clear();
                            }
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
                    message: this.search_date?'请选择因子！':'请选择时间！',
                    type: 'warning'
                })
            }
        },
        get_chartData1(data, data_freon) {
            let k, t, i, dtlist = [];
            this.chartData = [];
            for (k in data) {
                let d = ({
                    title: k,
                    xAxis: dtlist,
                    line: [],
                    stdevp: []
                });

                if (this.spec_iscalc[this.spec_id]){

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

                    for (i=0;i<24;i++) {
                        if (i in data1) {
                            if (this.freon) {
                                d.line.push(this.get_average(data1[i]));
                            }
                            else if (this.spec_iscalc[this.spec_id] == 0) {
                                d.line.push(data1[i].reduce((a, v) => NP.plus(a, v), 0));
                            }
                            else {
                                d.line.push(this.get_average(data1[i]));
                                d.stdevp.push(this.get_stdevp(data1[i]));
                            }
                            dtlist.push(i);
                        }
                    }
                    this.chartData.push(d);
                }
                else{
                    let da1;
                    da1 = Object.keys(data[k]).map(v => [v, data[k][v]]).sort((x, y) => this.dateCheck(y[0], x[0]));

                    d.xAxis = da1.map(v => v[0]);
                    d.line = da1.map(v => v[1]);
                    this.chartData.push(d);
                }
            }
            this.chart1('myChart4_1', this.chartData[0]);

        },
        get_chartData2(data, data_freon) {
            let k, t, i;
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
            this.chart1('myChart4_2', this.chartData[0]);

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
            if (this.spec_selects.length == 1){
                this.spec = this.specs[this.spec_selects[0]][7];
                this.spec_id = this.spec_selects[0];
            }
            
            this.centerDialogVisible = false;
        },
        spec_type_load(){
            rpc(hosts.baseHost, 'bi.list', 'spec_type', '', (d) => {
                if(d.result){
                    this.cbs.dataGroups.length = 0;
                    d.result.forEach(v => {
                        this.spec_type_data[v[0]] = v;
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
                        if (v[7] == '氟利昂113'){
                            this.freonid = v[0];
                        }
                        if (!spec_type.hasOwnProperty(v[3])){
                            this.cbs.dataGroups.push(
                                {
                                    id: v[3],
                                    checkAll: false,
                                    isIndeterminate: false,
                                    title: this.spec_type_data[v[3]][3]
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
                        this.spec_iscalc[v[0]] = this.spec_type_data[v[3]][4];
                    });
                }
            })
        },
        chart2_clear(){
            let myChart = this.$echarts.init(document.getElementById('myChart4_2'));
            myChart.clear();
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
                xAxis: [
                    {
                        type: 'category',
                        data: data.xAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: this.spec_iscalc[this.spec_id]?(this.noppb?'浓度(μg/m³)':'浓度(ppb)'):'响应值',
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
                            color: '#5a9dd7',
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
                        name: this.spec_iscalc[this.spec_id]?'浓度':'响应值',
                        type: 'line',
                        data: data.line,
                        symbolSize: 6,
                        itemStyle: {
                            color: '#5a9dd7'
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