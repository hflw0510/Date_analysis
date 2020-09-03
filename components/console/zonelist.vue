<template>
	<div>
		<el-dropdown
			split-button
			type="primary"
			placement="top-start"
			trigger="click"
			v-if="isshow"
			@click="handleClick"
			@command="handleCommand"
		>
			<span v-if="Object.keys(selected).length==0">{{ $t('zonelist.select') }}</span>
			<span v-else>{{ $t('zonelist.' + selected.key) }}</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item
					v-for="ld in listData"
					:command="ld"
					:key="ld.id"
				>
					{{$t('zonelist.' + ld.key)}}
				</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</div>
</template>
<script>
import rpc from '~/assets/js/rpc'
import hosts from '~/assets/config/hosts'

let listData=[];

export default {
	data () {
		return {
			listData,
			isshow: false,
			selected: {}
		};
	},
	created() {
		this.$bus.on('zone-show', this.show);
	},
	beforeDestroy() {
		this.$bus.off('zone-show', this.show);
	},
	mounted(){
		rpc(hosts.baseHost + '/', 'Zones.List', (d) => {
			if(d.result){
				listData.length = 0;
				d.result.forEach(v => listData.push(v))
			}
		})
	},
	methods: {
		handleClick() {
			if (Object.keys(this.selected).length > 0){
				this.$bus.emit('zone-click', this.selected);
			}
		},
		handleCommand(command) {
			this.selected = command;
			this.$bus.emit('zone-select', command);
		},
		show(isShow){
			this.isshow = isShow;
		}
	}
}
</script>
