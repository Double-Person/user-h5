<template>
	<view class="index" ref="index">
		<!-- 顶部 -->
		<view class="index-top">
			<view class="index_mid">
				<!-- 定位 -->
				<pickerAddress class="index-top-address" @change="setCity">
					<text class="iconfont icon-dingwei"></text>
					{{ cityShow }}
					<text class="iconfont icon-jiantou-xia"></text>
				</pickerAddress>
				<!-- 搜索 -->
				<view class="index-top-search" @tap="goSearch">
					<text class="iconfont icon-sousuo"></text>
					<text class="input-text">请输入商家名称或商品名</text>
					<!-- <input type="text" @tap="showHistory" @confirm="search" value="" placeholder="请输入商家名称或商品名" placeholder-style="fontSize:24rpx" style="font-size: 30rpx;"/> -->
				</view>
				<!-- 扫描 -->
				<text class="iconfont icon-saomiao" @tap="scanCode"></text>
			</view>
		</view>

		<!-- 广告 @click="goPreferencesPage" -->
		<view class="index-poster">
			<specialBanner :banner-list="bannerList" :swiper-config="swiperConfig"></specialBanner>
			<!-- <image src="../../static/images/banner.png" mode=""></image> -->
		</view>
		<!-- 分类 -->
		<view class="index-item">
			<view @click="goLocalPre" class="index-item-left">
				<view class="index-item-left-top">
					<text>本地优惠活动</text>
					<view><text class="iconfont icon-youjiantou"></text></view>
				</view>
			</view>
			<view class="index-item-right">
				<view @tap="getItemClick(index + 1, item.CATEGORY_ID)" v-for="(item, index) in itemList" :key="index">
					<text>{{ item.NAME }}</text>
					<image :src="'../../static/images/item0' + (3 + index) + '.png'" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 推荐内容 -->

		<view v-if="menuList.length > 0">
			<view class="index-content" v-for="(item, index) in menuList" :key="index">
				<view class="index-content-title">
					<text>{{ item.SHOP_NAME }}</text>
					<view @tap="goShopPage(item.SHOP_ID,0)">进店逛逛</view>
				</view>
				<view class="index-content-msg">
					<text>累计购买 {{ item.PAID_COUNT }} 次</text>
					<view>{{item.CITY + item.AREA}} 距离{{ (item.distance / 1000).toFixed(2) }}千米</view>
				</view>
				<view class="index-content-product">
					<view class="index-content-product-msg" v-for="(item1, index1) in item.GoodsImg" 
					:key="index1" @tap="goShopPage(item1.GOODS_ID,1)" v-if="item1.PUSHHP == 1">
						<image :src="imgBaseUrl + item1.img" mode=""></image>
						<text>{{ item1.name }}</text>
						<view class="msg">
							<text>￥{{ item1.price || 0 }}</text>
							销售量: {{ item1.sales || 0 }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else style="text-align: center;font-size: 30rpx;color: #999;padding-top: 50rpx;">暂无商家数据！</view>
		<!-- tabbar -->
		<tabbar active="1"></tabbar>

		<!-- 搜索蒙层 -->
		<view class="index-mask" :class="maskHide ? 'maskHide' : ''">
			<p class="index-mask-item">豆浆油条先生</p>
		</view>
		<!-- <web-view v-if="stroingCity==true" src="../../common/location.html"></web-view> -->
		<view id="output" style="width: 50upx;height: 50upx;display: none;" ref="output"></view>
	</view>
</template>

<!-- <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.6&amp;key=2df5711d4e2fd9ecd1622b5a53fc6b1d"></script> -->
<!-- <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=DD279b2a90afdf0ae7a3796787a0742e"></script> -->
<script>
	// banner
	// 318dfe4e09e51453d11d2c31cde26534
	import specialBanner from '@/components/specialBanner.vue'
	//引入tabbar
	import tabbar from '@/components/common-tabbar/common-tabbar';
	//引入高德地图
	import amap from '@/components/amap-wx.js';
	import amapPlugin from '@/components/initMap.js';
	// 城市选择
	import pickerAddress from '@/components/pickerAddress/pickerAddress.vue';
	import mixin from '@/mixin/mixin.js'
	import share from '@/mixin/share.js'
	// 引入请求接口
	import {
		pushShop,
		getItem,
		getShopPay,
		getBanner,
		homePage,
		baseUrl,
		autograph,
		imgBaseUrl
	} from '@/common/apis.js';
	import {INDEX_KEY, CONVERSION_KEY} from "@/common/commonConfig.js"
	var jweixin = require('jweixin-module');

	export default {
		components: {
			tabbar,
			pickerAddress,
			specialBanner
		},
		mixins: [mixin, share],
		data() {
			return {
				passCity2Loca: '',
				passCity: '',
				imgBaseUrl: imgBaseUrl,
				cityShow: '',
				key: INDEX_KEY, // 'f0d8604522a34fea7af419d353f98e8f',
				CONVERSION_KEY: CONVERSION_KEY,
				stroingCity: true,
				title: '',
				newCity: '', //当前城市
				area: '', //当前地区
				maskHide: true,
				menuList: '',
				itemType: 1,
				// 定位信息        
				longitude: '', // 104.031341
				latitude: '', // 30.698437
				kilometers: '',
				swiperConfig: {
					indicatorDots: true,
					indicatorColor: 'rgba(255, 255, 255, .4)',
					indicatorActiveColor: 'rgba(255, 255, 255, 1)',
					autoplay: false,
					interval: 3000,
					duration: 300,
					circular: true,
					previousMargin: '58rpx',
					nextMargin: '58rpx'
				},
				bannerList: [],
				itemList: [] //分类列表
			};
		},

		onLoad() {
			this.otherPage();
		},

		async created() {
			uni.setStorageSync('isWeChatLogin', false);
			// window.location.href = 'https://yflh.hkzhtech.com/qflhadmin/#/pages/index/index'
			await this.showLoad();
			
			// #ifdef APP-PLUS
			// plus 获取经纬度
			await this.getLocations()
			// #endif
			// this.getPoint()
			
			// #ifdef H5
			await this.loactionH5()
			// #endif
			
	
			await this._homePage()
		
			await this.hideLoad()
			await this.$forceUpdate()
		},

		methods: {
			// 扫描二维码
			scanCode() {
				// 允许从相机和相册扫码
				// #ifdef APP-PLUS
				uni.scanCode({
					scanType: ['qrCode'],
					success: ({ result }) => {
						let { shopId, money } = JSON.parse(result);
						getShopPay({ SHOP_ID: shopId, money }).then(res => {
								if (res.returnMsg.status != '00') {
								return uni.showToast({
									title: '条码错误!',
									icon: 'none',
									duration: 2000,
									mask: true
								});
							}
							uni.navigateTo({
								// url: '../scanPay/scanPay?shopName=' + res.returnMsg.shop.SHOP_NAME + '&shopId=' + shopId+ '&money=' + money
								url: `../scanPay/scanPay?shopName=${res.returnMsg.shop.SHOP_NAME}&shopId=${shopId}&money=${money}`
							});
							// plus.runtime.openURL('https://uniapp.dcloud.io/api/system/barcode');
						});
					},
				});
				// #endif
				// #ifdef H5
				autograph({"url": location.href.split('#')[0]}).then(res=>{
					// 引入微信JS-SDK
					this.scanCodeH5(res)			
				})
				
				// #endif
			},
			scanCodeH5(res) {
				jweixin.config({
					debug: false, // 
					appId: res.appid, // 必填，公众号的唯一标识
					timestamp: res.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.nonceStr, // 必填，生成签名的随机串
					signature: res.signature, // 必填，签名
					jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
				})
				
				jweixin.ready(() => {
					jweixin.checkJsApi({
						jsApiList: ['scanQRCode'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
						success: function(res) {
							console.log('checkjsapi Success', res)
						},
						fail:function(err) {
							console.log('err', err)
						}
					});
					jweixin.scanQRCode({
						needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
						scanType: ['qrCode', 'barCode'],
						success: function(res) {
							let { shopId, money } = JSON.parse(res.resultStr);
							uni.showToast({
								title: JSON.parse(res.resultStr)
							})
							getShopPay({ SHOP_ID: shopId, money }).then(res => {
									if (res.returnMsg.status != '00') {
									return uni.showToast({
										title: '条码错误!',
										icon: 'none',
										duration: 2000,
										mask: true
									});
								}
								uni.navigateTo({
									url: `../scanPay/scanPay?shopName=${res.returnMsg.shop.SHOP_NAME}&shopId=${shopId}&money=${money}`
								});
							});
						},
						fail() {
							uni.showToast({
								title: '扫码失败',
								icon: 'none'
							})
						}
					});
				});
			
			},
			loactionH5() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						this.longitude = res.longitude
						this.latitude = res.latitude
						this.conversionPoint(res)
					},
					fail(err) {
						uni.showToast({
							title: '定位失败',
							icon: 'none'
						})
					},
					
				});
			},
			showLoad() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
			},
			hideLoad() {
				uni.hideLoading()
			},
			getLocations() {
				let that = this;
				uni.getLocation({
					type: 'wgs84',
					geocode: true, //设置该参数为true可直接获取经纬度及城市信息
					success: async (res) => {
						this.longitude = res.longitude
						this.latitude = res.latitude
						var points = new plus.maps.Point(res.longitude, res.latitude);
				
						plus.maps.Map.reverseGeocode(
							points, {},
							function(event) {
								var address = event.address; // 转换后的地理位置
								var point = event.coord; // 转换后的坐标信息
								var coordType = event.coordType; // 转换后的坐标系类型
								var reg = /.+?(省|市|自治区|自治州|县|区)/g;
								let addressList = address.match(reg).toString().split(",");
								uni.setStorageSync('addressList', addressList)
								// addressList[0] +
								this.newCity = addressList[1] + addressList[2]
							},
							function(e) {}
						);
				
				
				
						await uni.setStorageSync('locationPoint', JSON.stringify(res));
						await this.conversionPoint(res)
						// 位置转换
						await uni.request({
							url: "https://restapi.amap.com/v3/geocode/regeo?parameters",
							method: 'GET',
							data: {
								key: that.key,
								location: `${res.longitude}, ${res.latitude}`
							},
							success: (data) => {
								getApp().globalData.city = [];
								let {
									city,
									district
								} = data.data.regeocode.addressComponent;
								this.newCity = city + district;
								this.cityShow = district;
								this.passCity = city;
								getApp().globalData.city.push(city, district);
							},
							fail(err) {
								uni.showToast({ title: "定位失败！手动选择", icon: 'none' })
							}
						})
				
					},
					fail() {
						uni.showModal({
							title: '提示',
							content: '请打开手机定位权限',
							showCancel: false,
				
						});
					}
				});
			},
			// 獲取分類
			_homePage() {
				homePage().then(res => {
					this.itemList = res.returnMsg && res.returnMsg
				})
			},
			//   金纬度转位置
			conversionPoint(res) {
				let that = this;
				uni.request({
					url: "https://restapi.amap.com/v3/geocode/regeo?parameters",
					method: 'GET',
					data: {
						key: that.key,
						location: `${res.longitude}, ${res.latitude}`
					},

					success: (data) => {
						this.area = data.data.regeocode.addressComponent.district;
						
						uni.setStorageSync('locationAddress', JSON.stringify(data.data.regeocode.addressComponent));
						uni.setStorageSync('locationArea', JSON.stringify(this.area));
						let {
							province,
							city,
							district
						} = data.data.regeocode.addressComponent
						// province +
						this.newCity = city + district
					
						// #ifdef H5
						let addressList = [province, city, district] ;// `${province},${city},${district}`
						uni.setStorageSync('addressList', addressList)
						
						// #endif
						
						this.getBannerList(city, district)
						this.getPositonData(this.latitude, this.longitude, this.area)
					},
					fail: err => {
						uni.showToast({
							title: "定位失败",
							icon: 'none'
						})
					},
				})
			},
			getPoint() {
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						this.longitude = res.longitude
						this.latitude = res.latitude
						uni.setStorageSync('locationPoint', JSON.stringify(res));
					}
				})
			},
		

			// 获取轮播

			// 前往本地优惠
			goLocalPre() {
				let citys = '';
				// if(this.passCity2Loca == '') {
				// 	citys = this.passCity;
				// }else {
				// 	citys = this.passCity2Loca;
				// }
				uni.navigateTo({ // passCity2Loca   passCity
				
					url: '../localPreferences/localPreferences?longitude=' + this.longitude + '&latitude=' + this.latitude +
						'&area=' + this.area + '&city=' + citys
				});
			},
			// banner跳转
			goPreferencesPage() {
				uni.navigateTo({
					url: '../preferencesPage/preferencesPage'
				});
			},
			// 根据定位请求数据
			getPositonData(LATITUDE, LONGITUDE, AREA, CATEGORY_ID) {
				
				this.cityShow = AREA;
				uni.request({
					url: baseUrl + '/api/ordersummary/push/newvendor',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					data: {
						LONGITUDE,
						LATITUDE,
						AREA,
						// NAME: this.itemType, // 不填就是综合
						CATEGORY_ID: CATEGORY_ID || ''
					},
					method: 'POST',
					success: (res) => {
						console.log(res)
						if (res.data.status != '00') {
							uni.showToast({
								title: '请手动设置地区!',
								icon: 'none',
								duration: 5000
							});
						} else {
							res.data.varList.map(item => {
								item.distance = Math.round(item.distance);
							});
							this.menuList = res.data.varList;
						}
					},
					fail: () => {
						uni.showToast({
							title: '获取数据失败！',
							icon: 'none'
						});
					},
					
				})

			},
			// 手动设置城市
			setCity(data) {
				this.newCity = data.data.slice(1, 3).join('');
				this.passCity2Loca = data.data[1] || ''
				
				// 存入全局变量
				getApp().globalData.city = data.data.slice(1);
				// 地址转换为经纬度
				// 
				uni.request({
					method: 'GET',
					url: `http://restapi.amap.com/v3/geocode/geo?key=${this.CONVERSION_KEY}&s=rsv3&city=35&address=${this.newCity}`,
					success: res => {
						var arr = res.data.geocodes[0].location.split(',');
						getApp().globalData.longitude = arr[0];
						getApp().globalData.latitude = arr[1];


						this.longitude = arr[0];
						this.latitude = arr[1];
						let {
							city,
							district
						} = res.data.geocodes[0]
						this.area = district
						this.getPositonData( this.latitude,this.longitude, this.area);


						this.getBannerList(city, district)
						this.getPositonData(this.latitude,this.longitude,  this.area)
					}
				});
			},
			// 分类筛选  CATEGORY_ID
			getItemClick(item, CATEGORY_ID) {
				this.itemType = item;
				this.getPositonData(this.latitude, this.longitude, this.area, CATEGORY_ID);
			},
			// 获取banner
			getBannerList(CITY = '成都市', AREA = '金牛区') {
				var data = {
					CITY,
					AREA, //this.area,
					CATEGORY: 0, // 0 首页轮播 1 优惠活动
				};
				getBanner(data).then(res => {
					this.bannerList = res.returnMsg.banner.map(item => {
						return {
							shopId: item.SHOP_ID,
							types: item.TYPES, // 0 外部 1 商品
							picture: item.IMG,
							title: '',
							description: '',
							path: item.URL
						}
					})

				}).catch(err => uni.showToast({ title: '系统错误', icon: 'none' }))
			},
			// 前往店铺
			goShopPage(id, e) {
				// return false;
				if (e === 0) {
					uni.navigateTo({
						url: "../shopPage/shopPage?shopId=" + id
					});
				} else if (e === 1) {
					uni.navigateTo({
						url: "../goodsDetails/goodsDetails?shopId=" + id
					});
				}
			},

			

			goSearch() {
				uni.navigateTo({
					url: '../search/search'
				});
			}
		},

	};
