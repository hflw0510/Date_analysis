<template>
    <div>
        <el-row>
            <el-col :span=24 style="display: inline-block;padding-left: 8px">
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
                        <el-button type="primary" icon="el-icon-search" @click="search()" v-loading.fullscreen.lock="fullscreenLoading"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.searchreset')" placement="top">
                        <el-button type="primary" icon="el-icon-delete" @click="search_date='';"></el-button>
                    </el-tooltip>
                    <el-button type="primary" @click="work" :disabled="btn">确定</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
                <div>
                    <el-input type="textarea" v-model="mytext" :rows="30"></el-input>
                </div>
                <div id="myChart_test1" class=charts_test1></div>
            </el-col>
        </el-row>
        <img src="" id="chartimg">
    </div>
</template>

<style>
  .charts_test1 {
    width: 520px;
    height: 390px;
    margin-left: auto;
    margin-right: auto;
    float: center;
  }

</style>

<script>
import hosts from '~/assets/config/hosts'
import rpc from '~/assets/js/rpc'
import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
import ImageModule from 'docxtemplater-image-module-free'

import NP from 'number-precision';
NP.enableBoundaryChecking(false);

export default {
    data() {
        return {
            btn: true,
            spec_type_data:{},
            specs: {},
            specs_type_vice: {},
            search_date: '',
            fullscreenLoading: false,
            data: [],
            dataurl: '',
            chartData2: [],
            mytext: '',
            spec_count: 0,
            spec_type_count: {},
            spec_type_avg: {},
            spec_type_vice_percent: {},
            spec_avg: [],
            tableData1: {},
            spec_range: [],
            spec_type_range: {},
            spec_type_space: {},
            spec_type_hours: {},
            spec_hours: {},
            OFP: {}
        }
    },
    created() {
        this.spec_type();
	},
    methods: {
        tt(){
            console.log(this.mytext);
            alert(this.mytext)
        },
        text_set(){
            let ret=[], k, da=[];
            this.mytext = '';
            ret.push('时间: ' + this.search_date[0] + ' ' + this.search_date[1]);
            ret.push('VOCs物种总数: ' + this.spec_count);
            for (k in this.spec_type_count){
                da.push(k + ' ' + this.spec_type_count[k] + '种');
            }
            ret.push(da.join(','));
            da = [];
            for (k in this.spec_type_avg){
                da.push(k + ' ' + this.spec_type_avg[k][0] + '±' + this.spec_type_avg[k][1]);
            }
            ret.push(da.join(','));
            da = [];
            for (k in this.spec_type_vice_percent){
                da.push(k + ' ' + this.spec_type_vice_percent[k] + '%');
            }
            ret.push(da.join(','));

            let spec_avg = this.spec_avg.slice(0, 10);
            ret.push('体积分数平均值最高的前十种VOCs分别为: ' + spec_avg.map(v => v[0]).join(','));
            ret.push('体积分数平均值分别为: ' + spec_avg.map(v => v[1]).join(','));

            let spec_count = this.spec_avg.map(v => v[1]).reduce((x, y) => NP.plus(x, y));
            let spec_top10_count = spec_avg.map(v => v[1]).reduce((x, y) => NP.plus(x, y));
            ret.push('VOCs总体积分数占比为: ' + this.get_percent(spec_top10_count, spec_count) + '%');

            ret.push('体积分数变化范围: ' + this.spec_range[0][1] + '-' + this.spec_range[1][1]);
            ret.push('分别出现在: ' +  this.spec_range[0][0] + '和' + this.spec_range[1][0]);

            ret.push('其中:' + Object.keys(this.spec_type_range).map(v => [v, this.spec_type_range[v].map(w => w[1]).join('-')].join('体积分数变化范围为') + 'ppb').join(',') +'.')
            
            let spec_hours = Object.keys(this.spec_hours).map(v => [v, this.spec_hours[v]]);
            let spec_hours_light = spec_hours.filter(v => (v[0]>=8 && v[0]<=18)).sort((x, y) => x[1] - y[1]);
            let spec_hours_night = spec_hours.filter(v => (v[0]<8 || v[0]>18)).sort((x, y) => x[1] - y[1]);
            let spec_hours_range = spec_hours.sort((x, y) => x[1] - y[1]);

            ret.push('夜间体积分数平均值: ' + this.get_average(spec_hours_night.map(v => v[1])));
            ret.push('夜间体积分数在: ' + spec_hours_night[0][1] + '-' + spec_hours_night[spec_hours_night.length-1][1] + 'ppb');
            ret.push('昼间体积分数平均值: ' + this.get_average(spec_hours_light.map(v => v[1])));
            ret.push('昼间体积分数在: ' + spec_hours_light[0][1] + '-' + spec_hours_light[spec_hours_light.length-1][1] + 'ppb');

            ret.push('VOCs体积分数 于' + spec_hours_range[spec_hours_range.length-1][0] + '时出现最大值' + spec_hours_range[spec_hours_range.length-1][1] + 'ppb, 于' + spec_hours_range[0][0] + '时出现最小值'+ spec_hours_range[0][1] + 'ppb');

            let sth, spec_type_hours=[[],[],[]], spec_type_hours_light, spec_type_hours_night, spec_type_hours_range;
            for (k in this.spec_type_hours){
                sth = Object.keys(this.spec_type_hours[k]).map(v => [v, this.spec_type_hours[k][v]]);
                spec_type_hours_light = sth.filter(v => (v[0]>=8 && v[0]<=18));
                spec_type_hours_night = sth.filter(v => (v[0]<8 || v[0]>18));
                spec_type_hours_range = sth.sort((x, y) => x[1] - y[1]);
                spec_type_hours[0].push(k);
                spec_type_hours[1].push(this.get_average(spec_type_hours_light.map(v => v[1])));
                spec_type_hours[2].push(this.get_average(spec_type_hours_night.map(v => v[1])));
                ret.push(k + ' 于' + spec_type_hours_range[spec_type_hours_range.length-1][0] + '时出现最大值' + spec_type_hours_range[spec_type_hours_range.length-1][1] + 'ppb, 于' + spec_type_hours_range[0][0] + '时出现最小值'+ spec_type_hours_range[0][1] + 'ppb');
            }
            ret.push('各大类VOCs: ' +  spec_type_hours[0].join(','));
            ret.push('夜间体积分数平均值: ' +  spec_type_hours[2].join(','));
            ret.push('昼间体积分数平均值: ' +  spec_type_hours[1].join(','));

            let ofp, ofp_total, ofp_top10, ofp_top10_per, ofp_top1_per;
            ofp = Object.keys(this.OFP).map(v => [v, this.OFP[v]]).sort((x, y) => y[1] - x[1]);
            ofp_total = ofp.map(v => v[1]).reduce((x, y) => NP.plus(x, y));
            ofp_top10 = ofp.slice(0, 10);
            ofp_top10_per = this.get_percent(ofp_top10.map(v => v[1]).reduce((x, y) => NP.plus(x, y)), ofp_total);
            ofp_top1_per = this.get_percent(ofp_top10[0][1], ofp_total);

            ret.push('臭氧生成趋势最高的前十种VOCs: ' +  ofp_top10.map(v => this.specs[v[0]][7]).join(','));
            ret.push('总计占: ' +  ofp_top10_per +'%');
            ret.push(this.specs[ofp_top10[0][0]][7] + ' 是臭氧生成趋势最高的VOCs物种， 贡献了 ' +  ofp_top1_per +'%');

            this.mytext = ret.join('\n');
        },
        search(){
            if (this.search_date) {
                rpc(hosts.baseHost, 'Search.Get_data', this.search_date, {}, (d) => {
                    if(d.result){
                        if(d.result.length){
                            let data={}, spec_vice, data1={}, data2={}, data3={}, data4={}, data5={};
                            d.result.forEach(v => {
                                if (v[1].length==10) v[1] = v[1] + " 00:00:00";

                                if (!data.hasOwnProperty(v[10])){
                                    data[v[10]] = [];
                                }
                                data[v[10]].push(v[3]);

                                spec_vice = this.specs_type_vice[v[2]];
                                if (!data1.hasOwnProperty(spec_vice)){
                                    data1[spec_vice] = 0;
                                }
                                data1[spec_vice] = NP.plus(data1[spec_vice], v[3]);

                                if (!data2.hasOwnProperty(v[10])){
                                    data2[v[10]] = {};
                                }
                                if (!data2[v[10]].hasOwnProperty(v[2])){
                                    data2[v[10]][v[2]] = [];
                                }
                                data2[v[10]][v[2]].push(v[3]);

                                if (!data3.hasOwnProperty(v[10])){
                                    data3[v[10]] = {};
                                }
                                if (!data3[v[10]].hasOwnProperty(v[1])){
                                    data3[v[10]][v[1]] = 0;
                                }
                                data3[v[10]][v[1]] = NP.plus(data3[v[10]][v[1]], v[3]);

                                if (!data4.hasOwnProperty(v[1])){
                                    data4[v[1]] = 0;
                                }
                                data4[v[1]] = NP.plus(data4[v[1]], v[3]);
                                
                                if (v[8] > 0) {
                                    if (!data5.hasOwnProperty(v[2])){
                                        data5[v[2]] = 0;
                                    }
                                    data5[v[2]] = NP.plus(data5[v[2]], NP.times(v[3], v[8]));
                                }
                            });

                            let k, da1 = {};
                            this.tableData1 = {};

                            for (k in data2){
                                this.tableData1[k] = Object.keys(data2[k]).map(v => (this.specs[v][7] + this.specs[v][8])).join(' ');
                                this.spec_type_count[k] = Object.keys(data2[k]).length;
                                Object.assign(da1, data2[k]);
                            }
                            this.spec_count = Object.values(this.spec_type_count).reduce((x, y) => NP.plus(x, y));

                            for (k in da1){
                               this.spec_avg.push([
                                    this.specs[k][7],
                                    this.get_average(da1[k])
                               ]);
                            }
                            this.spec_avg.sort((x, y) => y[1] - x[1]);

                            for (k in data) {
                                this.spec_type_avg[k] = [this.get_average(Object.values(data[k])), this.get_stdevp(Object.values(data[k]))];
                            }
                            let total;
                            total = Object.values(data1).reduce((x, y) => NP.plus(x, y));
                            for (k in data1){
                                this.spec_type_vice_percent[k] = this.get_percent(data1[k], total);
                            }

                            let str_arr, l, i;
                            this.spec_type_space = data3;
                            for (k in data3){
                                str_arr = Object.keys(data3[k]).map(v => [v, data3[k][v]]).sort((x, y) => x[1] - y[1]);
                                this.spec_type_range[k] = [str_arr[0], str_arr[str_arr.length - 1]];

                                this.spec_type_hours[k]= {};
                                for (l in data3[k]){
                                    i = new Date(l).getHours();
                                    if (!(i in this.spec_type_hours[k]))
                                        this.spec_type_hours[k][i] = [];
                                    this.spec_type_hours[k][i].push(data3[k][l]);
                                }
                            }
                            for (k in this.spec_type_hours){
                                for (l in this.spec_type_hours[k]){
                                    this.spec_type_hours[k][l] = this.get_average(this.spec_type_hours[k][l]);
                                }
                            }

                            str_arr = Object.keys(data4).map(v => [v, data4[v]]).sort((x, y) => x[1] - y[1]);
                            this.spec_range = [str_arr[0], str_arr[str_arr.length - 1]];
                            for (k in data4){
                                i = new Date(k).getHours();
                                if (!(i in this.spec_hours))
                                    this.spec_hours[i] = [];
                                this.spec_hours[i].push(data4[k]);
                            }

                            for (k in this.spec_hours){
                                this.spec_hours[k] = this.get_average(this.spec_hours[k]);
                            }

                            this.OFP = data5;

                            this.text_set();
                        }
                    }
                    else if(d.error){
                        throw(d.error);
                        this.$message({
                            message: d.error,
                            type: 'warning'
                        });
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
        chart2() {
            let myChart = this.$echarts.init(document.getElementById('myChart_test1'));
            myChart.setOption({
                title: {
                    text: 'VOCs组成特征',
                    left: 'center'
                },
                tooltip:{
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
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
            myChart.on('finished', (params) => {
                this.dataurl = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
                document.getElementById('chartimg').src = this.dataurl;
                this.btn = false;
            });
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
        spec_type() {
            rpc(hosts.baseHost, 'bi.list', 'spec_type', '', (d) => {
                if(d.result){
                    d.result.forEach(v => {
                        this.spec_type_data[v[0]] = v[3];
                    });
                    this.spec_load();
                }
            })
        },
        spec_load (){
            rpc(hosts.baseHost, 'bi.list', 'species', '', (d) => {
                if(d.result)
                    d.result.forEach(v => {
                        this.specs[v[0]] = v;
                        this.specs_type_vice[v[0]] = this.spec_type_data[v[4]];
                    });
            })
        },
        work (){
            let d=[], k;

            for (k in this.tableData){
                d.push({
                    spec_type: k,
                    spec: this.tableData[k].join()
                })
            }

            console.log(d);
            this.data = d;
            this.exportWord();
        },
        base64DataURLToArrayBuffer(dataURL) {
            const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
            if (!base64Regex.test(dataURL)) {
                return false;
            }
            const stringBase64 = dataURL.replace(base64Regex, "");
            let binaryString;
            if (typeof window !== "undefined") {
                binaryString = window.atob(stringBase64);
            } else {
                binaryString = new Buffer(stringBase64, "base64").toString("binary");
            }
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                const ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
            }
            return bytes.buffer;
        },
        exportWord () {
            let that = this;
            JSZipUtils.getBinaryContent("/docx/specs.docx", function(error, content) {
                if (error) {
                    throw error;
                }
            
                let opts = {}
                opts.centered = true;
                opts.fileType = "docx";
                opts.getImage = function(chartId){
                    return that.base64DataURLToArrayBuffer(chartId);
                }
                opts.getSize = function(){
                    return [520,390]
                }
                let imageModule = new ImageModule(opts);
                let zip = new PizZip(content);
                let doc = new docxtemplater();
                doc.attachModule(imageModule);
                doc.loadZip(zip);  

                doc.setData({
                    specs: that.data,
                    image: that.dataurl
                });
            
                try {
                    doc.render();
                } catch (error) {
                    let e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties
                    };
                    console.log(JSON.stringify({ error: e }));
                    throw error;
                }
            
                let out = doc.getZip().generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                });
                saveAs(out, "specs.docx");
            });
        }
    }
};
</script>