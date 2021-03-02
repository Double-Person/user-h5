<template>
	<view class="scanPay">
		<!-- header -->
		<commonHeader headerTitl="付款" xingHide="true" lingHide="true" fenxiangHide="true"></commonHeader>
		<!-- 内容开始 -->
		<view class="scanPay-content">
			<view class="title">付款给{{shopName}}</view>
			<view class="money">
				<view class="money-text">
					金额
					<view class="money-text-input">
						<text>￥</text>
						<input v-model="money" type="number" @input="copeWith = money" :disabled="disabled" placeholder="输入金额"
						 placeholder-style="fontSize:28rpx" />
					</view>
				</view>
				<view class="money-text-yhq" @tap="setCouponHide=false">
					<text>优惠券:</text>
					<view class>
						<text>{{yhqTetx}}</text>
						<text class="iconfont icon-youjiantou" style="color: #333;"></text>
					</view>
				</view>
				<view class="money-text-dk">
					<!-- ，抵扣可省{{XBMoneyValid}}元 -->
					<view class="text">您有{{XBMoney}}个星币，是否抵扣</view>
					<view class="radio-area">
						<label class="radio">
							<radio value="" :checked="isRadio" style="transform:scale(0.7)" @click="isRadio=!isRadio" />
							<text>是</text>
						</label>
						<label class="radio">
							<radio value="" :checked="!isRadio" style="transform:scale(0.7)" @click="isRadio=!isRadio" />
							<text>否</text>
						</label>
					</view>
				</view>
			</view>

			<!-- 付款方式  应付  实付 -->
			<view class="payMode">
				<text>应付：{{copeWith && (copeWith*1).toFixed(2) || 0}}元</text>
				<view class="right">
					<text>实付：{{ActualPayment && (ActualPayment*1).toFixed(2) || 0}}元</text>
					<view @tap="submitPay">支付</view>
				</view>
			</view>
		</view>
		<!-- 内容结束 -->

		<!-- 选择优惠券弹窗 -->
		<view class="setCoupon" :class="setCouponHide?'setCouponHide':''">
			<view class="top" @tap="setCouponHide=true"></view>
			<view class="content">
				<view class="content-top">
					优惠详情
					<text class="iconfont icon-shanchu" @tap="closeCard"></text>
				</view>
				<view class="redpackge">
					<view class="redpackge-title">
						<label class="radio" @tap="notUseCard();checkedradio = !checkedradio;">
							<radio value="" :checked="checkedradio" />
							<text>不使用优惠券</text>
						</label>
					</view>
					<view v-if="redpackgeList.length > 0">
						<view class="redpackge-item" v-for="(item, indey) in redpackgeList" :key="item.id">
							<view class="isUseCard">
								<image :src="item.useCard ? '/static/images/checked.png' : '/static/images/notChecked.png'" mode=""></image>
							</view>

							<view class="left">
								<view class="left-quan">
									<view class="price">
										<text>￥</text>
										<text>{{ item.MONEY }}</text>
										<view>{{ item.TYPE == 1 && '抵扣券' || '' }}</view>
									</view>
								</view>
								<view class="left-title">
									<text>{{ item.title }}</text>
									<view>有效期至：{{ item.ENDTIME }}</view>
									<text>使用规则</text>
								</view>
							</view>
							<view class="right" :class="{activeBtn: item.STATES == 1}" @tap="ljsy(item, indey)">{{ item.STATES == 0 ? '立即使用' : '已使用' }}</view>
						</view>
					</view>
					<view v-else style="text-align: center;">暂无优惠券</view>
				</view>
			</view>
		</view>

		<!-- 支付选择蒙层 -->
		<view class="payMask" :class="payMaskHide?'payMaskHide':''">
			<view class="payMask-content">
				<view class="title">
					<text class="iconfont icon-zuojiantou" @tap="payMaskHide=true; payMode = 0; payPwdMaskHide = true; val = '';"></text>请选择支付方式
				</view>

				<view class="item" @tap="pay(item.id)" v-for="item in payMaskInfo" :key='item.id'>
					<view class="item-left">
						<text class="iconfont" :class="item.iconClass" :style="{color: item.iconColor}"></text>{{item.title}}
						<text v-if="item.id == 0" style="font-size: 30rpx;">（{{ BALANCE }}）</text>
					</view>
					<view class="item-right">
						<text class="iconfont icon-youjiantou"></text>
					</view>
				</view>

			</view>
		</view>

		<!-- 支付密码蒙层 -->
		<view class="payPwdMask" :class="payPwdMaskHide?'payPwdMaskHide':''">
			<view class="payPwdMask-content">
				<view class="title">
					<text class="iconfont icon-shanchu" @tap="payPwdMaskHide = true"></text>请输入支付密码
				</view>
				<view class="content">
					<text>向{{shopName}}支付</text>
					<view>￥{{ ACTUALPRICE }}</view>
				</view>
				<view class="pwdinput">
					<view class="mode">
						<view class="modeLeft">支付方式</view>
						<view class="modeRight" @tap="backPay">
							{{ payMaskInfo[payMode].title }}
							<text class="iconfont icon-youjiantou"></text>
						</view>
					</view>
					<view class="flex-box">
						<input v-model="val" type="number" :focus="focusStata" :maxlength="maxlength" class="hide-input" @input="getVal" />
						<view v-bind:class="['item', { active: codeIndex == 1 }]">
							<view class="line"></view>
							<block v-if="isPwd && codeArr.length >= 1">
								<text class="dot">.</text>
							</block>
							<block v-else>{{ codeArr[0] ? codeArr[0] : ''}}</block>
						</view>
						<view v-bind:class="['item', { active: codeIndex == 2 }]">
							<view class="line"></view>
							<block v-if="isPwd && codeArr.length >= 2">
								<text class="dot">.</text>
							</block>
							<block v-else>{{ codeArr[1] ? codeArr[1] : ''}}</block>
						</view>
						<view v-bind:class="['item', { active: codeIndex == 3 }]">
							<view class="line"></view>
							<block v-if="isPwd && codeArr.length >= 3">
								<text class="dot">.</text>
							</block>
							<block v-else>{{ codeArr[2] ? codeArr[2] : ''}}</block>
						</view>
						<view v-bind:class="['item', { active: codeIndex == 4 }]">
							<view class="line"></view>
							<block v-if="isPwd && codeArr.length >= 4">
								<text class="dot">.</text>
							</block>
							<block v-else>{{ codeArr[3] ? codeArr[3] : ''}}</block>
						</view>
						<block v-if="maxlength === 6">
							<view v-bind:class="['item', { active: codeIndex == 5 }]">
								<view class="line"></view>
								<block v-if="isPwd && codeArr.length >= 5">
									<text class="dot">.</text>
								</block>
								<block v-else>{{ codeArr[4] ? codeArr[4] : ''}}</block>
							</view>
							<view v-bind:class="['item', { active: codeIndex == 6 }]">
								<view class="line"></view>
								<block v-if="isPwd && codeArr.length >= 6">
									<text class="dot">.</text>
								</block>
								<block v-else>{{ codeArr[5] ? codeArr[5] : ''}}</block>
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// header
	import commonHeader from "@/components/common-header/common-header";
	import mixin from '@/mixin/mixin.js'
	var jweixin = require('jweixin-module');
	import {
		myCard,
		personal,
		alipay,
		wxpay,
		shopBygoodList,
		offlinetradingService,
		offlinetradingServicePay,

		orderPay,
		miniPay,
		paymini
	} from "@/common/apis.js";
	export default {
		props: {
			//最大长度 值为4或者6
			maxlength: {
				type: Number,
				default: 6
			},
			//是否是密码
			isPwd: {
				type: Boolean,
				default: true
			}
		},
		mixins: [mixin],
		data() {
			return {
				ACTUALPRICE: -1, // 实际支付
				BALANCE: 0, // 余额
				disabled: false,
				copeWith: 0, // 应付 金额
				money: '',
				// 优惠弹窗
				yhqTetx: "暂无优惠券",
				setCouponHide: true,
				redpackgeList: [],
				checkedradio: false,
				isRadio: false,
				// 选择付款方式
				payMaskHide: true,
				// 支付密码
				payPwdMaskHide: true,
				// 支付方式
				payMode: 0,
				// 支付自动聚焦
				focusStata: true,
				val: "", //输入框的值
				codeIndex: 1, //下标
				codeArr: [],
				shopName: "",
				shopId: "",
				XBMoney: 0,
				YHMoney: 0,
				yhqID: "",
				USERINFO_ID: "",
				orderID: "",
				payAmount: "",
				payMaskInfo: [ // 支付方式
					{
						id: 0,
						iconClass: 'icon-shouzhimingxicaifuhongbaoyue',
						iconColor: '#FF5A32',
						title: '余额支付'
					},
					{
						id: 1,
						iconClass: 'icon-weixin',
						iconColor: '#09BB07',
						title: '微信支付'
					}
				]
			};
		},
		components: {
			commonHeader
		},
		methods: {
			// 返回支付选择
			backPay() {
				if (this.ACTUALPRICE == 0) {
					return false;
				}
				// 显示支付方式选择
				this.payMaskHide = false;
				// 隐藏密码输入
				this.payPwdMaskHide = true;
			},
			// 关闭优惠卷弹窗
			closeCard() {
				let checkCards = this.redpackgeList.filter(ele => ele.useCard);
				if (checkCards.length === 0) {
					this.yhqTetx = '不使用优惠券'
					this.YHMoney = 0
				} else if (checkCards.length === 1) {
					let [{
						title,
						MONEY
					}] = checkCards
					this.yhqTetx = title;
					this.YHMoney = MONEY * 1;
				} else {
					this.YHMoney = checkCards.reduce((pre, nex) => pre.MONEY * 1 + nex.MONEY * 1);
					this.yhqTetx = checkCards.map(item => item.MONEY).join('元,') + '优惠券'
				}
				this.yhqID = checkCards.map(item => item.USERCOUPONS_ID).join(',');
				this.checkedradio = false;
				this.setCouponHide = true;
			},
			// 立即使用优惠券
			// 不使用优惠券
			notUseCard() {
				this.yhqTetx = '不使用优惠劵';
				this.YHMoney = 0;
				this.yhqID = '';
				this.setCouponHide = true;
				this.redpackgeList.forEach(item => item.useCard = false)
			},
			// 立即使用优惠券
			ljsy(item, indey) {
				item.useCard = !item.useCard
				this.checkedradio = false;
				this.redpackgeList[indey] = item
				this.$forceUpdate()
			},

			// 提交支付
			submitPay() {
				try {
					this.money = Number(this.money)
				} catch (e) {
					this.money = 0
				}
				if (!this.money) {
					return uni.showToast({
						title: '请输入正确的付款金额',
						icon: 'none'
					})
				}
				this.val = '';

				/* * 
				 * MONEY   总价
				 * USERINFO_ID  用户ID
				 * COUPON      优惠卷字符串 ，分割
				 * SHOP_ID  商家ID
				 * STARCOINS 星币 */
				let query = {
					MONEY: this.money,
					USERINFO_ID: this.USERINFO_ID,
					SHOP_ID: this.shopId,
					COUPON: this.yhqID,
					STARCOINS: this.isRadio ? this.XBMoneyValid : 0,
				}
				offlinetradingService(query).then(res => {
					if (res.msgType == 0) {
						let moneyTemp = Number(res.returnMsg.ACTUALPRICE)
						this.ACTUALPRICE = moneyTemp < 0 ? 0 : moneyTemp
						if (this.ACTUALPRICE == 0) {
							this.payPwdMaskHide = false;
							this.OFFLINETRADING_ID = res.returnMsg.OFFLINETRADING_ID
						}
						if (this.payMode == 0) {
							this.payPwdMaskHide = false;
							this.OFFLINETRADING_ID = res.returnMsg.OFFLINETRADING_ID
						} else {
							this.payPwdMaskHide = true;
							this.finallyPay()
						}


					} else {
						uni.showToast({
							title: '支付失败',
							icon: true
						})
					}
					// this.payPwdMaskHide = false
				})
				return false;


			},
			// 支付
			finallyPay() {
				// * TYPES 0余额、1微信、2支付宝
				// * OFFLINETRADING_ID   ID  tradePass

				paymini({
					OFFLINETRADING_ID: this.OFFLINETRADING_ID,
					TYPES: this.payMode,
					tradePass: this.val
				}).then(res => {
					uni.hideLoading();
					console.log(res)
					if (this.payMode == 1) { // 微信支付
						this.weChatPayment(res.returnMsg)
						return false;
					}


					if (res.returnMsg.status == '01') {
						setTimeout(() => {
							uni.showToast({
								title: '交易密码不正确',
								icon: 'none'
							})
						}, 1000)
					} else if (res.returnMsg.status == '02') {
						setTimeout(() => {
							uni.showToast({
								title: '余额不足',
								icon: 'none'
							})
						}, 1000)

					} else {
						let order = res.returnMsg;
						this.paySuccess(order);

					}
				})

			},

			weChatPayment(obj) {

				let _self = this;
				let {
					appId,
					nonceStr,
					paySign,
					signType,
					timeStamp
				} =obj;
				let packageName = obj.package;
				
				jweixin.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: appId, // 必填，公众号的唯一标识
					timestamp: timeStamp.toString(), // 必填，生成签名的时间戳
					nonceStr: nonceStr, // 必填，生成签名的随机串
					signature: paySign, // 必填，签名
					jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
				})
				
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": appId, //公众号名称，由商户传入     
						"timeStamp": timeStamp, //时间戳，自1970年以来的秒数     
						"nonceStr": nonceStr, //随机串     
						"package": packageName,
						"signType": signType, //微信签名方式：     
						"paySign": paySign //微信签名 
					},
					(res) => {
						console.log(res)
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							this.payMaskHide = true; // 隐藏当前支付方式选择
							uni.showToast({
								title: '支付成功!',
								duration: 2000,
								mask: true
							});
							let timer = setTimeout(() => {
								let order = res.returnMsg;
								if (order && Object.keys(order).length) {
									_self.paySuccess(order)
								} else {
									clearTimeout(timer)
								}
							}, 1000);
				
						} else {
							uni.showToast({
								title: '支付失败!',
								icon: 'none'
							});
						}
					}, (err) => {
						// alert(JSON.stringify(err))
					});
					return false;
			
			},
			// 支付成功
			paySuccess(order) {
				// order.total = this.ActualPayment; // money
				order.total = this.money; // money
				setTimeout(() => {
					uni.redirectTo({
						url: '../payComplete/payComplete?orderInfo=' + JSON.stringify(order)
					});
				}, 500);
			},
			// 支付
			pay(index) {
				this.payMode = index;
				if (this.payMode == 0) {
					this.payMaskHide = true
					this.payPwdMaskHide = false
				} else if (this.payMode == 1) {
					this.finallyPay()
				}
				// 显示密码输入
				// this.payPwdMaskHide = false
			},


			// 余额支付
			balancePay(tradePass) {
				shopBygoodList({
					orderSummaryId: this.orderID,
					tradePass
				}).then(res => {
					uni.hideLoading();
					this.tradePass = '';
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


							this.inputPwd = true
							setTimeout(() => {
								uni.showToast({
									title: '支付成功',
									icon: 'none'
								})
								uni.navigateTo({
									url: '../payComplete/payComplete'
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
			//取值
			getVal(e) {
				let {
					value
				} = e.detail;
				this.val = value;
				let arr = value.split("");
				this.codeIndex = arr.length + 1;
				this.codeArr = arr;
				if (this.val.length === 6) {
					uni.showLoading({
						title: "支付中...",
						mask: true
					});

					this.payPwdMaskHide = true;
					// this.balancePay(this.val)
					this.finallyPay()
				}

			},

			async getInfo(USERINFO_ID) {
				await uni.showLoading({
					title: '加载中',
					mask: true
				})
				await myCard({
					USERINFO_ID: this.USERINFO_ID
				}).then(res => {
					res.returnMsg.userCoupons.map(item => {
						item.title = "通用抵扣券" + item.MONEY + "元";
					});
					this.redpackgeList = res.returnMsg.userCoupons;
				})
				// 获取星币
				await personal({
					USERINFO_ID: this.USERINFO_ID
				}).then(({
					returnMsg: {
						BALANCE,
						userInfo
					}
				}) => {
					this.BALANCE = BALANCE
					this.XBMoney = userInfo.STARCOINS;
				})
				await uni.hideLoading()
			}
		},
		onLoad(e) {
			this.shopName = e.shopName;
			this.shopId = e.shopId;
			let passMoney = Number(e.money || 0);

			if (passMoney > 0) {
				this.copeWith = passMoney;
				this.money = passMoney;
				this.disabled = true
			} else {
				this.copeWith = passMoney;
				this.disabled = false
			}
			uni.getStorage({
				key: "USERINFO_ID",
				success: res => {

					this.USERINFO_ID = res.data;
					this.getInfo()
					if (location.href.indexOf("?#") < 0) {
						location.href = location.href.replace("#", "?#");
					}
				},

			});
		},
		computed: {
			// 可抵扣星币金额
			XBMoneyValid() {
				if (this.XBMoney >= this.copeWith) {
					return this.copeWith
				} else {
					return this.XBMoney * 0.75
				}

			},
			// 实付金额
			ActualPayment() {

				let xb = 0; // 星币
				if (this.isRadio) {
					(this.XBMoney * 1 >= this.copeWith * 1) ? (xb = this.copeWith * 1) : (xb = this.XBMoney * 1)
				} else {
					xb = 0
				}



				let yh = 0; // 优惠
				(this.YHMoney * 1 >= this.copeWith * 1) ? (yh = this.copeWith * 1) : (yh = this.YHMoney * 1)



				let payMoney = this.copeWith - xb - yh
				if (payMoney >= 0) {
					return payMoney
				} else {
					return 0 // this.copeWith || 0
				}

			}
		}
	};
</script>

<style lang="less">
	.scanPay {
		padding-top: 100rpx;
		/* #ifdef APP-PLUS */
		padding-top: 140rpx;
		/* #endif */
		font-size: 30rpx;
		background: #f7f7f7;
		height: 100%;
		color: #333;

		.scanPay-content {
			.title {
				padding: 30rpx;
			}

			.money {
				background: #fff;
				padding: 0 30rpx;

				.money-text {
					padding: 20rpx 0;
					border-bottom: 1px solid #e0e0e0;

					.money-text-input {
						display: flex;
						padding-top: 30rpx;
						align-items: center;

						text {
							font-size: 50rpx;
							font-weight: bold;
						}

						input {
							font-size: 40rpx;
							text-indent: 20rpx;
						}
					}
				}

				.money-text-yhq {
					display: flex;
					align-items: center;
					padding: 30rpx 0;
					border-bottom: 1px solid #e0e0e0;

					>text {
						width: 180rpx;
					}

					>view {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;
						color: #999;
						font-size: 26rpx;
					}
				}

				.money-text-dk {
					.text {
						padding: 30rpx 0;
						border-bottom: 1px solid #e0e0e0;
					}

					.radio-area {
						display: flex;
						padding: 20rpx 0;

						.radio {
							margin-right: 120rpx;
							display: flex;
							align-items: center;
							font-size: 26rpx;
						}
					}
				}
			}
		}

		.payMode {
			height: 100rpx;
			background: #fff;
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			>text {
				margin-left: 30rpx;
				color: #666;
			}

			.right {
				display: flex;
				height: 100rpx;
				align-items: center;
				font-weight: bold;
				color: #333;

				view {
					margin-left: 30rpx;
					height: 100rpx;
					width: 150rpx;
					line-height: 100rpx;
					font-weight: bold;
					font-size: 36rpx;
					background: #ff6b37;
					text-align: center;
					color: #fff;
				}
			}
		}

		// 优惠弹窗
		.setCouponHide {
			display: none;
		}

		.setCoupon {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(1, 1, 1, 0.5);

			.top {
				height: 40%;
			}

			.content {
				height: 60%;
				background: #fff;
				font-size: 30rpx;
				display: flex;
				flex-direction: column;

				.content-top {
					text-align: center;
					padding: 20rpx 0;
					position: relative;
					margin-bottom: 30rpx;

					text {
						position: absolute;
						right: 30rpx;
						top: 20rpx;
						font-size: 40rpx;
						color: #666;
					}
				}

				.redpackge {
					flex: 1;
					padding-top: 30rpx;
					overflow-y: auto;

					.redpackge-title {
						padding: 30rpx;
					}
				}

				.redpackge-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 30rpx;
					border-radius: 20rpx;
					height: 200rpx;
					background: #fff;
					width: 86%;
					margin: 0 auto 20rpx;
					box-shadow: 0 4rpx 20rpx #999;
					position: relative;

					.isUseCard {
						position: absolute;
						top: 15rpx;
						right: 15rpx;

						image {
							width: 40rpx;
							height: 40rpx;
						}
					}

					.left {
						display: flex;

						.left-quan {
							.price {
								color: #ff5830;

								text:first-child {
									font-size: 40rpx;
								}

								text:nth-child(2) {
									font-size: 70rpx;
								}

								view {
									font-size: 24rpx;
								}
							}
						}

						.left-title {
							flex: 1;
							margin-left: 40rpx;
							font-size: 28rpx;

							text:first-child {
								font-weight: bold;
							}

							view {
								font-weight: bold;
								font-size: 24rpx;
								margin: 10rpx 0;
							}

							text:last-child {
								color: #999;
							}
						}
					}

					.right {
						color: #fff;
						font-size: 28rpx;
						width: 170rpx;
						height: 60rpx;
						text-align: center;
						line-height: 60rpx;
						background: linear-gradient(244deg,
							rgba(255, 137, 36, 1) 0%,
							rgba(255, 90, 45, 1) 100%);
						border-radius: 40rpx;
					}
				}
			}
		}

		// 支付弹框
		.payMaskHide {
			display: none !important;
		}

		.payMask {
			position: fixed;
			height: 100%;
			width: 100%;
			top: 0;
			left: 0;
			background: rgba(1, 1, 1, 0.5);
			z-index: 11;
			color: #000;

			.payMask-content {
				width: 80%;
				height: 500rpx;
				background: #fff;
				padding: 30rpx 30rpx 50rpx 30rpx;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				margin: auto;
				border-radius: 20rpx;

				.title {
					position: relative;
					text-align: center;
					padding-bottom: 20rpx;
					border-bottom: 1px solid #e6e6e6;

					text {
						position: absolute;
						left: 0;
						top: 10rpx;
					}
				}

				.item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 100rpx;
					border-bottom: 1px solid #e6e6e6;

					.item-left {
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 34rpx;

						text {
							font-size: 50rpx;
							margin-right: 20rpx;
						}
					}
				}
			}
		}

		// 输入密码弹窗
		.payPwdMaskHide {
			display: none !important;
		}

		.payPwdMask {
			position: fixed;
			height: 100%;
			width: 100%;
			top: 0;
			left: 0;
			background: rgba(1, 1, 1, 0.5);
			z-index: 999999;
			color: #000;

			.payPwdMask-content {
				width: 80%;
				height: 550rpx;
				background: #fff;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				margin: auto;
				border-radius: 20rpx;
				font-size: 37rpx;

				.title {
					padding: 20rpx 0;
					display: flex;
					align-items: center;
					justify-content: center;
					border-bottom: 1rpx solid #e6e6e6;

					text {
						position: absolute;
						top: 20rpx;
						left: 20rpx;
						color: #e6e6e6;
						font-size: 50rpx;
					}
				}

				.content {
					text-align: center;
					padding: 30rpx 0;
					border-bottom: 1rpx solid #e6e6e6;

					view {
						font-weight: bold;
						font-size: 57rpx;
					}
				}

				.pwdinput {
					padding: 0 30rpx;

					.mode {
						display: flex;
						justify-content: space-between;
						font-size: 30rpx;
						color: #666;
						padding: 20rpx 0;

						.modeRight {
							text {
								margin-left: 10rpx;
							}
						}
					}

					.flex-box {
						display: flex;
						flex-wrap: wrap;
						justify-content: center;
						margin-top: 40rpx;
						height: 100rpx;
						position: relative;
					}

					.item {
						position: relative;
						width: 90upx;
						height: 90upx;
						font-size: 30upx;
						font-weight: bold;
						color: #333333;
						line-height: 90upx;
						text-align: center;
						box-sizing: border-box;
						border: 1px solid #cccccc;
						border-right: 0;
					}

					.item:last-child {
						border-right: 1px solid #ccc;
					}

					.active {
						border-color: #ff4b4b;
					}

					.active .line {
						display: block;
					}

					.line {
						display: none;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						width: 2upx;
						height: 40upx;
						background: #ff4b4b;
						animation: twinkling 1s infinite ease;
					}

					.hide-input {
						position: absolute;
						top: 0;
						left: -100%;
						width: 200%;
						height: 100%;
						text-align: left;
						z-index: 9;
						opacity: 1;
					}

					@keyframes twinkling {
						0% {
							opacity: 0.2;
						}

						50% {
							opacity: 0.5;
						}

						100% {
							opacity: 0.2;
						}
					}

					.dot {
						font-size: 80upx;
						line-height: 40upx;
					}
				}
			}
		}
	}
</style>
