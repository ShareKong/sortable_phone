<template>
	<view class="content">
		<!-- 删除 sortable -->
		<!-- <div id="del" class="sortable-panel sortable_delete" v-show="!isPhone&&isShowDelete" :class="{'': isShowDeleteStyle}">
			<image style="width: 100rpx;height: 100rpx;opacity: 0.7;" src="@/static/icon-img/delete.png" mode=""></image>
		</div> -->
		
		<view id="sort-1" class="sortable sortable-panel">
			<template v-for="(result,index) in sorts.child">
				
				<st-search v-if="result.sorts=='st-search'" :isPhone="isPhone" :dat="result" @getUnique="activeGetUnique"></st-search>
				
				<st-swiper v-if="result.sorts=='st-swiper'" :isPhone="isPhone" :dat="result" @getUnique="activeGetUnique"></st-swiper>
				
				<st-form v-if="result.sorts=='st-form'" :isPhone="isPhone" :dat="result" @getUnique="activeGetUnique"></st-form>
				
				<st-input v-if="result.sorts == 'st-input'" :isPhone="isPhone" :dat="result" @getUnique="activeGetUnique"></st-input>
				
				<st-button v-if="result.sorts == 'st-button'" :isPhone="isPhone" :dat="result" @getUnique="activeGetUnique"></st-button>
				
				<st-applys v-if="result.sorts == 'st-applys'" :isPhone="isPhone" :dat="result" @getUnique="activeGetUnique"></st-applys>
				
			</template>
		</view>
	</view>
</template>

