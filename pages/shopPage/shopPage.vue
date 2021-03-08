<template>
	<view class="shopPage">

		<view class="shopPage-Top" :style="{'background':'url('+imgBaseUrl + vendor.BGIMG+')'}">
			<view class="shopPage-Top-header">
				<view class="left">
					<text class="iconfont icon-zuojiantou" @tap="backPage"></text>
				</view>
				<view class="right">
					<view>
						<text class="iconfont icon-xingxing" :style="{ color: status ? '#f00' : '' }" @tap="addShop"></text>
					</view>
					<view>
						<text class="iconfont icon-lingdang-xianxing" @tap="goNews"></text>
					</view>
					<view v-if="false">
						<text class="iconfont icon-fenxiang" @tap="maskState=true"></text>
					</view>
				</view>
			</view>
		</view>
		<!-- 标题 -->
		<view class="shopPage-shopTitle">
			<view class="shopPage-shopTitle-top">
				<view class="img">
					<image :src="imgBaseUrl + vendor.FACEICON" mode="aspectFit" />
				</view>
				<view class="title">
					<text>{{vendor.SHOP_NAME}}</text>
					<view>
						联系电话：{{vendor.PHONE}}
						<image style="marginLeft: 10rpx;" src="/static/images/phone.jpg" mode="aspectFit" @tap="callPhone" />
						<image style="marginLeft: 10rpx;" src="/static/images/weixin.jpg" mode="aspectFit" @tap="weixinMaskHide=false" />
					</view>
				</view>
			</view>
			<view class="shopPage-shopTitle-content">
				<view class="address">
					地址：{{(vendor.CITY || '')+ (vendor.FULLADD || '')}}
					<text class="iconfont icon-yiliaohangyedeICON-" @tap="goMap"></text>
				</view>

				<view class="tips">
					<text class="notice" :style="{height: open ? '140rpx': ''}">公告：{{vendor.NOTICE}}</text>
					<view style="text-align: right; padding-right: 30rpx;" @click="getMoreInfo" v-if="!open">查看更多></view>
					<view style="text-align: right; padding-right: 30rpx;" @click="getClose" v-else>收起</view>
				</view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="shopPage-content">
			<!-- 左侧 -->
			<view class="shopPage-content-left">
				<scroll-view scroll-y="true" :style="{ 'height':scrollHeight }">
					<view v-for="(item,index) in mainArray" :key="index" :class="{'leftActive':index==leftIndex}" :data-index="index"
					 @tap="leftTap">
						<text class="iconfont" :class="item.icon" :style="{'color': item.color}"></text>
						{{item.title}}
					</view>
				</scroll-view>
			</view>
			<!-- 右侧 -->
			<view class="shopPage-content-right">
				<scroll-view scroll-y="true" :style="{ 'height':scrollHeight }" @scroll="mainScroll" :scroll-into-view="scrollInto"
				 scroll-with-animation="true" @touchstart="mainTouch" id="scroll-el">
					<view v-for="(item,index) in mainArray" :key="index" id="rightArr">
						<view class="shopPage-content-right-title" :id="'item-'+index">
							<view>{{item.title}}</view>
						</view>
						<view class="shopPage-content-right-item" v-for="(item1,index1) in item.list" :key="index1">
							<view class="left" @tap="goDetails(item1.goodsId)">
								<image :src="imgBaseUrl + item1.img" mode="aspectFit" />

							</view>
							<view class="right">
								<text class="title" @tap="goDetails(item1.goodsId)">{{item1.shopName}}</text>
								<view class="text" @tap="goDetails(item1.goodsId)">
									<text>月售{{item1.monthlySales}}</text>
									<text>好评率{{ (item1.score * 100).toFixed(2)}}%</text>
								</view>
								<view class="addGoods">
									<view @tap="goDetails(item1.goodsId)" class="addGoods-left">
										¥
										<text>{{item1.price}}</text>
									</view>
									<view class="addGoods-right">
										<text v-if="item1.num" @tap="changeNum(item1.goodsId, -1, item.title)" class="text">-</text>
										<text v-if="item1.num">{{item1.num}}</text>
										<text @tap="changeNum(item1.goodsId, 1, item.title)" class="text">+</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 购物车 -->
		<view class="shopPage-footer">
			<view class="shopPage-footer-left" @tap="hideCartMask=!hideCartMask">
				<view class="icon">
					<view class>
						<text class="iconfont icon-gouwucheman"></text>
					</view>
				</view>
				<view class="text" v-if="titleAll">共{{goodNum}}件商品总计 ￥{{titleAll}}</view>
				<view class="text" v-if="!titleAll">未选购商品</view>
			</view>
			<view class="shopPage-footer-right add-card" @tap="addToCard">加入购物车</view>
			<view class="shopPage-footer-right" @tap="goSettlement">去结算</view>
		</view>
		<!-- 购物车蒙层 -->
		<view class="cartMask" :class="hideCartMask?'hideCartMask':''">
			<view class="cartMask-top" @tap="hideCartMask=true"></view>
			<view class="cartMask-content">
				<view class="cartMask-content-top">
					<view class="left">已选商品</view>
					<view class="right" @tap="clearCart">
						<text class="iconfont icon-qingkongshanchu"></text>清空
					</view>
				</view>
				<view class="cartMask-content-item">
					<!-- <view v-for="(item,index) in addCartShow" :key="index"> -->
					<view class="item" v-for="(item1,index1) in addCartShow" :key="index1">
						<view class="item-left">{{item1.shopName}}</view>
						<view class="item-right">
							<view class="item-right-price">
								￥
								<text>{{item1.price}}</text>
							</view>
							<view class="item-right-num">
								<text class="iconfont icon-jian1" v-if="item1.num > 1" @tap="changeNum(item1.goodsId, -1,item1.title)"></text>
								{{item1.num}}
								<text class="iconfont icon-jia1" @tap="changeNum(item1.goodsId, 1,item1.title)"></text>
							</view>
						</view>
					</view>
					<!-- </view> -->
				</view>


			</view>
		</view>
		<!-- 添加微信 -->
		<view class="weixinMask" :class="weixinMaskHide?'weixinMaskHide':''">
			<view class="weixinMask-content">
				<view class="title">
					添加客服微信
					<text class="iconfont icon-quxiao" @tap="weixinMaskHide=true"></text>
				</view>



				<view class="one">
					<text>步骤</text>
				</view>
				<view class="text">
					<view class>复制微信号，添加客服为好友</view>
					<view class>微信号：{{vendor.WX}}</view>
				</view>
				<view class="copy" @tap="copy">复制微信号</view>


				<view class="btn">
					<!-- <text @tap="addWeiXin">打开微信</text> -->

					<text @tap="weixinMaskHide=true" class="close">取消</text>
				</view>

				<!-- #ifdef H5 -->
				<view class="h5wx">
					<text class="iconfont icon-shanchu" @tap="weixinMaskHide=true"></text>
					<image :src="imgBaseUrl + vendor.WXQRCODE" mode="aspectFit" />
					<view class="h5tips">
						<text>长按识别图中二维码</text>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</view>
		<!-- 分享提示蒙层 -->
		<view class="mask" :class="maskState?'':'maskShow'">
			<view class="mask-top" @tap="maskState=false"></view>
			<view class="mask-content">
				<view class="mask-content-cancel">
					<text class="iconfont icon-shanchu" @tap="maskState=false"></text>
				</view>
				<view class="mask-content-title">
					——
					<text>分享到</text>——
				</view>
				<view class="mask-content-item">
					<view class="weixin" @tap="share(1)">
						<view class="iconfont icon-weixin"></view>
						<text>微信</text>
					</view>
					<view class="pengyouquan" @tap="share(2)">
						<view>
							<image src="/static/images/pengyouquan.png" mode="aspectFit" />
						</view>
						<text>朋友圈</text>
					</view>
					<view class="weibo" @tap="share(3)">
						<view>
							<text class="iconfont icon-weibo"></text>
						</view>
						<text>微博</text>
					</view>
					<view class="qq" @tap="share(4)">
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
	import mixin from '@/mixin/mixin.js'
	import share from '@/mixin/share.js'
	import {
		SHARE_CONFIG
	} from '@/common/commonConfig.js'
	// #ifdef H5
	// 复制
	import h5Copy from "@/components/junyi-h5-copy/junyi-h5-copy.js";
	// #endif
	import {
		shopList,
		collectionShop,
		getMoreShopInfo,
		setCarts,
		addCarts,
		imgBaseUrl
	} from "@/common/apis.js";
	export default {
		name: 'ShopPage',
		mixins: [mixin, share],
		data() {
			return {
				computedListData: [],
				imgBaseUrl: imgBaseUrl,
				scrollHeight: "100%",
				vendor: {},
				mainArray: [],
				leftIndex: 0,
				scrollInto: "",
				topArr: [],
				isMainScroll: false,
				rightTopArr: [],
				shopArr: [],
				hideCartMask: true,
				weixinMaskHide: true,
				maskState: false,
				LONGITUDE: "",
				LATITUDE: "",
				USERINFO_ID: "",
				shopId: "",
				open: false,
				status: false
			};
		},
		onLoad(e) {
			this.shareH5Mixin();

			uni.showLoading({ title: '加载中', mask: true })
			// 获取店铺id
			this.shopId = e.shopId;
			uni.getSystemInfo({
				success: res => {
					/* 设置当前滚动容器的高，若非窗口的告诉，请自行修改 */
					this.scrollHeight = `${res.windowHeight * 0.62}px`;
				}
			});
			// 获取商家信息
			shopList({ SHOP_ID: e.shopId }).then(res => {
				this.vendor = res.returnMsg.vendor;
				this.status = res.returnMsg.isCollection == 'Y'
				this.LONGITUDE = res.returnMsg.vendor.LONGITUDE;
				this.LATITUDE = res.returnMsg.vendor.LATITUDE;
				res.returnMsg.list.map(item => {
					item.list.map(item1 => {
						item1.num = 0;
					});
				});
				this.mainArray = res.returnMsg.list;
				this.computedList(res.returnMsg.list)
			}).finally(() => uni.hideLoading())
			// 获取userid
			uni.getStorage({
				key: "USERINFO_ID",
				success: res => {
					this.USERINFO_ID = res.data;
				}
			});
		},
		components: {
			// #ifdef H5
			h5Copy
			// #endif
		},
		
		methods: {
			mergeList() {
				
			},
			// 获取列表
			computedList(res) {
				let mainArr = JSON.parse(JSON.stringify(res));
				var arr = [];
				mainArr.map((item, index) => {
					item.list.map((item1, index1) => {
						arr.push({ title: item.title, list: item.list });
					});
				});
				
				let list = arr.map(item => item.list);
				let arrs = [].concat(...list);
				let obj = {};
				let newSetData = arrs.reduce((cur,next) => {
				    obj[next.goodsId] ? "" : obj[next.goodsId] = true && cur.push(next);
				    return cur;
				},[])
				this.computedListData = newSetData
				return newSetData
			},
			// 添加到购物车
			addToCard() {
				let list = this.addCartShow.map(ele => {
					return {
						GOODS_ID: ele.goodsId,
						COUNTS: ele.num,
						USERINFO_ID: uni.getStorageSync('USERINFO_ID')
					}
				}).forEach(send => {
					this.saveCard(send)
				})
			},
			// 发送请求添加到购物车
			saveCard(data) {
				addCarts(data).then(({ msgType }) => {
					if (msgType == 0) {
						uni.showToast({ title: '添加购物车成功' })
					} else {
						uni.showToast({ title: '添加购物车失败' })
					}
				})
			},
			getMoreInfo() {
				this.open = true
			},
			getClose() {
				this.open = false
			},
			backPage() {
				// #ifdef H5
				let canBack = true;
				const pages = getCurrentPages();
				// 有可返回的页面则直接返回，uni.navigateBack默认返回失败之后会自动刷新页面 ，无法继续返回
				if (pages.length > 1) {
					uni.navigateBack(1);
					return;
				}
				// vue router 可以返回uni.navigateBack失败的页面 但是会重新加载
				let a = this.$router.go(-1);
				// router.go失败之后则重定向到首页
				if (a == undefined) {
					uni.reLaunch({
						url: "/pages/index/index"
					});
				}
				return;
				// #endif
				uni.navigateBack(1);
			},
			// 前往详情页
			goDetails(goodsId) {
				uni.navigateTo({
					url: "../goodsDetails/goodsDetails?shopId=" + goodsId
				});
			},
			// 点击切换左侧状态
			leftTap(e) {
				let index = e.currentTarget.dataset.index;
				this.isMainScroll = false;
				this.leftIndex = Number(index);
				this.scrollInto = `item-${index}`;
			},
			/* 主区域滚动监听 */
			mainScroll(e) {
				if (!this.isMainScroll) {
					return;
				}
				let top = e.detail.scrollTop;
				let index = -1;

				if (top >= this.topArr[this.topArr.length - 1]) {
					index = this.topArr.length - 1;
				} else {
					index = this.topArr.findIndex((item, index) => {
						return this.topArr[index + 1] >= top;
					});
				}
				this.leftIndex = index < 0 ? 0 : index;
				// 右连左
				for (var i = 0; i < this.rightTopArr.length; i++) {
					// #ifdef H5
					if (top > this.rightTopArr[i] && top < this.rightTopArr[i + 1]) {
						this.leftIndex = i;
					}
					// #endif
					if (top > this.rightTopArr[i] && top < this.rightTopArr[i + 1]) {
						this.leftIndex = i;
					}
				}
			},
			/* 主区域触摸 */
			mainTouch() {
				this.isMainScroll = true;
			},
			//获取距离顶部的高度
			getScrollTop(selector) {
				return new Promise((resolve, reject) => {
					let query = uni.createSelectorQuery().in(this);
					query
						.select(selector + "")
						.boundingClientRect(data => {
							resolve(data.top);
						})
						.exec();
				});
			},
			// 获取右侧高度数组
			async getTopArr() {
				/* Promise 对象数组 */
				let p_arr = [];
				/* 遍历数据，创建相应的 Promise 数组数据 */
				for (let i = 0; i < this.mainArray.length; i++) {
					const resu = await this.getScrollTop(`#item-${i}`);
					p_arr.push(resu);
				}
				this.rightTopArr = p_arr;
				/* 主区域滚动容器的顶部距离 */
				this.getScrollTop("#scroll-el").then(res => {
					let top = res;
					// #ifdef H5
					top += 43; //因固定提示块的需求，H5的默认标题栏是44px
					// #endif
					/* 所有节点信息返回后调用该方法 */
					Promise.all(p_arr).then(data => {
						this.tipsTop = `${data}px`;
						this.topArr = data;
					});
				});
			},
			// 拨打电话
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: this.vendor.PHONE 
				});
			},
			// 打开微信
			addWeiXin() {
				
			},
			// 复制微信号
			copy() {
				// #ifdef H5
				let content = this.vendor.WX; // 复制内容，必须字符串，数字需要转换为字符串
				const result = h5Copy(content);
				if (result) {
					uni.showToast({
						title: '复制成功',
						icon: 'success'
					})

				} else {
					uni.showToast({
						title: "复制失败",
						icon: "none"
					});
				}
				// #endif
			},
			// 前往地图
			goMap() {
				let {
					LONGITUDE,
					LATITUDE,
					CELLPHONE,
					CITY,
					AREA,
					FULLADD
				} = this.vendor
				let obj = {
					LONGITUDE,
					LATITUDE,
					CELLPHONE,
					CITY,
					AREA,
					FULLADD
				};
				uni.navigateTo({
					url: "../address/address?vendor=" + JSON.stringify(obj)
				});
			},
			// 改变数量
			changeNum(id, num, title) {
				// 改变数量
				if (title) {
					this.mainArray.map(item => {
						if (item.title == title) {
							item.list.map(item1 => {
								if (item1.goodsId == id) {

									if (num == -1 && item1.num == 0) {
										return false;
									}
									item1.num += num;

								}
							});
						}
					});
				} else {
					this.mainArray.map(item => {
						item.list.map(item1 => {
							if (item1.goodsId == id) {
								item1.num += num;
							}
						});
					});
				}
				
				for(let i = 0; i <= this.computedListData.length; i++){
					if(this.computedListData[i].goodsId == id){
						this.computedListData[i].num += num;
						return false
					}
				}
			},
			// 去结算
			goSettlement() {
				var arr = [];
				if (!parseFloat(this.titleAll)) {
					return uni.showToast({
						title: "请先选购商品",
						duration: 2000,
						icon: "none"
					});
				}
								
				let stringifyArr = JSON.stringify(this.addCartShow)
				uni.navigateTo({
					url: "../settlement/settlement?item=" + stringifyArr + "&allNum=" + this.titleAll + "&shopId=" + this.shopId +
						'&page=shopPage' + '&phone=' + this.vendor.PHONE
				})
				

			},
			// 清空购物车
			clearCart() {
				// 改变数量
				this.mainArray.map(item => {
					item.list.map(item1 => {
						item1.num = 0;
					});
				});
				this.hideCartMask = true;
				
				this.computedListData.forEach(ele => ele.num =0);
			},
			// 进入消息
			goNews() {
				uni.navigateTo({
					url: "../../pages/news/news"
				});
			},
			// 收藏店铺
			addShop() {
				collectionShop({
					USERINFO_ID: this.USERINFO_ID,
					SHOP_ID: this.shopId
				}).then(res => {
					if (res.returnMsg.isCollection == 'Y') {
						uni.showToast({
							title: "收藏成功!",
							duration: 2000,
							mask: true
						});
						this.status = true
					} else {
						uni.showToast({
							title: "您已收藏!",
							icon: "none",
							duration: 2000,
							mask: true
						});
					}
				});
			},
			
			// 分享功能开始
			share(index) {
				
				this.shareH5Mixin(index)
			}
		},
		mounted() {
			this.getTopArr();
		},
		computed: {
			// 筛选数量已选
			selectArr() {
				var arr = [];
				// 筛选已选
				this.mainArray.map((item, index) => {
					item.list.map((item1, index1) => {
						if (item1.num > 0) {
							arr.push({
								title: item.title,
								list: item.list
							});
						}
					});
				});
				return arr;
			},
			
			addCartShow() {
				let list = this.computedListData.filter(item => item.num);
				return list;
			},
			// 计算总价
			titleAll() {
				let all = 0;
				this.computedListData.forEach(item => {
					all += item.num * item.price;
				})
				return all.toFixed(2);
			},
			// 计算数量
			goodNum() {
				let all = 0;
				this.computedListData.forEach(item => {
					all += item.num * 1;
				})
				return all;
			}
		}
	};
