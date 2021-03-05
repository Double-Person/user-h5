<template>
	<view class="login">
		<view class="login-header">
			手机号登录
		</view>
		<view class="login-title">
			请输入手机号登录
		</view>
		<view class="login-content">
			<view class="login-content-item">
				<text>+86</text>
				<input type="number" :value="phone" @input="inputPhone" :maxlength="11" placeholder="请输入手机号" placeholder-style="color:#999" />
			</view>
			<view class="login-content-item password">
				<text>密码</text>
				<input type="password" :value="pwd" @input="inputPwd" placeholder="请输入密码" placeholder-style="color:#999" />
			</view>
			<view class="tips">
				<text @tap="forgetPwd">忘记密码</text>
				<text @tap="register">立即注册</text>
			</view>
		</view>
		
		
		
		<button class="login-content-btn" :disabled="btnState" :class="btnState?'btnState':''" @tap="goIndex">登录</button>
		<view class="otherLogin">
			快捷登录方式 <text class="iconfont icon-weixin" @tap="weixinLogin"></text>
		</view>
		
		<view class="login-tipsText">
			根据国家网络实名的相关规定，自2017年10月1日起，
			您需要绑定手机才能享受正常服务。
			<view class="" style="text-align: center;margin-top: 30rpx;">
				登录或注册即代表已同意
				<navigator url="../userAgreement/userAgreement" style="color:#FF5904;display: inline-block;">《用户使用与隐私协议》</navigator>
			</view>
		</view>
		<!-- 记住密码提示 -->
		<view class="rememberPwd" :class="rememberPwdHide?'rememberPwdHide':''">
			<view class="rememberPwd-content">
				<view class="title">
					是否记住账号密码？
				</view>
				<view class="btn">
					<text @tap="cancelSave">取消</text>
					<text @tap="savePwd">确认</text>
				</view>
			</view>
		</view>

		<!-- 其它登录方式 -->
	
		


		<view class="mask-bind" v-if="isShowMask">
			<view class="bind-phone">
				<view class="form">
					<text>+86：</text> <input type="number" v-model="PHONE" :maxlength="11" />
					<button class="send-code" @click="getCode">{{codeText}}</button>
				</view>
				<view class="form">
					<text>验证码：</text> <input type="number" v-model="code" :maxlength="6" />
				</view>
				<view class="btn-bind-wx" @click="bindPhone">
					绑定手机
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入api接口
	import {
		login,
		wxLogin,
		wxTel,
		sendCode,
		wxwebLogin
	} from "@/common/apis.js";
	import { COMMON_URL, APPID, REDIRECT_URI, INDEX_KEY, CONVERSION_KEY } from '@/common/commonConfig.js';
	import mixin from '@/mixin/mixin.js'

	export default {
		data() {
			return {
				loginOpenCode: '',
				key: INDEX_KEY,
				openIdBind: '',
				isShowMask: false,
				PHONE: '',
				code: '', //  绑定手机验证码
				point: {},
				codeText: "获取验证码",
				btnState: true,
				phone: "", // 13258188656 18398207590
				pwd: "", /// 123456
				phoneState: false,
				pwdState: false,
				rememberPwdHide: true,
				saveObj: '',
			}
		},
		mixins: [mixin],
		mounted() {	
			const that = this;
			// 获取定位
			this.getPoint();
			
			uni.getStorage({
				key: 'saveStata',
				success: function(res) {
					let saveStata = res.data;
					
					let isWeChatLogin = false;
					try{
						isWeChatLogin = uni.getStorageSync('isWeChatLogin');
					}catch(e){
						isWeChatLogin = false;
					}
					if (saveStata && !isWeChatLogin) {
						try {
							uni.getStorage({
								key: 'name',
								success: (data) => {
									let {
										PHONE,
										PASSWORD,
										openId = '',
										nickName = ''
									} = JSON.parse(data.data);
									that.phone = PHONE;
									that.pwd = PASSWORD;
									that.phoneState = true;
									that.pwdState = true;
									that.loginState();
									that.saveObj = {
										PHONE,
										PASSWORD,
										openId: '',
										nickName: ''
									}
									that.loginSendData()

								},

							})
						} catch (e) {
							//TODO handle the exception

						}
					}
				}
			});			
		},
		onLoad(opt) {
			let code = location.search.substr(1).split('&')[0].split('=')[1];
			if(code) {
				this.getOpenId()
			}
		},
		
		
		methods: {		
			// 微信登录
			weixinLogin(code) {	
				this.loginInMixin()
			},
	
			getCodes () {
				if(this.isWechat()) {
					let code = this.getUrlCode('code');	
					if (code === null || code === '') {
						window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+APPID+'&redirect_uri=' + encodeURIComponent(REDIRECT_URI) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
						this.getOpenId()
					}
				}
			},
			// 获取code
			getUrlCode (name) {
				let type = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null;
				return type;
			},
			
			isWechat () {
				return String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) === "micromessenger";
			},
		
			
			// 判断登录按钮状态
			loginState() {
				if (this.pwd.length > 0 && this.phone.length === 11) {
					this.btnState = false;
					this.$forceUpdate()
				} else {
					this.btnState = true;
				}
			},

			// 前往首页
			goIndex() {
				const that = this;
				uni.showLoading({
					title: '登录中...',
					mask: true
				})
				that.saveObj = {
					PHONE: that.phone,
					PASSWORD: that.pwd
				}
				try {
	
					that.saveObj.openId = uni.getStorageSync('openIdBind'); //  getApp().globalData.openid ? getApp().globalData.openid : '';
					that.saveObj.nickName = getApp().globalData.nickName ? getApp().globalData.nickName : '';
					this.loginSendData()
				} catch (err) {
					
				}


				

			},
			loginSendData() {
				let that = this;
				// 登录请求
				login(that.saveObj).then(res => {
					uni.showToast({
						title: res.errMsg,
						icon: 'none'
					})
					if (res.returnMsg.status == '00') {
						// 用户ID存入全局
						uni.setStorage({
							key: 'USERINFO_ID',
							data: res.returnMsg.USERINFO_ID
						});
						that.rememberPwdHide = false;
						// alert('登录-')
						uni.getStorage({
							key: 'saveStata',
							success: (res) => {
								console.log('===', res.data)
								if (res.data) {
									// window.location.href = 'https://yflh.hkzhtech.com/qflhadmin/#/pages/index/index'
									uni.navigateTo({
										url: '../index/index'
									})
								} else {
									that.rememberPwdHide = false; // 提示保存密码
								}
							},
							fail: (res) => {
								that.rememberPwdHide = false; // 提示保存密码
							}
						})
					} else if (res.returnMsg.status == '01') {
						uni.showToast({
							title: '账号不存在!',
							icon: 'none'
						})
					} else if (res.returnMsg.status == '02') {
						uni.showToast({
							title: '密码错误!',
							icon: 'none'
						})
					} else if (res.returnMsg.status == '03') {
						uni.showToast({
							title: '不合法注册!',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: '系统错误!',
							icon: 'none'
						})
					}
				}).catch(err => uni.showToast({
					title: '系统错误!',
					icon: 'none'
				}))
			},

			// 忘记密码
			forgetPwd() {
				uni.navigateTo({
					url: "../forgetPwd/forgetPwd"
				})
			},
			// 立即注册
			register() {
				uni.navigateTo({
					url: '../register/register'
				})
			},
			// 保存密码
			async savePwd() {
				this.rememberPwdHide = true;
				// 保存状态到本地
				await uni.setStorage({
					key: 'saveStata',
					data: true
				})
				// 账号密码保存
				await uni.setStorage({
					key: 'name',
					data: JSON.stringify(this.saveObj),
					success() {
						window.location.href = 'https://yflh.hkzhtech.com/qflhadmin/#/pages/index/index'
					},
					fail() {
						uni.showToast({ title: '保存失败', icon: 'none' })
					}
				})
			},
			// 取消保存
			async cancelSave() {
				// 保存状态到本地
				let that = this;
				await uni.setStorage({ key: 'saveStata', data: false });
				await uni.removeStorage({
					key: 'name',
					success: () => {

					},
					complete() {
						this.rememberPwdHide = true;
						window.location.href = 'https://yflh.hkzhtech.com/qflhadmin/#/pages/index/index'
					}
				})

			},
			// 绑定手机
			bindPhone() {
				if (this.PHONE.length !== 11) {
					return uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
				}
				if (this.code.length == 0) {
					return uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					})
				}
				if (!this.point.CITY) {
					uni.showToast({
						title: '定位失败',
						icon: 'none'
					})
					this.getPoint()
					return false;
				}
				wxTel({
					PHONE: this.PHONE,
					code: this.code,
					WX: uni.getStorageSync('openIdBind'),
					...this.point
				}).then(res => {
				
					if (res.returnMsg.status == '00') {
						this.PHONE = '';
						this.code = '';
						uni.setStorage({
							key: 'USERINFO_ID',
							data: res.returnMsg.USERINFO_ID
						});
						
						try{
							let location = uni.getStorageSync('location');
							
							if(location) {
								window.location.href = location;
							}else {
								uni.reLaunch({
									url: '../index/index'
								})
							}
						}catch(e){
							//TODO handle the exception
							uni.reLaunch({
								url: '../index/index'
							})
						}
						
					} else if (res.returnMsg.status == '01') {
						this.code = '';
						return uni.showToast({
							title: res.returnMsg.Msg || '验证码错误',
							icon: 'none'
						})
					} else {
						this.PHONE = '';
						return uni.showToast({
							title: '系统错误',
							icon: 'none'
						})
					}
				}).catch(() => uni.showToast({
					title: '系统错误',
					icon: 'none'
				}))
			},
			
			
			// 获取验证码
			getCode() {
				if (this.PHONE.length != 11) {
					return uni.showToast({ title: '请输入手机号码！', icon: 'none' })
				}
				var time = 59;
				this.codeText = time + 's后重新获取';
				sendCode({
					MOBILE: this.PHONE
				}).then(res => {
					if (res.returnMsg.status == '00') {
						uni.showToast({
							title: '发送成功！',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: '发送失败！',
							icon: 'none'
						})
					}
				}).catch(err => {
					uni.showToast({
						title: '发送失败！',
						icon: 'none'
					})
				})
				var setTime = setInterval(() => {
					time--;
					this.codeText = time + 's后重新获取';
				}, 1000)
				setTimeout(() => {
					this.codeText = "获取验证码";
					clearInterval(setTime);
				}, 59000)
			
			},
			getPoint() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true, //设置该参数为true可直接获取经纬度及城市信息
					success: (res) => {
						this.conversionPoint(res)
					},
					fail(err) {
						uni.showToast({ title: '定位失败', icon: 'none' })
					}
				});
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
						let {
							province,
							city,
							district
						} = data.data.regeocode.addressComponent
			
						// #ifdef H5
						this.point = {
							CITY: city,
							AREA: district
						}
						
						// #endif
						
					},
					fail: err => {
						uni.showToast({
							title: "定位失败",
							icon: 'none'
						})
					},
				})
			},
			// 获取输入手机号
			inputPhone(e) {
				if (e.detail.value.length === 11) {
					this.phoneState = true;
					this.phone = e.detail.value;
					this.loginState()
				} else {
					this.phoneState = false;
				}
			
			},
			// 获取登录密码
			inputPwd(e) {
				if (e.detail.value.length) {
					this.pwdState = true;
					this.pwd = e.detail.value;
					this.loginState()
				} else {
					this.pwdState = false;
				}
			},
			
			
		},
		
		


	}
