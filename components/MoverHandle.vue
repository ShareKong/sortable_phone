<template>
	<view>
		<view ref="handle" @tap="choose" class="st-item-handle-1" :class="{'level-2': level==2, 'bg-red': is_show}" v-if="!isPhone">
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
		data: () => {
			return {
				uid: -1,
				new_uid: 0,
				is_show: false,
			}
		},
		methods: {
			choose(e) {
				let scroll_y = e.detail.y;
				window.parent.postMessage({
					method: "getScrollY",
					data: {
						scroll_y,
					}
				}, '*')
				this.$emit('choose');
			},
		}
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
	background-color: #f0f0f0;
	z-index: 997;
	// opacity: 0.1;
	&:hover {
		background-color: #e6e6e6;
	}
	.img {
		width: 50rpx;
		height: 50rpx;
	}
}

.level-1 {
	
}

.level-2 {
	right: 72rpx;
}

.bg-red {
	background-color: #f00;
}
</style>
