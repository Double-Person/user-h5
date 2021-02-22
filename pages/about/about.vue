<template>
	<view class="about">
		<!-- header -->
		<commonHeader headerTitl="关于我们" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<view class="about-content">
			<view>
				<view class="content">
					<view class="item">
						<view src="" frameborder="0" v-html="info.SYSSET_VALUE"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="usage-pprivacy-protocol" @click="usage">用户使用与隐私协议</view>
		<view class="beian">
			<view>Copyright 2020 趣分利版权所有</view>
			<view>ICP备案号 湘ICP备20003506号-1</view>
		</view>
	</view>
</template>

<script>
	// header
	import commonHeader from "@/components/common-header/common-header";
	import {
		getAboutInfo
	} from '@/common/apis.js'

	export default {
		data() {
			return {
				info: {}
			};
		},
		mounted() {
			this.getInitData()
		},
		methods: {
			async getInitData() {
				const {
					returnMsg
				} = await getAboutInfo()
				this.info = returnMsg
			},
			usage() {
				uni.navigateTo({
					url: '../userAgreement/userAgreement'
				})
			}
		},
		components: {
			commonHeader
		}
	}
</script>

<style lang="less" scoped>
	.usage-pprivacy-protocol {
		text-align: center;
		width: 100%;
		color:#FF5904;
		margin-top: 50rpx;
	}

	.about {
		background: #f7f7f7;
		height: 100%;
		font-size: 30rpx;
		color: #333;
		/* #ifdef H5 */
		padding-top: 130rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		padding-top: 170rpx;

		/* #endif */
		.about-content {
			padding: 0 30rpx;

			>view {
				background: #fff;
				border-radius: 20rpx;
			}

			.img {
				text-align: center;
				padding: 50rpx 0;

				image {
					width: 300rpx;
					height: 300rpx;
				}

				view {
					margin-top: 20rpx;
				}
			}

			.content {
				padding: 0 30rpx;
				font-size: 34rpx;
				padding-bottom: 50rpx;

				.title {
					font-weight: bold;
				}

				.item {
					margin-top: 10rpx;
					text-indent: 2em;
				}
			}
		}

		.beian {
			text-align: center;
			margin-top: 30rpx;
			color: #999;
		}
	}
</style>
