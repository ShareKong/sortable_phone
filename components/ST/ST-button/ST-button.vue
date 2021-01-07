<template>
	<view class="ipt">
		
		<u-button 
			:type="dat.button_type" 
			:size="dat.button_size"
			:plain="dat.button_plain=='false'?false:true"
			:shape="dat.button_shape"
			@tap="buttonClick">{{dat.button_text||'按钮'}}</u-button>
		
		<move-handle :isPhone="isPhone" @choose="activeGetSorts"></move-handle>
	</view>
</template>

<script>
	export default {
		props: {
			isPhone: {
				type: Boolean,
			},
			dat: {
				type: Object,
			}
		},
		data () {
			return {
				
			}
		},
		methods: {
			buttonClick() {
				console.log('点击', this.dat.button_text || '按钮');
			},
			// 鼠标点击组件获取该组件的 unique
			activeGetSorts() {
				this.$emit('getUnique', this.dat);
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
