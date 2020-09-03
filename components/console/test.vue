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
  </div>
</template>

<script>
export default {
  name: 'hello',
  props: ['props'],
  data () {
    return {
      msg: '我是Hello组件',
      color: 'color',
      value1: ''
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
      }
  }
}
</script>


<style>
    .color{
        color:#333;
    }
</style>