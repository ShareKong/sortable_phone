<template>
	<view class="content">
		<!-- 删除 sortable -->
		<div id="del" class="sortable-panel sortable_delete" v-show="!isPhone&&isShowDelete" :class="{'': isShowDeleteStyle}">
			<text style="width: 100%; height: 100rpx;">将组件托到这里进行删除</text>
		</div>
		<view id="sort-1" class="sortable sortable-panel">
			<template v-for="(result,index) in sorts.child">
				<view data-id="search" :class="{'st-item-fixed': result.disable&&!isPhone}" class="search" v-if="result.sorts==1">
					<image class="img" src="../../static/icon-img/search.png" mode=""></image>
					<input class="search-input" type="text" v-model="search" placeholder="请输入关键词" />
					<u-button @tap="searchSubmit" class="search-btn" type="primary" size="mini">search</u-button>
					<move-handle :isPhone="isPhone"></move-handle>
				</view>
				
				<swiper class="swiper" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500" v-if="result.sorts==2">
					<swiper-item v-for="(item,index) in swiperList" :key="index">
						<image class="img" :src="item.url" mode="scaleToFill"></image>
						<move-handle :isPhone="isPhone"></move-handle>
					</swiper-item>
				</swiper>
				
				<u-form :model="form" ref="uForm" v-if="result.sorts==3">
					<view id="sort-2"  class="sortable-panel">
						<template v-for="res in result.child">
							<u-form-item label="1 姓名" v-if="res.sorts==1">
								<u-input v-model="form.name" />
							</u-form-item>
							<u-form-item label="2 简介" v-if="res.sorts==2">
								<u-input v-model="form.intro" />
							</u-form-item>
							<u-form-item label="3 性别" v-if="res.sorts==3">
								<u-input v-model="form.sex" />
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
					<move-handle :isPhone="isPhone"></move-handle>
				</u-form>
				<view class="ipt" v-if="result.sorts == 'st-input'">
					<u-input type="text" v-model="result.default" :placeholder="result.placeholder||'请输入内容'"/>
					<move-handle :isPhone="isPhone"></move-handle>
				</view>
				<view class="ipt" v-if="result.sorts == 'st-botton'">
					<u-button type="primary">{{result.btn_text||'按钮'}}</u-button>
					<move-handle :isPhone="isPhone"></move-handle>
				</view>
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
				sortable_options: {
					name: 'sort',
					pull: true,
					put: false,
				},
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
				// 控制删除组件显示
				isShowDelete: false,
				// 控制组件托到删除框时，删除框的样式
				isShowDeleteStyle: false,
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
			// 获取布局数据
			async getEff(flag) {
				const _this = this;
				await uni.request({
					url: 'http://thinkphp/get_data',
					method: 'GET',
					success: async res => {
						_this.sorts = await JSON.parse(res.data[0].sortable);
						// console.log(_this.sorts)
						// console.log(JSON.stringify(_this.sorts))
						_this.initSortable('sort-1', flag, 1);
						setTimeout(() => {
							_this.initSortable('sort-2', flag, 2);
							// 删除的 sortable
							_this.initSortable('del', false, -1);
						}, 500)
					},
					fail: async err => {
						if(uni.getStorageSync('sortable')) {
							_this.sorts = uni.getStorageSync('sortable');
						}
					}
				})
			},
			// 初始化 sortable
			async initSortable(id, flag, level) {
				// level : -1 删除框 1 一级sortable 2 二级sortable
				const _this = this;
				const el = await document.getElementById(id);
				let options = {};

				options = await {
					group: {
						name: 'sort',
						pull: true,
						put: false,
					},
					animation: 200,
					forceFallback: true,
					dragClass: 'choose-active',
					chosenClass: 'choose-active_1',
					disabled: flag,
					filter: '.st-item-fixed',
					scroll: false,
					handle: '.st-item-handle-1',
					onStart: (evt) => {
						_this.isShowDelete = true;
					},
					onEnd: (evt) => {
						// console.log(evt);
						_this.saveSort(evt, id)
						_this.isShowDelete = false;
					},
					onAdd: (evt) => {
						// console.log('onAdd:', evt);
						let to_id = evt.to.id;
						let from_id = evt.from.id;
						let old_index = evt.oldIndex;
						let new_index = evt.newIndex;
						if(to_id == 'del') {
							_this.deleteComp(from_id, to_id, old_index, new_index);
						}
						_this.$forceUpdate();
					}
				};
				if(level == -1) {
					options.group.pull = false;
					options.group.put = true;
				}
				if(level == 2) {
					delete options.handle;
				}
				setTimeout(() => {
					// console.log(level, options)
					Sortable.create(el, options);
				}, 300)
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
				let data = dat.data;
				switch(dat.method)
				{
					case 'layoutSave':
						_this.saveLayout();
						break;
					case 'add-st':
						_this.addComponent(data)
						break;
					case 'update':
						_this.updateAttr(data)
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
				this.sorts.child.splice(0, 0, obj);
				// this.sorts.child.push(obj)
				// console.log(data_id)
			},
			// 更新组件属性内容
			updateAttr(data) {
				// console.log('update', data);
				
				for(let k in data)
				{
					this.sorts.child[0][k] = data[k];
				}
				this.$forceUpdate();
				// console.log(this.sorts)
			},
			// 删除组件
			deleteComp(from_id, to_id, old_index, new_index) {
				let sorts = this.sorts;
				if(sorts.id == from_id) {
					sorts.child.splice(old_index, 1);
				}
				else {
					for(let k in sorts.child)
					{
						if(sorts.child[k].child_id == from_id) {
							sorts.child[k].child.splice(old_index, 1)
						}
					}
				}
				console.log('删除成功')
				// this.saveLayout();
				// window.parent.postMessage({
				// 	method: 'deleteSuccess',
				// }, '*');
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sortable_delete {
		position: fixed;
		top: 2rpx;
		left: 2rpx;
		width: 250rpx;
		height: 250rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2rpx dotted #F56C6C;
		padding: 40rpx;
		border-radius: 20rpx;
		color: #F56C6C;
		z-index: 999;
		background-color: white;
		transition: all 1s;
		overflow: hidden;
		* {
			width: 0;
			height: 0;
			overflow: hidden;
		}
	}
	
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
