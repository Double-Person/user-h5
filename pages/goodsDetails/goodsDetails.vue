<template>
	<view class="goodsDetails">
		<!-- header -->
		<commonHeader headerTitl="产品详情" xingHide=true lingHide=true></commonHeader>
		<view class="goodsDetails-content">
			<view class="goodsDetails-content-background">

				<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
					<swiper-item v-for="item in Detail.image" :key='item.GOODSIMGS_ID'>
						<image :src="imgBaseUrl + item.IMG" mode="" @click="previewImage(Detail.image)"></image>
					</swiper-item>

				</swiper>
			</view>
			<view class="goodsDetails-content-title">
				<view class="title">
					{{Detail.NAME}}
					 
				</view>
				<view class="sale">
					<text>月售{{Detail.MONTHLY_SALES || 0}}</text>
				</view>
				<view class="jiesao">
					主要原料：{{Detail.MARERIAL}}
				</view>
				<view class="fl">
					<view class="price">￥{{Detail.PRICE || 0}}</view>
					<view class="cart" @click="_addCarts">
					加入购物车	
					</view>
				</view>
				
			</view>
			<view class="goodsDetails-content-details">
				<view class="title">
					商品详情
				</view>
				<view class="details">
					{{Detail.DETAILS}}
				</view>
			</view>
			<view class="goodsDetails-content-evaluate">
				<view class="title">
					评价
				</view>
				<view class="item" v-for="(item,i) in Detail.varlist" :key="i">
					<view class="left">
						<image :src="imgBaseUrl + item.FACEICON" mode=""></image>
					</view>
					<view class="right">
						<view class="name">
							{{item.USERNAME}}
						</view>
						<view class="date">
							{{item.CREATETIME}}
						</view>
						<view class="text">
							{{item.CONTENT}}
						</view>
						<view class="text" v-if="item.IMGS">
							<image :src="imgBaseUrl + item.IMGS" mode="" class="content-img"></image>
						</view>
						<view class="text" v-if="item.REPLY">
							商家回复：{{item.REPLY}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- tabbar -->
		<tabbar></tabbar>
	</view>
</template>

<script>
	import commonHeader from "@/components/common-header/common-header";
	import tabbar from "@/components/common-tabbar/common-tabbar";
	import {
		addCarts,
		shopDetails,
		imgBaseUrl
	} from "@/common/apis.js";
	export default {
		data() {
			return {
				goodsId: '',
				Detail: {},
				imgBaseUrl: imgBaseUrl,
			};
		},
		components: {
			tabbar,
			commonHeader
		},

		onLoad(opetion) {
			this.goodsId = opetion.shopId;
			shopDetails({
				goodsId: opetion.shopId
			}).then(res => {
				this.Detail = res.returnMsg.newevaluate
				let cons = this.Detail.varlist.filter(item => item.CONTENT)
				this.Detail.varlist = cons
			}).catch(err => {
				uni.showToast({
					title: '请求失败！',
					icon: 'none'
				})
			})

		},
		methods: {
			_addCarts() {
				const data = {
					GOODS_ID: this.goodsId,
					COUNTS: 1,
					USERINFO_ID: uni.getStorageSync('USERINFO_ID')
				}
				addCarts(data).then(({ msgType }) => {
					if (msgType == 0) {
						uni.showToast({
							title: '添加购物车成功'
						})
					} else {
						uni.showToast({
							title: '添加购物车失败'
						})
					}
				})
			},
			previewImage(imgs) {
				let urls = imgs.map(ele => (this.imgBaseUrl + ele.IMG))
				uni.previewImage({ urls });
			}
		}
	}
</script>

<style lang="less">
	.content-img{
		width: 150rpx;
		height: 150rpx;
	}
	.goodsDetails {
		background: #f7f7f7;
		color: #333;
		padding-top: 90rpx;
		min-height: 100%;
		padding-bottom: 100rpx;
		/* #ifdef APP-PLUS */
		padding-top: 130rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 130rpx;

		/* #endif */
		.goodsDetails-content {
			.goodsDetails-content-background {
				height: 390rpx;
				width: 100%;

				.swiper {
					height: 100%;

					image {
						width: 100%;
						height: 100%;
					}
				}


			}

			.goodsDetails-content-title {
				background: #fff;
				padding: 20rpx 30rpx;
				font-size: 24rpx;
				color: #666;

				.title {
					color: #000;
					font-size: 36rpx;
					font-weight: bold;
				}

				.sale {
					padding-top: 15rpx;

					text {
						margin-right: 30rpx;
					}
				}

				.jiesao {
					margin-top: 5rpx;
				}
				.fl{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.price {
						font-size: 28rpx;
						color: #FF5A32;
						margin-top: 15rpx;
					}
					.cart{
						background: rgb(255, 132, 39);
						font-size: 30rpx;
						color: #fff;
						border-radius: 10rpx;
						padding: 15rpx 15rpx;
					}
				}
				
			}

			.goodsDetails-content-details {
				padding: 30rpx;
				background: #fff;
				margin-top: 20rpx;

				.title {
					font-size: 32rpx;
					font-weight: bold;
				}

				.details {
					font-size: 28rpx;
					color: #666;
					margin-top: 10rpx;
				}
			}

			.goodsDetails-content-evaluate {
				margin-top: 20rpx;
				background: #fff;

				.title {
					font-size: 28rpx;
					padding: 30rpx;
				}

				.item {
					display: flex;
					padding: 30rpx;
					border-bottom: 1px solid #e0e0e0;

					.left {
						width: 65rpx;
						height: 65rpx;
						border-radius: 50%;
						overflow: hidden;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.right {
						flex: 1;
						margin-left: 30rpx;

						.name {
							font-size: 30rpx;
							font-weight: bold;
						}

						.date {
							font-size: 24rpx;
							color: #666;
							padding: 10rpx 0;
							color: #666;
						}

						.text {
							font-size: 30rpx;
							letter-spacing: 5rpx;
							word-break: break-all;
						}
					}
				}
			}
		}
	}
</style>
