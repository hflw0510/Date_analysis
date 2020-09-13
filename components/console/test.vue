<template>
  <div class="hello">
    <h1 @click="info" :class="color">{{ msg }} {{ props }}</h1>
    <el-button type="primary" round @click="newTab('console.test', '4444')">打开新Tab</el-button>
    <el-button type="primary" round @click="newTab('nedb', '')">NEDB</el-button>
    <p>
    <el-button plain @click="open3"> 成功 </el-button>
    <el-button plain @click="open4"> 警告 </el-button>
    <el-button plain @click="open5"> 消息 </el-button>
    <el-button plain @click="open6"> 错误 </el-button>
    </p>
    <el-date-picker v-model="value1" type="datetime" :placeholder="$t('elDatePicker.select')">
    </el-date-picker>
    <el-button type="primary" @click="switchChinese()">{{$t('componentsOverview.select-zhCN')}}</el-button>
    <el-button type="primary" @click="switchEnlish()">{{$t('componentsOverview.select-en')}}</el-button>

    <el-button type="primary" @click="showzone()">show</el-button>
    <el-button type="primary" @click="hiddenzone()">hidden</el-button>

    <p>{{$t('ab.hello')}}</p> 
    <p>{{$t('ab.msg')}}</p>

    <el-dialog
        title="多选框"
        :visible.sync="centerDialogVisible"
        width="40%"
        center
    >
    <checkboxes ref="cbs" :props="cbs" @event="checkboxes_event"></checkboxes>
    </el-dialog>

    <el-button plain @click="centerDialogVisible = true"> 打开多选框 </el-button>
  </div>
</template>

<script>
import checkboxes from '~/components/util/checkboxes';

export default {
  name: 'hello',
  props: ['props'],
  data () {
    return {
        msg: '我是Hello组件',
        color: 'color',
        value1: '',
        centerDialogVisible: false,
        cbs:{
            data1: [
                {
                    id: 1,
                    value: 4,
                    title: 'test1'
                },
                {
                    id: 2,
                    value: 5,
                    title: 'test2'
                }
            ],
            dataGroups: [
                {
                    id: 1,
                    checkAll: false,
                    isIndeterminate: false,
                    title: '组1'
                },
                {
                    id: 2,
                    checkAll: false,
                    isIndeterminate: false,
                    title: '组2'
                },
                {
                    id: 3,
                    checkAll: false,
                    isIndeterminate: false,
                    title: '组3'
                }
            ],
            dataOptions: [
                [
                    {
                        id: 1,
                        value: 2,
                        title: '组1-1'
                    },
                    {
                        id: 2,
                        value: 4,
                        title: '组1-2'
                    },
                    {
                        id: 3,
                        value: 5,
                        title: '组1-3'
                    },
                    {
                        id: 4,
                        value: 6,
                        title: '组1-4'
                    },
                    {
                        id: 5,
                        value: 7,
                        title: '组1-5'
                    },
                    {
                        id: 6,
                        value: 9,
                        title: '组1-6'
                    }
                ],
                [
                    {
                        id: 11,
                        value: 12,
                        title: '组2-1'
                    },
                    {
                        id: 12,
                        value: 14,
                        title: '组2-2'
                    },
                    {
                        id: 13,
                        value: 15,
                        title: '组2-3'
                    },
                    {
                        id: 14,
                        value: 16,
                        title: '组2-4'
                    },
                    {
                        id: 15,
                        value: 17,
                        title: '组2-5'
                    },
                    {
                        id: 16,
                        value: 19,
                        title: '组2-6'
                    }
                ],
                [
                    {
                        id: 21,
                        value: 22,
                        title: '组3-1'
                    },
                    {
                        id: 22,
                        value: 24,
                        title: '组3-2'
                    },
                    {
                        id: 23,
                        value: 25,
                        title: '组3-3'
                    },
                    {
                        id: 24,
                        value: 26,
                        title: '组3-4'
                    },
                    {
                        id: 25,
                        value: 27,
                        title: '组3-5'
                    },
                    {
                        id: 26,
                        value: 29,
                        title: '组3-6'
                    }
                ]
            ]
        }
    }
  },
  created() {
    this.$bus.on('zone-select', this.zoneSelect);
    this.$bus.on('zone-click', this.zoneSelect);
  },
  beforeDestroy() {
    this.$bus.off('zone-select', this.zoneSelect);
    this.$bus.off('zone-click', this.zoneSelect);
  },
  mounted(){console.log("我已经挂载了")},
  methods:{
      showzone(){
        this.$bus.emit('zone-show', true);
      },
      hiddenzone(){
        this.$bus.emit('zone-show', false);
      },
      zoneSelect(v) {
        console.log(v.key);
      },
      info() {
          console.log('你点击了我');
      },
      newTab(comp, props) {
        this.$emit('newTab', props, comp);
      },
      switchChinese(){
          this.$i18n.locale = 'zhCN';
          this.$emit('langChange');
      },
      switchEnlish(){
          this.$i18n.locale = 'en';
          this.$emit('langChange');
      },
      open3() {
        this.$notify({
          title: '成功',
          message: '这是一条成功的提示消息',
          type: 'success',
          offset: 42
        });
      },

      open4() {
        this.$notify({
          title: '警告',
          message: '这是一条警告的提示消息',
          type: 'warning',
          offset: 42
        });
      },

      open5() {
        this.$notify.info({
          title: '消息',
          message: '这是一条消息的提示消息',
          offset: 42
        });
      },

      open6() {
        this.$notify.error({
          title: '错误',
          message: '这是一条错误的提示消息',
          duration: 0,
          offset: 42
        });
      },

      checkboxes_event(){

      }
  },
    components: {
        checkboxes
    }
}
</script>


<style>
    .color{
        color:#333;
    }
</style>