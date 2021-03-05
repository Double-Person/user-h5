<template>
	<view class="settlement">
		<!-- 顶部 -->
		<commonHeader :headerTitl="headerTitl" xingHide="true" lingHide="true"></commonHeader>
		<view class="settlement-content">
			<view class="setting-content-top" @tap="goAddress">
				<view class="setting-content-top-left"><text class="iconfont icon-dingwei"></text></view>
				<view class="setting-content-top-right" v-if="this.addressState">
					<view class="title">
						<text>{{ address.USERNAME }}</text>
						<text>{{ address.PHONE }}</text>
					</view>
					<view class="text">{{ address.addressDetailed }}</view>
				</view>
				<view v-else class="setting-content-top-right" style="color: #999;font-size: 30rpx;">选择地址</view>
			</view>
			<view class="setting-content-product" v-for="(item, index) in orderList" :key="index">
				<image src="/static/images/content01.png" mode=""></image>
				<view class="product">
					<view class="title">
						<text>{{ item.shopName }}</text>
						<text>X{{ item.num }}</text>
					</view>
					<view class="date">
						<!-- 下单时间：2019-11-12 08:11 -->
					</view>
					<view class="price">单价：￥{{ item.price }}</view>
				</view>
			</view>
			<view class="setting-content-total">
				<text></text>
				<view class="right">
					<text>共计{{ shopNum }}商品</text>
					<text>合计 ￥</text>
					<text>{{ total && (total*1).toFixed(2) || 0 }}</text>
				</view>
			</view>
			<view class="setting-content-remarks">
				<text>订单备注:</text>
				<textarea placeholder-style="color:#999;marginTop:20rpx;margin-left:20rpx" v-model="remarks" placeholder="选填, 请输入备注" />
				</view>
			<!-- <view class="setting-content-code">
				订单编号:<text>08e0890890232842343</text>
			</view> -->
			<view class="setting-content-quan" @tap="setCouponHide = false">
				<text>
					优惠券:
					<text>{{ yhqTetx }}</text>
				</text>
				<text class="iconfont icon-youjiantou"></text>
			</view>
			<view class="setting-content-radio">
				<!-- 抵扣可省{{ XBMoneyValid }}元， -->
				<text>您有{{ XBMoney }}个星币，是否抵扣</text>
				<view class="xuanxiang">
					<label class="radio" @tap="changeXB">
						<radio value="" :checked="checked" />
						<text>是</text>
					</label>
					<label class="radio" @tap="changeXB">
						<radio value="" :checked="!checked" />
						<text>否</text>
					</label>
				</view>
				<!-- <view class="phone">
					联系商家:
					<text>{{phone}}</text>
				</view> -->
			</view>
		</view>
		<!-- 底部 -->
		<view class="settlement-footer">
			<text></text>
			<view class="right">
				共{{ shopNum }}件商品
				<text class="total">合计:</text>
				<view class="price">
					￥
					<text>{{ submitTotal && (submitTotal*1).toFixed(2) || 0 }}</text>
				</view>
				<view class="tijiao" @tap="submitOrder">提交订单</view>
			</view>
		</view>
		<!-- tabbar -->
		<tabbar></tabbar>

		<!-- 支付方式选择蒙层 -->
		<view class="payMask" :class="payMaskHide ? 'payMaskHide' : ''">
			<view class="payMask-content">
				<view class="title">
					<text class="iconfont icon-zuojiantou" @tap="payMaskHide = true"></text>
					请选择支付方式
				</view>
				<view class="item" @tap="pay(0)">
					<view class="item-left">
						<text class="iconfont icon-shouzhimingxicaifuhongbaoyue" style="color: #FF5A32;"></text>
						余额支付（{{ BALANCE }}）
					</view>
					<view class="item-right"><text class="iconfont icon-youjiantou"></text></view>
				</view>
				<view class="item" @tap="pay(1)">
					<view class="item-left">
						<text class="iconfont icon-weixin" style="color: #09BB07;"></text>
						微信支付
					</view>
					<view class="item-right"><text class="iconfont icon-youjiantou"></text></view>
				</view>
				
			</view>
		</view>

		<!-- 支付密码蒙层 -->
		<view class="payPwdMask" :class="payPwdMaskHide ? 'payPwdMaskHide' : ''">
			<view class="payPwdMask-content">
				<view class="title">
					<text class="iconfont icon-shanchu" @tap="backPay"></text>
					请输入支付密码
				</view>
				<view class="content">
					<text>向某某商家支付</text>
					<view>￥{{ checked ? total - yhqMoney - XBMoney : total - yhqMoney }}</view>
				</view>
				<view class="pwdinput">
					<view class="mode">
						<view class="modeLeft">支付方式</view>
						<view class="modeRight" @tap="backPay">
							{{ (payMode === 0 && '余额支付') || (payMode === 1 && '微信支付') || (payMode === 2 && '支付宝支付') || (payMode === 3 && '银行卡支付') }}
							<text class="iconfont icon-youjiantou"></text>
						</view>
					</view>
					<view class="flex-box">
						<input :value="val" type="number" :focus="focusStata" :maxlength="maxlength" class="hide-input" @input="getVal" />
						<view v-bind:class="['item', { active: codeIndex == 1 }]">
							<view class="line"></view>
							<block v-if="isPwd && codeArr.length >= 1"><text class="dot">.</text></block>
							<block v-else>{{ codeArr[0] ? codeArr[0] : '' }}</block>
						</view>
						<view v-bind:class="['item', { active: codeIndex == 2 }]">
							<view class="line"></view>
							<block v-if="isPwd && codeArr.length >= 2"><text class="dot">.</text></block>
							<block v-else>{{ codeArr[1] ? codeArr[1] : '' }}</block>
						</view>
						<view v-bind:class="['item', { active: codeIndex == 3 }]">
							<view class="line"></view>
							<block v-if="isPwd && codeArr.length >= 3"><text class="dot">.</text></block>
							<block v-else>{{ codeArr[2] ? codeArr[2] : '' }}</block>
						</view>
						<view v-bind:class="['item', { active: codeIndex == 4 }]">
							<view class="line"></view>
							<block v-if="isPwd && codeArr.length >= 4"><text class="dot">.</text></block>
							<block v-else>{{ codeArr[3] ? codeArr[3] : '' }}</block>
						</view>
						<block v-if="maxlength === 6">
							<view v-bind:class="['item', { active: codeIndex == 5 }]">
								<view class="line"></view>
								<block v-if="isPwd && codeArr.length >= 5"><text class="dot">.</text></block>
								<block v-else>{{ codeArr[4] ? codeArr[4] : '' }}</block>
							</view>
							<view v-bind:class="['item', { active: codeIndex == 6 }]">
								<view class="line"></view>
								<block v-if="isPwd && codeArr.length >= 6"><text class="dot">.</text></block>
								<block v-else>{{ codeArr[5] ? codeArr[5] : '' }}</block>
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>

		<!-- 选择优惠券弹窗 -->
		<view class="setCoupon" :class="setCouponHide ? 'setCouponHide' : ''">
			<view class="top" @tap="setCouponHide = true"></view>
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
							<view class="right" :class="{activeBtn: item.STATES == 1}" 
								  @tap="ljsy(item, indey)">{{ item.STATES == 0 ? '立即使用' : '已使用' }}</view>
						</view>
					</view>
					<view v-else style="text-align: center;">暂无优惠券</view>
				</view>
			</view>
		</view>
	
		<view class="input-pwd" v-if="inputPwd">
			
			<view class="input-warp">
				<view style="padding-top: 30rpx; font-size: 38rpx;">请输入密码</view>
				<input class="input" v-model="tradePass" type="password" />
				<view style="display: flex; justify-content: center;">
					<view class="btn" @click="payByBalance">确定</view>
					<view class="btn" @click="inputPwd = false">取消</view>
				</view>
				
			</view>
		</view>
	
	</view>
