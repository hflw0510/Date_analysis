<template> 
    <div>
        <el-row>
            <el-col :span=24 style="display: inline-block;padding-left: 8px">
                <el-date-picker
                    v-model="search_date"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
                <el-button-group>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.search')" placement="top">
                        <el-button type="primary" icon="el-icon-search" @click="searchClick('search')"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('utilSimpletable.searchreset')" placement="top">
                        <el-button type="primary" icon="el-icon-delete" @click="search_date='';"></el-button>
                    </el-tooltip>
                </el-button-group>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24 style="padding-left: 8px;">
               <div id="echarts">
                    <div id="myChart" class=charts1></div>
                    <div id="myChart2" class=charts2></div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<style>
  .charts1 {
    width: 600px;
    height: 300px;
    margin-left: auto;
    margin-right: auto;
    float: left;
  }

  .charts2 {
    width: 600px;
    height: 300px;
    margin-left: auto;
    margin-right: auto;
    float: right;
  }
</style>

<script>
import hosts from '~/assets/config/hosts'
import rpc from '~/assets/js/rpc'

export default {
  data () {
    return {
        search_date: ''
    }
  },
  mounted() {
    this.echartsInit()
    this.echartsInit2()
  },
  methods: {
      searchClick(){
          if (this.search_date){
            rpc(hosts.baseHost, 'Search.Get_data', this.search_date, {}, (d) => {
                if(d.result){
                    alert(d.result.length)
                }
            })
          }
          alert(this.search_date);
      },
    echartsInit () {
      // 找到容器
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 开始渲染
      myChart.setOption({
        title: {text: '在Vue中使用echarts'},
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    },
    echartsInit2 () {
      let myChart = this.$echarts.init(document.getElementById('myChart2'))
      myChart.setOption({
        title: {text: 'echarts 饼图'},
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data: [
              {value: 235, name: '视频广告'},
              {value: 274, name: '联盟广告'},
              {value: 310, name: '邮件营销'},
              {value: 335, name: '直接访问'},
              {value: 400, name: '搜索引擎'}
            ]
          }
        ]
      })
    }
  }
}
</script>