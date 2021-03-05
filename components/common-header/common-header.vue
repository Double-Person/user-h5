<template>
	<view class="header">
		<view class="common-header">
			<text class="iconfont icon-zuojiantou" @tap="backPage"></text>
			<text class="title">{{headerTitl}}</text>
			<view class="right">
				<!--  -->
				<text class="header-right-title-common" @click="withdrawalRecord" v-if="isShowHistory">提现记录</text>

				<text class="iconfont icon-xingxing" :class="xingHide?'xingHide':''"></text>
				<text class="iconfont icon-lingdang-xianxing" @tap="goNews" :class="lingHide?'lingHide':''"></text>
				<text class="iconfont icon-fenxiang" @tap="maskState=true" :class="fenxiangHide?'fenxiangHide':''"></text>
				<text class="iconfont icon-gengduo" :class="gengduoHide?'gengduoHide':''"></text>
			</view>
		</view>
		<!-- 分享提示蒙层 -->
		<view class="mask" :class="maskState?'':'maskShow'">
			<view class="mask-top" @tap="maskState=false">

			</view>
			<view class="mask-content">
				<view class="mask-content-cancel">
					<text class="iconfont icon-shanchu" @tap="maskState=false"></text>
				</view>
				<view class="mask-content-title">
					——<text>分享到</text>——
				</view>
				<view class="mask-content-item">
					<view class="weixin" @tap="share(1, $event)">
						<view class="iconfont icon-weixin">

						</view>
						<text>微信</text>
					</view>
					<view class="pengyouquan" @tap="share(2, $event)">
						<view>
							<image src="/static/images/pengyouquan.png" mode=""></image>
						</view>
						<text>朋友圈</text>
					</view>
					<view class="weibo" @tap="share(3, $event)">
						<view>
							<text class="iconfont icon-weibo"></text>
						</view>
						<text>微博</text>
					</view>
					<view class="qq" @tap="share(4, $event)">
						<view>
							<text class="iconfont icon-qq"></text>
						</view>
						<text>QQ</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { SHARE_CONFIG } from '@/common/commonConfig.js'
	import mixin from '@/mixin/mixin.js'
	import share from '@/mixin/share.js'
	share
	export default {
		props: {
			headerTitl: {
				type: String,
				default: ""
			},
			xingHide: {
				type: String,
				default: ""
			},
			isShowHistory: {
				type: Boolean,
				default: false
			},
			lingHide: {
				type: String,
				default: ""
			},
			fenxiangHide: {
				type: String,
				default: ""
			},
			gengduoHide: {
				type: String,
				default: ""
			},
			currentUrl: {
				type: String,
				default: '/pages/index/index'
			}
		},
		mixins: [mixin, share],
		data() {
			return {
				maskState: false
			}
		},
		onShareAppMessage(res) {
			console.log(res)
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
		    return {
		      title: '自定义分享标题',
		      path: '/pages/index/index'
		    }
		  },
		methods: {
			//  提现记录
			withdrawalRecord() {
				uni.navigateTo({
					url: '../../pages/withdrawalRecord/withdrawalRecord'
				})
			},
			backPage() {
				//  需要返回首页的  页面
				const backIndekList = ['pages/news/news', 'pages/cart/cart'];
				//  需要返回个人中心的  页面
				const backPersonalList = ['pages/myEvaluate/myEvaluate', 'pages/evaluate/evaluate'];
				// #ifdef H5
				let canBack = true;
				const pages = getCurrentPages();
				//  需要返回首页的  页面
				// if ((pages.route == 'pages/news/news') || (pages.route == 'pages/cart/cart')) {
				if (backIndekList.includes(pages.route)) {
					uni.navigateTo({
						url: "/pages/index/index"
					})
				}
				
				//  需要返回个人中心的  页面
				if (backPersonalList.includes(pages.route)) {
					uni.navigateTo({
						url: "/pages/personal/personal"
					})
				}
				
				// 有可返回的页面则直接返回，uni.navigateBack默认返回失败之后会自动刷新页面 ，无法继续返回  
				if (pages.length > 1) {
					uni.navigateBack(1)
					return;
				}
				// vue router 可以返回uni.navigateBack失败的页面 但是会重新加载   router.go失败之后则重定向到首页 
				let a = this.$router.go(-1)
				if (a == undefined) {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}
				return;
				
				
				// #endif
				// 修复小程序app返回退出应用bug(无法返回重定向至首页)
				
				var pagelength = getCurrentPages();

				var pageLast = pagelength[pagelength.length - 1];
				var currentWebview = pageLast.$getAppWebview();
				let currentRouter = currentWebview.__uniapp_route;

				if (backIndekList.includes(currentRouter)) {
					uni.navigateTo({
						url: "/pages/index/index"
					})
					return false;
				}
				if (backPersonalList.includes(currentRouter)) {
					uni.navigateTo({
						url: "/pages/personal/personal"
					})
					return false;
				}

				if (pagelength.length === 1) {
					var path = pagelength[0].route;
					// console.log(path)
					uni.reLaunch({
						url: '/' + path
					})
				} else {
					uni.navigateBack(1)
				}
				
			},
			// 进入消息
			goNews() {
				uni.navigateTo({
					url: "../../pages/news/news"
				})
			},
		
			
			// 分享功能开始
			share(index, event) {
				this.shareH5(index)
			}
		},
	}