</template>

<script>
// 引入tabbar
import tabbar from '@/components/common-tabbar/common-tabbar';
import commonHeader from '@/components/common-header/common-header';
import { orderPay, getAddress, myCard, personal, alipay, wxpay, shopBygoodList, miniPay} from '@/common/apis.js';
import mixin from '@/mixin/mixin.js'
var jweixin = require('jweixin-module');
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
			paySuccessObj: {},
			BALANCE: '',
			inputPwd: false,
			tradePass: '',  // 交易密碼
			phone:'',
			headerTitl: '结算',
			checked: false,
			payMaskHide: true,
			val: '', //输入框的值
			codeIndex: 1, //下标
			codeArr: [],
			payPwdMaskHide: true,
			// 支付方式
			payMode: '',
			// 支付自动聚焦
			focusStata: false,
			orderList: [],
			// 优惠弹窗
			yhqTetx: '暂无优惠券',
			setCouponHide: true,
			redpackgeList: [],
			checkedradio: false,
			yhqMoney: 0, // 优惠券金额
			XBMoney: 0, //星币抵扣
			XBMoneyValid: 0, //有效星币
			// 合计
			total: 0,
			shopNum: 0,
			address: {},
			remarks: '',
			yhqID: '',
			orderID: '',
			payAmount: '',
			GOODS: [],
			USERINFO_ID: '',
			ADDRESS_ID: '',
			addressState: false,
			shopId: '',
			Allprice:0
		};
	},
	
	components: {
		commonHeader,
		tabbar
	},
	onLoad(e) {
						
		this.phone = e.phone
		// debugger
			// this.Allprice=e.allTotal		
		this.shopId = e.shopId;
		this.getAddressInfo(e.page);
		uni.getStorage({
			key: 'USERINFO_ID',
			success: res => {
				this.USERINFO_ID = res.data;
			
				if(e.page == 'cart') {  // 从购物车中
				var arr = JSON.parse(e.item);
					this.shopNum =  arr.map(ele => Number(ele.COUNTS)).reduce((prev, cur)=> prev + cur);
					this.total =  arr.map(ele => ele.COUNTS * ele.PRICE).reduce((prev, cur)=> prev + cur);
					
					arr.map(item => {
						this.GOODS.push({ GOODS_ID: item.GOODS_ID, COUTNS: item.COUNTS, PRICE: parseFloat(item.PRICE), SHOP_ID: item.SHOP_ID });
					});
				}else if(e.page == 'shopPage'){ //  从商店直接购买
					var arr = JSON.parse(e.item);
					console.log(arr)
					this.shopNum =  arr.map(ele => Number(ele.num)).reduce((prev, cur)=> prev + cur);
					this.total =  arr.map(ele => ele.num * ele.price).reduce((prev, cur)=> prev + cur);
					arr.map(item => {
						this.GOODS.push({ GOODS_ID: item.goodsId, COUTNS: item.num, PRICE: parseFloat(item.price), SHOP_ID:e.shopId });
					});
				}else if(e.page == 'myOrder'){ //  待支付订单
					let myOrderPaymentJson = uni.getStorageSync('myOrderPayment');
					let myOrderPayment = JSON.parse(myOrderPaymentJson);
					this.shopNum = myOrderPayment.number
					this.total = myOrderPayment.PAYABLE
					this.GOODS = myOrderPayment.goodsInfo[0]
				}
	
	
				// 获取优惠券
				this._myCard(res.data)
				// 获取星币
				this._personal(res.data)
				if (location.href.indexOf("?#") < 0) {
					 location.href = location.href.replace("#", "?#");
				}	
				
			}
		});
		
	},
	computed: {
		submitTotal() {
			if (this.checked) {
				var all = (this.total - this.yhqMoney - this.XBMoneyValid) >= 0 ? (this.total - this.yhqMoney - this.XBMoneyValid) : 0;
			} else {
				var all = (this.total - this.yhqMoney) >= 0 ? this.total - this.yhqMoney : 0;
			}
			return all;
		}
	},
	// beforeDestroy() {
	// 	if (location.href.indexOf("?#") > 0) {
	// 		 location.href = location.href.replace("?#", "#");
	// 	}
	// },
	// onUnload(){
	// 	if (location.href.indexOf("?#") > 0) {
	// 		 location.href = location.href.replace("?#", "#");
	// 	}
	// },
	
	methods: {
		// 获取收货地址
		getAddressInfo(page) {
			if(page == 'myOrder') {
				let myOrderPaymentJson = uni.getStorageSync('myOrderPayment');
				let myOrderPayment = JSON.parse(myOrderPaymentJson);
				this.address = {
					addressDetailed: myOrderPayment.ADDRESS,
					PHONE: myOrderPayment.PHONE,
					USERNAME: myOrderPayment.USERNAME
				};
				this.ADDRESS_ID = myOrderPayment.ADDRESS_ID;
				this.addressState = true;
				return false;
			}
			
			this.addressState = getApp().globalData.addressState;
			// 判断是否选择地址
			if (getApp().globalData.addressState === true) {
				this.address = getApp().globalData.address;
				this.ADDRESS_ID = getApp().globalData.address.ADDRESS_ID;
				this.addressState = true;
			} else {
				// 查询收获地址
				uni.getStorage({
					key: 'USERINFO_ID',
					success: res => {
						getAddress({ USERINFO_ID: res.data }).then(res => {
							this.address = res.returnMsg.list[0];
							this.address.addressDetailed = this.address.AREA + this.address.FULLADD
							this.ADDRESS_ID = res.returnMsg.list[0].ADDRESS_ID;
							this.addressState = true;
						});
					}
				});
			}
		},
		// 前往地址
		goAddress() {
			uni.navigateTo({
				url: '../myAddress/myAddress?state=1'
			});
		},
		// 提交订单
		submitOrder() {
			if (!this.addressState) {
				uni.showToast({
					title: '请选择收货地址！',
					icon: 'none',
					mask: true,
					duration: 2000
				});
				return false;
			}
			
			
			this.GOODS = this.GOODS.filter(ele => ele.COUTNS != 0);
			uni.showLoading({
				title: '加载中',
				mask: true
			})
	
			var obj = {
				PAYABLE: this.total,
				COUPON: this.yhqID,
				STARCOINS: this.checked ? this.XBMoneyValid : 0,
				REMARKS: this.remarks,
				ADDRESS: this.address.addressDetailed,
				USERINFO_ID: this.USERINFO_ID,
				GOODS: JSON.stringify(this.GOODS),
				ADDRESS_ID: this.ADDRESS_ID,
				SHOP_ID: this.shopId
			};
			orderPay(obj).then(res => {
					if(res.msgType != '0') {
						return uni.showToast({
							title: res.returnMsg ||'提交失败！',
							icon: 'none',
							duration: 2000,
							mask: true
						});
					}
					
					this.orderID = res.returnMsg.ORDERSUMMARY_ID;
					this.payAmount = res.returnMsg.ACTUALPAY;
					this.paySuccessObj = {
						total: this.total,
						ORDERNO: res.returnMsg.ORDERNO,
						TIME: res.returnMsg.CREATETIME
					}

					if(this.submitTotal*1 <= 0) {
						this.pay(0)
					}else {
						this.payMaskHide = false;
					}
					
					
				})
				.catch(err => {
					uni.showToast({
						title: '提交失败，请稍后再试!',
						icon: 'none'
					});
				}).finally(() => uni.hideLoading())
		},
		// 获取输入的值
		//取值
		getVal(e) {
			let { value } = e.detail;
			this.val = value;
			let arr = value.split('');
			this.codeIndex = arr.length + 1;
			this.codeArr = arr;
			
		},
		//清除验证码或者密码
		clear() {
			this.codeIndex = 1;
			this.codeArr = [];
			this.val = '';
		},
		// 支付
		pay(index) {		
			this.payMode = index;
			// 0 余额支付   1 微信支付   2 支付宝支付    3 银行卡支付	
			let obj = {
				payAmount: this.payAmount,  // '216.0',//
				orderSummaryId: this.orderID, // 'D1601279104958'//
				USERINFO_ID: this.USERINFO_ID
			};
	
			// 微信支付
			if (this.payMode === 1) {
				
				this.weChatPayment(obj)
			}
			
			// 餘額支付
			if(this.payMode === 0) {
				this.inputPwd = true	
			}
			// 显示密码输入
			// this.payPwdMaskHide = false
		},
		payByBalance() {	
			// if(this.tradePass == '') {
			// 	return uni.showToast({ title: '请输入交易密码', icon: 'none' })
			// }
			if(this.BALANCE == '0.00') {
				return uni.showToast({ title: '余额不足', icon: 'none' })
			}
			if(this.tradePass == '') {
				return uni.showToast({ title: '请输入支付密码', icon: 'none' })
			}
			
			this.inputPwd = false;
			shopBygoodList({ orderSummaryId: this.orderID, tradePass: this.tradePass }).then(res => {
				this.tradePass = '';
				if(!res.returnMsg) {
					return uni.showToast({
						title: '系统错误稍后再试', icon: 'none'
					})
				}
				
				if(res.returnMsg.status == '01') {
					uni.showToast({ title: '交易密码不正确或者未设置交易密码', icon: 'none' })	
				}else if(res.returnMsg.status == '02') {
					uni.showToast({ title: '余额不足', icon: 'none' })	
				}else{
					uni.showToast({ title: '支付成功', icon: 'none' })	
					this.inputPwd = true
					this.paySuccessObj.TYPES = 0;
					let timer = setTimeout(() => {
						this.paySuccess(this.paySuccessObj)
					}, 1000);
					
				}
				
				
			})
		},
		
		weChatPayment(obj) {
			
			// if (location.href.indexOf("?#") < 0) {
			// 	 location.href = location.href.replace("#", "?#");
			// 	 this.weChatPayment(obj)
			// }	
				uni.showLoading({
					title: '加载中'
				})
			let _self = this;
			miniPay(obj).then(res => {
				let { appId,nonceStr, paySign,signType, timeStamp } = res.returnMsg.prepay;
				let packageName = res.returnMsg.prepay.package;
				
				jweixin.config({
					debug: false, 
					appId: appId, // 必填，公众号的唯一标识
					timestamp: timeStamp.toString(), // 必填，生成签名的时间戳
					nonceStr: nonceStr, // 必填，生成签名的随机串
					signature: paySign, // 必填，签名
					jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
				})
			
			   WeixinJSBridge.invoke(
				  'getBrandWCPayRequest', {
					 "appId":appId,     //公众号名称，由商户传入     
					 "timeStamp":timeStamp,         //时间戳，自1970年以来的秒数     
					 "nonceStr":nonceStr, //随机串     
					 "package":packageName,     
					 "signType":signType,         //微信签名方式：     
					 "paySign":paySign //微信签名 
				  },
				  (res) =>{
				  if(res.err_msg == "get_brand_wcpay_request:ok" ){
					  _self.payMaskHide = true; // 隐藏当前支付方式选择
					  uni.showToast({
						title: '支付成功!',
						duration: 2000,
						mask: true
					  });
					  _self.paySuccessObj.TYPES = 1
					  let timer = setTimeout(() => {
						_self.paySuccess(_self.paySuccessObj)
					  }, 1000);
				  
				  } else{
					  uni.showToast({
						title: '支付失败!',
						icon: 'none'
					  });
				  }
			   }, (err) => {
				   // alert(JSON.stringify(err))
			   }); 
	
				return false;
				
				
				jweixin.ready((result) => {
					jweixin.checkJsApi({
						jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
						success: function(res) {
							
						},
						fail:function(res) {
							
						}
					});
					jweixin.chooseWXPay({
					  debug: true,
					  appId: appId,
					  timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					  nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
					  package: packageName, // 统一支付接口返回的prepay_id参数值
					  signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					  paySign: paySign, // 支付签名
					  success: function (res) {
						// 支付成功后的回调函数
						console.log(res)
					  },
					  fail: function(err) {
						  console.log(err)
						  alert('支付失败', JSON.stringify(err))
					  }
					});
				})
				
			}).finally(() => {
				uni.hideLoading()
			})
			return false;
		},
		
		// 支付成功
		paySuccess(order) {
		
			setTimeout(() => {
				uni.redirectTo({
					url: '../payComplete/payComplete?orderInfo=' + JSON.stringify(order)
				});
			}, 100);
		},
		// 返回支付选择
		backPay() {
			// 显示支付方式选择
			this.payMaskHide = false;
			// 隐藏密码输入
			this.payPwdMaskHide = true;
		},
		// 不使用优惠券
		notUseCard() {
			this.yhqTetx = '不使用优惠劵';
			this.yhqMoney = 0;
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
		// 关闭优惠卷弹窗
		closeCard() {
			let checkCards = this.redpackgeList.filter(ele => ele.useCard);
			if(checkCards.length === 0) {
				this.yhqTetx = '不使用优惠券'
				this.yhqMoney = 0
			}else if(checkCards.length === 1) {
				let [{title, MONEY}] = checkCards
				this.yhqTetx =  title;
				this.yhqMoney = MONEY;
			}else {
				this.yhqMoney = checkCards.reduce((pre, nex) => pre.MONEY * 1 + nex.MONEY *1);
				this.yhqTetx = checkCards.map(item => item.MONEY).join('元,') + '优惠券'
			}
			this.yhqID = checkCards.map(item => item.USERCOUPONS_ID).join(',');
			this.checkedradio = false;
			this.setCouponHide = true;
			// this.yhqMoney = item.MONEY;
			// this.yhqID = item.USERCOUPONS_ID;
		},
		
		ljsy11(item) {
			if (item) {
				this.yhqTetx = item.title;
				this.checkedradio = false;
				this.setCouponHide = true;
				this.yhqMoney = item.MONEY;
				this.yhqID = item.USERCOUPONS_ID;
			} else {
				this.yhqTetx = '不使用优惠劵';
				this.yhqMoney = 0;
				this.yhqID = '';
				// this.setCouponHide = true;
			}
		},
		// 选择是否使用星币
		changeXB() {
			if (this.checked) {
				this.checked = false;
			} else {
				this.checked = true;
			}
		},
		// 获取优惠券
		_myCard(USERINFO_ID) {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			
			myCard({ USERINFO_ID }).then(res => {
				res.returnMsg.userCoupons.map(item => {
					item.title = '通用抵扣券' + item.MONEY + '元';
				});
				
				this.redpackgeList = res.returnMsg.userCoupons;
				this.redpackgeList.forEach(item => item.useCard = false)
				this.redpackgeList.length ? (this.yhqTetx = '选择优惠劵') : (this.yhqTetx = '暂无优惠券')				
			}).finally(() => uni.hideLoading())
		},
		// 获取星币
		_personal(USERINFO_ID) {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			personal({ USERINFO_ID }).then(res => {
				// 星币可全部抵扣
				if(res.returnMsg.userInfo.STARCOINS < this.submitTotal) {
					this.XBMoneyValid = res.returnMsg.userInfo.STARCOINS;
				}else {
					this.XBMoneyValid =this.submitTotal;
				}			
				this.XBMoney = res.returnMsg.userInfo.STARCOINS;
				//  显示余额
				this.BALANCE = res.returnMsg.BALANCE || '0' ;
				
				let openid = res.returnMsg.userInfo.WX;
				
				if(!openid) {
					this.loginInMixin()
				}else {
					let code = location.search.substr(1).split('&')[0].split('=')[1];
					if(code) {
						uni.setStorageSync('location', location.href)
						this.getOpenId('card')
					}
				}
				
				
				
				
				
			}).finally(() => uni.hideLoading())
		}
	},
	
};
</script>

