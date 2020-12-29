import Vue from 'vue'
import App from './App'
import uView from "uview-ui"
import MoveHandle from 'components/MoverHandle.vue'
// import VueConfig from './vue.config.js'


Vue.config.productionTip = false
Vue.use(uView);
Vue.component('MoveHandle', MoveHandle);
// Vue.use(VueConfig);
App.mpType = 'app'



// //判断当前运行环境是独立运行的还是在父应用里面进行运行，配置全局的公共资源路径
// if(window.__POWERED_BY_QIANKUN__){ 
//     __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__; 
// }
// //如果是独立运行window.__POWERED_BY_QIANKUN__=undefined
// if(!window.__POWERED_BY_QIANKUN__){
    
// } 
// //最后暴露的三个方法是固定的，加载渲染以及销毁
// export async function bootstrap(){} 
// export async function mount(props){} 
// export async function unmount(){}

const app = new Vue({
	...App
})
app.$mount()