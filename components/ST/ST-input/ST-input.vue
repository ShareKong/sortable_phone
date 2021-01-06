<template>
	<view class="ipt">
		<u-input type="text" v-model="dat.value" :placeholder="dat.placeholder||'请输入内容'"/>
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
			inputValue() {
				this.$emit('value', dat.default);
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