</script>

<style lang="less" scoped>
	.index {
		min-height: 100%;
		background: #f7f4f8;
		color: #333;
		padding-bottom: 120rpx;
		position: relative;

		// 顶部
		.index-top {
			background: url(../../static/images/bg1.jpg) no-repeat;
			background-size: cover;
			color: #fff;
			height: 220rpx;
			width: 100%;
			z-index: 100;

			>view {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				position: fixed;
				top: 0;
				width: 100%;
				z-index: 900;
				padding: 30rpx 0;
				background: url(../../static/images/bg1.jpg) no-repeat;
				background-size: cover;
				/* #ifdef APP-PLUS */
				padding-top: 70rpx;
				/* #endif */
				/* #ifdef MP-WEIXIN */
				padding-top: 70rpx;

				/* #endif */
				.index-top-address {
					.iconfont:first-child {
						font-size: 38rpx;
						margin: 0 10rpx 0 20rpx;
					}

					.iconfont:last-child {
						font-size: 20rpx;
						margin: 0 20rpx 0 10rpx;
					}
				}

				.index-top-search {
					flex: 1;
					height: 64rpx;
					background: #fff;
					font-size: 24rpx;
					border-radius: 32rpx;
					color: rgba(153, 153, 153, 1);
					display: flex;
					align-items: center;
					justify-content: center;

					.iconfont {
						font-weight: bold;
						margin-right: 15rpx;
					}

					.input-text {
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				>.iconfont {
					font-size: 50rpx;
					margin: 0 20rpx;
				}
			}
		}


		// 广告
		.index-poster {
			margin: -55rpx auto 0 auto;
			width: 710rpx;
			height: 330rpx;
			border-radius: 20rpx;
			overflow: hidden;
			// box-shadow: 2rpx 4rpx 0rpx #bfbfbf;
			// height: 280rpx;
			// width: 95%;
			// margin: -100rpx auto 0;
			// /* #ifdef APP-PLUS */
			// margin: -55rpx auto 0;
			// /* #endif */
			// /* #ifdef MP-WEIXIN */
			// margin: -55rpx auto 0;
			// /* #endif */
			// position: relative;
			// z-index: 800;
			// border-radius: 20rpx;
			// overflow: hidden;
			// box-shadow: 2rpx 4rpx 30rpx #4e4e4e;

			// image {
			// 	width: 100%;
			// 	height: 100%;
			// }
		}

		// 分类
		.index-item {
			height: 324rpx;
			width: 95%;
			background: #fff;
			margin: 50rpx auto 0;
			border-radius: 20rpx;
			display: flex;
			color: #333333;
			font-size: 30rpx;

			.index-item-left {
				width: 40%;
				background: url(../../static/images/item01.png) no-repeat;
				background-position: 0 60rpx;
				border-right: 1px solid #eae8e9;

				.index-item-left-top {
					padding-top: 30rpx;
					display: flex;
					font-weight: bold;
					justify-content: center;
					align-items: center;
					letter-spacing: 4rpx;

					view {
						width: 32rpx;
						height: 32rpx;
						line-height: 32rpx;
						color: #fff;
						font-size: 20rpx;
						background: #fe8c02;
						border-radius: 50%;
						background-size: 100%;
						text-align: center;

						.iconfont {
							font-size: 24rpx;
							margin-left: 5rpx;
						}
					}
				}
			}

			.index-item-right {
				width: 60%;
				height: 100%;
				display: flex;
				flex-wrap: wrap;

				>view {
					width: 49%;
					height: 50%;
					display: flex;
					justify-content: space-around;

					text {
						padding: 20rpx 0 0 10rpx;
					}

					image {
						width: 78rpx;
						height: 78rpx;
						margin-top: 60rpx;
						margin-right: 5rpx;
					}
				}

				view:nth-child(1) {
					border-bottom: 1px solid #eae8e9;
					border-right: 1px solid #eae8e9;
				}

				view:nth-child(2) {
					border-bottom: 1px solid #eae8e9;
				}

				view:nth-child(3) {
					border-right: 1px solid #eae8e9;
				}
			}
		}

		// 推荐内容
		.index-content {
			height: 400rpx;
			width: 90%;
			margin: 30rpx auto 0;
			background: #fff;
			border-radius: 20rpx;
			padding: 30rpx 20rpx;

			.index-content-title,
			.index-content-msg {
				display: flex;
				justify-content: space-between;
			}

			.index-content-title {
				font-size: 34rpx;
				letter-spacing: 4rpx;

				text {
					font-weight: 600;
				}

				view {
					width: 132rpx;
					height: 50rpx;
					font-size: 24rpx;
					color: #fff;
					background: linear-gradient(231deg, rgba(255, 178, 10, 1) 0%, rgba(255, 127, 4, 1) 60%, rgba(255, 89, 4, 1) 100%);
					border-radius: 50rpx;
					text-align: center;
					line-height: 50rpx;
				}
			}

			.index-content-msg {
				align-items: center;
				padding: 10rpx 0;

				text {
					height: 32rpx;
					font-size: 24rpx;
					padding: 3rpx 20rpx;
					background: #ffedec;
					color: #ff403a;
					border-radius: 17px;
				}

				view {
					color: #999999;
					font-size: 20rpx;
				}
			}

			.index-content-product {
				display: flex;

				// justify-content: space-between;
				.index-content-product-msg {
					margin-top: 20rpx;
					width: 31%;
					font-size: 26rpx;
					margin-left: 20rpx;

					image {
						width: 210rpx;
						height: 178rpx;
						background: rgba(216, 216, 216, 1);
						border-radius: 10rpx;
					}

					>text {
						display: inline-block;
						font-weight: bold;
						margin-top: 10rpx;
						font-size: 24rpx;
					}

					view {
						margin-top: 10rpx;
						color: #999;
						font-size: 24rpx;

						text {
							color: #ff403a;
							font-weight: bold;
							margin-right: 10rpx;
						}
					}
				}

				.index-content-product-msg:first-child {
					margin-left: 0;
				}
			}
		}

		// 搜索蒙层
		.maskHide {
			display: none;
		}

		.index-mask {
			width: 100%;
			height: 100%;
			background: rgba(1, 1, 1, 0.5);
			position: fixed;
			z-index: 899;
			top: 0;
			left: 0;
			color: #000;
			padding-top: 120rpx;

			.index-mask-item {
				font-size: 30rpx;
				padding: 15rpx;
				background: rgba(255, 255, 255, 0.5);
				border-bottom: 1px solid #ccc;
			}
		}
	}
</style>