</script>

<style lang="less">
	.shopPage {
		color: #333;
		position: relative;
		height: 100%;

		.shopPage-Top {
			height: 250rpx;
			width: 100%;
			// background: url(../../static/images/demo03.webp);
			background-size: 100%;
			/* #ifdef APP-PLUS */
			padding-top: 40rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			padding: 40rpx;

			/* #endif */
			.shopPage-Top-header {
				height: 100rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #fff;

				.left {
					margin-left: 30rpx;
				}

				.right {
					display: flex;

					>view {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						background: rgba(1, 1, 1, 0.3);
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20rpx;
					}
				}

				.iconfont {
					font-size: 32rpx;
				}
			}
		}

		.shopPage-shopTitle {
			min-height: 200rpx;
			height: auto;
			width: 90%;
			margin: -120rpx auto 0;
			border-radius: 20rpx;
			background: #fff;
			box-shadow: 0 10rpx 20rpx #999;
			padding: 20rpx;

			.shopPage-shopTitle-top {
				display: flex;

				.img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 30rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.title {
					text {
						font-size: 36rpx;
						font-weight: bold;
					}

					view {
						font-size: 26rpx;
						color: #666;
						margin-top: 8rpx;
						display: flex;
						align-items: center;

						image {
							width: 40rpx;
							height: 40rpx;
							margin-left: 20rpx;
						}
					}
				}
			}

			.shopPage-shopTitle-content {
				color: #666;
				font-size: 24rpx;

				.address {
					margin-top: 15rpx;

					text {
						color: #ff4a1a;
						margin-left: 15rpx;
					}
				}

				.tips {
					margin-top: 15rpx;
					display: flex;
					flex-direction: column;
					justify-content: start;
					// justify-content: space-between;

					.notice {
						box-sizing: border-box;

						// overflow: scroll;
						overflow-y: auto;
					}

					text:last-child {
						font-size: 20rpx;
						color: #999;
					}
				}
			}
		}

		.shopPage-content {
			display: flex;
			margin-top: 30rpx;
			height: 66%;
			padding-bottom: 100rpx;

			.shopPage-content-left {
				view {
					width: 160rpx;
					height: 100rpx;
					background: #f8f6f9;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;
					font-weight: bold;

					text {
						margin-right: 10rpx;
					}
				}

				.leftActive {
					background: #fff;
				}
			}

			.shopPage-content-right {
				flex: 1;
				padding-left: 20rpx;
				padding-bottom: 50rpx;

				.shopPage-content-right-title {
					font-size: 32rpx;
					margin-top: 20rpx;
					color: #ff5a32;
				}

				.shopPage-content-right-item:not(:first-child) {
					margin-top: 40rpx;
				}

				.shopPage-content-right-item {
					display: flex;

					.left {
						width: 180rpx;
						height: 152rpx;
						border-radius: 20rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.right {
						padding: 0 20rpx;
						flex: 1;
						margin-top: -10rpx;

						.title {
							font-size: 30rpx;
							font-weight: bold;
						}

						.text {
							margin: 10rpx 0 20rpx 0;
							font-size: 24rpx;
							color: #666;

							text:last-child {
								margin-left: 30rpx;
							}
						}

						.addGoods {
							display: flex;
							justify-content: space-between;
							align-items: center;

							.addGoods-left {
								color: #ff5a32;
								font-size: 28rpx;

								text {
									font-size: 40rpx;
								}
							}

							.addGoods-right {
								display: flex;
								align-items: center;
								justify-content: center;

								text {
									color: #000;
								}

								.text {
									background: #ff5a32;
									width: 48rpx;
									height: 48rpx;
									border-radius: 50%;
									color: #fff;
									font-size: 60rpx;
									line-height: 38rpx;
									text-align: center;
								}

								text:first-child {
									margin-right: 20rpx;
									background: 0;
									color: #ff5a32;
									border: 1px solid #ff5a32;
								}

								text:last-child {
									margin-left: 20rpx;
								}
							}
						}
					}
				}
			}
		}

		.shopPage-footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			width: 100%;
			position: fixed;
			bottom: 0;
			background: #fff;
			box-shadow: 20rpx 0 20rpx #999;
			z-index: 9999;

			.shopPage-footer-left {
				display: flex;
				margin-left: 50rpx;

				.icon {
					width: 105rpx;
					height: 105rpx;
					border-radius: 50%;
					background: #fee6e3;
					margin-top: -30rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					view {
						width: 90rpx;
						height: 90rpx;
						background: linear-gradient(117deg,
							rgba(255, 90, 43, 1) 0%,
							rgba(255, 89, 52, 1) 36%,
							rgba(255, 156, 31, 1) 100%);
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;

						text {
							color: #fff;
							font-size: 50rpx;
						}
					}
				}

				.text {
					font-size: 28rpx;
					color: #666;
					display: flex;
					align-items: center;
					margin-left: 20rpx;
				}
			}

			.shopPage-footer-right {
				width: 219rpx;
				height: 100%;
				background: #ff6b37;
				color: #fff;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.add-card {
				background: #ff8777;
			}
		}

		.hideCartMask {
			display: none;
		}

		// 购物车蒙层
		.cartMask {
			position: fixed;
			width: 100%;
			height: 100%;
			background: rgba(1, 1, 1, 0.5);
			z-index: 999;
			font-size: 30rpx;
			top: 0;

			.cartMask-top {
				min-height: 80%;
				width: 100%;
				position: absolute;
				top: 0;
				z-index: 900;
			}

			.cartMask-content {
				max-height: 50%;
				overflow-y: auto;
				color: #333;
				position: absolute;
				bottom: 100rpx;
				width: 100%;
				z-index: 901;

				.cartMask-content-top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20rpx 30rpx;
					background: #eceff1;
					color: #666;

					.iconfont {
						margin-right: 10rpx;
					}
				}

				.cartMask-content-item {
					.item {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 0 30rpx;
						height: 100rpx;
						background: #fff;
						border-bottom: 1px solid #eee;

						.item-left {}

						.item-right {
							display: flex;
							align-items: center;

							.item-right-price {
								color: #ff5339;
								font-size: 20rpx;
								font-weight: bold;
								margin-right: 50rpx;

								text {
									font-size: 30rpx;
								}
							}

							.item-right-num {
								display: flex;
								align-items: center;

								text {
									color: #ff5532;
									font-size: 46rpx;
								}

								text:first-child {
									margin-right: 20rpx;
								}

								text:last-child {
									margin-left: 20rpx;
								}
							}
						}
					}
				}


			}
		}

		// 添加微信
		.weixinMask {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 99;
			background: rgba(1, 1, 1, 0.5);

			.weixinMask-content {
				background: #fff;
				border-radius: 20rpx;
				width: 65%;
				height: 460rpx;
				position: absolute;
				overflow: hidden;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				margin: auto;
				color: #999;
				font-size: 26rpx;
				padding: 0 30rpx;

				.title {
					text-align: center;
					font-size: 32rpx;
					color: #4e4e4e;
					padding: 30rpx 0 15rpx 0;

					text {
						position: absolute;
						right: 20rpx;
						top: 20rpx;
						font-size: 50rpx;
					}
				}


				/* app start */

				.one {
					border-top: 1px solid #f2f2f2;
					margin-top: 40rpx;
					display: flex;

					text {
						width: 140rpx;
						background: #fff;
						margin: -20rpx auto 0;
						text-align: center;
					}
				}

				.tips {
					text-align: center;
					margin-top: 40rpx;

					view {
						margin-bottom: 10rpx;
					}

				}

				.img {
					width: 240rpx;
					height: 240rpx;
					overflow: hidden;
					margin: auto;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					text-align: center;
					margin-top: 20rpx;

					view {
						margin-bottom: 10rpx;
					}
				}

				.copy {
					text-align: center;
					color: #4081d6;
					margin-top: 10rpx;
				}

				.btn {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					display: flex;

					text {
						width: 50%;
						text-align: center;
						padding: 20rpx 0;
						background: #ccc;
						color: #fff;
						font-size: 30rpx;
					}

					text:first-child {
						background: #4cd964;
					}

					/* #ifdef APP-PLUS */
					.close {
						width: 50%;
					}

					/* #endif */

					/* #ifdef H5 */
					.close {
						width: 100%;
					}

					/* #endif */
				}

				/* app end */
				/* #ifdef H5 */
				.h5wx {
					text-align: center;

					image {
						width: 300rpx;
						height: 300rpx;
					}

					.icon-shanchu {
						position: absolute;
						font-size: 50rpx;
						right: 0;
						top: 0;
					}
				}

				/* #endif */
			}
		}

		.weixinMaskHide {
			display: none;
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
					color: #d8d8d8;

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
						background: #ff9206;
					}

					.qq view {
						background: #4dcffc;
					}
				}
			}
		}
	}
</style>
