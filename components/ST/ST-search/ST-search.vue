<template>
	<view :class="{'st-item-fixed': dat.disable&&!isPhone}" class="search">
		<image class="img" src="@/static/icon-img/search.png" mode=""></image>
		<input class="search-input" type="text" v-model="search" placeholder="请输入关键词" />
		<u-button @tap="searchSubmit" class="search-btn" type="primary" size="mini">search</u-button>
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
				search: '',
			}
		},
		methods: {
			searchSubmit() {
				console.log(this.search);
			},
			// 鼠标点击组件获取该组件的 unique
			activeGetSorts() {
				this.$emit('getUnique', this.dat);
			},
		}
	}
</script>

<style lang="scss" scoped>
.search {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 0 20rpx 0;
	border-bottom: 2rpx solid #eee;

	.img {
		width: 50rpx;
		height: 50rpx;
		flex-shrink: 0;
	}

	.search-input {
		width: 100%;
		padding: 0 30rpx;
	}

	.search-btn {
		flex-shrink: 0;
	}
}
</style>
