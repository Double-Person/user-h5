import {autograph, wxwebLogin} from '@/common/apis.js';
import { APPID, REDIRECT_URI, REDIRECT_URI_COMMON } from '@/common/commonConfig.js'
// #ifdef H5
var jweixin = require('jweixin-module');	
// #endif
const mixin = {
	data() {
		return {
			JWEIXIN: null,
		}
	},
	mounted() {
		// console.log('全局mixin');
		// this.getJweixin()
		
		
	},
	
	methods: {
		loginInMixin() {
			console.log(this.getCodes())
			if(this.getCodes()) {
				this.getOpenId()
			}else {
				this.redirectHref()
			}
		},
		// 获取code
		redirectHref() {
			window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+APPID+'&redirect_uri=' + encodeURIComponent(REDIRECT_URI) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
		},
		// 获取openid
		getOpenId(type) {
			const that = this;
			let code = location.search.substr(1).split('&')[0].split('=')[1];
			// 通过code获取用户openid
			wxwebLogin({ code }).then(res => {
				const {isExist, data} = res.returnMsg;
				uni.setStorageSync('isExist', isExist);
				if(isExist) { //、 存在用户信息  // data 为用户信息
					uni.setStorageSync('userInfo', data)
					uni.setStorageSync('USERINFO_ID', data.USERINFO_ID)
					
					if(type == 'card') {
						window.location.href = uni.getStorageSync('location')
					}else{
						window.location.href = REDIRECT_URI_COMMON + '/pages/index/index'
					}
				}else { // 不存在是为用户openid
					uni.setStorageSync('openIdBind', data)
					try{
						this.isShowMask = true;
					}catch(e){
						//TODO handle the exception
					}
				}
				
			})
		},
		getCodes() {
			let code = '';
			if(location.search && location.search.substr(1)) {
				code = location.search.substr(1).split('&')[0].split('=')[1];
			}else {
				this.redirectHref()
			}
			return code
		},
		
		
		mixinFn() {
		},
		getJweixin () {
			return false;
			// #ifdef H5
			var appid,timestamp,nonceStr,signature;
			autograph({"url":'https://yflh.hkzhtech.com/static/'}).then(res=>{
				// 引入微信JS-SDK
				appid = res.appid;
				timestamp = res.timestamp;
				nonceStr = res.nonceStr;
				signature = res.signature;
			})
			jweixin.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: appid, // 必填，公众号的唯一标识
				timestamp: timestamp, // 必填，生成签名的时间戳
				nonceStr: nonceStr, // 必填，生成签名的随机串
				signature: signature, // 必填，签名
				jsApiList: ['updateAppMessageShareData','updateTimelineShareData','scanQRCode','chooseWXPay'] // 必填，需要使用的JS接口列表
			})
			jweixin.scanQRCode({
				needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
				success: function(res) {
					console.log(res)
					
				},
				fail: function(err) {
					console.log('错误', err)
				}
			});
			
			// #endif
		}

	}
}
export default mixin