<style lang="less" scoped>
	.input-pwd{
		position: fixed;
		z-index: 999;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: rgba(0,0,0, .5);
		.input-warp{
			background: #fff;
			margin-top: 500rpx;
			margin-left: 10%;
			border-radius: 30rpx;
			height: 500rpx;
			width: 80%;
			text-align: center;
			input{
				border: 1rpx solid #000;
				border-radius: 10rpx;
				height: 90rpx;
				width: 80%;
				margin-left: 10%;
				margin-top: 100rpx;
			}
			.btn{
				margin-top: 30rpx;
				width: 100rpx;
			}
		}
	}
.settlement {
	background: #f6f7f8;
	color: #333;
	padding-top: 30rpx;
	/* #ifdef APP-PLUS */
	padding-top: 70rpx;
	/* #endif */
	/* #ifdef MP-WEIXIN */
	padding-top: 70rpx;
	/* #endif */
	margin-bottom: 200rpx;
	.settlement-content {
		background: #fff;
		border-radius: 20rpx;
		width: 90%;
		margin: 90rpx auto 0;
		padding: 20rpx;
		padding-bottom: 0;
		.setting-content-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #d8d8d8;
			padding-bottom: 20rpx;
			.setting-content-top-left {
				width: 66rpx;
				height: 66rpx;
				background: linear-gradient(143deg, rgba(255, 119, 43, 1) 0%, rgba(255, 91, 52, 1) 100%);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
				text {
					font-size: 40rpx;
					color: #fff;
				}
			}
			.setting-content-top-right {
				flex: 1;
				font-size: 32rpx;
				.title {
					display: flex;
					justify-content: space-between;
					text:first-child {
						font-weight: bold;
					}
					text:last-child {
						color: #666;
						font-size: 28rpx;
					}
				}
				.text {
					margin-top: 20rpx;
					font-size: 30rpx;
					line-height: 42rpx;
				}
			}
		}
		.setting-content-product {
			padding: 20rpx 0;
			display: flex;
			image {
				width: 180rpx;
				height: 152rpx;
				border-radius: 20rpx;
				margin-right: 20rpx;
			}
			.product {
				flex: 1;
				color: #666;
				font-size: 28rpx;
				.title {
					font-size: 32rpx;
					display: flex;
					justify-content: space-between;
					text:first-child {
						color: #333;
					}
				}
				.date {
					margin: 15rpx 0;
				}
			}
		}
		.setting-content-total {
			display: flex;
			justify-content: space-between;
			font-size: 30rpx;
			padding: 30rpx 0;
			text:nth-child(2) {
				margin-left: 30rpx;
				color: #666666;
			}
			text:last-child {
				color: #f16012;
			}
		}
		.setting-content-remarks {
			font-size: 30rpx;
			textarea {
				height: 171rpx;
				width: 100%;
				margin: 30rpx 0;
				border-radius: 20rpx;
				background: #f7f7f7;
				text-indent: 15rpx;
			}
		}
		.setting-content-code {
			font-size: 30rpx;
			padding: 30rpx 0;
			text {
				margin-left: 30rpx;
				color: #666;
			}
		}
		.setting-content-quan {
			font-size: 30rpx;
			// padding-left: 30rpx;
			display: flex;
			justify-content: space-between;
			> text text {
				color: #999999;
				margin-left: 30rpx;
				font-size: 28rpx;
			}
		}
		.setting-content-radio {
			font-size: 30rpx;
			padding: 40rpx 0;
			.xuanxiang {
				padding: 30rpx 0;
				.radio {
					margin-right: 100rpx;
				}
			}
			.phone {
				text {
					margin-left: 30rpx;
					color: #0e88ff;
				}
			}
		}
	}
	.settlement-footer {
		height: 100rpx;
		background: #faf7fa;
		position: fixed;
		bottom: 100rpx;
		width: 100%;
		box-shadow: 0px -10px 21px 0px rgba(0, 0, 0, 0.2);
		display: flex;
		font-size: 30rpx;
		color: #666;
		justify-content: space-between;
		.right {
			display: flex;
			align-items: center;
			.tijiao {
				width: 220rpx;
				height: 100rpx;
				background: #ff6b37;
				text-align: center;
				line-height: 100rpx;
				color: #fff;
				font-size: 32rpx;
			}
			.total {
				margin: 0 20rpx;
			}
			.price {
				color: #ff6b37;
				margin-right: 20rpx;
				text {
					font-size: 38rpx;
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
		z-index: 5;
		color: #000;
		.payMask-content {
			width: 80%;
			height: 300rpx;
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

	// 优惠弹窗
	.setCouponHide {
		display: none;
	}
	.setCoupon {
		position: fixed;
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
				.isUseCard{
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
					background: linear-gradient(244deg, rgba(255, 137, 36, 1) 0%, rgba(255, 90, 45, 1) 100%);
					border-radius: 40rpx;
				}
				.activeBtn{
					background: #d1d1d1 !important;
				}
			}
		}
	}
}
</style>