</script>

<style lang="less">
	.common-header {
		height: 100rpx;
		font-size: 40rpx;
		background: url(../../static/images/bg1.jpg) no-repeat;
		background-size: cover;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #fff;
		position: fixed;
		width: 100%;
		z-index: 99999;
		top: 0;
		/* #ifdef APP-PLUS */
		padding-top: 40rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 40rpx;

		/* #endif */
		>.iconfont {
			position: absolute;
			left: 30rpx;
		}

		.title {
			width: 100%;
			text-align: center;
		}

		.right {
			position: absolute;
			right: 30rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;

			.iconfont {
				margin-left: 20rpx;
			}

			.icon-lingdang-xianxing {
				font-size: 38rpx;
			}

			.icon-fenxiang {
				font-size: 30rpx;
			}

			.icon-gengduo {
				display: none;
			}

			.header-right-title-common {
				height: 40rpx;
				font-size: 28rpx;
				color: #FFFFFF;
				line-height: 40rpx;
			}

			.xingHide {
				display: none;
			}

			.lingHide {
				display: none;
			}

			.fenxiangHide {
				display: none;
			}

			.gengduoHide {
				display: block;
			}
		}
	}

	// 蒙层
	// 显示隐藏
	.maskShow {
		display: none;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.8);
		z-index: 9999999;
		font-size: 30rpx;

		.mask-top {
			position: absolute;
			top: 0;
			min-height: 75%;
			width: 100%;
		}

		.mask-content {
			height: 376rpx;
			width: 100%;
			background: #fff;
			position: absolute;
			bottom: 0;

			.mask-content-cancel {
				display: flex;
				padding: 30rpx;
				justify-content: flex-end;

				text {
					font-size: 40rpx;
					color: #999;
				}
			}

			.mask-content-title {
				text-align: center;
				font-weight: bold;
				color: #D8D8D8;

				text {
					color: #000;
					font-size: 30rpx;
					margin: 0 20rpx;
				}
			}

			.mask-content-item {
				margin-top: 40rpx;
				display: flex;
				color: #666;
				font-size: 28rpx;
				text-align: center;
				justify-content: space-around;

				>view>view {
					margin-bottom: 10rpx;
				}

				.iconfont {
					font-size: 60rpx;
				}

				image {
					width: 80rpx;
					height: 80rpx;
				}

				.weixin .iconfont {
					font-size: 100rpx;
					color: #1bac19;
				}

				.pengyouquan {
					view {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						border: 1px solid #e0e0e0;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}

				.weibo,
				.qq {
					view {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #fff;
					}
				}

				.weibo view {
					background: #FF9206;
				}

				.qq view {
					background: #4DCFFC;
				}
			}
		}
	}
</style>
