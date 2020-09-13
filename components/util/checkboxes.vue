<template>
<div>
    <div v-for="(dg, index) in dataGroups" :key="dg.id">
        <el-checkbox :indeterminate="dg.isIndeterminate" v-model="dg.checkAll" @change="handleCheckAllChange(index)">{{dg.title}}</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities[index]" @change="handleCheckedCitiesChange(index)">
            <el-checkbox-button v-for="d in dataOptions[index]" :label="d.value" :key="d.id">{{d.title}}</el-checkbox-button>
        </el-checkbox-group>
        <div style="margin: 25px 0;"></div>
    </div>
</div>
</template>
<script>
import rolesVue from '../menu/roles.vue';

export default {
    name: 'checkboxes',
    props: ['props'],
    data () {
        return {
            dataGroups: [],
            dataOptions:[],
            checkedCities: []
        }
    },
    mounted() {
       if (Object.prototype.toString.call(this.props.data)==='[object Array]'){
           this.dataOptions = [
               this.props.data
            ];
           this.dataGroups = [{
               id: 0,
               checkAll: false,
               isIndeterminate: false,
               title: '全选'
           }];
            this.checkedCities.push([]);
       }
       else{
           this.dataOptions = this.props.dataOptions;
           this.dataGroups = this.props.dataGroups;
           this.dataGroups.forEach(v => this.checkedCities.push([]));
       }
    },
    methods: {
        handleCheckAllChange(v) {
            this.checkedCities[v] = [];
            if (this.dataGroups[v].checkAll){
                this.dataOptions[v].forEach(ele => this.checkedCities[v].push(ele.value));
            }
            this.dataGroups[v].isIndeterminate = false;
        },
        handleCheckedCitiesChange(v) {
            let ccl = this.checkedCities[v].length, dol = this.dataOptions[v].length;
            this.dataGroups[v].checkAll = ccl === dol;
            this.dataGroups[v].isIndeterminate = ccl > 0 && ccl < dol;
        }
    }
}
</script>
