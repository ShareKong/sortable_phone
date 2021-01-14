import http from '../main.js'

// 请求 Sortable
const getSortable = (id) => {
	let url = '/zt/get_all?id=' + id;
	return http.$u.get(url).then(res => {
		return res;
	}).catch(err => {
		return err;
	})
}

// 获取页面主题
const getPageTheme = () => {
	let url = '/zt/get_zt';
	return http.$u.get(url).then(res => {
		return res;
	}).catch(err => {
		return err;
	})
}

// 保存页面布局
const saveLayout = (data) => {
	let url = '/zt/up_sor';
	return http.$u.post(url, data).then(res => {
		return res;
	}).catch(err => {
		return err;
	})
}


export default {
	getSortable,
	getPageTheme,
	saveLayout,
}