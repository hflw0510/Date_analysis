<template>
    <el-tabs
        v-model="consoleTabsValue"
        type="card"
        closable
        @tab-remove="removeTab"
        @tab-click="selectTab"
    >
        <el-tab-pane
            v-for="(item) in consoleTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
        >
            <component :is=item.content :props="item.props" @langChange="langChange" @newTab="childNewTab"></component>
        </el-tab-pane>
    </el-tabs>
</template>

<script>

export default {
    data() {
        return {
            defaultTab: {},
            consoleTabs: [],
            consoleTabsValue: '0'
        }
    },
    methods: {
        addTab(props, r) {
            let isNew, newTabName = r + '_' + new Date().valueOf();

            this.consoleTabs.some((tab, index) => {
                    if (tab.index === r && tab.props === props) {
                        isNew = tab.name;
                        return true;
                    }
            });

            if (!isNew) {
                this.consoleTabs.push({
                    title: this.$t(r),
                    props: props,
                    index: r,
                    name: newTabName,
                    content: resolve => require([`~/components/${r.split('.').join('/')}`], resolve)
                });
                
                this.consoleTabsValue = newTabName;
            }
            else {
                this.consoleTabsValue = isNew;
            }
        },
        removeTab(targetName, name) {
            let deleteIndex, tabs = this.consoleTabs;
            let activeName = this.consoleTabsValue;
            tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                    deleteIndex = index;
                    if (activeName === targetName){
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) activeName = nextTab.name;
                    }
                }
            });

            this.consoleTabs.splice(deleteIndex, 1);
            if ( this.consoleTabs.length)
                this.consoleTabsValue = activeName;
            else {
                this.consoleTabs.push({
                    title: this.$t('console.overview'),
                    name: '0',
                    index: 'console.overview',
                    content: resolve => require(['~/components/console/overview'], resolve)
                });
                this.consoleTabsValue = '0';
            }
        },
        selectTab(tab){
            console.log(tab);
        },
        langChange() {
            this.consoleTabs.forEach((tab, index) => {
                    tab.title = this.$t(tab.index);
            });
        },
        childNewTab(props, r){
            this.$emit('newTab', props, r)
            this.addTab(props, r)
        }
    }
}
</script>