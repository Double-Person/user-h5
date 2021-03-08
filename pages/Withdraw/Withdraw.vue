<template>
	<view class="header">
		<view class="common-header">
			<text class="iconfont icon-zuojiantou" @tap="backPage"></text>
			<text class="title">{{headerTitl}}</text>
			<view class="right">
				提现记录
			</view>
		</view>
		
	</view>
</template>

<script>
	import share from '@/mixin/share.js'
	export default {
		data() {
			return {
				headerTitl:'提现'
			}
		},
		mixins: [share],
		onLoad() {
			this.otherPage();
		},
		methods: {
			backPage() {
				// #ifdef H5
				let canBack = true;
				const pages = getCurrentPages();
				// 有可返回的页面则直接返回，uni.navigateBack默认返回失败之后会自动刷新页面 ，无法继续返回  
				if (pages.length > 1) {
					uni.navigateBack(1)
					return;
				}
				// vue router 可以返回uni.navigateBack失败的页面 但是会重新加载  
				let a = this.$router.go(-1)
				// router.go失败之后则重定向到首页 
				if (a == undefined) {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}
				return;
				// #endif
				// 修复小程序app返回退出应用bug(无法返回重定向至首页)
				var pagelength = getCurrentPages();
				if (pagelength.length === 1) {
					var path = pagelength[0].route;
					// console.log(path)
					uni.reLaunch({
						url: '/' + path
					})
				} else {
					uni.navigateBack(1)
				}
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
			font-size: 40rpx;
			text-align: center;
			letter-spacing: 2rpx;
		}

		.right {
			position: absolute;
			right: 30rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
            font-size: 28rpx;
		}
	}


</style>
