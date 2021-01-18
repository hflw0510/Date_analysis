<template> 
    <div>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div v-for="(item, index) in divs" :key="index">
                    <div align="right" style="width:1400px;">
                        <el-select v-model="values[index]" placeholder="请选择" @change="v_change">
                            <el-option v-for="item in options[index]" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div :id="item" class=charts7_2></div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px ;">
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
            id: this.props[0],
            values: [],
            options:[],
            options_t: [
                {
                    value: 1,
                    label: '生物源'
                },
                {
                    value: 2,
                    label: '汽车尾气排放'
                },
                {
                    value: 3,
                    label: '油气挥发性'
                },
                {
                    value: 4,
                    label: '有机溶剂使用'
                },
                {
                    value: 5,
                    label: '未知'
                }
            ],
            search_date: '',
            noppb: false,
            fullscreenLoading: false,
            specs:{},
            specs_name: {},
            spec_selects: [],
            centerDialogVisible : false,
            spec_types_name: {},
            datelist: [],
            chartData1: [],
            divs: [],
            color: ['#0100fe','#03ffff', '#ec7c31', '#7501e8', '#9c007a','#c1c1ff',  '#86e3bf', '#f6f784','#ceccce', '#ffc0db'],
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
        this.spec_type_load();
        //this.spec_load();
    },
    methods: {
        searchClick() {
            this.fullscreenLoading = false;
            rpc(hosts.baseHost, 'Bi.Load', 'source_analysis', this.id, (d) => {
                if(d.result){
                    if(Object.keys(d.result).length){
                        //this.get_datelist(JSON.parse(d.result['date_range']));
                        this.get_datelist_data(JSON.parse(d.result['data'])['result']);
                        this.get_chartData1(JSON.parse(d.result['spec_id']), JSON.parse(d.result['F_FACTOR']));
                        this.get_chartData2(JSON.parse(d.result['G_FACTOR']));
                        this.get_chartData3(JSON.parse(d.result['G_FACTOR']));
                        this.get_chartData4(JSON.parse(d.result['G_FACTOR']));
                        if (d.result['Result']){
                            this.values = JSON.parse(d.result['Result']);
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
        },
        v_change () {
            let data;
            data = {
                result: JSON.stringify(this.values)
            }
            rpc(hosts.baseHost, 'bi.Save', 'source_analysis', this.id, data, (d) => {
                if(d.result){
                    this.$message({
                        message: '因子分类保存成功',
                        type: 'success'
                        });
                    this.load();
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
                st.setHours(st.getHours() + i);
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
            this.options = [];
            this.values = []
            this.chartData1 = [];

            data.forEach((v, index) => {
                divid = 'myChart7_'+this.props[0]+'_1_' + index;
                this.divs.push(divid);
                this.options.push(this.options_t);
                let val = this.get_value(spec_id, v);
                if (! (this.values.length > index)) this.values.push(val);
                d = {
                    title : this.get_option(val) + (index + 1),
                    xAxis : spec_id.map(v => this.specs[v][7]),
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
                this.chartData2.legend.push(this.get_option(this.values[index])+(index+1));
                this.chartData2.series.push({
                    name: this.get_option(this.values[index])+(index+1),
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
                this.chartData3.legend.push(this.get_option(this.values[index]) + (index+1));
                this.chartData3.series.push({
                    name: this.get_option(this.values[index]) + (index+1),
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
                this.chartData4.legend.push(this.get_option(this.values[index]) + (index+1));
                this.chartData4.data.push({
                    name: this.get_option(this.values[index]) + (index+1),
                    value: data.map(w => w[index]).reduce((x, y) => NP.plus(x, y))
                })
            });
            this.chart4();
        },
        get_option(v){
            let t, ret;
            this.options_t.forEach(function(t){
                if (v == t['value']){
                    ret = t['label'];
                }
            });
            return ret;
        },
        get_value(spec_id, data){
            let arr = spec_id.map((v, index) => [v, data[index]]).sort((x, y) => y[1] - x[1]);

            let v1 = 38;
            if (v1 in this.specs_name){
                if (arr[0][0] == this.specs_name[v1])
                    return 1;
            }

            let total = data.reduce((a, v) => NP.plus(a, v), 0);
            let v2_type = this.get_spec_type_percent('烷烃', spec_id, data, total);
            let v2 = 6;
            if (v2 in this.specs_name){
                if (arr[0][0] == this.specs_name[v2] && v2_type > 40)
                    return 2;
            }

            let v3 = this.get_spec_percent([42, 43, 44, 45, 46], spec_id, data, total);
            if (v2_type > 20 && v3 > 20)
                return 3;
            
            let v3_1 = this.get_spec_percent([102, 93, 97], spec_id, data, total);
            let v3_2 = this.get_spec_percent([43, 44, 45, 46], spec_id, data, total);
            if (v3_1 > 30 && v3_2 > 20)
                return 4;

            return 5;

        },
        get_spec_type_percent(spec_type_name, spec_id, data, total){
            let spec_type_id, count = 0;
            if (spec_type_name in this.spec_types_name){
                spec_type_id = this.spec_types_name[spec_type_name];
            }
            else
                return 0;

            spec_id.forEach((v, index) => {
                if (v in this.specs){
                    if (this.specs[v][3] == spec_type_id){
                        count = NP.plus(count, data[index]);
                    }
                }
            });
            return this.get_percent(count, total);
        },
        get_spec_percent(specs, spec_id, data, total){
            let count = 0;
            specs.forEach(v => {
                spec_id.forEach((w, index) => {
                    if (this.specs_name[v] == w){
                        count = NP.plus(count, data[index]);
                    }
                })
            });
            return this.get_percent(count, total);
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
                        this.spec_types_name[v[3]] = v[0];
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
                        this.specs_name[v[13]] = v[0];
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
                color: this.color,
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
                legend:{
                    icon: 'rect',
                    data: this.chartData3.legend
                },
                toolbox:{
                    feature:{
                        saveAsImage: {}
                    }
                },
                color: this.color,
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
                color: this.color,
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