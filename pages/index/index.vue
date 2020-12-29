<template>
	<view class="content">
		<view id="sort-1" class="sortable">
			<template v-for="(result,index) in sorts.child">
				<view data-id="search" :class="{'st-item-fixed': result.disable&&!isPhone}" class="search" v-if="result.sorts==1">
					<image class="img" src="../../static/icon-img/search.png" mode=""></image>
					<input class="search-input" type="text" v-model="search" placeholder="请输入关键词" />
					<u-button @tap="searchSubmit" class="search-btn" type="primary" size="mini">search</u-button>
				</view>
				
				<swiper class="swiper" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500" v-if="result.sorts==2">
					<swiper-item v-for="(item,index) in swiperList" :key="index">
						<image class="img" :src="item.url" mode="scaleToFill"></image>
					</swiper-item>
				</swiper>
				
				<u-form :model="form" ref="uForm" v-if="result.sorts==3">
					<view id="sort-2">
						<template v-for="res in result.child">
							<u-form-item label="1 姓名" v-if="res.sorts==1">
								<u-input v-model="form.name" />
							</u-form-item>
							<u-form-item label="2 简介" v-if="res.sorts==2">
								<u-input v-model="form.intro" />
							</u-form-item>
							<u-form-item label="3 性别" v-if="res.sorts==3">
								<u-input v-model="form.sex" />
								<!-- <view class="st-item-handle" v-if="!isPhone"><image class="img" src="../../static/icon-img/move.png" mode=""></image></view> -->
							</u-form-item>
							<u-form-item label="4 水果" v-if="res.sorts==4">
								<u-checkbox-group>
									<u-checkbox v-model="item.checked" v-for="(item, ind) in checkboxList" :key="ind" :name="item.name">
										{{ item.name }}
									</u-checkbox>
								</u-checkbox-group>
							</u-form-item>
							<u-form-item label="5 味道" v-if="res.sorts==5">
								<u-radio-group v-model="radio">
									<u-radio v-for="(item, ind) in radioList" :key="ind" :name="item.name" :disabled="item.disabled">
										{{ item.name }}
									</u-radio>
								</u-radio-group>
							</u-form-item>
							<u-form-item label="6 开关" v-if="res.sorts==6">
								<u-switch slot="right" v-model="switchVal"></u-switch>
							</u-form-item>
						</template>
					</view>
				</u-form>
				<view class="ipt" v-if="result.sorts == 'st-input'"><input type="text" value="新添加的组件-输入框" /></view>
				<view class="ipt" v-if="result.sorts == 'st-botton'"><button type="default">新添加的组件-按钮</button></view>
			</template>
		</view>
	</view>
</template>

