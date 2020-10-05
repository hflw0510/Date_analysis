<template>
    <div background-color="#ffffff" styl ="padding:10px">
        <el-upload
          class="upload"
          :show-file-list="false"
          action=""
          :multiple="false"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :on-change="importExcel"
          :limit="1"
        >
          <el-button slot="trigger" size="small" type="primary">选择上传文件</el-button>
          <el-button size="small" type="warning" @click="upload">确定上传</el-button>
          <div slot="tip" style="font-size:12px;color:#606060">请选择xlsx/xls文件，并符合下面表格格式。提交数据以CAS号以依据进行创建和更新。</div>
        </el-upload>
        <div id="ex_hhh"></div>
        <el-table
            :data="tableData"
            :height="tableHeight + 'px'"
            border
            style="width: 100%">
                <el-table-column v-for="(key, index) in tbCols" :key="index" :prop="key" :label="key" width=""></el-table-column>
        </el-table>
    </div>
</template>

<script>
import XLSX from 'xlsx';
import hosts from '~/assets/config/hosts'
import rpc from '~/assets/js/rpc'

export default {
    data () {
        return {
            tableData: [],
            tbCols: ['序号','英文名称','物种名称','物种分类','物种细类','*(a)(b)类','CAS号','分子量（M值）','MIR','单位','因子小数'],
            tableHeight: 0,
            topHeight: 172,
            bottomHeight: 0,
        }
    },
    mounted(){
        this.$nextTick(() => this.tableSetHeight())
        window.addEventListener('resize', () => this.tableSetHeight());
    },
    methods: {
        upload (){
            let data=[];
            this.tableData.forEach(v => {
                let da=[];
                this.tbCols.forEach(k => {
                    if (k in v)
                        da.push(v[k]);
                    else
                        da.push('');
                })
                data.push(da);
            })
            console.log(data);
            if (data.length > 0){
                rpc(hosts.baseHost, 'Service.spec_upload', data, (d) => {
                    if(d.result){
                        alert(d.result.join());
                    }
                })
            }
            else {
                this.$message({
                    message: '没有符合条件的数据',
                    type: 'warning'
                });
            }
        },
        tableSetHeight() {
            this.tableHeight = window.innerHeight - this.topHeight - this.bottomHeight;
        },
        importExcel(param) {
            let _this = this, data=[[]];
            _this.file2Xce(param).then(item => {
                if (item && item.length > 0) {
                    if (item[0] && item[0].sheet && item[0].sheet.length)
                        data = item[0].sheet
                    if (_this.tbCols.join() == Object.keys(data[0]).join()){
                        _this.tableData = data;
                    }
                    else{
                        this.$message({
                            message: '导入格式错误',
                            type: 'warning'
                        });
                    }

                }
            })
            .catch(error => {
                
            });
        },
        file2Xce(file) {
            return new Promise(function(resolve, reject) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const data = e.target.result;
                    this.wb = XLSX.read(data, {
                        type: "binary"
                    });
                    const result = [];
                    this.wb.SheetNames.forEach(sheetName => {
                        result.push({
                        sheetName: sheetName,
                        sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
                        });
                    });
                    resolve(result);
                };
                reader.readAsBinaryString(file.raw);
            });
        }

    }
}
</script>