import { autograph, wxwebLogin } from '@/common/apis.js';
import { APPID, REDIRECT_URI, REDIRECT_URI_COMMON, SHARE_CONFIG } from '@/common/commonConfig.js'

// #ifdef H5
var jweixin = require('jweixin-module');
// #endif
const share = {
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
		// 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
		shareH5(index) {
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
					jsApiList: ['checkJsApi',
						'updateAppMessageShareData',
						'updateTimelineShareData',
						'onMenuShareAppMessage',
						'onMenuShareTimeline',

					] // 必填，需要使用的JS接口列表
				})

				jweixin.ready(() => {
					// 分享给朋友
					jweixin.checkJsApi({
						jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
						success: function(res) {
							console.log('检查api', res)
						},
						fail: function(err) {
							console.log('api失败', err)
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
					
					jweixin.onMenuShareAppMessage(shartData);
					jweixin.onMenuShareTimeline(shartData);
		
					if (index == 1 || index == 4) {
						jweixin.updateAppMessageShareData(shartData)
					}

					if (index == 2 || index == 3) { // 分享朋友圈   // 分享微博
						jweixin.updateTimelineShareData(shartData)
					}

					jweixin.error((err) => {
						console.log(err)
					})
				});
			})

		},

		mixinFn() {},
		getJweixin() {
			return false;
			// #ifdef H5
			var appid, timestamp, nonceStr, signature;
			autograph({
				"url": 'https://yflh.hkzhtech.com/static/'
			}).then(res => {
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
				jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'scanQRCode', 'chooseWXPay'] // 必填，需要使用的JS接口列表
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
export default share
