import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
//由于使用了element-ui，所以不可以使用el作为key

const zhCN = {
    ab: {
        'hello': '你好，世界',
        'msg': '提示',
        'cn': '只有中文'
    },
    console: {
        'title': '控制面板',
        'test': '测试',
        'overview': '总览',
        'product': '云产品',
        'instance': '实例',
        'volume': '云磁盘',
        'mutilvolume': '多通道云盘',
        'snapshot': '快照',
        'image': '镜像',
        'zonelist': '区域列表',
        'echarts': '图表'
    },
    logon:{
        'title':'用户登录'
    },
    menu:{
        'overview': '总览',
        'manage': '系统管理',
        'users': '用户管理',
        'department': '部门管理',
        'device': '设备管理',
        'roles': '角色管理',
        'species': '物种库',
        'spec_type': '物种类型',
        'log': '日志管理'
    },
    table: {
        'edit': '编辑',
        'delete': '删除'
    },
    list: {
        'mylist': '简单表格'
    },
    consoleInstance:{
        'wan': '外',
        'lan': '内',
        'vnc': '终端',
        'change': '变配',
        'update': '升级',
        'renew': '续费'
    },
    utilSimpletable: {
        'searchInput': '请输入检索内容',
        'rows': '行数：',
        'select': '请选择',
        'selected': '选中：',
        'exportexecl': '导出Execl',
        'search': '检索列表',
        'searchreset': '清除检索条件'
    },
    elDatePicker: {
        'select': '选择日期时间'
    },
    componentsOverview: {
        'select-zhCN': '中文',
        'select-en': '英文'
    },
    ...zhLocale
}

export default zhCN;