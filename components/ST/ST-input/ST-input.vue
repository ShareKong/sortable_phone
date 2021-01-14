<template>
	<view class="st-input">
		
		<view class="input">
			<u-input :type="dat.input_type" v-model="dat.default_value" :placeholder="dat.placeholder||'请输入内容'"/>
		</view>
		
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
			return {}
		},
		methods: {
			// 鼠标点击组件获取该组件的 unique
			activeGetSorts() {
				this.$emit('getUnique', this.dat);
			},
		}
	}
</script>

<style lang="scss" scoped>
.input {
	padding: 8rpx 20rpx;
}
</style>
