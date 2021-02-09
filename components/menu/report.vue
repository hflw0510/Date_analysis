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
                    <el-tooltip effect="dark" content="生成数据" placement="top">
                        <el-button type="primary" icon="el-icon-search" @click="search()" v-loading.fullscreen.lock="fullscreenLoading"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.searchreset')" placement="top">
                        <el-button type="primary" icon="el-icon-delete" @click="search_date='';"></el-button>
                    </el-tooltip>
                    <el-button type="primary" @click="work" :disabled="btn">下载</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <el-row style="padding-top:22px;">
            <el-col :span=2>&nbsp;</el-col>
            <el-col :span=8>
                <el-form ref="form" :model="form" ret="form" label-width="80px" label-position="left">
                    <el-form-item label="站点名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span=14></el-col>
        </el-row>
        <el-row>
            <el-col :span=2>&nbsp;</el-col>
            <el-col :span=8>
                <el-form ref="form" :model="form"  ret="form" label-width="80px" label-position="left">
                    <el-form-item label="昼间设定" prop="time_set">
                        <el-select v-model="form.stime" style="width:80px">
                            <el-option
                                v-for="i in [5,6,7,8,9]"
                                :key="i"
                                :label="i"
                                :value="i"
                            ></el-option>
                        </el-select>
                        &nbsp;- &nbsp;
                        <el-select v-model="form.etime" style="width:80px">
                            <el-option
                                v-for="i in [17,18,19,20]"
                                :key="i"
                                :label="i"
                                :value="i"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span=14></el-col>
        </el-row>
        <el-row >
            <el-col :span=2>&nbsp;</el-col>
            <el-col :span=8>
                <el-form ref="form" :model="form" ret="form" label-width="80px" label-position="left">
                    <el-form-item label="单位选择" prop="unit">
                        <el-radio v-model="form.unit" label=0>ppb</el-radio>
                        <el-radio v-model="form.unit" label=1>μg/m³</el-radio>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span=14></el-col>
        </el-row>
        <el-row >
            <el-col :span=2>&nbsp;</el-col>
            <el-col :span=8>
                <el-form ref="form" :model="form" ret="form" label-width="80px" label-position="left">
                    <el-form-item label="源解析ID" prop="sid">
                        <el-input v-model="form.sid"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span=14></el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px; height:720px">
                <div>
                    <el-input type="textarea" v-model="mytext" :rows="32" style="display:none"></el-input>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test1" class=charts_test1></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test2" class=charts_test1></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test3" class=charts_test1></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test4" class=charts_test1></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test5" class=charts_test1></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test6" class=charts_test1></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test7" class=charts_test1></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test8" class=charts_test1></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test9" class=charts_test2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test10" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test11" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test12" class=charts_test2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test13" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test14" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test15" class=charts_test2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test16" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test17" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test18" class=charts_test2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test19" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test20" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test21" class=charts_test2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test22" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test23" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test24" class=charts_test2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test25" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test26" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test27" class=charts_test2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test30" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test31" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test32" class=charts_test2></div>
            </el-col>
        </el-row>
                <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test33" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test34" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test35" class=charts_test2></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test36" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test37" class=charts_test2></div>
            </el-col>
            <el-col :span=8 style="padding: 8px 12px;">
                <div id="myChart_test38" class=charts_test2></div>
            </el-col>
        </el-row>
    </div>
</template>

<style>
  .charts_test1 {
    width: 520px;
    height: 390px;
    margin-left: auto;
    margin-right: auto;
    display: none
  }

