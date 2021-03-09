<template>
	<view class="address">
		<!-- header -->
		<commonHeader headerTitl="地址"></commonHeader>

		<view class="address-content">
			<view class="item">
				<view class="address-content-title">
					联系方式
				</view>
				<view class="address-content-phone">
					电&emsp;&emsp;话: <text>{{vendor.CELLPHONE}}</text>
				</view>
				<view class="address-content-address">
					联系地址: <text>{{vendor.CITY +vendor.AREA + vendor.FULLADD}}</text>
				</view>

				<view class="page-section page-section-gap" @tap="gomap">
					<!-- 30.710764, 104.030396 -->
					<map style="width: 630rpx; height: 410rpx;" :latitude="latitude" :longitude="longitude" :markers="covers">
					</map>
				</view>

				<view class="addressTips" @tap="gomap">
					点击查看详情
				</view>
			</view>
		</view>
		<!-- tabbar -->
		<tabbar></tabbar>
	</view>
</template>

<script>
	// header
	import commonHeader from "@/components/common-header/common-header";
	import { KEY } from '@/common/commonConfig.js'
	// 引入tabbar
	import tabbar from "@/components/common-tabbar/common-tabbar";
	import share from '@/mixin/share.js'
	export default {
		data() {
			return {
				vendor: {},
				title: 'map',
				latitude: '', // 39.909,
				longitude: '', // 116.39742,
				covers: [{
					latitude: '', // 39.909,
					longitude: '', // 116.39742,
					iconPath: '../../static/images/location.png',
					width: 30,
					height: 30
				}]
			};
		},
		components: {
			commonHeader,
			tabbar
		},
		mixins: [share],
		onLoad(e) {
			this.vendor = JSON.parse(e.vendor);		
			console.log(this.vendor)
			this.getPoint()
			this.otherPage();
		},
		methods: {
			getPoint() {
				let { CITY, AREA, FULLADD } = this.vendor;
				const address= CITY + AREA + FULLADD;
				const that = this;
				uni.request({
					url: `http://restapi.amap.com/v3/geocode/geo?key=${KEY}&s=rsv3&city=35&address=${address}`,
					success(res) {
						console.log(res)
						let { statusCode, data:{ geocodes }} = res
						if(statusCode == 200 && geocodes.length > 0) {
							let [{location}] = geocodes;
							let [LONGITUDE, LATITUDE] = location.split(',')
							that.setData({ LATITUDE, LONGITUDE })
						}else {
							let { LONGITUDE, LATITUDE } = that.vendor;
							that.setData({ LATITUDE, LONGITUDE })
						}
					},
					fail(err) {
						let { LONGITUDE, LATITUDE } = that.vendor;
						that.setData({ LATITUDE, LONGITUDE })
					}
				})
			},
			setData({ LATITUDE, LONGITUDE }) {
				this.latitude =  LATITUDE;
				this.longitude = LONGITUDE;
				this.covers[0].latitude =  LATITUDE;
				this.covers[0].longitude = LONGITUDE;
			},
			// 前往地图
			gomap() {
				uni.openLocation({
					latitude: JSON.parse(this.latitude),
					longitude: JSON.parse(this.longitude)
				});
			}
		}
	}
</script>

<style lang="less">
	.address {
		background: #f7f7f7;
		padding-top: 130rpx;
		height: 87%;
		color: #333;
		font-size: 30rpx;
		/* #ifdef APP-PLUS */
		padding-top: 170rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 170rpx;
		/* #endif */

		.address-content {
			background: #f7f7f7;
			padding: 0 30rpx;
			height: 100%;

			.item {
				height: 100%;
				background: #fff;
				border-radius: 20rpx;
				padding: 0 30rpx;

				.address-content-title {
					padding: 30rpx 0 20rpx 0;
					font-weight: bold;
					font-size: 39rpx;
				}

				>view {
					margin-top: 10rpx;

					text {
						margin-left: 20rpx;
					}
				}

				.page-section {
					margin-top: 50rpx;
				}
			}

			.addressTips {
				color: #f00;
				margin-top: 30rpx;
			}
		}
	}
</style>
