<template>
    <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'ascending'}" :height="tableHeight + 'px'" :border="isBorder">
        <el-table-column v-for="(tbc, index) in tbCols" :key="index" :prop="tbc.colname" :label="tbc.title" :sortable="tbc.sortable" :width="tbc.width" :show-overflow-tooltip="colShowTip"></el-table-column>
    </el-table>
</template>

<script>
let tableData = [];
for (let i=0;i<1000;i++){
    tableData.push({
        index: i+1,
        date: '2018-09-22',
        name: '测试名称'+ i,
        address: '测试地址多条测试显示，在标签浏览器（比如Firefox）中，每个标签具有自己的 window 对象（如果你在开发扩展，浏览器窗口也是一个独立的 window ，详情参见 Working with windows in chrome code）。也就是说，同一个窗口的标签之间不会共享一个 window 对象。有一些方法，如 window.resizeTo 和 window.resizeBy 之类的方法会作用于整个窗口而不是 window 对象所属的那个标签。一般而言，如果无法恰当地作用于标签，则会将其作用于窗口。第' + i + '条'
    });
};

const tbCols = [
    {
        colname: 'date',
        title: '日期',
        sortable: true,
        width: '180'
    },
    {
        colname: 'name',
        title: '姓名',
        sortable: true,
        width: '180'
    },
    {
        colname: 'address',
        title: '地址',
        sortable: false,
        width: ''
    },
    {
        colname: '',
        title: '操作',
        sortable: false,
        width: '180'
    },
    {
        colname: '',
        title: '操作1',
        sortable: false,
        width: '180'
    }
]

export default {
    data() {
        return {
            tableData,
            tbCols,
            isBorder: true,
            tableHeight: 0,
            topHeight: 184,
            colShowTip: true
        }
    },
    mounted(){
        this.$nextTick(() => this.tableSetHeight())
        window.onresize = () => this.tableSetHeight();
    },
    methods: {
        formatter(row, column) {
            return row.address;
        },
        tableSetHeight() {
            this.tableHeight = window.innerHeight - this.topHeight;
        }
    }
}
</script>