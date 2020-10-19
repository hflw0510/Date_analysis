<template>
    <div>
        <el-row v-if="isSearch">
            <el-col :span=6 style="display: inline-block;padding-left: 8px">
                <el-date-picker
                    v-model="search_date"
                    unlink-panels
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:00:00"
                    :default-time="['00:00:00', '23:00:00']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="date_change"
                >
                </el-date-picker>
            </el-col>
            <el-col :span=6 style="display: inline-block;padding-left: 8px;">
                <el-button-group>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.search')" placement="top">
                        <el-button type="primary" icon="el-icon-search" @click="btnClick('search', search_date)"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.searchreset')" placement="top">
                        <el-button type="primary" icon="el-icon-delete" @click="search_date='';"></el-button>
                    </el-tooltip>
                </el-button-group>
            </el-col>
            <el-col :span=12>
                <el-button-group style="float: right;padding-right: 4px">
                    <el-tooltip v-for="btn in tbBtns.filter(v => v.content)" :key="btn.key" effect="dark" :content="btn.content" :placement="btn.place">
                        <el-button v-if="btn.btntype" :type="btn.btntype" :icon="'el-icon-'+ btn.btnicon" @click="btnClick(btn.key)"></el-button>
                    </el-tooltip>
                    <el-button v-for="btn in tbBtns.filter(v => !v.content && v.btntype)" :key="btn.key" :type="btn.btntype" :icon="'el-icon-'+ btn.btnicon" @click="btnClick(btn.key)"></el-button>
                    <el-tooltip v-if="isDown" effect="dark" :content="$t('utilSimpletable.exportexecl')" placement="top">
                        <el-button type="primary" icon="el-icon-download" @click="exportExecl()"></el-button>
                    </el-tooltip>
                    <el-tooltip v-if="isInfo" effect="dark" :content="isInfo" placement="top">
                        <el-button type="primary" icon="el-icon-question"></el-button>
                    </el-tooltip>
                </el-button-group>
            </el-col>
        </el-row>
        <el-row v-if="!isSearch">
            <el-col :span=2 style="display: inline-block;padding-left: 8px">
                <el-select v-model="selectValue" :placeholder="$t('utilSimpletable.select')">
                    <el-option
                        v-for="item in tbCols.filter(v => v.colname.length > 0 && v.searchable)"
                        :key="item.colname"
                        :label="item.title"
                        :value="item.colname"
                    >
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span=6 style="display: inline-block;padding-left: 8px">
                <el-input
                    :placeholder="$t('utilSimpletable.searchInput')"
                    prefix-icon="el-icon-info"
                    v-model="searchInput"
                    @keyup.enter.native="searchTable"
                >
                </el-input>
            </el-col>
            <el-col :span=4 style="padding-left: 8px;">
                <el-button-group>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.search')" placement="top">
                        <el-button type="primary" icon="el-icon-search" @click="searchTable"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.searchreset')" placement="top">
                        <el-button type="primary" icon="el-icon-delete" @click="searchReset"></el-button>
                    </el-tooltip>
                </el-button-group>
            </el-col>
            <el-col :span=12>
                <el-button-group style="float: right;padding-right: 4px">
                    <el-tooltip v-for="btn in tbBtns.filter(v => v.content)" :key="btn.key" effect="dark" :content="btn.content" :placement="btn.place">
                        <el-button v-if="btn.btntype" :type="btn.btntype" :icon="'el-icon-'+ btn.btnicon" @click="btnClick(btn.key)"></el-button>
                    </el-tooltip>
                    <el-button v-for="btn in tbBtns.filter(v => !v.content && v.btntype)" :key="btn.key" :type="btn.btntype" :icon="'el-icon-'+ btn.btnicon" @click="btnClick(btn.key)"></el-button>
                    <el-tooltip v-if="isDown" effect="dark" :content="$t('utilSimpletable.exportexecl')" placement="top">
                        <el-button type="primary" icon="el-icon-download" @click="exportExecl()"></el-button>
                    </el-tooltip>
                    <el-tooltip v-if="isInfo" effect="dark" :content="isInfo" placement="top">
                        <el-button type="primary" icon="el-icon-question"></el-button>
                    </el-tooltip>
                </el-button-group>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24>
                <el-table
                    @selection-change="handleSelectionChange"
                    @sort-change="handleTableSortChange"
                    ref="myTable"
                    :stripe="row_color.length?false:true"
                    :data="td"
                    :default-sort = "{prop: 'date', order: 'ascending'}"
                    :height="tableHeight + 'px'"
                    :border="isBorder"
                    :show-summary="isSum"
                    :row-style="tableRowStyle"
                    style="width: 100%"
                >
                    <el-table-column
                        v-if="isSelect"
                        type="selection"
                        width="44"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        type="index"
                        width="48"
                    >
                    </el-table-column>
                    <el-table-column
                        v-for="(column, index) in tbCols"
                        :key="index"
                        :prop="column.colname"
                        :label="column.title"
                        :sortable="column.sortable?true:false"
                        :width="column.width"
                        :align="column.align"
                        :show-overflow-tooltip="colShowTip"
                    >
                        <template slot-scope="scope">
                            <expand
                                v-if="column.render"
                                :render="column.render"
                                :row="scope.row"
                                :column="column"
                            >
                            </expand>
                            <el-button v-else-if="column.buttons" v-for="(l) in column.buttons" :key="l.key" :size="l.size" :type="l.type" @click="btnClick(l.event,[l.key, scope.row])">{{ $t(l.text) }}</el-button>
                            <div v-else v-html="scope.row[column.colname]"></div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row style="padding: 8px;">
            <el-col :span=4>
                <el-alert
                    v-if="isSelect"
                    :title="$t('utilSimpletable.rows') + tds.length + '    ' + $t('utilSimpletable.selected') + multipleSelection.length"
                    :type="multipleSelection.length?'success':'info'"
                    :closable="false"
                    show-icon
                >
                </el-alert>
                <el-alert
                    v-if="!isSelect"
                    :title="$t('utilSimpletable.rows') + tds.length"
                    :closable="false"
                    show-icon
                >
                </el-alert>
            </el-col>
            <el-col :span=20>
                <el-pagination
                    v-if="!isSinglepage"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pagesize"
                    :total="tds.length"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="sizes, prev, pager, next, jumper"
                    style="float: right;"
                >
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<style>
    .el-table__footer-wrapper tbody td {
        background-color:#989797;
    }
