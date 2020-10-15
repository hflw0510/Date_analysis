let bi, bs, i;
bi = {
    device: '设备',
    department: '部门',
    roles: '角色',
    users: '用户',
    species: '物种库',
    spec_type: '物种类型'
};
bs = {
    'search.get_data' : '图表查询',
    'search.source_analysis' : '源解析',
    'search.get_log' : '日志查询',
    'service.spec_upload' : '导入物种库'
};
for (i in bi){
    bs[i + '.create'] = bi[i] + '-新建';
    bs[i + '.modify'] = bi[i] + '-编辑';
    bs[i + '.list'] = bi[i] + '-读取';
    bs[i + '.delete'] = bi[i] + '-删除';
}

export default bs;