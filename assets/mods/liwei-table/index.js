let tableData = [];
for (let i=0;i<9765;i++){
    tableData.push({
        index: i+1,
        date: '2018-09-22',
        name: '测试名称'+ i,
        address: '测试地址多条测试显示，在标签浏览器（比如Firefox）中。第' + i + '条'
    });
};

export default {
    tbCols: [
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
    ],
    tbData: tableData
};