<script>
	import draggable from 'vuedraggable'
	import Sortable from "sortablejs";
	
	export default {
		components: {
			draggable,
		},
		data() {
			return {
				sorts: [],
				sorts_1: [],
				sorts_2: [],
				
				search: '',
				// banners
				swiperList: [{
						id: 0,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
					}, {
						id: 1,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
					}, {
						id: 2,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
					}, {
						id: 3,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
					}, {
						id: 4,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
					}, {
						id: 5,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
					}, {
						id: 6,
						type: 'image',
						url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
					}, ],
				form: {
					name: '',
					intro: '',
					sex: ''
				},
				checkboxList: [{
						name: '苹果',
						checked: false,
						disabled: false
					},
					{
						name: '雪梨',
						checked: false,
						disabled: false
					},
					{
						name: '柠檬',
						checked: false,
						disabled: false
					}
				],
				radioList: [{
						name: '鲜甜',
						disabled: false
					},
					{
						name: '麻辣',
						disabled: false
					}
				],
				radio: '',
				switchVal: false,
				isPhone: false,
				sortable_group: {
					name: 'sort',
					pull: 'clone',
					put: false,
				},
			}
		},
		mounted() {
			let isPhone = navigator.userAgent.toLowerCase();
			const _this = this;
			setTimeout(() => {
				if(isPhone.indexOf('windows') != -1) {
					_this.getEff(false);
					_this.isPhone = false;
				}
				else {
					_this.getEff(true);
					_this.isPhone = true;
				}
			}, 500)
			window.addEventListener('message', this.save);
		},
		methods: {
			searchSubmit() {
				console.log(this.search);
			},
			async getEff(flag) {
				const _this = this;
				await uni.request({
					url: 'http://thinkphp/get_data',
					method: 'GET',
					success: async res => {
						_this.sorts = await JSON.parse(res.data[0].sortable);
						// console.log(_this.sorts)
						_this.initSortable('sort-1', flag);
						setTimeout(() => {
							_this.initSortable('sort-2', flag);
						}, 500)
					},
					fail: async err => {
						if(uni.getStorageSync('sortable')) {
							_this.sorts = uni.getStorageSync('sortable');
						}
					}
				})
			},
			initSortable(id, flag) {
				const _this = this;
				const el = document.getElementById(id);
				const sortable = Sortable.create(el, {
					group: _this.sortable_options,
					animation: 200,
					forceFallback: true,
					dragClass: 'choose-active',
					chosenClass: 'choose-active_1',
					disabled: flag,
					filter: '.st-item-fixed',
					scroll: false,
					// handle: '.st-item-handle',
					onEnd: (evt) => {
						// console.log(evt);
						_this.saveSort(evt, id)
					},
				})
			},
			// 保存排序
			/**
				evt 对象
				id 表示可拖拽组的 id
			*/
			async saveSort(evt, id) {
				const _this = this;
				const sorts = _this.sorts;
				let old_index = evt.oldIndex;
				let new_index = evt.newIndex;
				
				if(sorts.id == id) {
					if(old_index < new_index) {
						sorts.child.splice(new_index + 1, 0, sorts.child[old_index]);
						sorts.child.splice(old_index, 1);
					}
					else {
						sorts.child.splice(new_index, 0, sorts.child[old_index]);
						sorts.child.splice(old_index + 1, 1);
					}
				}
				else {
					for(let k in sorts.child)
					{
						let v = sorts.child[k];
						if(v.child_id == id) {
							if(old_index < new_index) {
								v.child.splice(new_index + 1, 0, v.child[old_index]);
								v.child.splice(old_index, 1);
							}
							else {
								v.child.splice(new_index, 0, v.child[old_index]);
								v.child.splice(old_index + 1, 1);
							}
						}
					}
				}
				_this.sorts = sorts;
				uni.setStorageSync('sortable', _this.sorts);
			},
			// 监听父窗口请求
			save(event) {
				const _this = this;
				let dat = event.data;
				let params = event.data.params;
				switch(dat.method)
				{
					case 'layoutSave':
						_this.saveLayout();
						break;
					case 'add-st':
						_this.addComponent(params)
						break;
				}
			},
			// 保存布局到数据库
			saveLayout() {
				const _this = this;
				let sorts = JSON.stringify(this.sorts);
				uni.request({
					url: 'http://thinkphp/update_data',
					method: 'POST',
					data: {
						id: 1000,
						sortable: sorts
					},
					success() {
						window.parent.postMessage({
							method: 'saveSuccess',
						}, '*');
					}
				})
			},
			// 添加新组件
			addComponent(params) {
				const _this = this;
				let data_id = params.data_id;
				let obj = {
					sorts: data_id,
					disable: false,
					child_id: '',
					child: [],
				}
				this.sorts.child.push(obj)
				// console.log(data_id)
			},
			
			//test
			test(e) {
				console.log('悬停', e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.content {
		padding: 0 20rpx;

		.sortable {
			width: 100%;

			>* {
				margin-top: 30rpx;
				margin-bottom: 30rpx;
			}

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

			//banner
			.swiper {
				height: 150px;
				width: 100%;
				text-align: center;

				.img {
					width: 100%;
				}
			}
		}
		
		.choose-active {
			border: 4rpx solid #6dcb8b;
			padding: 10rpx;
			&_1 {
				background-color: #eee;
			}
		}
	}
</style>
