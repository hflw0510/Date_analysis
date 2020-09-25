<template>
    <div>
        <el-button type="primary" @click="work" :disabled="btn">确定</el-button>
        <el-row>
            <el-col :span=24 style="padding: 8px 12px;">
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
            tableData: {},
            data: [],
            dataurl: '',
            chartData2: []
        }
    },
    created() {
        this.spec_type();
        this.search();
	},
    methods: {
        search(){
            rpc(hosts.baseHost, 'Search.Get_data', ['2020-06-01', '2020-06-07'], {}, (d) => {
                if(d.result){
                    if(d.result.length){
                        let data={}, data1={}, data2={};
                        d.result.forEach(v => {
                            if (!data.hasOwnProperty(v[10])){
                                data[v[10]] = {};
                            }
                            if (!data[v[10]].hasOwnProperty(v[1])){
                                data[v[10]][v[1]] = 0;
                            }
                            data[v[10]][v[1]] = NP.plus(data[v[10]][v[1]], v[3]);

                        });

                        this.get_chartData2(data);
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
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                });
                document.getElementById('chartimg').src = this.dataurl;
                this.btn = false;
            });
        },
        get_average(arr){
            return NP.divide(arr.reduce((a, v) => NP.plus(a, v), 0), arr.length).toFixed(3);
        },
        spec_type() {
            rpc(hosts.baseHost, 'bi.list', 'spec_type', '', (d) => {
                if(d.result){
                    d.result.forEach(v => {
                        this.spec_type_data[v[0]] = v[3];
                        this.tableData[v[3]] = [];
                    });
                    this.spec_load();
                }
            })
        },
        spec_load (){
            rpc(hosts.baseHost, 'bi.list', 'species', '', (d) => {
                if(d.result)
                    d.result.forEach(v => {
                        this.tableData[this.spec_type_data[v[3]]].push(v[5])
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