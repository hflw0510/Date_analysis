<template>
    <div>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="d in dataOptions" :label="d" :key="d">{{d}}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>
<script>

export default {
    name: 'checkboxes',
    props: ['props'],
    data () {
        return {
            checkAll: false,
            isIndeterminate: true,
            dataOptions:this.props.data,
            checkedCities: []
        }
    },
    mounted() {
        console.log(this.props.data);
    },
    methods: {
        handleCheckAllChange(val) {
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {

        }
    }
}
</script>
