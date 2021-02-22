import Request from 'luch-request'
// import Request from '/js_sdk/luch-request/luch-request/index.js'
import { COMMON_URL } from './commonConfig.js'

const request = new Request()

request.setConfig((config) => { /* 设置全局配置 */
	config.baseURL = COMMON_URL + '/' //'https://yflh.hkzhtech.com/qufl/' //process.env.VUE_APP_BASE_API /* 根域名不同 */ 
	// config.baseURL = 'http://192.168.0.108:8081/' //process.env.VUE_APP_BASE_API /* 根域名不同 */ 
	config.header = { ...config.header,
	"Content-Type": "application/x-www-form-urlencoded",

	}

	return config
})


request.interceptors.request.use((config, cancel) => { /* 请求之前拦截器 */
	const token = uni.getStorageSync('token')
	if (token) config.header['Authorization'] = 'Bearer ' + token;
	return config
})

request.interceptors.response.use((response) => { 
	

	const res = response.data
	if (res.msgType === 0) { // 服务端返回的状态码不等于0，则reject()
		return res
	}

	return res
	return Promise.reject(res)
}, (response) => {
	uni.showToast({
		title: '接口请求失败',
		icon: 'none'
	})
	return response
})

export default request
