import { autograph, wxwebLogin } from '@/common/apis.js';
import { APPID, REDIRECT_URI, REDIRECT_URI_COMMON, SHARE_CONFIG } from '@/common/commonConfig.js'

// #ifdef H5
// var jweixin = require('jweixin-module');
import jweixin from 'jweixin-module/out/index.js'  
// #endif
const share = {
	data() {
		return {
			JWEIXIN: null,
		}
	},

	onLoad() {
	},


	methods: {
		// 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
		shareH5Mixin(index) {
			const {
				href,
				title,
				summary,
				imageUrl,
				link
			} = SHARE_CONFIG;
			// let encode = encodeURI(href);
			let encode = href;
			autograph({
				"url": location.href.split('#')[0]
			}).then(res => {
				// 引入微信JS-SDK
				jweixin.config({
					debug: false, // 
					appId: res.appid, // 必填，公众号的唯一标识
					timestamp: res.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.nonceStr, // 必填，生成签名的随机串
					signature: res.signature, // 必填，签名
					jsApiList: [
						'updateAppMessageShareData',
						'updateTimelineShareData'
					] // 必填，需要使用的JS接口列表
				})

				jweixin.ready(() => {
					// 分享给朋友
					jweixin.checkJsApi({
						jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
						success: function(res) {
							// console.log('检查api成功', res)
						},
						fail: function(err) {
							// console.log('api失败', err)
						}
					});
					let shartData = {
						title: title, // 分享标题
						desc: summary, // 分享描述
						link: encode, // 
						imgUrl: imageUrl, // 分享图标
						success: function() {
							// 设置成功
						}
					}
					jweixin.updateAppMessageShareData(shartData)
					jweixin.updateTimelineShareData(shartData)
					
					
					if(index == 1) {
						jweixin.onMenuShareAppMessage({
						  title: title,  
						  desc: summary, // 分享描述
						  link: encode, 
						  imgUrl: imageUrl,
						  success: function (res) {
							  // console.log('分享成功', res)
						  },
						  
						})
					}
		
					if(index) {
						// if (index == 1 || index == 4) {
						// 	jweixin.updateAppMessageShareData(shartData)
						// }
						
						// if (index == 2 || index == 3) { // 分享朋友圈   // 分享微博
						// 	jweixin.updateTimelineShareData(shartData)
						// }
												
					}
					

					jweixin.error((err) => {
						console.log('错误',err)
					})
				});
			})

		},
		otherPage(index) {
			this.shareH5Mixin(index)
		},
	}
}
export default share
