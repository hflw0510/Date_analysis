<template>
    <simpletable ref="st" :props="props" @refresh="refresh" @tts="tts" @search="server_search"></simpletable>
</template>
<script>
import simpletable from '~/components/util/simpletable';

let tableData = [];
for (let i=0;i<9165;i++){
    tableData.push([
        i,
        '2018-09-22',
        '测试名称'+ i,
        '测试地址多条测试显示，在标签浏览器（比如Firefox）中。第' + i + '条'
    ]);
};

const tbCols = [
    {
        colname: '1',
        title: '日期',
        searchable: false,
        sortable: true,
        width: '180'
    },
    {
        colname: '2',
        title: '姓名',
        searchable: true,
        sortable: true,
        width: '180'
    },
    {
        colname: '3',
        title: '地址',
        searchable: true,
        sortable: false,
        width: ''
    }
];

const tbBtns = [
    {
        key: 'refresh',
        content: '刷新',
        place: 'top-end',
        btntype: 'primary',
        btnicon: 'refresh'
    }
];

export default {
    data() {
        return {
            props : {
                title: '123123',
                isDown: true,
                isInfo: '这是一个简单表格',
                isSinglepage: true,
                tbCols,
                tbBtns,
                tbData: tableData,
                noSelect: true,
                isSearch: true
            },
            tableData
        }
    },
    methods: {
        refresh () {
            this.tableData.length = 0;
            this.$refs.st.searchReset();
        },
        tts(params) {
            console.log(params);
        },
        server_search(params){
            alert(params)
        }
    },
    components: {
        simpletable
    }
};
</script>