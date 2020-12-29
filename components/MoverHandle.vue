<template>
	<view>
		<view class="st-item-handle-1" :class="{'level-2': level==2}" v-if="!isPhone">
			<image class="img" src="../static/icon-img/move.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			isPhone: {
				type: Boolean,
				default: true
			},
			level: {
				type: Number,
				default: 1
			}
		},
	}
</script>

<style lang="scss" scoped>
.st-item-handle-1 {
	position: absolute;
	right: 0;
	top: 0;
	width: 70rpx;
	height: 100%;
	max-height: 100%;
	min-height: 70rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	// background-color: #E6A23C;
	background-color: #4CD964;
	z-index: 997;
	.img {
		width: 50rpx;
		height: 50rpx;
	}
}

.level-1 {
	
}

.level-2 {
	right: 72rpx;
	background-color: #4CD964;
}
</style>
