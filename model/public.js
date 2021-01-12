import http from '../main.js'

// 请求 Sortable
const getSortable = (id) => {
	let url = 'get_data?id=' + id;
	return http.$u.get(url).then(res => {
		return res;
	}).catch(err => {
		return err;
	})
}

// 获取页面主题
const getPageTheme = () => {
	let url = '/get_theme';
	return http.$u.get(url).then(res => {
		return res;
	}).catch(err => {
		return err;
	})
}


export default {
	getSortable,
	getPageTheme,
}