<script>
	// import draggable from 'vuedraggable'
	import Sortable from "sortablejs";
	import STsearch from '@/components/ST/ST-search/ST-search.vue';
	import STform from '@/components/ST/ST-form/ST-form.vue';
	import STswiper from '@/components/ST/ST-swiper/ST-swiper.vue';
	import STbutton from '@/components/ST/ST-button/ST-button.vue';
	import STinput from '@/components/ST/ST-input/ST-input.vue';
	import STapplys from '@/components/ST/ST-applys/ST-applys.vue';
	
	export default {
		components: {
			// draggable,
			'st-search': STsearch,
			'st-form': STform,
			'st-swiper': STswiper,
			'st-button': STbutton,
			'st-input': STinput,
			'st-applys': STapplys,
		},
		
		data() {
			return {
				// 保存布局的原始数据（不可改变）
				data_sorts: [],
				// 项目的布局数据（可改变）
				sorts: [],
				// 判断项目是在哪个端打开
				isPhone: false,
				// 控制删除组件显示
				isShowDelete: false,
				// 控制组件托到删除框时，删除框的样式
				isShowDeleteStyle: false,
				// 要删除的组件 unique
				delete_unique: -1,
				// 当前页面请求数据排版的id
				id: 1008,
				// 用于返回操作
				back_data: [],
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
			// _this.initSortable('del', false, -1);
		},
		computed: {
			// 监听页面布局是否发生改变
			isPageChange() {
				return this.data_sorts == JSON.stringify(this.sorts);
			},
		},
		methods: {
			// 获取布局数据
			async getEff(flag) {
				const _this = this;
				await uni.request({
					url: 'http://thinkphp/get_data?id=' + _this.id,
					method: 'GET',
					success: async res => {
						_this.data_sorts = res.data.sortable;
						_this.sorts = await JSON.parse(res.data.sortable);
						// console.log(_this.sorts)
						// console.log(JSON.stringify(_this.sorts))
						_this.initSortable('sort-1', flag, 1);
						setTimeout(() => {
							for(let k in _this.sorts.child)
							{
								if(_this.sorts.child[k].child_id) {
									_this.initSortable(_this.sorts.child[k].child_id, flag, 2);
								}
							}
						}, 100)
					},
					// fail: async err => {
					// 	if(uni.getStorageSync('sortable')) {
					// 		_this.sorts = uni.getStorageSync('sortable');
					// 	}
					// }
				})
			},
			// 初始化 sortable
			async initSortable(id, flag, level) {
				// level : -1 删除框 1 一级sortable 2 二级sortable
				// flag : true 项目是由移动端打开 false 项目是由PC端打开
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
						let old_index = evt.oldIndex;
						let new_index = evt.newIndex;
						_this.saveSort(new_index, old_index, id)
						_this.isShowDelete = false;
						_this.pageIsChange();
					},
					// 该方法目前争对删除框
					onAdd: (evt) => {
						// console.log('onAdd:', evt);
						let to_id = evt.to.id;
						let from_id = evt.from.id;
						let old_index = evt.oldIndex;
						let new_index = evt.newIndex;
						if(to_id == 'del') {
							let item = _this.searchByIdAndIndex(from_id, old_index);
							let obj = {
								id: from_id,
								type: 'delete',
								index: old_index,
								item,
							}
							// console.log(obj);
							_this.back_data.push(obj);
							
							_this.deleteComp(from_id, to_id, old_index, new_index);
							evt.item.style.width = 0;
							evt.item.style.height = 0;
							evt.item.style.overflow = 'hidden';
						}
						
						_this.$forceUpdate();
					},
					// 只有在盒子内可移动项的排序发生改变时才会触发
					onUpdate: (evt) => {
						// console.log('update sort', evt)
						let to_id = evt.to.id;
						let from_id = evt.from.id;
						let old_index = evt.oldIndex;
						let new_index = evt.newIndex;
						let obj = {
							id: to_id,
							old_index: new_index,
							new_index: old_index,
							type: 'sort',
						};
						this.back_data.push(obj);
						// console.log(this.back_data);
					}
				};
				if(level == -1) {
					options.group.pull = false;
					options.group.put = true;
				}
				if(level == 2) {
					// delete options.handle;
				}
				setTimeout(() => {
					// console.log(level, options)
					Sortable.create(el, options);
				}, 300)
			},
			// 保存排序
			async saveSort(new_index, old_index, id) {
				// evt 对象 id 表示可拖拽组的 id
				const _this = this;
				const sorts = _this.sorts;
				
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
						_this.addComponent(data);
						break;
					case 'update':
						_this.updateAttr(data);
						break;
					case 'deleteCompUnique':
						_this.deleteCompUnique();
						break;
					case 'backData':
						_this.backData();
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
						id: _this.id,
						sortable: sorts
					},
					success(res) {
						if(res.statusCode == 200) {
							window.parent.postMessage({
								method: 'saveSuccess',
							}, '*');
						}
						else {
							window.parent.postMessage({
								method: 'saveFail',
							}, '*');
						}
					}
				})
			},
			// 添加新组件
			addComponent(params) {
				const _this = this;
				let attr_obj = params.attr_obj;
				attr_obj.unique = Math.floor((new Date()).getTime() / 1000);
				// 当组件内部存在 sortable 盒子时，设置该盒子的 id
				if(attr_obj.child_id == -1) {
					attr_obj.child_id = Math.floor((new Date()).getTime());
				}
				
				this.sorts.child.splice(0, 0, attr_obj);
				let obj = {
					id: this.sorts.id,
					type: 'add',
					index: 0,
				};
				this.back_data.push(obj);
				
				// 当组件内部存在 sortable 盒子时，初始化该盒子
				if(attr_obj.child_id == -1) {
					setTimeout(() => {
						_this.initSortable(attr_obj.child_id, this.isPhone, 2);
					}, 100)
				}
			},
			// 更新组件属性内容
			updateAttr(data) {
				// console.log('update', data);
				const _this = this;
				let sorts = this.sorts;
				
				for(let k in sorts.child)
				{
					if(sorts.child[k].unique == data.unique) {
						let item = JSON.parse(JSON.stringify(sorts.child[k]));
						let obj = {
							id: sorts.id,
							type: 'update',
							unique: sorts.child[k].unique,
							item,
						};
						this.back_data.push(obj);
						// console.log(item);
						for(let kk in data)
						{
							_this.sorts.child[k][kk] = data[kk];
						}
						break;
					}
				}
				
				this.pageIsChange();
				this.$forceUpdate();
				// console.log(this.sorts)
			},
			// 使用 拖动 删除组件
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
			// 监听页面布局改变，发送信号到父窗口
			pageIsChange() {
				// let data_sorts = this.data_sorts;
				// let sorts = JSON.stringify(this.sorts);
				if(this.isPageChange) {
					window.parent.postMessage({
						method: 'pageLayoutChange',
						data: {
							flag: false,
						}
					}, '*');
				}
				else {
					window.parent.postMessage({
						method: 'pageLayoutChange',
						data: {
							flag: true,
						}
					}, '*');
				}
			},
			// 鼠标点击组件获取该组件的 unique
			activeGetUnique(item) {
				// console.log(item)
				this.delete_unique = item.unique;
				window.parent.postMessage({
					method: 'activeGetUnique',
					data: {
						// unique,
						// sorts,
						item
					}
				}, '*')
			},
			// 使用 unique 删除组件
			deleteCompUnique() {
				let sorts = this.sorts;
				// false 删除不成功 true 删除成功
				let flag = false;
				
				for(let k in sorts.child)
				{
					if(sorts.child[k].unique == this.delete_unique) {
						let obj = {
							id: sorts.id,
							type: 'delete',
							index: k,
							item: sorts.child[k],
						}
						this.back_data.push(obj);
						sorts.child.splice(k, 1);
						flag = true;
						break;
					}
					else if(sorts.child[k].child && sorts.child[k].child.length) {
						for(let kk in sorts.child[k].child)
						{
							let v = sorts.child[k].child[kk];
							if(v.unique == this.delete_unique) {
								let obj = {
									id: sorts.child[k].id,
									type: 'delete',
									index: kk,
									item: v,
								}
								this.back_data.push(obj);
								sorts.child[k].child.splice(kk, 1)
								flag = true;
								break;
							}
						}
					}
					if(flag) {
						break;
					}
				}
				
				// this.pageIsChange();
				// if(flag) {
				// 	window.parent.postMessage({
				// 		method: 'deleteSuccess'
				// 	}, '*');
				// }
				// else {
				// 	window.parent.postMessage({
				// 		method: 'deleteFail'
				// 	}, '*');
				// }
			},
			// 返回上一步
			backData() {
				// sort 排序时 delete 删除时 add 新增组件时
				if(this.back_data.length <= 0) return; 
				let sorts = this.sorts;
				let obj = this.back_data.pop();
				switch(obj.type)
				{
					case 'sort':
						this.saveSort(obj.new_index, obj.old_index, obj.id);
						break;
					case 'delete':
						if(sorts.id == obj.id) {
							this.sorts.child.splice(obj.index, 0, obj.item);
						}
						else {
							let childs = sorts.child;
							for(let k in childs)
							{
								if(childs[k].id == id) {
									this.sorts.child[k].child.splice(obj.index, 0, obj.item);
								}
							}
						}
						break;
					case 'add':
						this.sorts.child.splice(obj.index, 1);
						break;
					case 'update':
						if(sorts.id == obj.id) {
							for(let k in sorts.child)
							{
								if(sorts.child[k].unique == obj.unique) {
									for(let kk in obj.item)
									{
										this.sorts.child[k][kk] = obj.item[kk];
									}
									break;
								}
							}
						}
						// 更新到父窗口
						window.parent.postMessage({
							method: 'activeGetUnique',
							data: {
								item: JSON.parse(JSON.stringify(obj.item))
							}
						}, '*');
						this.$forceUpdate();
						break;
				}
				// console.log(obj, this.back_data);
			},
			// 根据 id 和 index 查找对应项
			searchByIdAndIndex(id, index) {
				let sorts = this.sorts;
				
				if(sorts.id == id) {
					return sorts.child[index];
				}
				else {
					let childs = sorts.child;
					for(let k in childs)
					{
						if(childs[k].id == id) {
							return childs[k][index];
						}
					}
				}
				return -1;
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
		}
	}
</style>
