<template>
	<view class="local-preferences-detail">
		<view class="warp">
			<image class="bg-img" :src="hotInfo.PICTURE ? (imgBaseUrl + hotInfo.PICTURE) : '/static/images/youhui.png'" mode=""></image>
		</view>

		<view class="info">
			<!-- {{ hotInfo.DESCRIBE }} -->
			<view class="" v-html="hotInfo.DESCRIBE"></view>
			<!-- {{  }} -->
			<view class="phone" @click="callPhone(hotInfo.TYPES)">
				<image src="/static/images/phone.png"></image>
				<view class="">{{ hotInfo.TYPES }}</view>
			</view>
		</view>

		<!-- 热门推荐 -->
		<view class="localPreferences-content-hot">
			<view class="localPreferences-content-hot-title">
				<text class="iconfont icon-dian"></text>热门推荐
			</view>

			<view class="localPreferences-content-hot-item" v-for="item in hotInfo.glist" :key="item.id" @click="toDetail(item.GOODS_ID)">
				<view class="left">
					<image :src="imgBaseUrl + item.IMG" mode=""></image>
				</view>
				<view class="right">
					<view class="right-title">
						<text>{{item.NAME}}</text>
						<view>
							<text class="iconfont icon-youjiantou"></text>
						</view>
					</view>
					<view class="right-text">
						{{item.DETAILS}}
					</view>
					<!-- 评分 -->
					<view class="right-score">
						<!-- 不可点击状态 -->
						<uni-rate disabled="true" :value="5" active-color="#FF5D06" size="18"></uni-rate>
						<text>5分</text>
					</view>
					<!-- 时间 -->
					<view class="right-date">
						{{hotInfo.CREATETIME}}
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	// 评分组件
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	import {
		pushShop,
		getBanner,
		getPush,
		shopActivityGoods,
		findById,
		imgBaseUrl
	} from "@/common/apis.js";
	export default {
		data() {
			return {
				hotInfo: {},
				imgBaseUrl: imgBaseUrl,
			};
		},
		components: {
			uniRate
		},

		onLoad(options) {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			let shopId = options.shopId; //|| '9e98a5b1afb64ac6a00fc805c678e1e3';// options.shopId  
			let ACTIVITY_ID = options.ACTIVITY_ID; // ACTIVITY_ID
			findById({
				ACTIVITY_ID
			}).then(res => {
				this.hotInfo = res.returnMsg.data;
				let {
					GOODS1,
					GOODS2,
					GOODS3,
					GOODS4,
					GOODS5
				} = this.hotInfo;
				let glist = [GOODS1, GOODS2, GOODS3, GOODS4, GOODS5];
				glist = glist.filter(ele => ele);
				this.hotInfo.glist = glist;
				
			}).finally(() => uni.hideLoading())

		},
		methods: {

			toDetail(goodsId) { // goodsId 
				uni.navigateTo({
					url: '../goodsDetails/goodsDetails?shopId=' + goodsId
				})
			},
			// 拨打电话
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone //仅为示例
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.local-preferences-detail {
		height: 100vh;
		width: 100%;


		.warp {
			// position: fixed;
			// z-index: -1;
			// top: 0;
			// left: 0;
			// right: 0;
			// bottom: 0;
			margin-bottom: 40rpx;

			.bg-img {
				width: 100%;
				object-fit: cover;
				// height: 300rpx;
			}
		}

		.info {
			// height: 300rpx;
			background: rgb(245, 166, 35);
			width: 90%;
			border-radius: 20rpx;
			margin: 0 auto;
			padding: 20rpx;
			font-size: 30rpx;
			overflow-x: auto;

			.phone {
				background: rgb(250, 214, 154);
				display: flex;
				align-items: center;
				padding: 15rpx 0 15rpx 30rpx;
				border-radius: 60rpx;
				margin: 30rpx auto;

				image {
					width: 45rpx;
					height: 45rpx;
				}

				view {
					margin-left: 30rpx;
					color: rgb(205, 145, 81);
				}
			}
		}
	}


	.localPreferences-content-hot {
		margin-top: 100rpx;

		.localPreferences-content-hot-title {
			font-size: 32rpx;
			display: flex;
			align-items: center;

			text {
				color: #FF5D06;
				margin-left: 10rpx;
				font-size: 40rpx;
			}
		}

		.localPreferences-content-hot-item {
			display: flex;
			background: #fff;
			padding: 20rpx;
			width: 90%;
			border-radius: 20rpx;
			margin: 20rpx auto 0;
			box-shadow: 0 8rpx 20rpx #999;
			&:last-child{
				margin-bottom: 100rpx;
			}

			.left {
				width: 213rpx;
				height: 181rpx;
				border-radius: 20rpx;

				image {
					width: 100%;
					height: 100%;
				}

				margin-right: 20rpx;
			}

			.right {
				flex: 1;

				.right-title {
					font-size: 30rpx;
					font-weight: bold;
					display: flex;
					justify-content: space-between;

					view {
						width: 45rpx;
						height: 45rpx;
						border-radius: 50%;
						color: #fff;
						display: flex;
						justify-content: center;
						align-items: center;
						background: linear-gradient(205deg, rgba(251, 151, 72, 1) 0%, rgba(254, 120, 52, 1) 100%);
					}
				}

				.right-text {
					font-size: 24rpx;
					color: #666;
					width: 400rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-top: 10rpx;
				}

				.right-score {
					margin-top: 30rpx;
					display: flex;
					font-size: 24rpx;

					text {
						margin-top: -15rpx;
						margin-left: 15rpx;
					}
				}

				.right-date {
					font-size: 24rpx;
					color: #666;
					margin-top: 10rpx;
				}
			}
		}
	}
</style>
