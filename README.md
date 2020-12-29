# 页面编写要求

> <move-handle>组件: 用于需要拖动特定的区域才能移动子项目的特定区域（该组件是自定义的，主要是内部的 class）
	1. 属性值：
		* isPhone: 是否是 移动端 打开的项目

> 需要拖动特定的区域才能移动子项目时，需要满足一下条件
1. uni.scss -> sortable-panel: 在页面中 sortable 盒子必须添加该（sortable-panel）
2. 在 sortable 的子项目后放置 <move-handle> 组件




> 注意
1. 需要拖动特定的区域才能移动子项目时
	* 在为 <swiper> 添加 <move-handle> 时，需要添加在图片的后面，不能直接添加在 <swiper> 直接子元素内
	* 当一级的 sortable 里面还有还有 sortable 时，必须在二级的 sortable 外再加一层元素，例如：
		```
		<view class="sortable-panel">
			<view></view>
			<view>	//不能直接在该层设置为 sortable 盒子
				<view class="sortable-panel"></view>
			</view>
			<view></view>
		</view>
		```
	* sortable 盒子不要用 v-if 来控制显示，可以用 v-show
	* 删除组件之后也要保存布局才生效


> 存在问题
1. 目前最多只能嵌套两层可移动 sortable
2. 目前只能改变最近一次加入组件的属性内容
3. 如果设置组件属性内容，需要点击 '更新数据' 内容才能设置组件属性