.charts_test2 {
    width: 520px;
    height: 390px;
    margin-left: auto;
    margin-right: auto;
    display:none
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
            tip: '',
            btn: true,
            spec_type_data:{},
            specs: {},
            specs_type_vice: {},
            search_date: '',
            datelist: [],
            fullscreenLoading: false,
            data: [],
            dataurl: {},
            chartData1: {},
            chartData2: [],
            chartData3: {},
            chartData4: {},
            chartData5: {},
            chartData6: {},
            chartData7: {},
            chartData8: {},
            mytext: '',
            spec_count: 0,
            spec_type_count: {},
            spec_type_avg: {},
            spec_type_vice_percent: {},
            spec_avg: [],
            tableData1: {},
            spec_range: [],
            spec_type_range: {},
            spec_type_hours: {},
            spec_type_hours_stdevp: {},
            spec_type_hours_freon: {},
            spec_hours: {},
            spec_hours_stdevp: {},
            spec_hours_freon: {},
            OFP: {},
            LOH: {},
            docx_data: {},
            form: {
                name: '',
                time_set: '',
                unit: '0',
                sid: '',
                stime: 8,
                etime: 19
            },
            specs_name: {},
            spec_types_name: {},
            s_chartData1: [],
            s_chartData2: {
                legend: [],
                xAxis: [],
                series: []
            },
            s_chartData3: {
                legend: [],
                xAxis: [],
                series: []
            },
            s_chartData4: {
                legend: [],
                data: []
            },
            color: ['#0100fe','#03ffff', '#ec7c31', '#7501e8', '#9c007a','#c1c1ff',  '#86e3bf', '#f6f784','#ceccce', '#ffc0db'],
            divs: [],
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
            v_str: [],
            s_spec_count:0
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

            this.docx_data["name"] = this.form.name;
            this.docx_data["unit"] = ((this.form.unit=='1')?'μg/m³':'ppb')
            ret.push('单位: ' + this.docx_data["unit"]);

            this.docx_data["datefrom"] = this.search_date[0];
            this.docx_data["dateto"] = this.search_date[1];
            ret.push('时间: ' + this.docx_data["datefrom"] + ' ' + this.docx_data["dateto"]);

            this.docx_data["spec_count"] = this.spec_count;
            ret.push('VOCs物种总数: ' + this.docx_data["spec_count"]);
            
            for (k in this.spec_type_count){
                da.push(k + ' ' + this.spec_type_count[k] + '种');
            }
            this.docx_data["spec_type_list"] = da.join(',');
            ret.push(this.docx_data["spec_type_list"]);

            let stc=0, sta=0;
            da = [];
            for (k in this.spec_type_avg){
                da.push(k + ' ' + this.spec_type_avg[k][0] + this.docx_data["unit"] + '±' + this.spec_type_avg[k][1]);
                stc = NP.plus(stc, this.spec_type_avg[k][0]);
                sta = NP.plus(sta, this.spec_type_avg[k][1]);
            }

            this.docx_data["spec_total_avg"] = stc + this.docx_data["unit"] + '±' + sta;
            ret.push('体积分数平均值: ' + this.docx_data["spec_total_avg"]);

            this.docx_data["spec_type_avg"] = da.join(',');
            ret.push(this.docx_data["spec_type_avg"]);

            da = [];
            for (k in this.spec_type_vice_percent){
                da.push(k + ' ' + this.spec_type_vice_percent[k] + '%');
            }

            this.docx_data["spec_type_vice_percent"] = da.join(',');
            ret.push(this.docx_data["spec_type_vice_percent"]);

            this.docx_data["specs"] = this.tableData1;

            let spec_avg = this.spec_avg.slice(0, 10);
            this.docx_data["spec_top10"] = spec_avg.map(v => v[0]).join(',')
            this.docx_data["spec_top10_ppb"] = spec_avg.map(v => v[1] + this.docx_data["unit"]).join(',')
            ret.push('体积分数平均值最高的前十种VOCs分别为: ' + this.docx_data["spec_top10"]);
            ret.push('体积分数平均值分别为: ' + this.docx_data["spec_top10_ppb"]);

            let spec_count = this.spec_avg.map(v => v[1]).reduce((x, y) => NP.plus(x, y));
            let spec_top10_count = spec_avg.map(v => v[1]).reduce((x, y) => NP.plus(x, y));

            this.docx_data["spec_total_percent"] = this.get_percent(spec_top10_count, spec_count) + '%';
            ret.push('VOCs总体积分数占比为: ' + this.docx_data["spec_total_percent"]);

            this.docx_data["spec_range"] = this.spec_range[0][1] + '-' + this.spec_range[1][1] + this.docx_data["unit"];
            ret.push('体积分数变化范围: ' +  this.docx_data["spec_range"]);

            this.docx_data["spec_range_time"] = this.spec_range[0][0] + '和' + this.spec_range[1][0];
            ret.push('分别出现在: ' +  this.docx_data["spec_range_time"]);

            this.docx_data["spec_type_range"] = Object.keys(this.spec_type_range).map(v => [v, this.spec_type_range[v].map(w => w[1]).join('-')].join('体积分数变化范围为') + this.docx_data["unit"] ).join(',') +'.';
            ret.push('其中:' + this.docx_data["spec_type_range"]);

            this.docx_data["stime"] = parseInt(this.form.stime);
            this.docx_data["etime"] = parseInt(this.form.etime);
            
            this.docx_data["night"] = "0:00-" + (this.docx_data["stime"]-1) + ":00," + (this.docx_data["etime"]+1) + ":00-23:00";
            this.docx_data["day"] = this.docx_data["stime"] + ":00-" + this.docx_data["etime"] + ":00";

            ret.push("夜间：" + this.docx_data["night"]);
            ret.push("昼间：" + this.docx_data["day"]);

            let spec_hours = Object.keys(this.spec_hours).map(v => [v, this.spec_hours[v]]);
            let spec_hours_light = spec_hours.filter(v => (v[0]>=this.docx_data["stime"] && v[0]<=this.docx_data["etime"])).sort((x, y) => x[1] - y[1]);
            let spec_hours_night = spec_hours.filter(v => (v[0]<this.docx_data["stime"] || v[0]>this.docx_data["etime"])).sort((x, y) => x[1] - y[1]);
            let spec_hours_range = spec_hours.sort((x, y) => x[1] - y[1]);

            this.docx_data["spec_hours_night"] = this.get_average(spec_hours_night.map(v => v[1]));
            ret.push('夜间体积分数平均值: ' + this.docx_data["spec_hours_night"] + this.docx_data["unit"]);

            this.docx_data["spec_hours_night_range"] = spec_hours_night[0][1] + '-' + spec_hours_night[spec_hours_night.length-1][1] + this.docx_data["unit"];
            ret.push('夜间体积分数在: ' + this.docx_data["spec_hours_night_range"]);

            this.docx_data["spec_hours_light"] = this.get_average(spec_hours_light.map(v => v[1]));
            ret.push('昼间体积分数平均值: ' + this.docx_data["spec_hours_light"] + this.docx_data["unit"]);

            this.docx_data["spec_hours_light_range"] = spec_hours_light[0][1] + '-' + spec_hours_light[spec_hours_light.length-1][1] + this.docx_data["unit"];
            ret.push('昼间体积分数在: ' + this.docx_data["spec_hours_light_range"]);

            this.docx_data["spec_hours_range_max"] = spec_hours_range[spec_hours_range.length-1][0];
            this.docx_data["spec_hours_range_max_value"] = spec_hours_range[spec_hours_range.length-1][1] + this.docx_data["unit"];
            this.docx_data["spec_hours_range_min"] = spec_hours_range[0][0];
            this.docx_data["spec_hours_range_min_value"] = spec_hours_range[0][1] + this.docx_data["unit"];
            ret.push('VOCs体积分数 于' + this.docx_data["spec_hours_range_max"] + '时出现最大值' + this.docx_data["spec_hours_range_max_value"] + ', 于' + this.docx_data["spec_hours_range_min"] + '时出现最小值'+ this.docx_data["spec_hours_range_min_value"]);

            let sth, spec_type_hours=[[],[],[]], spec_type_hours_light, spec_type_hours_night, spec_type_hours_range, spec_type_wave=[];
            this.docx_data["spec_type_hours"] = []
            for (k in this.spec_type_hours){
                sth = Object.keys(this.spec_type_hours[k]).map(v => [v, this.spec_type_hours[k][v]]);
                spec_type_hours_light = sth.filter(v => (v[0]>=8 && v[0]<=18));
                spec_type_hours_night = sth.filter(v => (v[0]<8 || v[0]>18));
                spec_type_hours_range = sth.sort((x, y) => x[1] - y[1]);
                spec_type_wave.push([k, spec_type_hours_range[spec_type_hours_range.length-1][1] - spec_type_hours_range[0][1]])
                spec_type_hours[0].push(k);
                spec_type_hours[1].push(this.get_average(spec_type_hours_light.map(v => v[1])) + this.docx_data["unit"]);
                spec_type_hours[2].push(this.get_average(spec_type_hours_night.map(v => v[1])) + this.docx_data["unit"]);
                this.docx_data["spec_type_hours"].push(k + ' 于' + spec_type_hours_range[spec_type_hours_range.length-1][0] + '时出现最大值' + spec_type_hours_range[spec_type_hours_range.length-1][1] + 'ppb, 于' + spec_type_hours_range[0][0] + '时出现最小值'+ spec_type_hours_range[0][1] + 'ppb');
            }
            this.docx_data["spec_type_count"] = Object.keys(this.spec_type_hours).length;
            this.docx_data["spec_type_hours"] = this.docx_data["spec_type_hours"].join(';');
            ret.push(this.docx_data["spec_type_hours"]);

            spec_type_wave = spec_type_wave.sort((x, y) => x[1] - y[1]);
            this.docx_data["spec_max"] = spec_type_wave[spec_type_wave.length-1][0];
            this.docx_data["spec_min"] = spec_type_wave[0][0];

            this.docx_data["spec_type_hour"] = spec_type_hours[0].join(',');
            this.docx_data["spec_type_night"] = spec_type_hours[2].join(',');
            this.docx_data["spec_type_light"] = spec_type_hours[1].join(',');
            ret.push('各大类VOCs: ' +  this.docx_data["spec_type_hour"]);
            ret.push('夜间体积分数平均值: ' +  this.docx_data["spec_type_night"]);
            ret.push('昼间体积分数平均值: ' +  this.docx_data["spec_type_light"]);

            let ofp, ofp_total, ofp_top10, ofp_top10_per, ofp_top1_per;
            ofp = this.OFP;
            ofp_total = ofp.map(v => v[1]).reduce((x, y) => NP.plus(x, y));
            ofp_top10 = ofp.slice(0, 10);
            ofp_top10_per = this.get_percent(ofp_top10.map(v => v[1]).reduce((x, y) => NP.plus(x, y)), ofp_total);
            ofp_top1_per = this.get_percent(ofp_top10[0][1], ofp_total);

            this.docx_data["ofp_top10"] = ofp_top10.map(v => this.specs[v[0]][7]).join(',');
            this.docx_data["ofp_top10_per"] = ofp_top10_per +'%';
            ret.push('臭氧生成趋势最高的前十种VOCs: ' +  this.docx_data["ofp_top10"]);
            ret.push('总计占: ' +  this.docx_data["ofp_top10_per"]);

            this.docx_data["ofp_top1"] = this.specs[ofp_top10[0][0]][7];
            this.docx_data["ofp_top1_per"] = ofp_top1_per +'%';
            ret.push(this.docx_data["ofp_top1"] + ' 是臭氧生成趋势最高的VOCs物种， 贡献了 ' +  this.docx_data["ofp_top1_per"]);

            let loh, loh_total, loh_top10, loh_top10_per, loh_top1_per;
            loh = this.LOH;
            loh_total = loh.map(v => v[1]).reduce((x, y) => NP.plus(x, y));
            loh_top10 = loh.slice(0, 10);
            loh_top10_per = this.get_percent(loh_top10.map(v => v[1]).reduce((x, y) => NP.plus(x, y)), loh_total);
            loh_top1_per = this.get_percent(loh_top10[0][1], loh_total);

            this.docx_data["loh_top10"] = loh_top10.map(v => v[0]).join(',');
            this.docx_data["loh_top10_per"] = loh_top10_per +'%';
            ret.push('自由基反应活性最高的前十种VOCs: ' +  this.docx_data["loh_top10"]);
            ret.push('总计占: ' +  this.docx_data["loh_top10_per"]);

            this.docx_data["loh_top1"] = loh_top10[0][0];
            this.docx_data["loh_top1_per"] = loh_top1_per +'%';
            ret.push(this.docx_data["loh_top1"] + ' 是自由基反应活性最高的VOCs物种， 贡献了 ' +  this.docx_data["loh_top1_per"]);

            this.docx_data["s_spec_count"] = this.s_spec_count;
            let total = this.s_chartData4.data.map(v => v['value']).reduce((x, y) => NP.plus(x, y));
            let source_data = this.s_chartData4.data.map(v => [v['name'], this.get_percent(v['value'], total)]).sort((x, y) => y[1] - x[1]);
            this.docx_data["s_top1"] = source_data[0][0] + '占比' + source_data[0][1] + '%';
            this.docx_data["s_top1_name"] = source_data[0][0];

            this.docx_data["s_topn"] = source_data.slice(1).map(v => v[0]).join('、');
            this.docx_data["s_topn_value"] = source_data.slice(1).map(v => v[1] + '%').join('、');
            this.docx_data["s_v_str"] = this.v_str.map((v, i) => '因子'+ (i+1) + ' '+ v).join('。');

            ret.push('源解析物种数：' +  this.docx_data["s_spec_count"]);
            ret.push('贡献最大：' +  this.docx_data["s_top1"]);
            ret.push('其他依次为：' +  this.docx_data["s_topn"]);
            ret.push('占比为：' +  this.docx_data["s_topn_value"]);
            ret.push('解析结果为：' +  this.docx_data["s_v_str"]);
            console.log(3);

            this.mytext = ret.join('\n');
            this.$message({
                message: '数据处理完毕，请点击下载。',
                type: 'success'
            })
        },
        search(){
            this.fullscreenLoading = true;
            if (this.search_date) {
                this.get_datelist(this.search_date);
                rpc(hosts.baseHost, 'Search.Get_data', this.search_date, {}, (d) => {
                    if(d.result){
                        if(d.result.length){
                            let data={}, spec_vice, data1={}, data2={}, data3={}, data4={}, data5={}, data6={}, data7={}, data8={};
                            d.result.forEach(v => {
                                if (v[1].length==10) v[1] = v[1] + " 00:00:00";
                                let val = this.get_μg(v[2], v[3]);
                                if (this.form.unit=='1') v[3] = this.get_μg(v[2], v[3]);

                                if (!data.hasOwnProperty(v[10])){
                                    data[v[10]] = [];
                                }
                                if (!data[v[10]].hasOwnProperty(v[1])){
                                    data[v[10]][v[1]] = 0;
                                }
                                data[v[10]][v[1]] = NP.plus(data[v[10]][v[1]], v[3]);

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

                                if (!data6.hasOwnProperty(v[1])){
                                    data6[v[1]] = {};
                                }
                                if (!data6[v[1]].hasOwnProperty(v[10])){
                                    data6[v[1]][v[10]] = 0;
                                }
                                data6[v[1]][v[10]] = NP.plus(data6[v[1]][v[10]], v[3]);

                                if (!data4.hasOwnProperty(v[1])){
                                    data4[v[1]] = 0;
                                }
                                data4[v[1]] = NP.plus(data4[v[1]], v[3]);
                                
                                if (v[8] > 0) {
                                    let val = v[3];
                                    if (!data5.hasOwnProperty(v[2])){
                                        data5[v[2]] = 0;
                                    }
                                    data5[v[2]] = NP.plus(data5[v[2]], NP.times(val, v[8]));
                                }

                                if (v[11] > 0) {
                                    if (!data8.hasOwnProperty(v[5])){
                                        data8[v[5]] = 0;
                                    }
                                    data8[v[5]] = NP.plus(data8[v[5]], NP.times(val, NP.divide(v[11], v[7]))).toFixed(4);
                                }

                                if (v[5] == '氟利昂113'){
                                    if (!data7.hasOwnProperty(v[1])) data7[v[1]] = [];
                                    data7[v[1]] = NP.plus(data7[v[1]], v[3]);
                                }
                            });

                            let k, da1 = {};
                            this.tableData1 = [];
                            this.spec_type_count = {};
                            this.spec_count = 0;
                            for (k in data2){
                                this.tableData1.push({
                                    spec_type: k + '(' + Object.keys(data2[k]).length + ')',
                                    spec: Object.keys(data2[k]).map(v => (this.specs[v][7] + this.specs[v][8])).join(' ')
                                });
                                this.spec_type_count[k] = Object.keys(data2[k]).length;
                                Object.assign(da1, data2[k]);
                            }
                            this.spec_count = Object.values(this.spec_type_count).reduce((x, y) => NP.plus(x, y));

                            this.spec_avg = [];
                            this.spec_type_avg = {};
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

                            let total=0;
                            this.spec_type_vice_percent = {};
                            total = Object.values(data1).reduce((x, y) => NP.plus(x, y));
                            for (k in data1){
                                this.spec_type_vice_percent[k] = this.get_percent(data1[k], total);
                            }

                            let str_arr, l, i;
                            this.spec_type_range = {};
                            this.spec_type_hours = {};
                            this.spec_type_hours_stdevp = {};
                            this.spec_type_hours_freon = {};
                            for (k in data3){
                                str_arr = Object.keys(data3[k]).map(v => [v, data3[k][v]]).sort((x, y) => x[1] - y[1]);
                                this.spec_type_range[k] = [str_arr[0], str_arr[str_arr.length - 1]];

                                this.spec_type_hours[k]= {};
                                this.spec_type_hours_freon[k]= {};
                                for (l in data3[k]){
                                    i = new Date(l).getHours();
                                    if (!(i in this.spec_type_hours[k]))
                                        this.spec_type_hours[k][i] = [];
                                    if (!(i in this.spec_type_hours_freon[k]))
                                        this.spec_type_hours_freon[k][i] = [];
                                    this.spec_type_hours[k][i].push(data3[k][l]);
                                    if (l in data7)
                                        this.spec_type_hours_freon[k][i].push(NP.divide(data3[k][l], data7[l]).toFixed(4));
                                    else
                                        this.spec_type_hours_freon[k][i].push(data3[k][l]);
                                }
                            }
                            for (k in this.spec_type_hours){
                                this.spec_type_hours_stdevp[k] = {};
                                for (l in this.spec_type_hours[k]){
                                    this.spec_type_hours_stdevp[k][l] = this.get_stdevp(this.spec_type_hours[k][l]);
                                    this.spec_type_hours_freon[k][l] = this.get_average(this.spec_type_hours_freon[k][l]);
                                    this.spec_type_hours[k][l] = this.get_average(this.spec_type_hours[k][l]);
                                }
                            }

                            this.spec_hours = {};
                            this.spec_hours_stdevp = {};
                            this.spec_hours_freon = {};
                            str_arr = Object.keys(data4).map(v => [v, data4[v]]).sort((x, y) => x[1] - y[1]);
                            this.spec_range = [str_arr[0], str_arr[str_arr.length - 1]];
                            for (k in data4){
                                i = new Date(k).getHours();
                                if (!(i in this.spec_hours))
                                    this.spec_hours[i] = [];
                                if (!(i in this.spec_hours_freon))
                                    this.spec_hours_freon[i] = [];
                                this.spec_hours[i].push(data4[k]);
                                if (k in data7)
                                    this.spec_hours_freon[i].push(NP.divide(data4[k], data7[k]).toFixed(4));
                                else
                                    this.spec_hours_freon[i].push(data4[k]);
                            }

                            for (k in this.spec_hours){
                                this.spec_hours_stdevp[k] = this.get_stdevp(this.spec_hours[k]);
                                this.spec_hours_freon[k] = this.get_average(this.spec_hours_freon[k]);
                                this.spec_hours[k] = this.get_average(this.spec_hours[k]);
                            }

                            this.OFP = Object.keys(data5).map(v => [v, data5[v]]).sort((x, y) => y[1] - x[1]);
                            this.LOH = Object.keys(data8).map(v => [v, data8[v]]).sort((x, y) => y[1] - x[1]);

                            this.get_chartData1(data);
                            this.get_chartData3(this.spec_avg);
                            this.get_chartData4(data, data6);
                            this.get_chartData6(this.OFP);
                            this.get_chartData8(this.LOH);
                            this.get_chartData7();

                            this.source_analysis(this.form.sid);
                            //this.fullscreenLoading = false;
                            //this.btn = false;
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
        source_analysis(id) {
            this.fullscreenLoading = true;
            rpc(hosts.baseHost, 'Bi.Load', 'source_analysis', id, (d) => {
                if(d.result){
                    if(Object.keys(d.result).length){
                        //this.get_datelist(JSON.parse(d.result['date_range']));
                        this.get_datelist_data(JSON.parse(d.result['data'])['result']);
                        this.get_s_chartData1(JSON.parse(d.result['spec_id']), JSON.parse(d.result['F_FACTOR']));
                        this.get_s_chartData2(JSON.parse(d.result['G_FACTOR']));
                        this.get_s_chartData3(JSON.parse(d.result['G_FACTOR']));
                        this.get_s_chartData4(JSON.parse(d.result['G_FACTOR']));
                        this.s_spec_count = JSON.parse(d.result['spec_id']).length;
                        if (d.result['Result']){
                            this.values = JSON.parse(d.result['Result']);
                        }
                        this.text_set();
                        this.fullscreenLoading = false;
                        this.btn = false;
                    }
                    else{
                        this.fullscreenLoading = false;
                        this.$message.error('源解析没有符合条件的数据！');
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
            for (i=0;i<this.dateCheck(d[0], d[1])+1;i++) {
                let st = d[0];
                if (st.length==10) st = st + " 00:00:00";
                st = new Date(st);
                st.setHours(st.getHours() + i);
                this.datelist.push(this.dateFormat("YYYY-mm-dd HH:MM:SS", st));
            }
        },
        get_chartData1(data) {
            let k, v;
            this.chartData1.xAxis = [];
            this.chartData1.bar = [];
            this.chartData1.line = [];
            this.chartData2 = [];

            for (k in data) {
                this.chartData1.xAxis.push(k);
                this.chartData1.line.push(this.get_stdevp(Object.values(data[k])));
                
                v = this.get_average(Object.values(data[k]));
                this.chartData1.bar.push(v);
                this.chartData2.push({
                    name: k,
                    value: v
                })
            }
            this.chart1();
            this.chart2();
        },
        chart1(){
            let myChart = this.$echarts.init(document.getElementById('myChart_test1'));
            let aa = {
                title: {
                    text: 'VOCs体积分数平均',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
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
                        name: (this.form.unit=='1')?'浓度(μg/m³)':'浓度(ppb)'
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
                                color: (params) => ['#5a9dd7','#ee751d','#ff339c','#9d78ff','#58ff25','#00fff7', '#c1c1ff'][params.dataIndex]
                            }
                        }
                    },
                    {
                        name: '标准差',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.chartData1.line,
                        lineStyle: {
                            color: '#ceccce'
                        }
                    }
                ]
            };
            myChart.setOption(aa);
            myChart.on('finished', (params) => {
                this.docx_data['image1'] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        chart2() {
            let myChart = this.$echarts.init(document.getElementById('myChart_test2'));
            myChart.setOption({
                title: {
                    text: 'VOCs组成特征',
                    left: 'center'
                },
                color: ['#5a9dd7','#ee751d','#ff339c','#9d78ff','#58ff25','#00fff7', '#c1c1ff'],
                tooltip:{
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
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
            myChart.on('finished', (params) => {
                this.docx_data['image2'] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        get_chartData3(data){
            let k, d;
            this.chartData3.xAxis = [];
            this.chartData3.bar = [];

            d = data.slice(0, 10);
            this.chartData3.xAxis = d.map(v => v[0]);
            this.chartData3.bar = d.map(v => v[1]);

            this.chart3();
        },
        chart3 () {
            let myChart = this.$echarts.init(document.getElementById('myChart_test3'))
            myChart.setOption({
                title: {
                    text: '体积分数前10种VOCs物种',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
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
            myChart.on('finished', (params) => {
                this.docx_data['image3'] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        get_chartData4(data, data1) {
            let k, dtlist = [];
            this.chartData4.data = {};
            this.chartData4.legend = Object.keys(data);
            this.chartData4.xAxis = dtlist;
            this.chartData4.series = [];
            this.chartData5.data = {};
            this.chartData5.legend = Object.keys(data);
            this.chartData5.xAxis = dtlist;
            this.chartData5.series = [];

            Object.keys(data).forEach(v => {
                this.chartData4.data[v] = [];
                this.chartData4.series.push({
                    name: v,
                    type: 'line',
                    stack: 'total',
                    showSymbol: false,
                    areaStyle: {},
                    data: this.chartData4.data[v]
                });
                this.chartData5.data[v] = [];
                this.chartData5.series.push({
                    name: v,
                    type: 'line',
                    stack: 'total',
                    showSymbol: false,
                    areaStyle: {},
                    data: this.chartData5.data[v]
                })
            });
            this.chartData4.data['total'] = [];
            this.chartData4.series.push({
                name: 'VOCs总量',
                type: 'line',
                stack: 'total',
                showSymbol: false,
                areaStyle: {},
                data: this.chartData4.data['total']
            });
            this.chartData4.legend.push('VOCs总量');

            this.datelist.forEach(v => {
                let total = 0;
                Object.keys(data).forEach(w => {
                    if (v in data1) {
                        if (w in data1[v]){
                            let val = data1[v][w];
                            this.chartData4.data[w].push(val);
                            total = NP.plus(total, val);
                        }
                        else
                            this.chartData4.data[w].push(0);
                    }
                });
                if (total > 0){
                    dtlist.push(this.dateFormat("YYYY-mm-dd HH", v));
                    this.chartData4.data['total'].push(total);
                    Object.keys(data).forEach(w => {
                        if (v in data1) {
                            if (w in data1[v]){
                                this.chartData5.data[w].push(this.get_percent(data1[v][w], total));
                            }
                            else
                                this.chartData5.data[w].push(0);
                        }
                    });
                }
            });
            this.chart4();
            this.chart5();
        },
        chart4(){
            let myChart = this.$echarts.init(document.getElementById('myChart_test4'));
            let aa = {
                title: {
                    text: '时空分布特征-浓度累计',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#5d9cd3','#eb7b2e','#ff3299','#9369fe','#89fe66','#03ffff','#dfeb00','#ceccce'],
                legend:{
                    icon: 'pin',
                    bottom: "0%",
                    data: this.chartData4.legend
                },
                grid:{
                    left: '10%',
                    right: '15%',
                    bottom: '100'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.chartData4.xAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '浓度累计'
                    }
                ],
                series: this.chartData4.series
            };
            myChart.setOption(aa)
            myChart.on('finished', (params) => {
                this.docx_data['image4'] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        chart5() {
            let myChart = this.$echarts.init(document.getElementById('myChart_test5'));
            myChart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#5d9cd3','#eb7b2e','#ff3299','#9369fe','#89fe66','#03ffff','#dfeb00','#ceccce'],
                legend:{
                    icon: 'pin',
                    bottom: "0%",
                    data: this.chartData5.legend
                },
                grid:{
                    left: '10%',
                    right: '4%'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.chartData5.xAxis
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
                series: this.chartData5.series
            });
            myChart.on('finished', (params) => {
                this.docx_data['image5'] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        get_chartData6(data){
            let k, d=[];
            this.chartData6.xAxis = [];
            this.chartData6.bar = [];

            data.splice(0, 10).forEach(v => {
                this.chartData6.xAxis.push(this.specs[v[0]][7]);
                this.chartData6.bar.push(v[1]);
            });
            this.chart6();
        },
        chart6() {
            let myChart = this.$echarts.init(document.getElementById('myChart_test6'))
            myChart.setOption({
                title: {
                    text: '臭氧生成潜势前10种VOCs物种',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                label:{
                    show: true
                },
                xAxis: {
                    data: this.chartData6.xAxis,
                    axisLabel: {
                        interval: 0,
                        rotate: 35,
                        fontSize: 10
                    }
                },
                yAxis: {
                        type: 'value',
                        name: '物种浓度'
                    },
                series: [{
                    name: '浓度',
                    type: 'bar',
                    data: this.chartData6.bar,
                    itemStyle: {
                        normal: {
                            color: (params) => ['#0100fe','#03ffff','#ec7c31','#7501e8','#9c007a','#c1c1ff','#86e3bf','#f6f784','#ceccce','#ffc0db'][params.dataIndex]
                        }
                    }
                }]
            });
            myChart.on('finished', (params) => {
                this.docx_data['image6'] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        get_chartData7() {
            let k, d, chartData = [], chartData1 = [];
            let color = ['#5a9dd7', '#ee751d', '#ff339c', '#9d78ff', '#58ff25', '#00fff7', '#c1c1ff']

            //this.spec_type_hours_freon

            for (k in this.spec_type_hours) {
                d = ({
                    title: k,
                    xAxis: Array(24).fill(0).map((v, i) => i),
                    line: Object.values(this.spec_type_hours[k]),
                    stdevp: Object.values(this.spec_type_hours_stdevp[k])
                });
                chartData.push(d);

                d = ({
                    title: k,
                    xAxis: Array(24).fill(0).map((v, i) => i),
                    line: Object.values(this.spec_type_hours_freon[k]),
                    stdevp: []
                });
                chartData1.push(d);
            }

            this.chart7('myChart_test7', 7, {
                title: '',
                xAxis: Array(24).fill(0).map((v, i) => i),
                line: Object.values(this.spec_hours),
                stdevp: Object.values(this.spec_hours_stdevp)
            });

            this.chart7('myChart_test8', 8, {
                title: '',
                xAxis: Array(24).fill(0).map((v, i) => i),
                line: Object.values(this.spec_hours_freon),
                stdevp: []
            });

            chartData.forEach((v, i) => {
                this.chart7('myChart_test' + (i+9), i+9, v, color[i]);
            });

            chartData1.forEach((v, i) => {
                this.chart7('myChart_test' + (i+9+chartData.length), (i+18), v, color[i]);
            });

        },
        chart7(divid, i, data, color){
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
                        name: (this.form.unit=='1')?'浓度(μg/m³)':'浓度(ppb)',
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
                        showSymbol: false
                    },
                ]
            };
            myChart.setOption(aa)
            myChart.on('finished', (params) => {
                this.docx_data['image'+i] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        get_chartData8(data){
            let k;
            this.chartData8.xAxis = [];
            this.chartData8.bar = [];

            data.splice(0, 10).forEach(v => {
                this.chartData8.xAxis.push(v[0]);
                this.chartData8.bar.push(v[1]);
            });
            this.chart8();
        },
        chart8() {
            let myChart = this.$echarts.init(document.getElementById('myChart_test27'))
            myChart.setOption({
                title: {
                    text: 'LOH排名前十VOC物种',
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
                    data: this.chartData8.xAxis,
                    axisLabel: {
                        interval: 0,
                        rotate: 35,
                        fontSize: 10
                    }
                },
                yAxis: {
                        type: 'value',
                        name: '浓度(μg/m³)'
                    },
                series: [{
                    name: '浓度',
                    type: 'bar',
                    data: this.chartData8.bar,
                    itemStyle: {
                        normal: {
                            color: (params) => ['#0100fe','#03ffff','#ec7c31','#7501e8','#9c007a','#c1c1ff','#86e3bf','#f6f784','#ceccce','#ffc0db'][params.dataIndex]
                        }
                    }
                }]
            });
            myChart.on('finished', (params) => {
                this.docx_data['image27'] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        get_s_chartData1(spec_id, data) {
            let k, d, divid;
            this.divs = [];
            this.options = [];
            this.values = []
            this.s_chartData1 = [];

            data.forEach((v, index) => {
                divid = 'myChart_test'+ (30 + index);
                this.divs.push(divid);
                this.options.push(this.options_t);
                let val = this.get_value(spec_id, v);
                if (! (this.values.length > index)) this.values.push(val);
                let name = '因子' + (index + 1) + '(' + this.get_option(val) + ')';
                d = {
                    title : name,
                    xAxis : spec_id.map(v => this.specs[v][7]),
                    series : [{
                        name: name,
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
                this.s_chartData1.push(d);
            });
            this.$nextTick(() => {
                this.divs.forEach((v, i) => {
                    this.s_chart1(v, this.s_chartData1[i], i);
                })
            });
            
        },
        get_s_chartData2(data) {
            let k;
            this.s_chartData2.legend = [];
            this.s_chartData2.xAxis = this.datelist;
            this.s_chartData2.series = [];

            data[0].forEach((v, index) => {
                let name = '因子' + (index + 1) + '(' + this.get_option(this.values[index]) + ')';
                this.s_chartData2.legend.push(name);
                this.s_chartData2.series.push({
                    name: name,
                    type: 'line',
                    stack: 'total',
                    showSymbol: false,
                    areaStyle: {},
                    data: data.map(x => x[index])
                })
            });

            this.s_chart2();
        },
        get_s_chartData3(data) {
            let data1;
            this.s_chartData3.legend = [];
            this.s_chartData3.xAxis = this.datelist;
            this.s_chartData3.series = [];

            data1 = data.map(v => {
                let total = v.reduce((x, y) => NP.plus(x, y));
                return v.map(w => this.get_percent(w, total));
            });

            data1[0].forEach((v, index) => {
                let name = '因子' + (index + 1) + '(' + this.get_option(this.values[index]) + ')';
                this.s_chartData3.legend.push(name);
                this.s_chartData3.series.push({
                    name: name,
                    type: 'line',
                    stack: 'total',
                    showSymbol: false,
                    areaStyle: {},
                    data: data1.map(x => x[index])
                })
            });

            this.s_chart3();
        },
        get_s_chartData4(data) {
            this.s_chartData4.data = [];
            this.s_chartData4.legend = [];

            data[0].forEach((v, index) => {
                let name = '因子' + (index + 1) + '(' + this.get_option(this.values[index]) + ')';
                this.s_chartData4.legend.push(name);
                this.s_chartData4.data.push({
                    name: name,
                    value: data.map(w => w[index]).reduce((x, y) => NP.plus(x, y))
                })
            });

            this.s_chart4();
        },
        s_chart1(divid, data, index){
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
            myChart.setOption(aa);
            myChart.on('finished', (params) => {
                this.docx_data['image' + (30 + index)] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        s_chart2(){
            let myChart = this.$echarts.init(document.getElementById('myChart_test36'));
            let aa = {
                tooltip: {
                    trigger: 'axis'
                },
                legend:{
                    icon: 'rect',
                    data: this.s_chartData2.legend
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
                        data: this.s_chartData2.xAxis
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: this.s_chartData2.series
            };
            myChart.setOption(aa);
            myChart.on('finished', (params) => {
                this.docx_data['image36'] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        s_chart3() {
            let myChart = this.$echarts.init(document.getElementById('myChart_test37'));
            myChart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend:{
                    icon: 'rect',
                    data: this.s_chartData3.legend
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
                        data: this.s_chartData3.xAxis
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
                series: this.s_chartData3.series
            });
            myChart.on('finished', (params) => {
                this.docx_data['image37'] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
        },
        s_chart4() {
            let myChart = this.$echarts.init(document.getElementById('myChart_test38'));
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
                    data: this.s_chartData4.legend
                },
                label:{
                    formatter: '{b}: {d}%'
                },
                series:[
                    {
                        name: '因子占比',
                        type: 'pie',
                        radius: '55%',
                        data: this.s_chartData4.data
                    }
                ]
            });
            myChart.on('finished', (params) => {
                this.docx_data['image38'] = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
            });
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
                if (arr[0][0] == this.specs_name[v1]){
                    this.v_str.push('异戊二烯占比最高 生物源√');
                    return 1;
                }
            }

            let total = data.reduce((a, v) => NP.plus(a, v), 0);
            let v2_type = this.get_spec_type_percent('烷烃', spec_id, data, total);
            let v2 = 6;
            if (v2 in this.specs_name){
                if (arr[0][0] == this.specs_name[v2] && v2_type > 40){
                    this.v_str.push('烷烃类占比'+ v2_type + '%，异戊烷占比最高 汽车尾气排放√');
                    return 2;
                }
            }

            let v3 = this.get_spec_percent([42, 43, 44, 45, 46], spec_id, data, total);
            if (v2_type > 20 && v3 > 20){
                this.v_str.push('烷烃类占比'+ v2_type + '%，苯、甲苯、乙苯、和二甲苯和占比'+ v3 + '% 油气挥发性√');
                return 3;
            }

            let v3_1 = this.get_spec_percent([102, 93, 97], spec_id, data, total);
            let v3_2 = this.get_spec_percent([43, 44, 45, 46], spec_id, data, total);
            if (v3_1 > 30 && v3_2 > 20){
                this.v_str.push('乙酸乙酯，丙酮，和丁酮在排放源中的占比'+ v3_1 + '%，苯、甲苯、乙苯、和二甲苯和占比'+ v3_2 + '% 有机溶剂使用√');
                return 4;
            }

            this.v_str.push('未知');
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
        spec_type() {
            rpc(hosts.baseHost, 'bi.list', 'spec_type', '', (d) => {
                if(d.result){
                    d.result.forEach(v => {
                        this.spec_type_data[v[0]] = v[3];
                        this.spec_types_name[v[3]] = v[0];
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
                        this.specs_name[v[13]] = v[0];
                    });
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
        },
        work (){
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

                doc.setData(that.docx_data);
            
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
                saveAs(out, "report_template.docx");
            });
        }
    }
};
</script>