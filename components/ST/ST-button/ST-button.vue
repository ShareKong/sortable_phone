<template>
	<view class="ipt">
		<u-button type="primary" :style="attr" @tap="buttonClick">{{dat.button_text||'按钮'}}</u-button>
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
				attr: {}
			}
		},
		watch: {
			monitorDat (n, o) {
				this.attr = n;
			}
		},
		computed: {
			monitorDat() {
				return {
					'background-color': this.dat.background_color,
					'color': this.dat.text_color,
				}
			}
		},
		mounted() {
			this.attr = {
				'background-color': this.dat.background_color,
				'color': this.dat.text_color,
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