</style>

<script>
import XLSX from 'xlsx';
import expand from '~/components/util/expand'

export default {
    name: 'simpleTable',
    props: ['props'],
    components:{
        expand
    },
    data () {
        return {
            selectValue: '',
            searchInput: '',
            tableData: this.props['tbData'],
            tbCols: this.props['tbCols'],
            tbBtns: this.props['tbBtns'],
            isDown: this.props['isDown'],
            isInfo: this.props['isInfo'],
            isSum: this.props['isSum'],
            row_color: this.props['row_color']?this.props['row_color']:[],
            title: [],
            td: [],
            tds: [],
            name: 'index',
            isBorder: false,
            isSelect: true,
            isSearch: this.props['isSearch'],
            isSinglepage: this.props['isSinglepage'],
            search_date: '',
            tableHeight: 0,
            topHeight: 172,
            bottomHeight: 38,
            colShowTip: true,
            multipleSelection: [],
            currentPage: 1,
            pageSizes:[10, 20, 50, 100, 200],
            pagesize: 100
        }
    },
    mounted() {
        if(this.props['noSelect']) this.isSelect = false;
        this.searchReset();
        this.$nextTick(() => this.tableSetHeight())
        window.addEventListener('resize', () => this.tableSetHeight());
    },
    methods: {
        tableRowStyle({row, rowIndex}) {
            if (this.row_color.length > 0){
                if (rowIndex % 2 == 0) {
                    return {
                        background: this.row_color[0]
                    }
                }
                else {
                    return {
                        background: this.row_color[1]
                    }
                }
            }
            return ''
        },
        tableSetHeight() {
            let h;
            h = window.innerHeight - this.topHeight - this.bottomHeight;
            //if (this.isSum) h -= 50;
            this.tableHeight = h;
        },
        searchReset(){
            this.selectValue = '';
            this.searchInput = '';
            if(this.tds !== this.tableData) {
                [...this.tds] = this.tableData;
                this.dataReset();
            }
            this.$nextTick(() => {
                this.$refs.myTable.doLayout(); 
            });
        },
        searchTable() {
            let ss;
            if (this.selectValue)
                ss = this.tbCols.filter(v => v.colname == this.selectValue );
            else
                ss = this.tbCols.filter(v => v.colname.length > 0 && v.searchable);
            
            if(ss.length && this.searchInput.length)
                this.tds = this.tableData.filter(v => ss.some(w => v[w.colname].indexOf(this.searchInput)!=-1));
            else
                this.tds = this.tableData;

            this.dataReset();
        },
        dataReset() {
            let _start, _end;
            if(!this.isSinglepage) {
                this.isSinglepage = false;
                if(this.currentPage==1) {
                    _start = 0;
                    _end = this.pagesize;
                } else {
                    _start = (this.currentPage - 1) * this.pagesize;
                    _end = this.currentPage * this.pagesize;
                }

                this.td = this.tds.slice(_start, _end);
            }
            else{
                this.td = this.tds;
            }
        },
        handleTableSortChange(params){
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            this.pagesize = val;
            this.dataReset();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.dataReset();
        },
        btnClick(k, params){
            this.$emit(k, params);
        },
        date_change(){
            this.$emit('dtc', this.search_date);
        },
        exportExecl(){
            const filename = (this.props['title']?this.props['title']:'table') + '.' + (new Date()).getMilliseconds() + '.xlsx';
            const wb = XLSX.utils.book_new();

            const cols = this.tbCols.filter(v => v.colname.length > 0).map(v => v.colname);
            const title = this.tbCols.filter(v => v.colname.length > 0).map(v => v.title);
            const arr = this.tableData.map(v => cols.map(j => { return v[j] }));
            arr.unshift(title);
            const ws = XLSX.utils.aoa_to_sheet(arr);
            XLSX.utils.book_append_sheet(wb, ws, filename);
            XLSX.writeFile(wb, filename);
        }
    }
}
</script>