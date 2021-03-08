<template>
	<view class="myOrder">
		<!-- header -->
		<commonHeader headerTitl="我的订单" xingHide=true lingHide=true></commonHeader>
		<!-- tab切换 -->
		<view class="myOrder-title">
			<text :class="active===1?'active':''" @tap="changeTitle(1)">已付款</text>
			<text :class="active===0?'active':''" @tap="changeTitle(0)">未付款</text>
			<text :class="active===2?'active':''" @tap="changeTitle(2)">退款/售后</text>
			<text :class="active===3?'active':''" @tap="changeTitle(3)">退款成功</text>
			<text :class="active===4?'active':''" @tap="changeTitle(4)">已完成</text>
		</view>
		<view class="myOrder-content">
			<!-- 已付款 -->
			<view class="myOrder-content-complete commonStyle" :class="active===1?'show':''">
				<view class="item" v-for="item in orderList" :key="item.id">
					<view v-for="(shopItem,indey) in item.shop" :key="indey">
						<view class="item-title">
							<view class="left">
								<image :src="imgBaseUrl + shopItem.FACEICON" mode=""></image>
								<text>{{shopItem.SHOP_NAME}}</text>
							</view>
							<view class="right">
								{{shopItem.PHONE}}
							</view>
						</view>
						<view v-if="item.address!='线下支付'" @click="again(shopItem.SHOP_ID)" class="anotherList">再来一单</view>
						<view class="item-content">
							<view v-for="(good,indez) in shopItem.goodes" :key="indez" style="width:100%; display: flex;justify-content: space-between; margin-bottom: 15rpx;">
								<view class="left">
									<image :src="imgBaseUrl + good.IMG" mode=""  @click.stop="toShop(good.SHOP_ID)"></image>
									<view>
										<text class="left-title">
											商品名称：{{good.GOODSNAME}}
										</text>

										<view class="left-price">
											单价：￥{{good.PRICE}}
										</view>
										<view v-if="item.take_status == 'Y'" @click="evaluation(item.ORDERSUMMARY_ID, good.GOODS_ID)" class="evaluation">立即评价</view>
									</view>
								</view>
								<view class="right">
									X{{good.COUTNS}}
								</view>
							</view>
						</view>

					</view>


					<!-- PAYTYPEY  支付方式  PAYTYPE  收入支出类型 0收入 1支出   -->
					<view class="item-pay">
						付款方式：<text>{{item.PAYTYPEY==0&&'微信'||item.PAYTYPEY==1&&'支付宝'||item.PAYTYPEY==3&&'银行卡'||item.PAYTYPEY==2&&'余额支付'}}</text>
					</view>

					<view class="item-pay">
						下单时间：{{ item.CREATETIME }}
					</view>
					<view class="item-pay" v-if="item.REMARKS">
						备注：{{ item.REMARKS }}
					</view>
					<view class="item-pay border-bottom">
						收获地址：{{ item.ADDRESS || '' }}
					</view>


					<view class="item-total" style="align-items: center;">

						<view style="font-size: 24rpx;">订单编号：{{item.ORDERNO}}</view>
						<view style="font-size: 28rpx;">
							共计 <text style="color: red;margin-left: 0;"> {{item.number}} </text>
							<text>合计 ￥<text>{{item.PAYABLE}}</text></text>
						</view>
					</view>
					<view class="item-btn">
						<!-- n 待收货 k 代发货 y 也完成 -->
						<text v-if="item.take_status != 'Y'" @click="goOrderDetail(item.ORDERSUMMARY_ID)" style="margin-right: 15rpx;">申请退款</text>
						<text v-if="item.take_status == 'N'" @click="subOrder(item.ORDERSUMMARY_ID)" style="margin-right: 15rpx;">确认收货</text>
						
						
					</view>
				</view>
			</view>
			<!-- 未付款 -->
			<view class="myOrder-content-uncomplete commonStyle" :class="active===0?'show':''">
				<view class="item" v-for="item in orderList" :key="item.id">
					<view v-for="(shopItem,indey) in item.shop" :key="indey">
						<view class="item-title">
							<view class="left">
								<image :src="imgBaseUrl + shopItem.FACEICON" mode=""></image>
								<text>{{shopItem.SHOP_NAME}}</text>
							</view>
							<view class="right">
								{{shopItem.PHONE}}
							</view>
						</view>
						<view class="item-content">
							<view v-for="(good,indez) in shopItem.goodes" :key="indez" @click="toShop(good.SHOP_ID)" style="width:100%;display: flex;justify-content: space-between;margin-bottom: 30rpx;">
								<view class="left">
									<image :src="imgBaseUrl + good.IMG" mode=""></image>
									<view>
										<text class="left-title">
											商品名称：{{good.GOODSNAME}}
										</text>

										<view class="left-price">
											单价：￥{{good.PRICE}}
										</view>
									</view>
								</view>
								<view class="right">
									X{{good.COUTNS}}
								</view>
							</view>
						</view>

					</view>
					<view class="item-pay">
						下单时间：{{ item.CREATETIME }}
					</view>
					<view class="item-pay" v-if="item.REMARKS">
						备注：{{ item.REMARKS || '' }}
					</view>
					<view class="item-pay border-bottom">
						收获地址：{{ item.ADDRESS || '' }}
					</view>

					<view class="item-total" style="align-items: center;">

						<view style="font-size: 24rpx;">订单编号：{{item.ORDERNO}}</view>
						<view style="font-size: 28rpx;">
							共计 <text style="color: red;margin-left: 0;"> {{item.number}} </text>
							<text>合计 ￥<text>{{item.PAYABLE}}</text></text>
						</view>
					</view>
					<view class="item-btn" style="display: flex;justify-content: flex-end;align-items: center;">

						<view style="font-size: 24rpx;"></view>
						<text style="margin-right: 30rpx;" @click="orderDel(item.ORDERSUMMARY_ID)" class="del">删除</text>
						<text @click="toPay(item)">待付款</text>
					</view>
				</view>
			</view>
			<!-- 退款售后 -->
			<view class="myOrder-content-refund commonStyle" :class="active===2 || active===3 || active===4?'show':''">
				<view class="item" v-for="item in orderList" :key="item.id">
					<view v-for="(shopItem,indey) in item.shop" :key="indey">
						<view class="item-title">
							<view class="left">
								<image :src="imgBaseUrl + shopItem.FACEICON" mode=""></image>
								<text>{{shopItem.SHOP_NAME}}</text>
							</view>
							<view class="right">
								{{shopItem.PHONE}}
							</view>
						</view>
						<view class="item-content">
							<view v-for="(good,indez) in shopItem.goodes" 
							:key="indez" style="width:100%;display: flex;justify-content: space-between;margin-bottom: 15rpx;">
								<view class="left">
									<image :src="imgBaseUrl + good.IMG" mode="" @click="toShop(good.SHOP_ID)"></image>
									<view>
										<text class="left-title">
											商品名称：{{good.GOODSNAME}}
										</text>

										<view class="left-price">
											单价：￥{{good.PRICE}}
										</view>
										<view v-if="item.take_status == 'Y'" @click="evaluation(item.ORDERSUMMARY_ID, good.GOODS_ID)" class="evaluation">立即评价</view>
									</view>
								</view>
								<view class="right">
									X{{good.COUTNS}}
								</view>
							</view>
						</view>

					</view>



					<view class="item-pay">
						付款方式：<text>{{item.PAYTYPEY==0&&'微信'||item.PAYTYPEY==1&&'支付宝'||item.PAYTYPEY==3&&'银行卡'||item.PAYTYPEY==2&&'余额支付'}}</text>
					</view>
					<view class="item-pay">
						下单时间：{{ item.CREATETIME }}
					</view>
					<view class="item-pay" v-if="item.REMARKS">
						备注：{{ item.REMARKS || '' }}
					</view>
					<view class="item-pay border-bottom">
						收获地址：{{ item.ADDRESS || '' }}
					</view>


					<view class="item-total" style="align-items: center;">

						<view style="font-size: 24rpx;">订单编号：{{item.ORDERNO}}</view>
						<view style="font-size: 28rpx;">
							共计 <text style="color: red;margin-left: 0;"> {{item.number}} </text>
							<text>合计 ￥<text>{{item.PAYABLE}}</text></text>
						</view>
					</view>
					<view class="item-btn" v-if="active===2">
						<text @click="again(item.SHOP_ID)" style="margin-right: 15rpx;">进入店铺</text>
						<text @click="cancelRefund(item)">撤销退款</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 暂无提示 -->
		<view class="myOrder-content-tips" v-if="orderList.length == 0" style="textAlign: center;color: #666;paddingTop: 50rpx;">
			暂无订单！
		</view>
		<!-- tabbar -->
		<tabbar></tabbar>

		<view class="input-pwd" v-if="inputPwd">

			<view class="input-warp">
				<view style="padding-top: 30rpx; font-size: 38rpx;">请输入密码</view>
				<input class="input" v-model="tradePass" type="password" />
				<view class="btn" @click="payByBalance">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	import share from '@/mixin/share.js'
	import commonHeader from "@/components/common-header/common-header";
	import tabbar from "@/components/common-tabbar/common-tabbar";

	import {
		myOrder,
		submitOrder,
		orderRepeal,
		alipay,
		wxpay,
		shopBygoodList,
		orderDelete,
		evaluateSelect,
		imgBaseUrl
	} from "@/common/apis.js";
	export default {
		data() {
			// n 待收货 k 代发货 y 也完成
			return {
				imgBaseUrl: imgBaseUrl,
				active: 1,
				orderList: [],
				USERINFO_ID: '',
				inputPwd: false,
				tradePass: '', // 交易密碼
				orderId: '',
			};
		},
		components: {
			commonHeader,
			tabbar
		},
		mixins: [share],
		onLoad() {
			this.otherPage();
		},
		mounted() {
			this.getOrderList(1)
		},
		methods: {
			evaluation(orderId, GOODS_ID) { // ORDERSUMMARY_ID  ORDERSUMMARY_ID
			let obj ={
				GOODS_ID,
				USERINFO_ID: uni.getStorageSync('USERINFO_ID'),
				ORDERSUMMARY_ID: orderId
			}
			evaluateSelect(obj).then(res => {
					console.log(res)
					let EVALUATE_ID = res.returnMsg.evaluate.EVALUATE_ID;
					console.log(EVALUATE_ID)
					uni.navigateTo({
						url: '../evaluate/evaluate?ORDERSUMMARY_ID=' + orderId + '&from=order' + '&goodsId=' + GOODS_ID + '&EVALUATE_ID=' + EVALUATE_ID
					})
			})
				
			},
			orderDel(ORDERSUMMARY_ID) {
				const that = this;
				orderDelete({
					ORDERSUMMARY_ID
				}).then(res => {
					if (res.result == 'success') {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						setTimeout(() => {
							that.changeTitle(0)
						}, 1000)
					} else {
						uni.showToast({
							title: '删除失败',
							icon: 'none'
						})
					}

				})
			},
			// 去店铺
			toShop(shopId) {
				uni.navigateTo({
					url: '../shopPage/shopPage?shopId=' + shopId
				})
			},
			// 去支付
			toPay(item) {
				let goodsInfo = item.shop.map(ele => ele.goodes);
				item.goodsInfo = [...goodsInfo]

				uni.setStorageSync('myOrderPayment', JSON.stringify(item));
				// page == 'myOrder'
				uni.navigateTo({
					url: '../settlement/settlement?page=myOrder'
				})

			},

			pay(index, ACTUALPAY, ORDERSUMMARY_ID) {
				// 0 余额支付   1 微信支付   2 支付宝支付    3 银行卡支付	
				let obj = {
					payAmount: ACTUALPAY,
					orderSummaryId: ORDERSUMMARY_ID
				};
				// 微信支付
				if (index === 1) {
					wxpay(obj).then(res => {
						uni.requestPayment({ // 现在都没进这个
							provider: 'wxpay',
							orderInfo: res.returnMsg,
							success: (res) => {
								uni.showToast({
									title: '支付成功!',
									duration: 2000,
									mask: true
								});
								setTimeout(() => {
									uni.navigateTo({
										url: '../index/index'
									});
								}, 2000);
							},

							fail: (err) => {
								uni.showToast({
									title: '支付失败!',
									icon: 'none',
									duration: 2000,
									mask: true
								});
							}
						});
					});
				}

				// 支付宝支付
				if (index === 2) {
					alipay(obj).then(res1 => {
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: res1.returnMsg,
							// orderInfo: mockOrderInfo.returnMsg,
							success: res => {
								uni.showToast({
									title: '支付成功!',
									duration: 2000,
									mask: true
								});
								setTimeout(() => {
									uni.navigateTo({
										url: '../index/index'
									});
								}, 2000);
							},
							fail: err => {
								uni.showToast({
									title: '支付失败!',
									icon: 'none',
									duration: 2000,
									mask: true
								});
							},
						});
					});
				}

				// 餘額支付

				if (index === 0) {
					this.inputPwd = true
				}


				if (index === 3) {
					uni.showToast({
						title: '暂未开通此功能!',
						duration: 2000,
					})
				}
				// 显示密码输入

			},

			payByBalance() {
				let isEnough = ['0.00', '0', '0.0'].includes(BALANCE);
				let {
					BALANCE
				} = uni.getStorageSync('userInfo');
				if (isEnough) return uni.showToast({
					title: '余额不足',
					icon: 'none'
				})

				if (this.tradePass == '') return uni.showToast({
					title: '请输入支付密码',
					icon: 'none'
				})

				this.inputPwd = false;
				shopBygoodList({
					orderSummaryId: this.orderId,
					tradePass: this.tradePass
				}).then(res => {
					this.tradePass = '';
					this.inputPwd = true
					if (res.returnMsg) {
						if (res.returnMsg.status == '01') {
							uni.showToast({
								title: '交易密码不正确或者未设置交易密码',
								icon: 'none'
							})
						} else if (res.returnMsg.status == '02') {
							uni.showToast({
								title: '余额不足',
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: '支付成功',
								icon: 'none'
							})

							setTimeout(() => {
								uni.navigateTo({
									url: '../index/index'
								});
							}, 2000);
						}
					} else {
						uni.showToast({
							title: '系统错误稍后再试',
							icon: 'none'
						})
					}

				})
			},

			
			changeTitle(index) {
				this.active = index;
				this.getOrderList(index)
			},
			// 申请退款
			goOrderDetail(id) {
				uni.navigateTo({
					url: "../oraderDetails/oraderDetails?orderID=" + id
				})
			},
			// 确认收货
			subOrder(orderId) {
				submitOrder({
					ORDERSUMMARY_ID: orderId
				}).then(res => {
					if (res.returnMsg.status == '00') {
						uni.showToast({
							title: '确认收货成功！'
						})
						this.getOrderList(1)
					} else if (res.returnMsg.status == '01') {
						uni.showToast({
							title: '订单号不存在！'
						})
					} else if (res.returnMsg.status == '03') {
						uni.showToast({
							title: '退款中，不能确认收货！'
						})
					} else {
						uni.showToast({
							title: '确认失败！'
						})
					}
				})
			},
			// 请求订单
			getOrderList(STATE) {
				uni.getStorage({
					key: 'USERINFO_ID',
					success: res => {
						uni.showLoading({
							title: '加载中',
							mask: true
						})
						myOrder({
							STATE,
							USERINFO_ID: res.data
						}).then(res => {
							if (res.returnMsg.status == '00') {
								this.orderList = res.returnMsg.list
							} else {
								uni.showToast({
									title: '数据获取失败!',
									icon: 'none'
								})
							}
						}).catch(err => {
							uni.showToast({
								title: '获取失败！'
							})
						}).finally(() => uni.hideLoading())
					}
				})
			},
			// 再来一单
			again(shopId) {
				uni.navigateTo({
					url: "../shopPage/shopPage?shopId=" + shopId
				})
			},
			cancelRefund(item) {
				orderRepeal({
					ORDERSUMMARY_ID: item.ORDERSUMMARY_ID
				}).then(res => {
					if (res.returnMsg.status == '00') {
						uni.showToast({
							title: '取消退款成功',
							icon: "none"
						})
						this.active = 2
						this.getOrderList(2)
					} else if (res.returnMsg.status == '01') {
						uni.showToast({
							title: '订单号不存在',
							icon: "none"
						})
					} else if (res.returnMsg.status == '02') {
						uni.showToast({
							title: '取消退款失败',
							icon: "none"
						})
					} else {
						uni.showToast({
							title: '取消退款失败',
							icon: "none"
						})
					}

				})
			}
		},

	}