</script>

<style lang="less" scoped>
	.send-code {
		width: 300rpx;
		font-size: 25rpx;
	}

	.mask-bind {
		position: fixed;
		z-index: 10;
		width: 100%;
		top: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.bind-phone {
		margin: 400rpx auto;
		width: 80%;
		background: #fff;
		border: 2rpx #eee solid;
		border-radius: 10rpx;
		padding: 80rpx 10rpx;

		.form {
			display: flex;
			margin-bottom: 50rpx;

			text {
				font-size: 36rpx;
				font-weight: 400;
				color: #333333;
			}

			input {
				border-left: 2rpx solid #999;
				padding-left: 30rpx;
			}
		}

		.btn-bind-wx {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			font-size: 40rpx;
			text-align: center;
			background: linear-gradient(243deg, #FF9960 0%, #FF5A2C 100%);
			border-radius: 8rpx;
			color: #fff;
		}
	}
</style>

<style lang="less">
	.login {
		height: 100%;
		background: #fffeff;
		color: #333;
		font-family: PingFangSC-Regular, PingFang SC;
		position: relative;

		.login-header {
			padding: 20rpx;
			font-size: 40rpx;
			/* #ifdef APP-PLUS */
			padding-top: 60rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			padding-top: 60rpx;
			/* #endif */
			background: linear-gradient(117deg, rgba(255, 90, 43, 1) 0%, rgba(255, 89, 52, 1) 36%, rgba(255, 156, 31, 1) 100%);
			color: #fff;
			text-align: center;
		}

		.login-title {
			padding: 40rpx 30rpx 0;
			font-size: 44rpx;
			font-weight: bold;
		}

		.login-content {
			padding-left: 30rpx;

			.login-content-item {
				padding: 30rpx 0;
				display: flex;
				border-bottom: 1px solid #e0e0e0;
				margin-top: 40rpx;
				position: relative;

				text:first-child {
					width: 150rpx;
					border-right: 1px solid #999;
					font-size: 36rpx;
				}

				input {
					margin-left: 30rpx;
				}

				.testCode {
					position: absolute;
					right: 30rpx;
					bottom: 30rpx;
					font-size: 30rpx;
					color: #FF5904;
					padding: 15rpx 25rpx;
					background: #f1f1f1;
					border-radius: 40rpx;
					opacity: 0.5;
				}

				/deep/ uni-button {
					line-height: 1em;
				}

				.selectCode {
					opacity: 1;
				}
			}

			.password {
				justify-content: space-between;

				input {
					flex: 1;
				}
			}

			.login-content-userTreaty {
				padding-right: 30rpx;
				font-size: 24rpx;
				padding-top: 20rpx;
				position: relative;

				/deep/ uni-radio .uni-radio-input {
					width: 30rpx;
					height: 30rpx;
				}

				.radio {
					display: flex;
					align-items: center;
					color: #666;
					position: absolute;
					left: 0;

					image {
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
					}
				}

				>text {
					color: #FF5904;
					position: absolute;
					right: 30rpx;
				}

				.treatyHide {
					display: none;
				}

				.codeHide {
					display: none;
				}
			}

			.tips {
				display: flex;
				justify-content: space-between;
				font-size: 30rpx;
				padding: 20rpx 0;
				padding-right: 20rpx;
				color: #FF5904;
			}
		}

		.login-content-btn {
			width: 95%;
			background: linear-gradient(243deg, rgba(255, 153, 96, 1) 0%, rgba(255, 90, 44, 1) 100%);
			height: 88rpx;
			border-radius: 10rpx;
			color: #fff;
			font-size: 40rpx;
			text-align: center;
			margin: 150rpx auto 0;
			line-height: 88rpx;
			box-shadow: 0 10rpx 20rpx #FF9960;
		}

		.btnState {
			opacity: 0.5;
			color: #fff !important;
		}

		.login-tipsText {
			font-size: 28rpx;
			color: #999999;
			width: 88%;
			margin: 100rpx auto 0;
		}


		// 记住密码蒙层
		.rememberPwdHide {
			display: none !important;
		}

		.rememberPwd {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(1, 1, 1, 0.3);

			.rememberPwd-content {
				padding: 30rpx;
				width: 50%;
				height: 200rpx;
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				border-radius: 20rpx;
				font-size: 30rpx;
				text-align: center;
				margin: auto;
				background: #fff;
				overflow: hidden;

				.btn {
					position: absolute;
					bottom: 0;
					width: 100%;
					display: flex;
					margin-left: -30rpx;
					justify-content: space-between;
					color: #fff;

					text {
						width: 50%;
						padding: 20rpx 0;
						background: #ccc;
					}

					text:last-child {
						background: #4CD964;
					}
				}
			}
		}

		// 其它登录方式
		.otherLogin {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30rpx;
			margin-top: 30rpx;

			.icon-weixin {
				font-size: 80rpx;
				color: #1bac19;
				margin-left: 20rpx;
			}
		}

	}
</style>