</script>

<style lang="less">
	.anotherList, .evaluation{
		padding: 8rpx 20rpx;
		border: 1px solid #FF6504;
		border-radius: 40rpx;
		color: #FF6504;
		margin-top: 30rpx;
		display: inline-block;
		font-size: 28rpx;
	}
	.evaluation{
		padding: 4rpx 15rpx ;
	}
	
	
	
	.border-bottom {
		border-bottom: 1px solid #e0e0e0;
	}

	.input-pwd {
		position: fixed;
		z-index: 999;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .5);

		.input-warp {
			background: #fff;
			margin-top: 500rpx;
			margin-left: 10%;
			border-radius: 30rpx;
			height: 500rpx;
			width: 80%;
			text-align: center;

			input {
				border: 1rpx solid #000;
				border-radius: 10rpx;
				height: 90rpx;
				width: 80%;
				margin-left: 10%;
				margin-top: 100rpx;
			}

			.btn {
				margin-top: 30rpx;
			}
		}
	}

	.myOrder-content-uncomplete,
	.myOrder-content-complete,
	.myOrder-content-refund {
		.item-content {
			display: block !important;
			padding: 15px 0 0 0 !important;
		}
	}

	.myOrder {
		min-height: 100%;
		background: #f6f7f8;
		padding: 210rpx 0;
		color: #333;
		/* #ifdef APP-PLUS */
		padding-top: 250rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 250rpx;

		/* #endif */
		.myOrder-title {
			font-size: 32rpx;
			display: flex;
			justify-content: space-around;
			background: #fff;
			border-bottom: 1px solid #e0e0e0;
			position: fixed;
			top: 90rpx;
			/* #ifdef APP-PLUS */
			top: 130rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			top: 130rpx;
			/* #endif */
			width: 100%;
			z-index: 9999;

			text {
				padding: 35rpx 0;
			}

			.active {
				border-bottom: 8rpx solid #FF5904;
				font-weight: bold;
			}
		}

		.myOrder-content {
			.show {
				display: block;
			}

			>view {
				display: none;

			}

			.commonStyle {
				width: 95%;
				margin: auto;
				font-size: 30rpx;

				.item {
					background: #fff;
					margin-top: 20rpx;
					border-radius: 20rpx;
					padding: 0 20rpx 30rpx 20rpx;

					.item-title {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 30rpx 0;
						border-bottom: 1px solid #e0e0e0;

						.left {
							font-size: 32rpx;
							font-weight: bold;
							display: flex;
							align-items: center;

							image {
								width: 50rpx;
								height: 50rpx;
								border-radius: 50%;
								margin-right: 20rpx;
							}
						}

						.right {
							font-size: 38rpx;
							color: #999;
						}
					}

					.item-content {
						display: flex;
						padding: 30rpx 0;
						justify-content: space-between;

						.left {
							display: flex;

							image {
								width: 180rpx;
								height: 152rpx;
								border-radius: 20rpx;
								margin-right: 20rpx;
							}

							>view {
								.left-title {
									font-size: 28rpx;
								}

								view {
									font-size: 28rpx;
									color: #666;
									margin-top: 10rpx;
								}
							}
						}

						.right {
							font-size: 28rpx;
							color: #666;
						}
					}

					.item-code,
					.item-pay {
						padding: 14rpx 0;

						text {
							color: #666;
							margin-left: 30rpx;
						}
					}

					.item-pay {
						font-size: 28rpx;
					}


					.item-total {
						display: flex;
						justify-content: space-between;
						padding: 30rpx 0;
						border-top: 1rpx solid #e0e0e0;

						view {
							>text {
								color: #666;
								margin-left: 40rpx;

								text {
									color: #FF5904;
								}
							}
						}
					}

					.item-btn {
						display: flex;
						justify-content: flex-end;

						text {
							padding: 8rpx 20rpx;
							border: 1px solid #FF6504;
							border-radius: 40rpx;
							color: #FF6504;
							// margin-right: 30rpx;
						}

						text:last-child {
							background: linear-gradient(231deg, rgba(255, 178, 10, 1) 0%, rgba(255, 127, 4, 1) 60%, rgba(255, 89, 4, 1) 100%);
							color: #fff;
							border: 0;
							margin-right: 10rpx;
						}
					}
				}
			}
		}
	}
</style>
